---
title: "Đếm chuỗi con không chứa \"abc\": cố định đầu mút phải"
description: "Cố định đầu mút phải r và đếm trực tiếp các chuỗi con hợp lệ: [l, r] chứa abc khi và chỉ khi l ≤ startABC(r), với startABC(r) là vị trí chữ a muộn nhất trong các bộ abc nằm trong s[0..r]. Ba biến startA, startAB, startABC cập nhật startABC(r) trong O(1)."
date: 2026-11-16 10:00:00 +0700
categories: [algorithm]
tags: [leetcode, counting, contribution, subsequence]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Đề: cho chuỗi `s` chỉ gồm `a`, `b`, `c`, với $n \le 10^5$. Một chuỗi được gọi là **hợp lệ** nếu nó không chứa `"abc"` như một *dãy con*. Hãy đếm số chuỗi con hợp lệ của `s`.

Với `s = "abcabc"`, có 21 chuỗi con, trong đó 7 chuỗi chứa `abc`, nên đáp án là 14.

Bài này đi theo cùng hướng với bài 1513 trong [Đếm đóng góp (contribution): mỗi đoạn được tính cho vị trí nào?]({% post_url 2026-11-10-contribution-counting %}) (câu hỏi 2: cố định đầu mút phải $r$ của chuỗi con rồi đếm các đầu mút trái $l$ thỏa mãn). Điểm khác nằm ở lượng thông tin cần nhớ: ở 1513 chỉ cần vị trí số `0` gần nhất, còn ở đây cần ba biến nối tiếp nhau.

## Thuật ngữ

- **Chuỗi con** (substring): đoạn liên tiếp $s[l..r]$.
- **Dãy con** (subsequence): chọn một số vị trí tăng dần, không cần liền nhau. `"abc"` là dãy con của `"axbxc"`.
- **Bộ `abc`**: ba vị trí $i < j < k$ với `s[i] = a`, `s[j] = b`, `s[k] = c`. **Cặp `ab`**: hai vị trí $i < j$ với `s[i] = a`, `s[j] = b`.
- **Tiền tố của mẫu**: phần đầu của mẫu. Mẫu `abc` có ba tiền tố khác rỗng: `a`, `ab`, `abc`.
- **Vị trí đầu** của một dãy con là vị trí nhỏ nhất trong các vị trí được chọn (chữ `a` trong `abc`). **Đầu mút trái** $l$ và **đầu mút phải** $r$ là hai vị trí đầu và cuối của chuỗi con $s[l..r]$.

Nói "chuỗi con chứa `abc`" nghĩa là chứa `abc` như một dãy con, tức là có một bộ `abc` nằm trọn trong $[l, r]$.

## Bước 1: duyệt trâu (brute force)

Ta phân loại mỗi chuỗi con theo đầu mút phải $r$ của nó và đếm thẳng các chuỗi hợp lệ, không cần qua phần bù:

```java
for (int r = 0; r < n; r++)
    for (int l = 0; l <= r; l++)
        if (!containsAbc(l, r)) count++;   // containsAbc: kiểm tra dãy con abc trong s[l..r]
```

## Bước 2: với $r$ cố định, những $l$ nào hợp lệ?

Đoạn $[l, r]$ chứa `abc` khi và chỉ khi tồn tại một bộ `abc` $(i, j, k)$ với $l \le i$ và $k \le r$.

Với $r$ cho trước, ta xét mọi bộ có $k \le r$ và đặt

$$
\text{startABC}(r) = \text{giá trị } i \text{ lớn nhất của các bộ đó} \quad (-1 \text{ nếu không có bộ nào}).
$$

Nói cách khác, $\text{startABC}(r)$ là **điểm bắt đầu muộn nhất của một bộ `abc`** trong $s[0..r]$: chữ `a` nằm xa về bên phải nhất mà phía sau nó vẫn còn một chữ `b` rồi một chữ `c`, không vượt quá $r$.

**Khẳng định:** $[l, r]$ chứa `abc` $\iff l \le \text{startABC}(r)$.

- ($\Rightarrow$) Giả sử $[l, r]$ chứa một bộ có $i \ge l$. Bộ này cũng có $k \le r$, nên $\text{startABC}(r) \ge i \ge l$.
- ($\Leftarrow$) Bộ đạt $\text{startABC}(r)$ có $i = \text{startABC}(r) \ge l$ và $k \le r$. Do $l \le i < j < k \le r$, hai vị trí $j, k$ cũng nằm trong $[l, r]$, tức là cả bộ nằm trọn trong $[l, r]$.

Như vậy, với $r$ cố định, $l$ hợp lệ khi và chỉ khi $l > \text{startABC}(r)$. Ta viết lại vòng lặp trong:

```java
for (int r = 0; r < n; r++)
    for (int l = 0; l <= r; l++)
        if (l > startABC(r)) count++;
```

Các giá trị $l$ thỏa $\text{startABC}(r) < l \le r$ tạo thành một đoạn liên tiếp, nên số lượng của chúng là $r - \text{startABC}(r)$. Nhờ đó ta rút gọn được vòng lặp theo $l$:

```java
for (int r = 0; r < n; r++)
    count += r - startABC(r);
```

Cấu trúc này giống hệt bài 1513: ở đó $[l, r]$ chỉ gồm số `1` khi $z_r < l \le r$, với $z_r$ là vị trí số `0` gần nhất. Ở bài này, $\text{startABC}(r)$ đóng vai trò của $z_r$. Việc còn lại là tính $\text{startABC}(r)$ khi $r$ tăng dần.

## Bước 3: tính $\text{startABC}(r)$

Một bộ `abc` luôn kết thúc bằng chữ `c`, nên $\text{startABC}(r)$ chỉ có thể thay đổi khi $s[r]$ = `c`. Ở các vị trí khác, nó giữ nguyên giá trị cũ.

Khi gặp chữ `c` tại $k$, ta cần chữ `a` muộn nhất mà giữa nó và $k$ có một chữ `b`. Cách làm tự nhiên nhất là chuẩn bị hai mảng:

- `prevA[j]`: vị trí chữ `a` gần nhất đứng trước $j$ ($-1$ nếu không có).
- `prevB[k]`: vị trí chữ `b` gần nhất đứng trước $k$ ($-1$ nếu không có).

Tại chữ `c` ở $k$: lấy chữ `b` gần nhất $j$ = `prevB[k]`, rồi lấy chữ `a` gần nhất trước nó, $i$ = `prevA[j]`. Bộ $(i, j, k)$ chính là bộ có chữ `a` muộn nhất.

**Vì sao chọn chữ `b` gần nhất là đúng?** Chỉ cần một nhận xét: vị trí càng dịch sang phải thì chữ `a` gần nhất phía trước nó càng muộn, hoặc giữ nguyên. Nói cách khác, nếu $j' \le j$ thì `prevA[j']` $\le$ `prevA[j]`, vì mọi chữ `a` đứng trước $j'$ cũng đứng trước $j$.

Bây giờ xét một bộ `abc` bất kỳ $(i', j', k')$ với $k' \le k$. Chữ `b` của nó đứng trước $k$, nên $j' \le j$, với $j$ là chữ `b` gần nhất trước $k$. Chữ `a` của nó đứng trước $j'$, nên

$$
i' \le \texttt{prevA}[j'] \le \texttt{prevA}[j] = i.
$$

Vậy không bộ nào, kể cả các bộ kết thúc ở những chữ `c` trước đó, có chữ `a` muộn hơn $i$. Ta gán thẳng $\text{startABC} = i$ mà không cần so với giá trị cũ.

```java
int n = s.length();
int[] prevA = new int[n], prevB = new int[n];
int a = -1, b = -1, startABC = -1;
long count = 0;
for (int r = 0; r < n; r++) {
    prevA[r] = a;                 // chữ a gần nhất đứng trước r
    prevB[r] = b;                 // chữ b gần nhất đứng trước r
    char c = s.charAt(r);
    if (c == 'a') a = r;
    else if (c == 'b') b = r;
    else if (prevB[r] >= 0) startABC = prevA[prevB[r]];
    count += r - startABC;
}
```

**Bỏ hai mảng.** Tại mỗi chữ `c`, ta chỉ đọc `prevA` ở đúng một chỗ: chữ `b` gần nhất. Vì vậy không cần lưu cả mảng. Mỗi khi gặp chữ `b`, ta ghi lại luôn chữ `a` gần nhất trước nó vào một biến, gọi là `startAB` (điểm bắt đầu muộn nhất của một cặp `ab`). Biến `a` đổi tên thành `startA` cho đồng bộ. Đến chữ `c`, ta chỉ việc gán `startABC = startAB`.

## Code

```java
class Solution {
    public long countValid(String s) {      // s chỉ gồm a, b, c
        long count = 0;
        int startA = -1, startAB = -1, startABC = -1;   // điểm bắt đầu muộn nhất của a / ab / abc
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (c == 'a') startA = r;
            else if (c == 'b') startAB = startA;
            else startABC = startAB;           // c == 'c'
            count += r - startABC;            // số l hợp lệ với đầu mút phải r
        }
        return count;
    }
}
```

Thuật toán chạy trong $O(n)$ thời gian và $O(1)$ bộ nhớ. Bạn nên tự đối chiếu với cách duyệt trâu $O(n^2)$ trên các chuỗi ngẫu nhiên ngắn (mình đã thử 5 000 chuỗi có độ dài tới 14 và kết quả đều khớp). Đây chỉ là bước kiểm tra, còn phần chứng minh nằm ở trên.

Ta chạy tay với `"abcabc"`:

| $r$ | `s[r]` | `startA` | `startAB` | `startABC` | $l$ hợp lệ | $r - \text{startABC}$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 0 | `a` | 0 | $-1$ | $-1$ | 0 | 1 |
| 1 | `b` | 0 | 0 | $-1$ | 0, 1 | 2 |
| 2 | `c` | 0 | 0 | 0 | 1, 2 | 2 |
| 3 | `a` | 3 | 0 | 0 | 1, 2, 3 | 3 |
| 4 | `b` | 3 | 3 | 0 | 1, 2, 3, 4 | 4 |
| 5 | `c` | 3 | 3 | 3 | 4, 5 | 2 |

Tổng là $1 + 2 + 2 + 3 + 4 + 2 = 14$. Thử kiểm tra vài dòng: với $r = 2$, $l = 0$ cho `abc` (không hợp lệ), còn $l = 1$ cho `bc` và $l = 2$ cho `c` (hợp lệ). Với $r = 5$, $l = 3$ cho `abc` (không hợp lệ), còn $l = 4$ cho `bc` và $l = 5$ cho `c` (hợp lệ).

## Dạng bài này

Đây là bài toán đếm chuỗi con chứa (hoặc không chứa) một mẫu như dãy con. Cách làm gồm hai bước:

1. **Cố định $r$ và xác định tập các $l$ không hợp lệ.** Bài toán có *tính chất đơn điệu* theo $l$: nếu $[l, r]$ đã chứa mẫu thì $[l-1, r]$ cũng chứa, vì mở rộng đoạn sang trái không làm mất dãy con nào. Do đó các $l$ không hợp lệ tạo thành một đoạn đầu $l \le \text{start}(r)$, với $\text{start}(r)$ là điểm bắt đầu muộn nhất của một dãy con khớp mẫu trong $s[0..r]$ (với mẫu `abc`, đó chính là $\text{startABC}(r)$). Số $l$ hợp lệ là $r - \text{start}(r)$, số $l$ không hợp lệ là $\text{start}(r) + 1$, và tổng hai số này là $r + 1$.
2. **Cập nhật $\text{start}(r)$** bằng một chuỗi các biến "muộn nhất": mỗi biến là vị trí đầu muộn nhất của một dãy con khớp với một tiền tố của mẫu.

**Mẫu bất kỳ $p$ độ dài $k$ (xét như dãy con).** Gọi `f[j]` là vị trí đầu muộn nhất của một dãy con khớp với $p[0..j)$ trong $s[0..r]$ ($-1$ nếu chưa có). Lập luận hoàn toàn tương tự bài trên:

- Với $j \ge 2$ ta có `f[j] <= f[j-1]`, vì bỏ phần tử cuối của một dãy con khớp $p[0..j)$ thì được một dãy con khớp $p[0..j-1)$ có cùng vị trí đầu.
- Khi đọc $s[r]$, nếu `s[r] != p[j-1]` thì không có dãy con mới khớp $p[0..j)$ nên `f[j]` giữ nguyên.
- Nếu `s[r] == p[j-1]` và $j \ge 2$, mỗi dãy con mới là một dãy con khớp $p[0..j-1)$ trong $s[0..r-1]$ ghép thêm $s[r]$, nên vị trí đầu muộn nhất của chúng là `f[j-1]` cũ. Theo bất đẳng thức ở trên, giá trị này cũng không nhỏ hơn `f[j]` cũ, vì vậy `f[j] = f[j-1]` cũ.
- Với $j = 1$, dãy con mới chỉ gồm một mình $s[r]$, và $r$ lớn hơn mọi vị trí cũ nên `f[1] = r`.

Với $p$ = `abc` thì `f[1], f[2], f[3]` chính là `startA, startAB, startABC`.

```java
int k = p.length();
int[] f = new int[k + 1];
Arrays.fill(f, -1);
for (int r = 0; r < n; r++) {
    for (int j = k; j >= 1; j--)              // từ dài về ngắn
        if (s.charAt(r) == p.charAt(j - 1))
            f[j] = (j == 1) ? r : f[j - 1];
    count += r - f[k];                        // số chuỗi hợp lệ; số hỏng là f[k] + 1
}
```

Ta duyệt `j` giảm dần vì mỗi $s[r]$ chỉ được dùng một lần, tức `f[j - 1]` phải còn là giá trị của bước $r - 1$. Với `p = "aa"` và `s = "a"`, nếu duyệt tăng dần thì `f[1] = 0` rồi `f[2] = f[1] = 0`, nghĩa là `"a"` chứa `"aa"`, và đó là kết quả sai.

Ví dụ với `s = "ababa"` và `p = "aba"`, số chuỗi hợp lệ là $1 + 2 + 2 + 3 + 2 = 10$ trên tổng số 15 chuỗi con. Mình đã đối chiếu với cách duyệt trâu trên 5 000 chuỗi ngẫu nhiên, với mẫu ngẫu nhiên dài tới 4, và kết quả đều khớp.

**Khi nào không áp dụng được.** Cách này cần tính chất đơn điệu theo $l$ nói ở trên. Chẳng hạn, với bài đếm đoạn chứa **đúng** $k$ chữ `a`, việc kéo $l$ sang trái có thể thêm một chữ `a` và biến đoạn từ "đúng" thành "sai". Khi đó tập các $l$ không hợp lệ không còn là một đoạn đầu $l \le \text{start}(r)$. Ta phải đổi hướng, thường là lấy hiệu của hai bài toán "ít nhất $k$".

## Bài tập liên quan

[1358. Number of Substrings Containing All Three Characters](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/) là bài gần nhất có cùng khung. Cố định đầu mút phải $r$, đoạn $[l, r]$ chứa đủ ba chữ khi $l \le \min(\text{startA}, \text{lastB}, \text{lastC})$, nên mỗi $r$ có $\min(\text{startA}, \text{lastB}, \text{lastC}) + 1$ đoạn chứa. Gợi ý: ba chữ độc lập với nhau nên chỉ cần ba biến vị trí gần nhất, không cần chuỗi biến.

## Tóm tắt

1. Cố định đầu mút phải $r$ và đếm trực tiếp phía cần đếm, không cần qua phần bù.
2. Tìm $\text{start}(r)$ sao cho $[l, r]$ chứa mẫu $\iff l \le \text{start}(r)$. Chứng minh từng chiều bằng một đến hai câu.
3. $\text{start}(r)$ là vị trí đầu muộn nhất của một dãy con. Ta cập nhật nó bằng chuỗi các tiền tố của mẫu, trong đó mỗi biến chỉ đổi khi gặp ký tự kết thúc của tiền tố tương ứng. Ghép với phần tử gần nhất của tiền tố ngắn hơn luôn cho vị trí đầu muộn nhất (vì "chữ gần nhất phía trước" chỉ dịch sang phải khi vị trí dịch sang phải), nên ta gán thẳng mà không cần `max`.
4. Cập nhật từ dài về ngắn để không dùng một ký tự hai lần.
5. Đối chiếu với cách duyệt trâu trên các chuỗi ngẫu nhiên ngắn.

## Ghi chú: lời giải đếm phần bù đầu tiên sai ở đâu

Cách đếm phần bù, trong đó mỗi chữ `c` cộng `(startAB - prev + 1) * (n - i)` rồi đặt `prev = i + 1`, cho kết quả sai. Ở đây `prev - 1` là giá trị $\text{startABC}$ đã được tính là không hợp lệ, và khi $\text{startABC}$ tăng thêm $d$ thì có thêm $d$ giá trị $l$ không hợp lệ ở mọi $r \ge i$. Lỗi nằm ở chỗ đặt `prev = i + 1`: điều này ngầm khẳng định $\text{startABC} = i$ (vị trí một chữ `c`), trong khi $\text{startABC}$ là vị trí của một chữ `a`. Cách đúng là sau khi đọc chữ `c` này, $\text{startABC} = \text{startABC} = \text{startAB}$, nên phải đặt `prev = startAB + 1`. Trên `"abcabc"`, code sai tính tổng phần bù là 5 thay vì 7, nên đáp án ra 16 thay vì 14.
