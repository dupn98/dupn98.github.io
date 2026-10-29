---
title: "Chapter 2.1: Types of Performance Tests"
description: "Ghi chú chương 2 sách Optimizing Cloud Native Java (phần 1/5): 7 loại performance test và câu hỏi mà mỗi loại trả lời."
date: 2026-10-28 10:32:21 +0700
categories: [Java] # max 2 levels
tags: [java, jvm, performance, book-notes] # lowercase
pin: false
toc: true
comments: true
math: false
mermaid: false
---

> **Phần 1/5** — ghi chú Chương 2 sách *Optimizing Cloud Native Java, 2nd Edition* (Benjamin J. Evans, James Gough).
{: .prompt-info }

## Giới thiệu

- "Chúng ta nên làm performance test" là một trong những câu nói ít giá trị nhất trong phát triển phần mềm. Performance test thường được chạy vì những lý do không đúng, hoặc chạy rất tệ, bởi niềm tin mù quáng rằng làm *một cái gì đó* vẫn tốt hơn là không làm gì. Sách gọi niềm tin này là một nửa sự thật đầy nguy hiểm.
- Cách khắc phục là phải **cụ thể**. Một bài performance test tốt phải **định lượng được**: nó đặt ra một câu hỏi mà câu trả lời là một con số có thể phân tích bằng thống kê. Trước khi chọn loại test, hãy viết câu hỏi đó ra và thống nhất với người chịu trách nhiệm về ứng dụng (application owner).

## 7 loại performance test

| Loại test | Câu hỏi mà nó trả lời |
| --- | --- |
| **Latency** | Thời gian xử lý một transaction từ đầu đến cuối là bao lâu? |
| **Throughput** | Hệ thống hiện tại xử lý được bao nhiêu transaction đồng thời? |
| **Stress** | Điểm giới hạn (breaking point) của hệ thống nằm ở đâu? |
| **Load** | Hệ thống có chịu được *đúng mức tải này* không? |
| **Endurance** | Những bất thường nào xuất hiện khi hệ thống chạy trong thời gian dài? |
| **Capacity planning** | Hệ thống có mở rộng như mong đợi khi bổ sung tài nguyên không? |
| **Degradation** | Điều gì xảy ra khi một phần của hệ thống gặp lỗi? |

- **Latency**: loại test phổ biến nhất, vì cả quản lý lẫn người dùng đều quan tâm: khách hàng phải chờ bao lâu? Cái bẫy nằm ở chỗ câu hỏi này đơn giản đến mức team thôi không hỏi thêm câu nào khác. Và dùng giá trị trung bình (average) đơn thuần là một cách đo kém cho latency (xem thêm ở [phần 4]({% post_url 2026-10-29-statistics-for-jvm-performance %})).

- **Throughput**: là cặp đôi của latency. Hãy báo cáo latency *tại một mức throughput đã biết*, và khi tăng dần throughput thì theo dõi xem latency có tăng vọt hay không. "Throughput tối đa" là điểm mà phân phối latency đột ngột thay đổi: điểm uốn (inflection point).

- **Stress**: đo phần dư địa còn lại của hệ thống. Bắt đầu từ trạng thái ổn định (thường là mức tải đỉnh hiện tại), sau đó tăng dần số transaction đồng thời cho đến khi các chỉ số quan sát bắt đầu suy giảm. Giá trị tốt cuối cùng chính là mức tối đa đạt được.

- **Load**: một bài test dạng có/không: "Chúng ta có xử lý được mức tải dự kiến không?". Thường được chạy trước một sự kiện đã biết, như đón một khách hàng lớn, chạy một chiến dịch quảng cáo, hoặc khi sản phẩm bất ngờ trở nên viral.

- **Endurance (soak)**: một số vấn đề chỉ lộ ra sau nhiều ngày: memory leak chậm, cache bị "ô nhiễm" (cache pollution), heap bị phân mảnh. Hãy chạy hệ thống ở mức sử dụng thực tế (từ trung bình đến cao) và theo dõi tài nguyên. Loại test này vừa chậm vừa tốn kém, lại khó có dữ liệu thực tế cho các lần chạy dài. Đây là lý do lớn khiến nhiều team cuối cùng "test thẳng trên production". Tuy nhiên, không có đường tắt nào cả.

- **Capacity planning**: giống stress test nhưng nhìn về tương lai: một hệ thống *đã được nâng cấp* sẽ chịu được bao nhiêu? Thường là một phần của kế hoạch định kỳ, chứ không phải phản ứng trước một mối đe dọa.

- **Degradation (partial failure)**: chạy ở mức tải bình thường giống production, rồi đột ngột rút bớt tài nguyên (mất vài node trong cluster, giảm băng thông mạng) và theo dõi latency, throughput. Ví dụ cực đoan nổi tiếng là **Chaos Monkey** của Netflix, công cụ ngẫu nhiên tắt các tiến trình đang chạy trên production. Cách này đòi hỏi kỷ luật vận hành rất tốt, nhưng nó phản ánh đúng thực tế trên cloud: trong một hệ thống đủ lớn, *luôn có thứ gì đó đang hỏng*. Một hệ thống "chạy trơn tru hoàn toàn" chỉ là đặc điểm của quy mô nhỏ.

## Kết luận

- Các loại test này thường chồng lấn nhau và hiếm khi độc lập trong thực tế, nhưng mỗi loại có một mục tiêu riêng. Hãy chọn **con số bạn cần** trước, rồi mới chọn loại test.

**Bài tiếp:** [Phần 2 — Performance testing best practices]({% post_url 2026-10-29-performance-testing-best-practices %})
