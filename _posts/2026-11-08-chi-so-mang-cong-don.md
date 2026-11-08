---
title: "Hai loại chỉ số trong bài đếm đoạn con"
description: "Vì sao cứ rối giữa r và r + 1 khi dùng mảng tiền tố: chỉ số phần tử và chỉ số tiền tố là hai loại khác nhau. Chứng minh trên nums[l..r], dịch sang chỉ số tiền tố đúng một lần, rồi để vòng lặp đếm chỉ dùng chỉ số tiền tố."
date: 2026-11-08 22:30:00 +0700
categories: [algorithm]
tags: [leetcode, prefix-sum, off-by-one]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Bài đếm đoạn con bằng mảng tiền tố thường đi qua ba bước: chứng minh trên đoạn `nums[l..r]`, ra một điều kiện giữa $P[l]$ và $P[r+1]$, rồi viết vòng lặp theo `r`. Đến bước cuối thì dễ rối: biến lặp là `r` nhưng thân vòng lặp toàn là `P[r + 1]`, và không rõ mình đang ở `r` hay `r + 1`. Bài này chỉ ra nguyên nhân và một cách viết để không phải hỏi câu đó nữa.

## Quy ước

### Mảng và đoạn

- `nums` có $n$ phần tử: `nums[0]`, ..., `nums[n-1]`.
- `nums[l..r]` là đoạn **lấy cả hai đầu**, với $0 \le l \le r \le n-1$. Đoạn có $r - l + 1$ phần tử.

### Mảng tiền tố

Mảng tiền tố (prefix) $P$ có $n + 1$ ô:

$$P[x] = \text{nums}[0] + \dots + \text{nums}[x-1] = \text{tổng của } x \text{ phần tử đầu tiên}, \qquad 0 \le x \le n$$

- $P[0] = 0$ là tổng của $0$ phần tử.
- Cách xây: `P[i + 1] = P[i] + nums[i]`.

Thay "tổng" bằng đại lượng khác thì được mảng tiền tố khác. Bài 4013 dùng hai mảng:

- $E[x]$: số phần tử chẵn trong $x$ phần tử đầu tiên.
- $L[x] = (a+b)E[x] - a\,x$. Đây cũng là một mảng tiền tố: $L[x]$ là tổng $x$ phần tử đầu tiên của mảng $w$, với $w[i] = b$ nếu `nums[i]` chẵn và $w[i] = -a$ nếu `nums[i]` lẻ.

### Hai loại chỉ số

| | Chỉ số phần tử | Chỉ số tiền tố |
|---|---|---|
| Nghĩa | vị trí của một phần tử | số phần tử đầu tiên được tính |
| Miền | từ $0$ đến $n-1$ ($n$ giá trị) | từ $0$ đến $n$ ($n + 1$ giá trị) |
| Dùng để tra | `nums[...]` | `P[...]`, `E[...]`, `L[...]` |
| Tên biến trong bài | `i`, `l`, `r` | `x`, `y` |

Quy tắc: **mảng nào nhận đúng loại chỉ số của mảng đó.** Đưa một chỉ số phần tử vào `P[...]` là đang trộn hai loại.

### Cầu nối giữa hai loại

Phần tử $i$ nằm giữa ô tiền tố $i$ và ô tiền tố $i + 1$:

$$\text{nums}[i] = P[i+1] - P[i]$$

Theo chiều ngược lại, ô tiền tố $x$ nằm giữa phần tử $x - 1$ và phần tử $x$. Vì vậy, nếu chỉ dùng chỉ số phần tử, mỗi ô có **hai cách gọi**:

- "ngay trước phần tử $x$",
- "ngay sau phần tử $x - 1$".

Chỉ số tiền tố luôn theo cách gọi thứ nhất: $x$ là số phần tử đứng trước ô. Riêng hai ô ở hai đầu chỉ có một cách gọi: ô $0$ chỉ là "trước phần tử $0$", ô $n$ chỉ là "sau phần tử $n - 1$".

Đoạn `nums[l..r]` bắt đầu ngay trước phần tử $l$ và kết thúc ngay sau phần tử $r$, nên

$$\text{tổng}(\text{nums}[l..r]) = P[r+1] - P[l]$$

| Đầu đoạn | Đoạn `nums[l..r]` gọi nó là | Đổi về cách gọi "ngay trước phần tử ..." | Chỉ số tiền tố |
|---|---|---|---|
| trái | ngay trước phần tử $l$ | giữ nguyên | $l$ |
| phải | ngay sau phần tử $r$ | ngay trước phần tử $r + 1$ | $r + 1$ |

**Dấu $+1$ chính là phép đổi "sau phần tử $r$" thành "trước phần tử $r + 1$".** Ở đầu trái không phải đổi gì, nên ta không để ý mình vừa chuyển sang loại chỉ số khác. Ở đầu phải thì phải đổi, và mọi chỗ rối giữa `r` và `r + 1` bắt nguồn từ đây.

## Bài 4013: chứng minh

**Đề:** cho `nums` cùng hai số nguyên dương $a$, $b$. Đếm số đoạn con thoả

$$b \cdot \text{chẵn} \le a \cdot \text{lẻ}$$

Với đoạn `nums[l..r]`:

- chẵn $= E[r+1] - E[l]$
- dài $= (r+1) - l$
- lẻ $=$ dài $-$ chẵn

Thay vào điều kiện:

$$
\begin{aligned}
b \cdot \text{chẵn} &\le a \cdot (\text{dài} - \text{chẵn}) \\
(a+b) \cdot \text{chẵn} - a \cdot \text{dài} &\le 0 \\
\big[(a+b)E[r+1] - a(r+1)\big] - \big[(a+b)E[l] - a\,l\big] &\le 0
\end{aligned}
$$

Ở dòng cuối, mỗi ngoặc chỉ chứa một chỉ số tiền tố, và mỗi ngoặc chính là một ô của $L$:

$$L[l] \ge L[r+1].$$

Bước chứng minh trên `nums[l..r]` như vậy là hoàn toàn đúng. Chỗ rối chỉ đến ở bước viết vòng lặp.

## Chỗ nhầm: lặp theo phần tử, dữ liệu theo ô tiền tố

Từ điều kiện trên, ta dễ viết ngay vòng lặp theo `r`. Trong đoạn mã dưới, `add` và `countAtLeast` là hai thao tác của cấu trúc đếm: thêm một giá trị, và đếm số giá trị đã thêm mà $\ge$ một giá trị cho trước.

```java
add(L[0]);
for (int r = 0; r < n; r++) {
    count += countAtLeast(L[r + 1]);   // (1)
    add(L[r + 1]);                     // (2)
}
```

Đoạn mã này cho kết quả đúng. Nhưng biến lặp `r` là chỉ số phần tử, còn mọi thứ thân vòng lặp chạm tới đều là ô tiền tố. Có $n$ phần tử nhưng $n + 1$ ô, và theo phần tử thì mỗi ô có hai cách gọi. Ba chỗ khó chịu quen thuộc đều từ đây mà ra:

1. **"Đang ở `r` hay `r + 1`?"** Hai dòng cùng viết `L[r + 1]` nhưng dùng hai cách gọi khác nhau của cùng một ô:
   - dòng (1) coi nó là "sau phần tử $r$", tức đầu phải của các đoạn kết thúc tại phần tử $r$;
   - dòng (2) cất nó để các vòng sau dùng như "trước phần tử $r + 1$", tức đầu trái của các đoạn bắt đầu tại phần tử $r + 1$.
2. **Phải cất `L[0]` riêng trước vòng lặp**, hoặc viết `map.put(0, 1)` như nhiều lời giải. Ô $0$ chỉ có cách gọi "trước phần tử $0$". Nó không là "sau phần tử $r$" với bất kỳ $r$ nào, nên dòng (2) không bao giờ cất nó.
3. **Vòng cuối cất một ô không gọi tên được.** Ở `r = n - 1`, dòng (2) cất $L[n]$ như "trước phần tử $n$", nhưng phần tử $n$ không tồn tại.

Lấy ví dụ `nums = [2, 1, 2]` với $a = b = 1$, khi đó $L = [0, 1, 0, 1]$. Theo dõi riêng ô $L[1]$:

| Vòng | Việc | Ô được gọi là | Nghĩa theo `nums` |
|---|---|---|---|
| `r = 0` | (1) hỏi | `L[r + 1]` | sau phần tử 0 |
| `r = 0` | (2) cất | `L[r + 1]` | trước phần tử 1 |
| `r = 1` | được đếm | `L[l]`, `l = 1` | đầu trái của `nums[1..1]` |
| `r = 2` | được đếm | `L[l]`, `l = 1` | đầu trái của `nums[1..2]` |

Khi làm đầu phải, ô này được nhận ra qua `r = 0`. Khi làm đầu trái, nó được nhận ra qua `l = 1`. Một ô ứng với hai con số khác nhau, nên mỗi lần đọc code ta lại phải nhẩm phép đổi giữa hai con số đó. Đó chính là cảm giác "đang ở `r` hay `r + 1`".

## Cách gỡ: dịch đúng một lần

Ngay sau khi chứng minh xong, dịch **cả hai đầu** sang chỉ số tiền tố trong một bước:

$$x = l, \qquad y = r + 1$$

$$0 \le l \le r \le n-1 \iff 0 \le x < y \le n$$

Mỗi đoạn `nums[l..r]` ứng với đúng một cặp $x < y$. Ngược lại, cặp $x < y$ là đoạn `nums[x..y-1]`. Bài toán viết lại thành:

> Đếm số cặp chỉ số tiền tố $x < y$ sao cho $L[x] \ge L[y]$.

Làm vậy không có nghĩa là bỏ bài toán trên `nums`. Mỗi cặp vẫn là một đoạn xác định, nên đếm cặp chính là đếm đoạn; chỉ có cách gọi tên đoạn thay đổi. Từ dòng này trở đi, `nums`, `l` và `r` không cần xuất hiện nữa.

Vòng lặp đếm thực chất duyệt qua **đầu phải** của đoạn. Thân vòng lặp cần đầu phải ở dạng chỉ số tiền tố, nên biến lặp là $y$, chạy qua đủ $n + 1$ ô:

```java
for (int y = 0; y <= n; y++) {
    // cấu trúc đang chứa L[0..y-1], tức mọi x < y
    count += countAtLeast(L[y]);   // các cặp (x, y)
    add(L[y]);                     // ô y sẽ làm x cho các vòng sau
}
```

Ba chỗ khó chịu ở trên biến mất:

1. Hai dòng cùng dùng `L[y]` với cùng một nghĩa là ô $y$. Ô đó là đầu trái hay đầu phải chỉ do vị trí của nó trong cặp quyết định, không cần đổi tên.
2. Ô $0$ được cất ở vòng `y = 0` như mọi ô khác. Ở vòng này không có $x < 0$ nên chỉ có bước cất. `map.put(0, 1)` trong nhiều lời giải chính là vòng `y = 0` được làm sẵn.
3. Ô $n$ cũng được cất như mọi ô. Nó không được dùng tiếp chỉ vì không còn $y$ nào lớn hơn, và không có câu nào phải dịch sang phần tử.

Theo dõi lại ô $L[1]$:

| Vòng | Việc | Ô được gọi là |
|---|---|---|
| `y = 1` | hỏi, rồi cất | `L[y]`, `y = 1` |
| `y = 2` | được đếm trong cặp $x = 1$, $y = 2$, tức `nums[1..1]` | `L[x]`, `x = 1` |
| `y = 3` | được đếm trong cặp $x = 1$, $y = 3$, tức `nums[1..2]` | `L[x]`, `x = 1` |

Ô này luôn được nhận ra qua cùng một con số là $1$.

## Bài 4013: lời giải Java

Cấu trúc đếm ở đây là nén giá trị kết hợp cây Fenwick, được giải thích kỹ trong bài [Nén tọa độ và cây Fenwick]({% post_url 2026-11-06-compress-fenwick %}).

```java
class Solution {
    public long countRatioSubarrays(int[] nums, int a, int b) {
        int n = nums.length;

        // E[x] = số phần tử chẵn trong x phần tử đầu tiên
        int[] E = new int[n + 1];
        for (int i = 0; i < n; i++) {
            E[i + 1] = E[i] + (nums[i] % 2 == 0 ? 1 : 0);
        }

        long[] L = new long[n + 1];
        for (int x = 0; x <= n; x++) {
            L[x] = ((long) a + b) * E[x] - (long) a * x;
        }

        // Nén giá trị của L về hạng 1..m để làm chỉ số cho cây Fenwick
        long[] sorted = Arrays.stream(L).sorted().distinct().toArray();
        int m = sorted.length;
        int[] bit = new int[m + 1];

        long count = 0;
        for (int y = 0; y <= n; y++) {
            // bit đang chứa L[0..y-1], tức đúng y giá trị
            int rank = Arrays.binarySearch(sorted, L[y]) + 1;
            count += y - countRankAtMost(bit, rank - 1); // số x < y có L[x] >= L[y]
            for (int node = rank; node <= m; node += node & -node) bit[node]++;
        }
        return count;
    }

    // Số giá trị đã cất có hạng từ 1 đến rank
    private int countRankAtMost(int[] bit, int rank) {
        int s = 0;
        for (int node = rank; node > 0; node -= node & -node) s += bit[node];
        return s;
    }
}
```

Trong cả lời giải, chỉ có một chỗ trộn hai loại chỉ số: dòng `E[i + 1] = E[i] + ...`, tức định nghĩa của mảng tiền tố.

## Quy tắc tóm gọn

1. **Đặt tên theo loại.** `i`, `l`, `r` là chỉ số phần tử. `x`, `y` là chỉ số tiền tố.
2. **Tra đúng mảng.** `nums[...]` chỉ nhận chỉ số phần tử, mảng tiền tố chỉ nhận chỉ số tiền tố. Biến lặp phải cùng loại với mảng mà thân vòng lặp tra.
3. **Chỉ trộn ở hai chỗ:**
   - khi xây mảng tiền tố: `P[i + 1] = P[i] + nums[i]`;
   - khi dịch đoạn, đúng một lần sau chứng minh: $x = l$, $y = r + 1$.
4. **Viết vòng lặp đếm theo $y$**, thường từ `0` đến `n`, và ghi bất biến "cấu trúc đang chứa những ô nào" ngay trên vòng lặp. Bất biến quyết định thứ tự hỏi và cất.
5. **Tự kiểm tra.** Nếu thấy `P[r + 1]` hay `P[l]` bên trong vòng lặp đếm, nghĩa là bạn chưa dịch.

## Áp dụng

Mỗi bài dưới đây đi qua đúng ba bước: chứng minh trên `nums[l..r]`, dịch sang $x$, $y$, rồi viết code.

### 560. Subarray Sum Equals K

Đếm số đoạn có tổng bằng $k$.

- **Chứng minh:** $P[r+1] - P[l] = k$.
- **Dịch:** $P[x] = P[y] - k$ với $x < y$.

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        int n = nums.length;
        int[] P = new int[n + 1]; // P[x] = tổng x phần tử đầu tiên
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];

        Map<Integer, Integer> seen = new HashMap<>(); // seen[v] = số x < y có P[x] = v
        int count = 0;
        for (int y = 0; y <= n; y++) {
            count += seen.getOrDefault(P[y] - k, 0);
            seen.merge(P[y], 1, Integer::sum);
        }
        return count;
    }
}
```

### 974. Subarray Sums Divisible by K

Đếm số đoạn có tổng chia hết cho $k$.

- **Chứng minh:** $P[r+1] - P[l]$ chia hết cho $k$.
- **Dịch:** $P[x] \bmod k = P[y] \bmod k$ với $x < y$.

```java
class Solution {
    public int subarraysDivByK(int[] nums, int k) {
        int n = nums.length;
        int[] P = new int[n + 1];
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];

        int[] seen = new int[k]; // seen[v] = số x < y có P[x] mod k = v
        int count = 0;
        for (int y = 0; y <= n; y++) {
            int v = Math.floorMod(P[y], k); // % của Java trả số âm khi P[y] < 0
            count += seen[v];
            seen[v]++;
        }
        return count;
    }
}
```

### 525. Contiguous Array

Tìm độ dài lớn nhất của đoạn có số phần tử $0$ bằng số phần tử $1$.

Ở bài này, coi mỗi số $1$ là $+1$ và mỗi số $0$ là $-1$. $P[x]$ là tổng của $x$ phần tử đầu tiên sau khi đổi như vậy.

- **Chứng minh:** $P[r+1] - P[l] = 0$, độ dài là $(r + 1) - l$.
- **Dịch:** $P[x] = P[y]$, độ dài là $y - x$.

```java
class Solution {
    public int findMaxLength(int[] nums) {
        int n = nums.length;
        int[] P = new int[n + 1];
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + (nums[i] == 1 ? 1 : -1);

        Map<Integer, Integer> first = new HashMap<>(); // first[v] = x nhỏ nhất (x < y) có P[x] = v
        int best = 0;
        for (int y = 0; y <= n; y++) {
            Integer x = first.get(P[y]);
            if (x != null) best = Math.max(best, y - x);
            first.putIfAbsent(P[y], y);
        }
        return best;
    }
}
```

Độ dài là `y - x` và không có `+1`, vì cả hai đều là chỉ số tiền tố.

### 523. Continuous Subarray Sum

Kiểm tra có tồn tại đoạn dài ít nhất $2$ và có tổng chia hết cho $k$ hay không.

- **Chứng minh:** $P[r+1] - P[l]$ chia hết cho $k$, và $r - l + 1 \ge 2$.
- **Dịch:** $P[x] \bmod k = P[y] \bmod k$, và $y - x \ge 2$, tức $x \le y - 2$.

```java
class Solution {
    public boolean checkSubarraySum(int[] nums, int k) {
        int n = nums.length;
        long[] P = new long[n + 1];
        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];

        Set<Long> seen = new HashSet<>(); // seen chứa P[x] mod k với mọi x <= y - 2
        for (int y = 2; y <= n; y++) {
            seen.add(P[y - 2] % k);
            if (seen.contains(P[y] % k)) return true;
        }
        return false;
    }
}
```

Bài này **cất trước, hỏi sau**, và thứ được cất là $P[y - 2]$ chứ không phải $P[y]$. Thứ tự này không theo thói quen mà được suy ra từ bất biến: muốn hỏi ở vòng $y$ thì tập phải đang chứa đúng các $x \le y - 2$.
