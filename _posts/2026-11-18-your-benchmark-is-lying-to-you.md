---
title: "Your benchmark is lying to you"
description: "Năm thí nghiệm nhỏ trên JVM: mean, lần chạy đầu, vòng lặp nanoTime, test 30 giây và load generator closed-loop đều có thể đánh lừa bạn khi đo hiệu năng."
date: 2026-11-18 10:36:26 +0700
categories: [Java]
tags: [java, jvm, performance, book-notes]
pin: false
toc: true
comments: true
math: false
mermaid: false
---

Tôi nghĩ là tôi có thể đo lường được hiệu năng: chạy, đo thời gian, lấy trung bình. Năm bài thí nghiệm nhỏ sau sẽ phản biện lại các ý niệm mặc định đó. Ta sẽ đo các con số và kiểm tra chúng trên thực tế.

## Cài đặt

Bạn cần JDK 21 và Gradle.

```kotlin
plugins {
    java
    id("me.champeau.jmh") version "0.7.3"
}

repositories { mavenCentral() }
java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }
dependencies { implementation("org.hdrhistogram:HdrHistogram:2.1.12") }
jmh { jmhVersion = "1.37" }

// -PjvmArgs="..." / -PappArgs="..." -> list of words
fun words(name: String) = (findProperty(name) as String?)?.split(" ")?.filter { it.isNotBlank() } ?: emptyList()

mapOf(
    "ex1" to "lab.ch02.ex1_percentiles.Main",
    "ex2" to "lab.ch02.ex2_warmup.Main",
    "ex3" to "lab.ch02.ex3_jmh.NaiveBenchmark",
    "ex4" to "lab.ch02.ex4_server.Main",
    "ex5" to "lab.ch02.ex5_load.Main",
).forEach { (name, main) ->
    tasks.register<JavaExec>(name) {
        classpath = sourceSets.main.get().runtimeClasspath
        mainClass = main
        jvmArgs(words("jvmArgs"))
        args(words("appArgs"))
    }
}
```

- JMH benchmarks go in `src/jmh/java`, everything else in `src/main/java`.

## 1. The average hides the users who suffer

- Chương trình đầu tiên xử lý 1 request trong vòng lặp. Đa phần là rất nhanh, nhưng 1 trong 200 lần sẽ cấp phát ~50 MB mảng và kích hoạt GC. Mỗi lời gọi đều được ghi lại và đo đạc.

```java
package lab.ch02.ex1_percentiles;

import org.HdrHistogram.Histogram;
import java.util.Random;

public class Main {
    static final int CALLS = 100_000;
    static final Random random = new Random(42);
    static long sink;

    static void work(){
        if (random.nextInt(200) == 0){
            byte[][] garbage = new byte[50][];
            for(int i = 0;i < garbage.length; i ++){
                garbage[i] = new byte[1_000_000];
            }

            sink += garbage[random.nextInt(garbage.length)].length;
        } else {
            long x = 0;
            for(int i = 0; i < 2_000; i++){
                x += i * 31L ^ (x >>> 3);
                sink += x;
            }
        }
    }

    public static void main (String[] args){
        for(int i = 0;i < 20_000; i ++){
            work();
        }

        long[] nanos = new long[CALLS];
        Histogram histogram = new Histogram(10_000_000_000L, 3);

        for(int i = 0; i < CALLS; i ++){
            long start = System.nanoTime();
            work();
            nanos[i] = System.nanoTime() - start;
            histogram.recordValue(nanos[i]);
        }

        double mean = 0;
        for(long n: nanos) {
            mean += n;
        }

        mean /= CALLS;
        double variance = 0;
        for(long n : nanos){
            variance += (n - mean) * (n - mean);
        }

        System.out.printf("mean = %.1f us, stddev = %.1f us%n", mean / 1000, Math.sqrt(variance/CALLS) / 1000);
        System.out.printf("p50 = %.1f us, p90 = %.1f us, p99 = %.1f us, p99.9 = %.1f us, max = %.1f us%n",
            histogram.getValueAtPercentile(50) / 1000.0, histogram.getValueAtPercentile(90) / 1000.0,
            histogram.getValueAtPercentile(99) / 1000.0, histogram.getValueAtPercentile(99.9) / 1000.0,
            histogram.getMaxValue()/ 1000.0
        );

        histogram.outputPercentileDistribution(System.out, 1000.0);
    }
}
```

| run           | mean    | stddev  | p50    | p99   | p99.9     | max       |
| ---           | ---     | ------  | ---    | ---   | ----      | ---       |
| first run     | 19.5 us | 265 us  | 1.7 us | 2.3 us| 2,519 us  | 8,667 us  |
| re-run        | 35.5 us | 477.6 us| 3.2 us | 6.2 us| 7,454 us  | 15,106 us |

- Nhìn vào bảng, p99 chỉ là vài microseconds, nhưng p99.9 lớn hơn **khoảng 1000 lần**. Nếu độ trễ tuân theo hình chuông, thì mean + 3 stddev nên cover gần như tất cả. Độ trễ có đuôi dài, và mean + stddev không thể bao phủ hết nó.
- p99.9 cũng tăng đến 3 lần giữa hai lần chạy. Đuôi là phần kém ổn định nhất của bài kiểm tra, chạy 1 lần là không đủ.

> **Bài học:** report percentiles (p50, p90, p99.9, max), never just mean ± stddev. To prove a cause, change one thing and watch the number move.

## 2. "How long does it take?" has no single answer on the JVM

The same workload, timed in 20 batches in a row:

```java
package lab.ch02.ex2_warmup;

public class Main {
    static final int BATCHES = 20;
    static final int ITERATIONS = 1_000_000;
    static long sink;

    static long work(int n) {
        long h = 17;
        for (int i = 0; i < n; i++) h = h * 31 + Integer.toString(i % 1000).hashCode();
        return h;
    }

    public static void main(String[] args) {
        for (int batch = 1; batch <= BATCHES; batch++) {
            long start = System.nanoTime();
            sink += work(ITERATIONS); // keep the result so the JIT cannot delete the work
            System.out.printf("batch %2d: %5d ms%n", batch, (System.nanoTime() - start) / 1_000_000);
        }
    }
}
```

```bash
./gradlew -q ex2                                       # default: tiered C1 + C2
./gradlew -q ex2 -PjvmArgs="-Xint"                     # interpreter only
./gradlew -q ex2 -PjvmArgs="-XX:TieredStopAtLevel=1"   # C1 only
./gradlew -q ex2 -PjvmArgs="-XX:+PrintCompilation"     # see when work() gets compiled
```

```text
batch  1:  48 ms
batch  2:  33 ms
batch  3:  23 ms
batch  7:  13 ms   <- time settles here
batch 17:  12 ms
batch 19:  30 ms   <- a late spike (GC? deoptimization? not checked)
```

- JIT sẽ biên dịch hot code trong khi chương trình chạy, nên chương trình sẽ chạy nhanh dần. So sánh các JIT mode, nhìn vào thời gian chạy khi nó ổn định:

| Mode                           | settled batch time | vs full JIT |
|--------------------------------|--------------------|-------------|
| Default (tiered, C1 + C2)      | ~12 ms             | 1x          |
| `-XX:TieredStopAtLevel=1` (C1) | ~40 ms             | ~3x slower  |
| `-Xint` (interpreter only)     | ~630 ms            | ~50x slower |

- C1 biên dịch nhanh nhưng tối ưu hóa ở mức hạn chế. C2 biên dịch chậm hơn, nhưng nhờ inlining mạnh và tối ưu suy đoán (speculative optimization) nên đạt được tốc độ cuối cùng. Nếu tôi chỉ đo batch đầu tiên, tôi sẽ báo cáo con số tệ hơn thực tế gấp 4 lần.

> **Lesson:** phân tách warm-up khỏi trạng thái ổn định, và biết chắc bạn đang đo cái gì. `-XX:+PrintCompilation` chỉ ra chính xác khoảnh khắc mà hàm được biên dịch.

## 3. Micro-benchmarks: the JIT is smarter than your stopwatch

The function under test is one line: `Math.log(x) * 31`. I measured it with a naive `System.nanoTime()` loop, and with
JMH in three ways: return the result, send it to a `Blackhole`, or throw it away.

```java
// src/main/java/lab/ch02/ex3_jmh/Compute.java
package lab.ch02.ex3_jmh;

public class Compute {
    public static double work(int x) {
        return Math.log(x) * 31;
    }
}
```

```java
// src/main/java/lab/ch02/ex3_jmh/NaiveBenchmark.java: the "obvious" way
package lab.ch02.ex3_jmh;

public class NaiveBenchmark {
    public static void main(String[] args) {
        int calls = 50_000_000;
        for (int round = 1; round <= 5; round++) {
            long start = System.nanoTime();
            for (int i = 0; i < calls; i++) {
                Compute.work(12345); // constant input, result thrown away
            }
            System.out.printf("round %d: %.3f ns/op%n", round, (double) (System.nanoTime() - start) / calls);
        }
    }
}
```

```java
// src/jmh/java/lab/ch02/ex3_jmh/ComputeBenchmark.java: the JMH way
package lab.ch02.ex3_jmh;

import java.util.concurrent.TimeUnit;
import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Blackhole;

@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Warmup(iterations = 3, time = 1)
@Measurement(iterations = 5, time = 1)
@Fork(1)
@State(Scope.Thread)
public class ComputeBenchmark {
    int x = 12345; // a field, not a constant, so the JIT cannot pre-compute the answer

    @Benchmark
    public double returned() { return Compute.work(x); }          // JMH consumes the return value

    @Benchmark
    public void blackholed(Blackhole bh) { bh.consume(Compute.work(x)); }

    @Benchmark
    public void discarded() { Compute.work(x); }                   // result unused: dangerous
}
```

```bash
./gradlew -q ex3                        # naive loop
./gradlew -q ex3 -PjvmArgs="-Xint"      # naive loop, interpreter only
./gradlew jmh                           # JMH, takes ~1 minute
```

| Benchmark         | first run (ns/op) | re-run (ns/op)|
|  ----             | --------          | ---------     |
| naive loop        | 27.6 - 30.0       | ~10.5         |
| JMH `returned`    | 17.4 ± 0.7        | 29.2 ± 14     |
| JMH `blackholed`  | 17.8 ± 2.3        | 29.4 ± 4.5    |
| JMH `discarded`   | 29.1 ± 3.2        | 28.2 ± 5.6    |

- Hai lần chạy không đồng nhất với nhau, và sự không đồng nhất đó là bài học. Trong lần chạy đầu tiên, vòng lặp naive có vẻ chậm hơn JMH, nhưng trong lần chạy lại nó lại nhanh hơn 3 lần. Vòng lặp naive không có warm-up, không có forking, không có error bar, nên nó đưa ra con số mà không cho bạn biết mức độ tin cậy của con số đó.

- Tiếp theo tôi đổi hàm sang `31 * Math.sqrt(x)` và đổi input của JMH thành hằng số:

```java
public static double work(int x) { return 31 * Math.sqrt(x); }   // Compute.java
final int x = 12345;                                              // ComputeBenchmark.java
```

| Benchmark        | ns/op         |
|------------------|---------------|
| JMH (all three)  | **0.55**      |
| naive loop       | **0.000**     |

- 0.55 ns là khoảng 2 chu kỳ CPU. Nó là 1 vòng lặp rỗng. JIT tính `sqrt` của hằng số lúc compile time và không còn gì để tính nữa. Nó không làm vậy với `log`, bởi vì với JIT `log` là một lời gọi mà nó không biết bên trong làm gì. Khi một bài kiểm tra hiệu năng cho kết quả nhanh đến mức phi lý, thì nhiều khả năng là phần công việc cần thực hiện đã bị loại bỏ.

> **Lessons:**
> - Never trust a benchmark that throws its result away. The JIT may delete or change the work.
> - A result of ~0 ns is a red flag, not a win.
> - Use JMH, read the error bars, and run it more than once.

## 4. A 30-second test cannot find a slow leak

- Một HTTP server dựng bằng JDK, không có framework. Mỗi request dùng 1 chút CPU, và với `-Dleak=true`, mỗi request sẽ leak 256 byte:

```java
package lab.ch02.ex4_server;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

public class Main {
    static final boolean LEAK = Boolean.getBoolean("leak");
    static final List<byte[]> leaked = new ArrayList<>();
    static volatile long sink;

    static long cpuWork() {
        long x = 0;
        for (int i = 0; i < 200_000; i++) x += Math.sqrt(i) * 31 + (x >>> 7);
        return x;
    }

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.createContext("/work", exchange -> {
            sink = cpuWork();
            if (LEAK) {
                synchronized (leaked) {
                    leaked.add(new byte[256]); // slow leak, never released
                }
            }
            byte[] body = "ok\n".getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.start();
        System.out.println("listening on :8080, leak=" + LEAK);
    }
}
```

- Load generator là 1 vòng lặp đóng (closed loop): N virtual thread, mỗi thread gửi 1 request, đợi reply, rồi mới gửi request tiếp theo. Độ trễ được đo bằng `Recorder` của HdrHistogram, an toàn khi nhiều thread cùng ghi.

```java
// core of lab.ch02.ex5_load.Main; args: <url> <concurrency> <durationSeconds>
HttpClient client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();
HttpRequest request = HttpRequest.newBuilder(URI.create(args[0])).GET().build();
Recorder recorder = new Recorder(3); // values in microseconds
long end = System.nanoTime() + TimeUnit.SECONDS.toNanos(Integer.parseInt(args[2]));

try (ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < Integer.parseInt(args[1]); i++) {
        pool.submit(() -> {
            while (System.nanoTime() < end) {
                long start = System.nanoTime();
                client.send(request, HttpResponse.BodyHandlers.discarding()); // wait for the reply...
                recorder.recordValue((System.nanoTime() - start) / 1000);     // ...then record, then loop
            }
            return null;
        });
    }
}
Histogram total = recorder.getIntervalHistogram();
System.out.printf("requests=%d  p50=%.2f ms  p99=%.2f ms  p99.9=%.2f ms%n", total.getTotalCount(),
        total.getValueAtPercentile(50) / 1000.0, total.getValueAtPercentile(99) / 1000.0,
        total.getValueAtPercentile(99.9) / 1000.0);
```

```bash
./gradlew -q ex4 -PjvmArgs="-Dleak=true -Xmx512m -Xlog:gc"   # terminal 1 (drop -Dleak=true for the control)
./gradlew -q ex5 -PappArgs="http://localhost:8080/work 10 600" # terminal 2
jcmd $(pgrep -f ex4_server) GC.class_histogram | head          # terminal 3, run twice a few minutes apart
```

- Kết quả với 10 client đồng thời:
    - **Độ trễ p99:** khoảng 48-50 ms ở cả hai server. Con số này không nói lên điều gì.
    - **GC log, heap sau khi thu hồi:** server không leak luôn trở về ~2 MB, còn server leak thì đi từ 2 → 3 → 6 → 9 MB và tăng đều.
    - **`jcmd <pid> GC.class_histogram`**, chạy 2 lần: số `byte[]` tăng giữa hai lần chạy, đó là dấu hiệu leak mà không cần đọc code.

- Liệu bài test 30 s có bắt được nó? **Không.** Trong 30 s heap tăng ít và trông như nhiễu, chỉ có chạy trong thời gian dài mới bắt được nó.

> **Lesson:** xem heap size sau khi GC kết thúc (live data là phần GC không thể dọn), chứ không phải latency. Leak hiện ra dưới dạng một xu hướng, không phải một đỉnh đột biến.

## 5. Khi đã vượt qua điểm uốn, tăng thêm tải chỉ dẫn đến chờ đợi lâu hơn

- Cùng 1 server, không leak, mỗi lượt chạy 30 s, với số lượng client tăng dần:

```bash
./gradlew -q ex4    # terminal 1
for n in 1 10 50 200; do ./gradlew -q ex5 -PappArgs="http://localhost:8080/work $n 30"; done   # terminal 2
```

- Tôi chạy nó 2 lần:

| N   | req/s (1st / 2nd) | p50 (2nd) | p99 (2nd) | p99.9 (2nd) |
|-----|-------------------|-----------|-----------|-------------|
| 1   | 20 / 20           | 49.1 ms   | 52.6 ms   | 120.3 ms    |
| 10  | 211 / 210         | 47.1 ms   | 52.3 ms   | 187.1 ms    |
| 50  | 1087 / 1093       | 45.1 ms   | 53.2 ms   | 181.9 ms    |
| 200 | 2722 / 2770       | 66.4 ms   | 131.2 ms  | 249.3 ms    |

- Khác với micro-benchmark, test này lặp lại gần như y hệt giữa hai lần chạy.
- **Với N lên đến 50:** thông lượng tăng tỷ lệ thuận với N, trong khi p50 vẫn không đổi. Máy chủ phần lớn ở trạng thái nhàn rỗi và mỗi yêu cầu chủ yếu là phải chờ đợi.
- **Từ 50 lên 200:** gấp 4 lần client chỉ cho thêm 2.5 lần thông lượng, trong khi p50 tăng ~50% và p99 tăng ~2.5 lần. Đó là điểm uốn.
- **Định luật Little được xác nhận:** throughput ≈ N / latency. Ví dụ: 200 / 0.066 s ≈ 3000 req/s, so với con số 2770 đo được trên thực tế.
- **Coordinated omission:** load generator ở đây là closed loop, nên khi server chậm lại thì client cũng gửi chậm lại. Những request lẽ ra phải xếp hàng chờ không bao giờ được gửi, nên cũng không được đo. Với tải đến theo tốc độ cố định (open loop), đuôi độ trễ thật sẽ tệ hơn bảng trên.

### 49 ms đến từ đâu?

- Hàm ở section 3 tốn ~17-29 ns. Một request đơn lẻ cần 49 ms, nghĩa là hàm đó chiếm chưa tới **một phần triệu**. Tôi ước tính khoảng 5 ms CPU cho mỗi request (14 cores / ~2700 req/s). Còn lại là ~45 ms chờ đợi, có thể là TCP delayed ACK (~40 ms trên Linux), điều mà tôi chưa kiểm chứng. Làm cho hàm chạy nhanh gấp đôi không có ý nghĩa gì với user.

> **Lesson:** Hãy đo lường toàn bộ hệ thống trước khi tối ưu hóa một thành phần. Xác định điểm uốn (knee point) và kiểm tra xem công cụ tạo tải (load tool) của bạn có vô tình che khuất các tình trạng tắc nghẽn (stalls) mà bạn cần quan tâm hay không.

## Bài học: Viết dự đoán của bạn ra trước

Bài tập cuối cùng trong cuốn sách nói về thiên kiến: hãy viết ra một dự đoán *trước* mỗi lần chạy, rồi so sánh nó với kết quả thu được. Nhìn lại, lần nào tôi tin tưởng thì lần đó tôi đều bị đánh lừa:

- **the average** (section 1)
- **the first run** (section 2)
- **the tool's output with no sanity check** (section 3)
- **the short test** (section 4)
- **the closed-loop load generator** (section 5)

### Cheat sheet

| Do                                            | Don't                                   |
|-----------------------------------------------|-----------------------------------------|
| Report p50 / p99 / p99.9 / max                | Report mean ± stddev for latency        |
| Separate warm-up from steady state            | Time the first run                      |
| Use JMH, consume results, read error bars     | Trust a `nanoTime()` loop               |
| Run endurance tests and watch heap-after-GC   | Call a 30 s test "stable"               |
| Find the knee; watch for coordinated omission | Assume more load means more throughput  |
| Change one variable to prove a cause          | Explain a result by reading the code    |
