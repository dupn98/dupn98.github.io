---
title: "Frequency Map & Bucket/Sort"
description: "Nhận diện nhóm bài mà vị trí không quan trọng, chỉ tần suất quyết định đáp án: dấu hiệu từ đề, công thức 4 bước trên bảng đếm, case study LC 1121 với điều kiện maxFreq · k ≤ n, và các bẫy thường gặp."
date: 2026-11-19 10:44:06 +0700
categories: [algorithm]
tags: [leetcode, counting, frequency-map, bucket-sort]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Trong thuật toán, có một nhóm bài nhìn qua tưởng chừng phải dùng QHĐ hay đồ thị, nhưng cuối cùng lại quy về một phép so sánh. Điểm chung của chúng là: vị trí không quan trọng, chỉ có tần suất mới quyết định đáp án cuối cùng.

Dưới đây là cẩm nang nhận diện và tư duy triển khai pattern **Frequency Map (Counting Map / Bucket by Count)**.

## 1. Dấu hiệu nhận biết từ đề bài

Hãy nghĩ đến Freq Map khi thấy một trong các dấu hiệu sau:

- **Điều kiện chỉ nhắc đến "bao nhiêu lần"**: đề hỏi các phần tử xuất hiện nhiều hơn `n/k` lần, top `k` phần tử phổ biến nhất, hoặc kiểm tra tính chất của số lần xuất hiện (chẵn, lẻ, nguyên tố) mà không hề đả động đến vị trí.
- **Được phép sắp xếp lại hoặc xóa tự do**: khi thứ tự ban đầu có thể bị xáo tùy ý, mảng input thực chất là một multiset, và bảng đếm tần suất chính là toàn bộ dữ liệu đầu vào.
- **Miền giá trị nhỏ, `n` lớn**: giá trị chỉ nằm trong khoảng hẹp (26 chữ cái, 10 chữ số, `-50..50`, `0..1000`) trong khi độ dài mảng rất lớn. Một mảng đếm trực tiếp sẽ ăn đứt mọi thuật toán sort $O(n \log n)$.
- **Đáp án bị chặn bởi tần suất lớn nhất (maxFreq)**: thường chứa một bất đẳng thức kiểu nguyên lý Dirichlet (chuồng bồ câu), ví dụ `maxFreq <= ceil(n / 2)` hay `maxFreq * k <= n`.

| Từ khóa thường gặp | Tư duy | Ví dụ |
| --- | --- | --- |
| "k most frequent elements", nhanh hơn $O(n \log n)$ | Đếm tần suất rồi dùng min-heap kích thước k, hoặc bucket sort theo tần số để đạt $O(n)$ | LC 347 |
| "rearrange into groups of consecutive cards" | Xếp tự do → bỏ vị trí: dùng bảng đếm và ăn tham lam từ key nhỏ nhất còn sống | LC 846 |
| "at least h papers cited at least h times" | Ngưỡng tự quy chiếu: gom bucket rồi quét ngược từ lớn về bé để cộng dồn suffix | LC 274 |
| "divided into disjoint increasing subsequences of length at least k" | Không quan tâm đến giá trị cụ thể, chỉ cần kiểm tra bất đẳng thức trên maxFreq | LC 1121 |

## 2. Case study: bài 1121

Đề bài cho `nums` đã sắp xếp không giảm, hỏi có chia được thành các dãy con tăng nghiêm ngặt rời nhau, mỗi dãy dài ít nhất `k` không?

- **Ngõ cụt**: thử tham lam, nhét từng số vào một dãy còn hợp lệ, nhưng rất khó chứng minh khi nào được phép trả về `false`. Thử DP hay ghép cặp thì không gian trạng thái quá lớn với $n \le 10^5$.
- **Tìm điều kiện cần**: gọi `m` là số dãy cần chia và `maxF` là tần suất lớn nhất. Các số bằng nhau phải nằm ở các dãy khác nhau, nên $m \ge maxF$. Mỗi dãy có ít nhất `k` phần tử nên $m \cdot k \le n$. Suy ra điều kiện cần là $maxF \cdot k \le m \cdot k \le n$.
- **Chứng minh điều kiện đủ**: chia mảng theo kiểu xoay vòng vào đúng `maxF` dãy (phần tử thứ `i` vào dãy `i % maxF`). Vì các số bằng nhau đứng liền kề nhau và xuất hiện tối đa `maxF` lần, chúng chắc chắn rơi vào các dãy khác nhau; mảng đã sort nên mỗi dãy tăng nghiêm ngặt. Mỗi dãy nhận ít nhất $\lfloor n / maxF \rfloor$ phần tử, mà $maxF \cdot k \le n$ và `k` nguyên nên $k \le \lfloor n / maxF \rfloor$.

Kết quả là `maxF * k <= n`.

> Bài học rút ra: hãy gạch bỏ mọi yếu tố về vị trí và giá trị trong điều kiện đề bài. Nếu thứ còn sót lại chỉ là tần suất, hãy tìm một bất đẳng thức trên bảng đếm và chứng minh nó đạt được bằng một cách dựng cụ thể (như chia xoay vòng hoặc điền cách bước).
{: .prompt-tip }

## 3. Công thức 4 bước triển khai

1. **Chọn key & container phù hợp**
   - Key không nhất thiết là giá trị gốc: ở các bài khó, key thường là giá trị dẫn xuất như `v % space` (LC 2453), `floorMod(v, value)` (LC 2598) hay tổng chữ số.
   - Miền giá trị nhỏ → mảng `int[]` (nhớ cộng offset nếu có số âm). Miền tới $10^9$ → `HashMap`. Cần thứ tự key → `TreeMap` hoặc sort danh sách key phân biệt.
2. **Một lượt đếm tuyến tính $O(n)$**: vừa đếm vừa cập nhật luôn các chỉ số phụ nếu cần (ví dụ `maxFreq`).
3. **Lượt thứ hai trên các key phân biệt** (phần cốt lõi của thuật toán):
   - Lọc ngưỡng: ví dụ `count * k > n`, `count == 2`, `isPrime(count)`.
   - Sắp xếp theo count: sort các cặp (key, count), dùng min-heap kích thước k cho bài top-k ($O(U \log k)$ với $U$ là số key phân biệt), hoặc bucket sort (mảng các list đánh chỉ số theo tần suất) để đạt $O(n)$.
   - Quét ngược cộng dồn (suffix sum): quét trục giá trị từ lớn về bé để tìm ngưỡng tự quy chiếu hoặc phần tử nhỏ thứ k.
   - Tham lam theo thứ tự key: key nhỏ nhất còn tồn tại thường bị ép vào một vai trò duy nhất (ví dụ phần tử đầu của một chuỗi liên tiếp), hãy dùng nó trước.
   - Tính trực tiếp từ các count, như độ dài palindrome dài nhất $2 \sum \lfloor f/2 \rfloor + [\exists f \text{ lẻ}]$ (LC 409), hay số cặp khác nhau tại mỗi vị trí chữ số $\sum c(N-c)/2$ (LC 3153).
4. **Xuất kết quả**: nếu cần phá thế hòa (tie-break) theo thứ tự xuất hiện đầu tiên hoặc giá trị nhỏ nhất, hãy duyệt mảng gốc hoặc duyệt tăng dần theo trục giá trị, tuyệt đối không dựa vào thứ tự duyệt của `HashMap`.

## 4. Tại sao cách làm này đúng

- **Bất biến theo hoán vị**: nếu đề cho xếp lại tự do, hoặc chỉ hỏi số lượng, hai input có cùng vector đếm là hoàn toàn tương đương. Mọi cách làm $O(n^2)$ hay sort chỉ là đang tính lại thông tin có sẵn.
- **Cơ sở cho lượt duyệt thứ hai**:
  - *Exchange argument / bất đẳng thức sắp xếp lại*: khi chọn các nhóm để tối ưu tổng, đổi một phần tử tần suất thấp lấy phần tử tần suất cao hơn (hoặc ngược lại, tùy hướng tối ưu) không bao giờ làm kết quả tệ đi (LC 1338, 1481, 3016).
  - *Tính đơn điệu (monotonicity)*: khi hạ dần ngưỡng từ cao xuống thấp, số phần tử đạt ngưỡng chỉ tăng lên, nên điểm đầu tiên thỏa mãn chắc chắn là đáp án tối ưu (LC 274).

## 5. Những cái bẫy thường gặp

- **Tràn số (overflow) ở bước cộng dồn**: với giá trị tới $10^9$ hoặc $n \approx 10^5$, các phép tính như `sum(i * count[i])` hay `c * (N - c)` (tới khoảng $2.5 \cdot 10^9$) sẽ tràn `int` 32 bit ngay lập tức, hãy dùng `long`.
- **So sánh tỷ lệ bằng số thực** như `count / n > 0.25`: hãy luôn nhân chéo bằng số nguyên, `count * 4 > n`.
- **Bỏ qua gợi ý cấu trúc của đề**: frequency map có thể pass nhiều bài, nhưng đôi khi đề cho sẵn dữ kiện để tối ưu hơn nữa. Ví dụ LC 1287 cho mảng đã sort nên phần tử chiếm hơn 25% chắc chắn nằm ở vị trí `n/4`, `n/2` hoặc `3n/4`; hay LC 229 đòi bộ nhớ $O(1)$ bằng thuật toán Boyer–Moore 2 ứng viên kèm bước xác minh.
