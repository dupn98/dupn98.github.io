---
title: "Seen-set và tra phần bù"
description: "Nhận diện bài toán đếm/tìm cặp (i, j) có quan hệ khả nghịch, tách điều kiện về từng chỉ số và tra phần bù bằng hash map trong một lần duyệt."
date: 2026-11-05 16:29:36 +0700
categories: [algorithm]
tags: [leetcode, hashing, two-sum, complement-lookup]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

## Dấu hiệu nhận biết

- Mục tiêu là đếm hoặc tìm cặp chỉ số $(i, j)$ thỏa mãn một phương trình ràng buộc cả hai. Ràng buộc có thể là tổng, tích, XOR, tổng modulo, hoặc kết hợp giữa chỉ số và giá trị.
- Quan hệ giữa hai phần tử có tính khả nghịch: từ mỗi phần tử tính trực tiếp ra đối tác cần tìm (ví dụ `target - x`, `t / x`, `k ^ x`, `(m - r) % m`) thay vì phải quét tìm.
- Kích thước mảng từ $10^5$ trở lên: hai vòng lặp lồng nhau sẽ quá thời gian, còn kỹ thuật này chỉ duyệt mảng một lần với chi phí tra cứu $O(1)$.
- Điều kiện chứa cả hai chỉ số nhưng các số hạng tách rời được: mọi biến liên quan đến $i$ đều chuyển được về một vế của phương trình.
- Kết quả là số lượng cặp, có thể vượt giới hạn số nguyên 32-bit. Đề bài trả về `long` hoặc yêu cầu lấy dư là dấu hiệu rõ ràng.

## Nhận diện qua từ khóa đề bài

| Từ khóa trong đề bài | Dấu hiệu nhận biết | Bài |
| --- | --- | --- |
| A pair of indices (i, j) is a bad pair if i < j and j - i != nums[j] - nums[i], n ≤ 10^5 | Điều kiện ràng buộc cả hai chỉ số, nhưng mọi số hạng chứa i chuyển được về một vế để làm hash key | 2364 |
| The number of pairs i, j where i < j and hours[i] + hours[j] forms a complete day | Điều kiện tổng với dữ liệu lớn (5 · 10^5). Đối tác phải được tính trực tiếp thay vì quét tìm | 3185 |
| An exact multiple of 24 hours | Lấy mod 24 trước: key của đối tác là phần dư `(24 - r) % 24` | 3184 |
| You can pick two numbers from the array whose sum equals k, return the maximum number of operations | Ghép cặp theo quan hệ khả nghịch: đếm theo key rồi lấy `min(cnt[v], cnt[k - v])` | 1679 |
| A pair (i, j) is called good if nums[i] == nums[j] and i < j | Key đối tác chính là giá trị của phần tử. Cộng dồn trước khi chèn tự động giữ điều kiện i < j | 1512 |
| The distance between two points is (x1 XOR x2) + (y1 XOR y2) | XOR là phép toán tự nghịch đảo: mỗi cách chia ngân sách k chỉ định đúng một key đối tác | 2857 |

Hai câu hỏi cốt lõi để xác định pattern:

1. Có dồn được mọi số hạng của $i$ về một vế của phương trình không? Nếu có, bài toán thuộc kỹ thuật này.
2. Đại lượng cần tìm có phải phần bù của một nhóm dễ đếm không? Nếu đúng, đếm nhóm dễ rồi lấy $\binom{n}{2}$ trừ đi.

## Phương pháp triển khai

- **Tách điều kiện:** biến đổi phương trình cho đến khi mỗi vế chỉ chứa một chỉ số. Ví dụ:
  - `j - i == nums[j] - nums[i]` thành `nums[j] - j == nums[i] - i` (bài 2364);
  - `a[i] + rev(a[j]) == a[j] + rev(a[i])` thành `a[i] - rev(a[i]) == a[j] - rev(a[j])` (bài 1814);
  - `(h[i] + h[j]) % 24 == 0` thành tra số dư đối tác `(24 - h[i] % 24) % 24`.

  Nếu biểu thức không tách rời được, pattern này vô hiệu.
- **Duyệt kết hợp map:** quét dữ liệu một lần, dùng map ánh xạ key sang đại lượng bài toán cần (số lần xuất hiện, chỉ số đầu tiên, cực trị...).
- **Truy vấn trước, chèn sau:** trình tự luôn là tính key đối tác, tra cứu, cộng dồn, rồi mới chèn phần tử hiện tại vào map. Chuỗi thao tác này tự động xử lý điều kiện $i < j$.
- **Tra mọi đối tác hợp lệ:** khi một phần tử có nhiều đối tác khả dĩ (như bài 2857), thử toàn bộ.
- **Dùng phần bù:** nếu yêu cầu là phần bù của một tập dễ gom nhóm, đếm tập dễ trước rồi lấy $\binom{n}{2}$ trừ đi.

```java
// Bài 2364: đếm bad pair = tổng số cặp - số good pair
public long countBadPairs(int[] nums) {
    Map<Integer, Integer> seen = new HashMap<>();
    long good = 0;
    for (int j = 0; j < nums.length; j++) {
        int key = nums[j] - j;
        good += seen.getOrDefault(key, 0); // truy vấn trước
        seen.merge(key, 1, Integer::sum);  // chèn sau
    }
    long n = nums.length;
    return n * (n - 1) / 2 - good;
}
```

## Bẫy thường gặp

- **Sai thứ tự thao tác:** chèn phần tử vào map trước khi truy vấn sẽ làm phần tử tự ghép cặp với chính nó.
- **Sai modulo:** luôn dùng `(m - r) % m`, không dùng `m - r`, vì khi `r = 0` đối tác phải là `0` chứ không phải `m` (bài 3184).
- **Tràn số:** biến cộng dồn cần kiểu `long`, vì $n = 5 \cdot 10^5$ tạo ra khoảng $1.25 \cdot 10^{11}$ cặp (bài 3185).
- **Cặp giá trị khác cặp chỉ số:** khi đếm các cặp giá trị phân biệt, chuẩn hóa cặp theo phần tử nhỏ hơn rồi đưa vào tập kết quả để loại trùng, đặc biệt khi `k = 0` (bài 532).
- **Thiếu điều kiện chia nguyên:** với đối tác dạng `T / x`, phải kiểm tra `T % x == 0` trước (bài 1577).
- **Cập nhật cực trị sai thời điểm:** khi map lưu cực trị thay vì số đếm, dùng `min`/`max` khi cập nhật và chỉ chèn khi phần tử là điểm bắt đầu hợp lệ (bài 3026).
- **Bị đánh lừa bởi cấu trúc dữ liệu:** với cây BST trong bài 653, có thể bỏ qua trật tự node và duyệt thẳng vào seen-set.
