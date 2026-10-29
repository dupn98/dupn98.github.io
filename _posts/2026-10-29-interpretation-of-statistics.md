---
title: "Chapter 2.5: Interpretation of Statistics"
description: "Ghi chú chương 2 sách Optimizing Cloud Native Java (phần 5/5): tương quan giả, bài toán chiếc mũ/con voi, và cách đọc số liệu mà không tự lừa mình."
date: 2026-10-29 16:47:13 +0700
categories: [Java] # max 2 levels
tags: [java, jvm, performance, book-notes] # lowercase
pin: false
toc: true
comments: true
math: false
mermaid: false
---

> **Phần 5/5** — ghi chú Chương 2 sách *Optimizing Cloud Native Java, 2nd Edition* (Benjamin J. Evans, James Gough).
{: .prompt-info }

## Giới thiệu

- Thu thập dữ liệu là phần dễ. Diễn giải nó thường là việc khó nhất. Như Gerald Weinberg từng nói: dù vấn đề là gì đi nữa, thì nó luôn là vấn đề con người.

## Tương quan giả (spurious correlation)

- "Tương quan không có nghĩa là nhân quả." Với hai sự kiện A và B có tương quan với nhau, sẽ có 4 khả năng:
    1. A gây ra B (nhân quả trực tiếp).
    2. B gây ra A (nhân quả ngược).
    3. Cả hai cùng do một yếu tố thứ ba C gây ra (chung nguyên nhân).
    4. Không có liên hệ gì cả, chỉ là trùng hợp.
- Trường hợp 1 và 2 đơn giản. Trường hợp 3 tinh vi hơn: tương quan là *có thật*, nhưng câu chuyện nhân quả mà bạn suy ra lại sai. Ví dụ trong sách: nuôi con bằng sữa mẹ có tương quan với chỉ số IQ cao hơn ở trẻ, nhưng chính tầng lớp xã hội mới là yếu tố quyết định cả hai.
- Trường hợp 4 là cực đoan nhất: cứ tìm đủ kỹ, bạn sẽ thấy tương quan ngay cả giữa những dữ liệu chẳng liên quan gì đến nhau. Sách đưa ra ví dụ lượng thịt gà tiêu thụ ở Mỹ biến động giống hệt lượng dầu thô nhập khẩu, rõ ràng là vô lý.

![Biểu đồ tương quan giữa lượng gà tiêu thụ ở Mỹ và lượng dầu thô nhập khẩu](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-6-spurious-chicken-oil.png){: w="600" h="238" }
_Hình 2-6: Một tương quan hoàn toàn giả (Vigen) (nguồn: Optimizing Cloud Native Java, 2nd Ed.)_

- Mối nguy thật sự lại nằm ở những tương quan *ít* phi lý hơn, chẳng hạn doanh thu của các khu trò chơi điện tử (arcade) biến động cùng chiều với số bằng tiến sĩ khoa học máy tính được cấp ở Mỹ. Không khó để hình dung ai đó viết một bài báo nghe rất hợp lý về chuyện nghiên cứu sinh căng thẳng tìm đến trò chơi điện tử để xả stress.

![Biểu đồ tương quan giữa doanh thu arcade và số bằng tiến sĩ khoa học máy tính](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-7-less-spurious-arcade-phd.png){: w="600" h="238" }
_Hình 2-7: Một tương quan "ít giả" hơn? (Vigen)_

- Với công việc trên JVM: **đừng bao giờ gán quan hệ nhân quả cho một tương quan chỉ vì câu chuyện "nghe có vẻ hợp lý"**. Lời cảnh báo của Feynman rất đúng ở đây: nguyên tắc đầu tiên là bạn không được tự lừa mình, và bạn chính là người dễ bị lừa nhất.
- Sách đưa ra một biểu đồ allocation rate thật: ổn định trong khoảng 350–700 MB/s suốt gần một ngày, với một đợt giảm quanh giờ thứ 9–10. Biểu đồ này có tín hiệu rõ ràng gắn với workload, nhưng các chỉ số quan sát thực tế sẽ nhanh chóng rối hơn nhiều.

![Biểu đồ allocation rate trong gần một ngày](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-8-allocation-rate.png){: w="600" h="401" }
_Hình 2-8: Ví dụ về allocation rate_

## Bài toán chiếc mũ/con voi (the hat/elephant problem)

- Trong *Hoàng tử bé*: bức vẽ một con trăn nuốt chửng con voi bị người lớn nhìn thành một chiếc mũ. Bài học: hãy suy nghĩ kỹ hơn về những gì mình thực sự đang nhìn thấy, thay vì chấp nhận một lời giải thích hời hợt.

![Histogram thời gian phản hồi HTTP có hình dạng giống chiếc mũ](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-9-hat-or-elephant.png){: w="600" h="345" }
_Hình 2-9: Chiếc mũ, hay con voi bị trăn nuốt?_

- Áp dụng vào phần mềm: histogram thời gian phản hồi HTTP trông như một khối phức tạp. Nhưng "web response" thực ra là nhiều nhóm khác nhau bị trộn lẫn:
    - **Lỗi phía client (4xx, ví dụ 404)**: được trả về ngay lập tức, nên rất nhanh và tập trung sát nhau.
    - **Lỗi phía server (5xx)**: thường xảy ra *sau khi* đã xử lý rất nhiều, hoặc do timeout, nên chậm.
    - **Thành công (2xx)**: có đuôi dài và thường **đa đỉnh (multimodal)**, ví dụ khi có hai nhánh code phổ biến với thời gian chạy khác nhau.

![Phân phối thời gian phản hồi của lỗi client](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-10-client-errors.png){: w="600" h="347" }
_Hình 2-10: Lỗi phía client (4xx)_

![Phân phối thời gian phản hồi của lỗi server](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-11-server-errors.png){: w="600" h="347" }
_Hình 2-11: Lỗi phía server (5xx)_

![Phân phối thời gian phản hồi của các request thành công, có hai đỉnh](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-12-successful-requests.png){: w="600" h="347" }
_Hình 2-12: Các request thành công (2xx), phân phối đa đỉnh_

- Chồng các nhóm này lên nhau, bạn sẽ dựng lại đúng "chiếc mũ" ban đầu. Phương pháp ở đây là: **chia một chỉ số quan sát chung thành các nhóm con có ý nghĩa**. Bạn có thể đi xa hơn nữa, ví dụ tách các thao tác đọc (read) khỏi cập nhật (update) và tải lên (upload). Bạn cần hiểu dữ liệu và lĩnh vực của mình trước khi rút ra bất kỳ kết luận nào.

![Ba phân phối chồng lên nhau tạo lại hình chiếc mũ](/assets/img/posts/2026-10-29-interpretation-of-statistics/fig-2-13-hat-revisited.png){: w="600" h="347" }
_Hình 2-13: Nhìn lại chiếc mũ/con voi_

## Đọc thêm

- Blog kỹ thuật của PayPal, đặc biệt là bài *"Statistics for Software"* của Mahmoud Hashemi.
- **Datasaurus Dozen**: các bộ dữ liệu có cùng các chỉ số thống kê tổng hợp nhưng hình dạng khác nhau hoàn toàn, một lời nhắc rằng hãy luôn vẽ dữ liệu ra mà xem.

## Tổng kết loạt bài

- Qua 5 bài của chương 2: chọn đúng loại test cho câu hỏi, test trong môi trường giống production, cảnh giác với các antipattern do con người tạo ra, báo cáo percentile thay vì trung bình, và hoài nghi chính cách diễn giải của mình. (Phần cuối chương, về các thiên kiến nhận thức (cognitive bias), không nằm trong loạt bài này.)

**Bài trước:** [Phần 4 — Statistics for JVM performance]({% post_url 2026-10-29-statistics-for-jvm-performance %})
