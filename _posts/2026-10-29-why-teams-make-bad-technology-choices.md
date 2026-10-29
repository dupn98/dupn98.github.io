---
title: "Chapter 2.3: Why Teams Make Bad Technology Choices"
description: "Ghi chú chương 2 sách Optimizing Cloud Native Java (phần 3/5): 5 nguyên nhân con người đằng sau các performance antipattern và cách khắc phục."
date: 2026-10-29 10:57:53 +0700
categories: [Java] # max 2 levels
tags: [java, jvm, performance, book-notes] # lowercase
pin: false
toc: true
comments: true
math: false
mermaid: false
---

> **Phần 3/5** — ghi chú Chương 2 sách *Optimizing Cloud Native Java, 2nd Edition* (Benjamin J. Evans, James Gough).
{: .prompt-info }

## Giới thiệu

- **Antipattern** là một hành vi không mong muốn nhưng xuất hiện ở rất nhiều dự án. Vì nó cứ lặp đi lặp lại, chắc chắn có một yếu tố tiềm ẩn nào đó thúc đẩy nó. Một số antipattern thoạt nhìn có vẻ hợp lý, số khác hình thành dần dần từ những thói quen xấu. Đặt tên cho chúng tạo ra một vốn từ vựng chung để nhận diện và loại bỏ chúng.

- Tuning hiệu năng cần **khách quan**, với mục tiêu cụ thể được đặt ra từ sớm. Nhưng dưới áp lực, đó lại là thứ đầu tiên bị bỏ qua. Kết quả kinh điển: một đợt ra mắt, một sự cố bất ngờ (hy vọng là trên môi trường UAT, nhưng thường lại là trên production), rồi cả team cuống cuồng vì chẳng ai test cả, hoặc vì "ninja" của team đã tự đưa ra giả định rồi nghỉ việc. Và cũng như phần lớn các vấn đề trong phát triển phần mềm, nguyên nhân thường nằm ở **giao tiếp chứ không phải công nghệ**.

- Sách mượn cách phân loại từ bài viết của Carey Flichel, *"Why Developers Keep Making Bad Technology Choices"*: 5 nguyên nhân đến từ con người.

## 1. Sự nhàm chán (Boredom)

- Một lập trình viên bị kẹt mãi ở một vị trí có thể thêm vào những phức tạp không ai cần, ví dụ tự viết thuật toán sort trong khi `Collections.sort()` là đủ, hoặc chọn một công nghệ lạ chỉ để vọc thử.

## 2. Làm đẹp CV (Résumé padding)

- Gần giống trên, nhưng động cơ là con đường sự nghiệp: dùng một công nghệ chủ yếu để thêm vào CV. Một team lành mạnh thường sẽ ngăn chuyện này, nhưng không phải lúc nào cũng vậy, và hậu quả có thể kéo dài nhiều năm sau khi người đó đã rời đi.

## 3. Áp lực xã hội (Social pressure)

- Những lo ngại không được nói ra: một bạn junior không muốn bị coi là sai trước mặt các senior, hoặc có người sợ bị đánh giá là thiếu hiểu biết. Tệ nhất là khi team chạy theo danh tiếng "làm nhanh", vội vàng đưa ra các quyết định then chốt mà không cân nhắc hệ quả.

## 4. Thiếu hiểu biết (Lack of understanding)

- Tìm đến một công cụ mới hào nhoáng chỉ vì không biết công cụ hiện tại làm được gì. Ví dụ trong sách: Hibernate được đưa vào chỉ vì từng thấy nó được dùng ở nơi khác, nhưng bị dùng sai cách và gây ra những sự cố ngừng hoạt động không thể khắc phục. Một trong hai tác giả từng gặp một sinh viên phải gỡ bỏ hoàn toàn Hibernate chỉ trong một cuối tuần để quay về dùng JDBC thuần.

## 5. Hiểu sai vấn đề, hoặc vấn đề không tồn tại

- Áp dụng một công nghệ vào một vấn đề mà chưa ai đo lường. Không có số liệu hiệu năng thì bạn không thể đánh giá bản sửa có hiệu quả hay không, và chính việc thu thập số liệu thường làm lộ ra vấn đề thật sự là gì.

## Cách khắc phục

- Khuyến khích **giao tiếp cởi mở**, nơi mọi người đều có thể tham gia.
- Khi mọi thứ chưa rõ ràng, hãy **thu thập bằng chứng và xây dựng prototype**. Nếu một công nghệ mới hào nhoáng không đạt kỳ vọng trong bản prototype, team có thể ra quyết định dựa trên dữ liệu thực tế.
- Phụ lục B của sách liệt kê chi tiết các antipattern cụ thể sinh ra từ những nguyên nhân này.

**Bài trước:** [Phần 2 — Performance testing best practices]({% post_url 2026-10-29-performance-testing-best-practices %})

**Bài tiếp:** [Phần 4 — Statistics for JVM performance]({% post_url 2026-10-29-statistics-for-jvm-performance %})
