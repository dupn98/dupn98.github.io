---
title: "Chapter 2.4: Statistics for JVM Performance"
description: "Ghi chú chương 2 sách Optimizing Cloud Native Java (phần 4/5): sai số ngẫu nhiên và sai số hệ thống, vì sao dữ liệu JVM không phân phối chuẩn, percentile theo thang logarit và HdrHistogram."
date: 2026-10-29 15:17:01 +0700
categories: [Java] # max 2 levels
tags: [java, jvm, performance, book-notes] # lowercase
pin: false
toc: true
comments: true
math: false
mermaid: false
---

> **Phần 4/5** — ghi chú Chương 2 sách *Optimizing Cloud Native Java, 2nd Edition* (Benjamin J. Evans, James Gough).
{: .prompt-info }

## Giới thiệu

- Nếu phân tích hiệu năng là một khoa học thực nghiệm, chúng ta sẽ phải làm việc với **phân phối của kết quả**, và dữ liệu thực tế không bao giờ là một tín hiệu sạch. Mọi phép đo đều có sai số, nên cần lặp lại phép thử nhiều lần. Tài liệu tham khảo kinh điển là bài báo năm 2007 *"Statistically Rigorous Java Performance Evaluation"*, bài báo đã phổ biến quy tắc kinh nghiệm chạy **khoảng 30 lần** cho một hệ thống động như JVM.

## Hai loại sai số

|  | Sai số ngẫu nhiên (random error) | Sai số hệ thống (systematic error) |
| --- | --- | --- |
| Nguyên nhân | Những thay đổi không đoán trước được trong môi trường | Một yếu tố chưa được tính đến, tác động lên kết quả một cách *nhất quán* |
| Thuật ngữ chất lượng | **Độ chính xác** – precision (sai số ngẫu nhiên thấp) | **Độ đúng** – accuracy (sai số hệ thống thấp) |

- Hãy tưởng tượng trò chơi phi tiêu (hình 2-1, từ trái sang phải): cụm phi tiêu chụm ngay tâm = vừa chính xác vừa đúng; cụm chụm nhưng lệch tâm = chính xác nhưng không đúng; phi tiêu tản mát quanh tâm = đúng nhưng không chính xác; tản mát và lệch = không chính xác cũng không đúng.

![Bốn tấm bia phi tiêu minh họa precision và accuracy](/assets/img/posts/2026-10-29-statistics-for-jvm-performance/fig-2-1-types-of-error.png){: w="600" h="142" }
_Hình 2-1: Các loại sai số (nguồn: Optimizing Cloud Native Java, 2nd Ed.)_

- Sai số ngẫu nhiên thường tuân theo phân phối Gauss (phân phối chuẩn, đường cong hình chuông): khả năng đẩy kết quả lên hay xuống là ngang nhau. (Ta giả định bản thân công cụ đo là đáng tin cậy, nên nguồn gốc sai số là từ môi trường.)

![Đường cong hình chuông của phân phối chuẩn](/assets/img/posts/2026-10-29-statistics-for-jvm-performance/fig-2-2-gaussian.png){: w="600" h="428" }
_Hình 2-2: Phân phối Gauss (phân phối chuẩn, đường cong hình chuông)_

## Một câu chuyện về sai số hệ thống

- Một bài test JMeter cho các backend service trả về JSON cho thấy hai hiện tượng:
    1. Latency của một service tăng tuyến tính theo thời gian. Đó là dấu hiệu một tài nguyên nào đó đang cạn kiệt dần, một ứng viên thật sự đáng điều tra. Tuy nhiên chưa thể kết luận là memory leak nếu chưa phân tích thêm.
    2. Gần như tất cả các service còn lại đều nằm quanh **180 ms**, dù khối lượng công việc của chúng rất khác nhau. Tại sao? Các service đặt ở London, còn máy tạo tải lại ở Mumbai. Độ trễ mạng khứ hồi khoảng 120–150 ms đã lấn át thời gian phản hồi thực sự. Chạy lại từ London thì hiện tượng này biến mất.
- Bài học: hiện tượng thứ hai là lỗi do *cách dựng bài test*, không phải lỗi của ứng dụng. Thêm một lý do nữa để điều kiện test phải giống production.

![Biểu đồ JMeter: một service có latency tăng dần, các service khác nằm quanh 180 ms](/assets/img/posts/2026-10-29-statistics-for-jvm-performance/fig-2-3-systematic-error.png){: w="600" h="450" }
_Hình 2-3: Sai số hệ thống. Đường trên cùng là service bị cạn kiệt tài nguyên, các đường còn lại bị kéo về ~180 ms do độ trễ mạng London–Mumbai_

## Dữ liệu JVM không phân phối chuẩn

- Trung bình, độ lệch chuẩn, phương sai và độ xiên (skew) được dạy cho dữ liệu hình chuông, nhưng chúng bị bóp méo chỉ bởi vài giá trị ngoại lai nằm rất xa. Trong hiệu năng Java, **giá trị ngoại lai chính là các transaction chậm và những khách hàng không hài lòng**, nên ta không được phép "pha loãng" chúng.
- Thời gian chạy trên JVM có một cận dưới cứng: **hot path** (code đã được JIT biên dịch, không có GC) là trường hợp tốt nhất, và không có chuyện một lần chạy "nhanh hơn một chút" nhờ may mắn ngẫu nhiên. Điều này phá vỡ giả định của phân phối Gauss và tạo ra một phân phối **đuôi dài** (long-tail). Với loại phân phối này, độ lệch chuẩn và các moment bậc cao hơn gần như vô dụng. Hơn nữa, những khách hàng lên tiếng phàn nàn chỉ là thiểu số, nên cải thiện *giá trị trung bình* hiếm khi là mục tiêu thật sự.

![Phân phối đuôi dài của thời gian giao dịch](/assets/img/posts/2026-10-29-statistics-for-jvm-performance/fig-2-4-long-tail.png){: w="600" h="348" }
_Hình 2-4: Phân phối thời gian giao dịch thực tế hơn: có cận dưới cứng và một cái đuôi dài (lưu ý: sách đặt Latency ở trục dọc, Frequency ở trục ngang)_

## Dùng percentile theo thang logarit

- Mô tả toàn bộ phân phối bằng cách lấy mẫu tại median (50%), rồi 90%, rồi giãn dần ra theo thang logarit. Ví dụ trong sách cho một getter method:

```
50.0%   = 23 ns
90.0%   = 30 ns
99.0%   = 43 ns
99.9%   = 164 ns
99.99%  = 248 ns
99.999% = 3,458 ns
99.9999%= 17,463 ns
```

- Mức "thông thường" là 23 ns, nhưng cứ khoảng 1.000 lần gọi thì có 1 lần chậm hơn khoảng một bậc độ lớn (order of magnitude), và cứ 100.000 lần gọi thì có 1 lần chậm hơn khoảng hai bậc. Những phân phối có **dải động cao (high dynamic range – HDR)** như vậy rất phổ biến.

## HdrHistogram

- Để phân tích sâu hơn, sách giới thiệu **HdrHistogram** (của Gil Tene, có sẵn trên Maven Central, phiên bản 2.1.12 tại thời điểm viết sách). Nó ghi nhận giá trị vào các bucket, có thể in ra phân phối theo percentile, và có công cụ vẽ đồ thị online. Sách dùng nó để vẽ khoảng thời gian giữa các lần GC.
- HdrHistogram cũng giúp phát hiện hiện tượng **coordinated omission**: khi hệ thống đo vô tình "phối hợp" với hệ thống đang được test, dẫn đến đo sai các giá trị ngoại lai hoặc bỏ sót request.

![Biểu đồ HdrHistogram: khoảng thời gian giữa các lần GC theo percentile](/assets/img/posts/2026-10-29-statistics-for-jvm-performance/fig-2-5-hdrhistogram.png){: w="600" h="278" }
_Hình 2-5: Ví dụ trực quan hóa bằng HdrHistogram (khoảng thời gian giữa các lần GC)_

## Kết luận

- Hãy báo cáo **percentile và phân phối**, không phải giá trị trung bình. Hãy coi phần đuôi của phân phối chính là tín hiệu cần quan tâm.

**Bài trước:** [Phần 3 — Why teams make bad technology choices]({% post_url 2026-10-29-why-teams-make-bad-technology-choices %})

**Bài tiếp:** [Phần 5 — Interpretation of statistics]({% post_url 2026-10-29-interpretation-of-statistics %})
