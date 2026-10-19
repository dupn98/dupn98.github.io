---
title: "Chapter 1: Optimization and Performance Defined"
description: "Ghi chú chương 1 sách Optimizing Cloud Native Java: tối ưu hiệu năng là một thử nghiệm khoa học, cùng bộ từ vựng throughput, latency, capacity, utilization, efficiency, scalability, degradation."
date: 2026-10-19 14:04:51 +0700
categories: [Java] # max 2 levels
tags: [java, jvm, performance, book-notes] # lowercase
pin: false
toc: true
comments: true
math: true
mermaid: false
---

## TL;DR

- **Sách:** *Optimizing Cloud Native Java, 2nd Edition* (Benjamin J. Evans, James Gough).
- Tối ưu hiệu năng **không phải mẹo vặt**, mà là một vòng lặp khoa học: *đặt mục tiêu → đo → thay đổi → đo lại → so với mục tiêu*.
- Mọi cuộc thảo luận về hiệu năng cần một **từ vựng chung**. Chương này đưa ra 7 chỉ số: throughput, latency, capacity, utilization, efficiency, scalability, degradation.
- Trên cloud, bài toán khó hơn: nhiều JVM phân tán, đơn vị triển khai là container, và sự kém hiệu quả hiện thẳng lên hóa đơn.

## 1. Vì sao tối ưu hiệu năng Java hay bị hiểu sai

**Câu chuyện minh họa.** Nhiều năm liền, kết quả Google cho "Java performance tuning" vẫn là các trang từ 1997–1998. Thời đó gọi phương thức (method dispatch) là việc đắt, nên người ta gộp hàm nhỏ thành hàm lớn. Ngày nay JIT tự **inline** hàm nhỏ, nên cách "tối ưu" cũ có thể làm code **chậm hơn**.

**Bài học rút ra**

- Tốc độ của Java phụ thuộc nhiều vào JVM. Code cũ có thể nhanh hơn trên JVM mới mà không cần biên dịch lại.
- Lời khuyên nào bạn không tự đo và kiểm chứng được thì đừng tin.
- Theo tác giả, không có phép màu, không có "tips & tricks", không có thuật toán bí mật. Hiệu năng tốt đến từ:
  - phương pháp luận phù hợp với vòng đời phần mềm
  - lý thuyết kiểm thử
  - đo lường, thống kê và công cụ hỗ trợ
  - kỹ năng phân tích (hệ thống và dữ liệu)
  - hiểu biết về công nghệ nền tảng

**Bối cảnh: Java là ngôn ngữ "blue-collar".** Cách nói của James Gosling: ngôn ngữ để làm việc thực tế. Java đánh đổi hiệu năng thô lấy năng suất lập trình viên. Các hệ thống con được quản lý (managed subsystems) như GC lấy đi khả năng kiểm soát low-level, đổi lại bạn không phải tự quản lý bộ nhớ, nhưng hành vi lúc chạy phức tạp hơn.

<!-- TODO: đối chiếu với sách xem có đúng ý "chỉ phù hợp cho HPC từ khoảng 2005 (HotSpot trưởng thành)" không; nếu đúng thì thêm lại. -->

## 2. Hiệu năng là một khoa học thực nghiệm

JVM có thể rất nhanh, nhưng ứng dụng chạy trên nó vẫn có thể chậm vì cả stack rất phức tạp. Quy trình tối ưu:

1. Định nghĩa kết quả mong muốn
2. Đo lường hệ thống hiện tại
3. Xác định cần thay đổi điều gì
4. Thực hiện cải tiến
5. Kiểm thử lại
6. So sánh với mục tiêu ban đầu

**Mục tiêu phải đo được.** Mục tiêu hiệu năng là **yêu cầu phi chức năng** (non-functional requirements) và nên viết dưới dạng **mục tiêu định lượng**. "Trang tải nhanh" thì không dùng được. "p99 < 200 ms ở 1.000 req/s" thì dùng được. Một thước đo không được định nghĩa rõ thì không giúp gì cho việc ra quyết định.

<!-- TODO: sách trích lời Goldratt về thước đo; đối chiếu nguyên văn trước khi trích dẫn. -->

### Hai cái bẫy khi đo trên JVM

- **Thống kê:** số liệu đo trên JVM thường **không** theo phân phối chuẩn (lệch, đuôi dài), nên trung bình, độ lệch chuẩn và phương sai dễ gây hiểu lầm. Hãy nhìn percentile và các giá trị ngoại lai. Ngoại lai rất quan trọng trong giao dịch tài chính hay đặt vé, và việc lấy mẫu (sampling) có thể bỏ sót đúng những sự kiện đó.
- **Chi phí đo:** bản thân việc đo cũng tốn tài nguyên. Ghi quá nhiều dữ liệu thì chính con số bạn đo cũng bị thay đổi.

## 3. Bảy chỉ số hiệu năng (trọng tâm của chương)

| Chỉ số | Trả lời câu hỏi | Lưu ý |
|---|---|---|
| **Throughput** (thông lượng) | Làm được bao nhiêu việc mỗi giây? (vd. TPS) | Chỉ có nghĩa khi gắn với nền tảng được mô tả rõ và tải ổn định |
| **Latency** (độ trễ) | Mỗi đơn vị công việc mất bao lâu? | Thường vẽ theo mức tải tăng dần |
| **Capacity** (sức chứa) | Xử lý đồng thời được bao nhiêu đơn vị? | Tại một mức latency hoặc throughput nhất định |
| **Utilization** (mức sử dụng) | Tài nguyên (CPU, bộ nhớ, mạng, I/O) bận đến đâu? | Với microservices, mạng thường là nút thắt thật sự, còn bộ nhớ hay bị lãng phí |
| **Efficiency** (hiệu suất) | Throughput trên mỗi đơn vị tài nguyên hoặc chi phí? | TCO gấp đôi cho cùng throughput nghĩa là hiệu suất giảm một nửa |
| **Scalability** (mở rộng) | Throughput đổi thế nào khi **thêm tài nguyên**? | Tuyến tính hoàn hảo là lý tưởng, hiếm khi đạt |
| **Degradation** (suy giảm) | Hiệu năng đổi thế nào khi **tăng tải mà không thêm tài nguyên**? | Phần lớn hệ thống xấu đi theo cách phi tuyến |

### Mối liên hệ giữa các chỉ số

- **Đánh đổi:** mỗi vòng tối ưu thường chỉ cải thiện vài chỉ số, và cải thiện chỉ số này có thể làm xấu chỉ số khác.
- **Phân biệt dễ nhầm:** scalability = tăng tải **và** tăng tài nguyên; degradation = **chỉ** tăng tải.
- **Trái trực giác:** tải lớn hơn có thể **giảm** latency. Phương thức được gọi nhiều hơn sẽ vượt ngưỡng biên dịch JIT, được biên dịch sang mã máy và chạy nhanh hơn nhiều. Vì vậy đo ở tải thấp rồi ngoại suy lên tải cao là sai.
- **Workload khác nhau thì "trông" rất khác nhau:** một giao dịch ngân hàng end-to-end có capacity khổng lồ và latency tính bằng giờ hoặc ngày. Một matching engine chỉ có vài trăm lệnh đang chờ nhưng latency khoảng một mili giây.

## 4. Đọc các biểu đồ hiệu năng

| Hình dạng | Ý nghĩa |
|---|---|
| **Performance elbow** (điểm gãy) | Latency tăng vọt khi tải vượt một ngưỡng: hệ thống hết dư địa |
| **Răng cưa của bộ nhớ** | Dấu hiệu bình thường, khỏe mạnh của GC |
| **Latency xấu dần rồi tăng vọt tại điểm uốn** | Dấu hiệu của rò rỉ tài nguyên (resource leak) |
| **Mở rộng gần tuyến tính** | Chỉ có ở trường hợp thuận lợi, vd. giao thức stateless, không cần session affinity |

### Định luật Amdahl

Phần xử lý tuần tự đặt ra giới hạn cứng cho mức tăng tốc. Với $p$ là tỉ lệ có thể song song hóa và $N$ là số lõi:

$$S(N) = \frac{1}{(1 - p) + \frac{p}{N}}$$

Ví dụ với $p = 0.95$: 32 lõi chỉ tăng tốc khoảng $12.5$ lần, và dù thêm bao nhiêu lõi, mức tối đa cũng chỉ là $1 / 0.05 = 20$ lần. Thêm lõi không cứu được phần tuần tự.

### Allocation rate

**Tốc độ cấp phát** (byte/giây) là chỉ số quan trọng trên JVM, vì nó quyết định áp lực lên GC. Ví dụ trong sách: một benchmark đòi mức cấp phát cao hơn mức phần cứng cho phép (khoảng 4–5 GiB/s), nên con số đo được phản ánh giới hạn phần cứng chứ không phải code.

<!-- TODO: đối chiếu con số "8 GiB/s" của benchmark trong sách trước khi ghi cụ thể. -->

## 5. Hiệu năng trên cloud

- **Hệ thống phân tán:** cloud là cụm nhiều JVM. Bạn phải tính đến phân bổ workload, triển khai bản cập nhật, node vào/ra cụm, node cấu hình sai, sự cố control plane, và hạ tầng dùng chung có thể thành điểm nghẽn.
- **Đơn vị triển khai là container,** không phải tiến trình JVM, và nhiều thứ trong cụm nằm ngoài tầm nhìn của bạn. Đó là lý do **observability** quan trọng (sẽ được bàn ở các chương sau).
- **Chi phí:** sở hữu máy chủ là CAPEX, thuê cloud là OPEX. Sự kém hiệu quả hiện thẳng trên hóa đơn hàng tháng, nên tối ưu hiệu năng cũng chính là tối ưu chi phí.
- **Cụm luôn biến động:** mở rộng, thu hẹp, tiến trình liên tục bị thay thế. Điều này khác hệ thống truyền thống trên máy chủ vật lý, vốn sống lâu và ổn định hơn. Vì vậy phép đo một lần thường không đủ.

<!-- TODO: xác nhận số chương của phần observability trong sách rồi thay "các chương sau". -->

## Tóm tắt nhanh

1. Đừng tin lời khuyên cũ nếu chưa tự đo.
2. Đặt mục tiêu **định lượng** trước khi tối ưu.
3. Dùng đúng từ vựng: biết mình đang nói về throughput, latency hay capacity.
4. Nhìn **percentile và ngoại lai**, không chỉ trung bình.
5. Nhớ Amdahl: phần tuần tự quyết định trần tăng tốc.
6. Trên cloud, hiệu năng, độ quan sát và chi phí gắn chặt với nhau.

**Tự kiểm tra:** Hệ thống của bạn đang ở đâu trên đường cong tải/latency, trước hay sau "elbow"? Và mục tiêu hiệu năng của nó có viết thành con số chưa?
