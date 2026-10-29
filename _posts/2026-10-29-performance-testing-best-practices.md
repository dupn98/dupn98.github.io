---
title: "Chapter 2.2: Performance Testing Best Practices"
description: "Ghi chú chương 2 sách Optimizing Cloud Native Java (phần 2/5): 3 nguyên tắc vàng, đo top-down, môi trường test giống production và yêu cầu phi chức năng."
date: 2026-10-29 10:15:21 +0700
categories: [Java] # max 2 levels
tags: [java, jvm, performance, book-notes] # lowercase
pin: false
toc: true
comments: true
math: false
mermaid: false
---

> **Phần 2/5** — ghi chú Chương 2 sách *Optimizing Cloud Native Java, 2nd Edition* (Benjamin J. Evans, James Gough).
{: .prompt-info }

## Giới thiệu

- Trước khi bắt tay vào tuning, sách đưa ra 3 nguyên tắc vàng:
    1. **Xác định điều bạn quan tâm và tìm cách đo lường nó.**
    2. **Tối ưu thứ quan trọng, không phải thứ dễ tối ưu.**
    3. **Bắt đầu từ những phần đóng góp lớn nhất.**
- Nguyên tắc 2 có một mặt trái: đừng coi trọng một metric chỉ vì nó dễ thu thập. Nguyên tắc 3 cảnh báo việc mải mê gọt giũa những thứ nhỏ nhặt chỉ cho có.

## Đo hiệu năng từ trên xuống (top-down)

- Nghe có vẻ ngược đời, nhưng đo toàn bộ một ứng dụng **Java** thường dễ và đáng tin hơn việc lấy được con số chính xác cho một đoạn code nhỏ. Đó là lý do sách đẩy phần **microbenchmarking** xuống phụ lục. Hãy bắt đầu từ hành vi của toàn bộ ứng dụng (**top-down**), và bạn cần 3 thứ:
    - một môi trường test,
    - một ý tưởng rõ ràng về việc cần đo gì và tối ưu gì,
    - một kế hoạch đưa công việc này vào vòng đời phát triển phần mềm.

## Xây dựng môi trường test

- Mục tiêu là một **bản sao chính xác của production**: cùng số CPU, OS, phiên bản JVM, cùng web server, database và message queue. Các dịch vụ bên thứ ba không thể tái tạo ở mức tải thật thì dùng mock.
- Một môi trường khác biệt đáng kể so với production sẽ cho ra kết quả không có giá trị dự đoán. Ban quản lý thường phản đối khoản chi này, nhưng gần như luôn là tiết kiệm sai chỗ, vì chi phí của các sự cố ngừng hoạt động (outage) thường bị tính thiếu.
- Cloud giúp việc này dễ hơn (hạ tầng theo nhu cầu, "livestock, not pets"), với vài lưu ý:
    - thay đổi nên đi theo chiều test → production, không phải ngược lại,
    - đảm bảo môi trường test không có phụ thuộc ẩn nào vào production,
    - dùng xác thực và phân quyền giống thật, không dùng tài khoản giả (dummy).
- Một lợi ích lớn của cloud: môi trường có thể **tắt đi khi không dùng**, tiết kiệm tiền thật, với điều kiện bạn tự động hóa lịch bật/tắt.

## Xác định yêu cầu hiệu năng

- Hiệu năng không chỉ nằm ở code của bạn. Container, OS và phần cứng đều ảnh hưởng, nên hãy định nghĩa mục tiêu dưới dạng **yêu cầu phi chức năng (NFR)** mà khách hàng và ban quản lý thực sự cảm nhận được. Một số mục tiêu hiển nhiên:
    - giảm thời gian ở percentile 95 (p95) đi 100 ms,
    - tăng throughput lên 5 lần trên phần cứng hiện có.
- Một số khác ít hiển nhiên hơn nhưng giá trị không kém:
    - giảm một nửa chi phí tài nguyên trên mỗi khách hàng,
    - vẫn nằm trong 25% so với mục tiêu thời gian phản hồi ngay cả khi cluster suy giảm 50%,
    - giảm 25% tỷ lệ khách hàng bỏ ngang bằng cách cắt bớt 10 ms latency.
- Hãy chốt các mục tiêu này với các bên liên quan, tốt nhất là ngay từ buổi kickoff.

## Performance test trong vòng đời phát triển (SDLC)

- Các team trưởng thành không coi performance test là việc làm một lần. Họ chạy **performance regression test liên tục**. Điều này đòi hỏi team phát triển và team hạ tầng kiểm soát được phiên bản code nào đang nằm trên môi trường test, và gần như không thể làm được nếu thiếu một môi trường test riêng.

## Những vấn đề riêng của Java

- JVM tự quản lý nhiều thứ (điều chỉnh bộ nhớ động, biên dịch JIT), điều này làm mọi thứ phức tạp hơn. Nếu một method không được JIT biên dịch, thì hoặc là nó không được gọi đủ nhiều, hoặc (hiếm hơn nhiều) là nó quá lớn hay quá phức tạp để phân tích. Chương 6 sẽ nói cách đảm bảo các method được gọi thường xuyên (hot method) được biên dịch.

**Bài trước:** [Phần 1 — Types of performance tests]({% post_url 2026-10-28-chap02-01-types-of-performance-tests %})

**Bài tiếp:** [Phần 3 — Why teams make bad technology choices]({% post_url 2026-10-29-why-teams-make-bad-technology-choices %})
