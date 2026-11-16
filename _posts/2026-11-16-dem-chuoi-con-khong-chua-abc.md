---
title: "Đếm chuỗi con không chứa \"abc\": contribution với vị trí gánh là chữ c"
description: "Áp dụng kỹ thuật contribution: giao mỗi chuỗi con hỏng cho chữ c đầu tiên làm nó hỏng, đổi vòng lặp để chữ c nằm ngoài, rồi thu vòng trong. Mấu chốt là các khối điểm đầu phải rời nhau, nên con trỏ nhảy tới pA + 1 chứ không phải i + 1."
date: 2026-11-16 10:00:00 +0700
categories: [algorithm]
tags: [leetcode, counting, contribution, subsequence]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Đề: cho chuỗi `s` chỉ gồm `a`, `b`, `c`. Một chuỗi **hợp lệ** nếu nó không chứa `"abc"` dưới dạng *dãy con* (subsequence, không cần liền nhau). Đếm số chuỗi con (substring) hợp lệ của `s`.

Đếm phần bù sẽ dễ hơn: lấy tổng số chuỗi con $\frac{n(n+1)}{2}$ trừ đi số chuỗi con **chứa** `abc`. Gọi các chuỗi con đó là chuỗi con *hỏng*.

Bài này là một biến thể của dạng 3 trong bài [Mỗi vị trí gánh bao nhiêu đoạn?]({% post_url 2026-11-10-contribution-counting %}): đoạn được giao cho phần tử đầu tiên thỏa điều kiện. Ở đó, với 2495, đoạn được giao cho số chẵn đầu tiên của nó. Ở đây, chuỗi con hỏng được giao cho **chữ `c` đầu tiên làm nó hỏng**. Khác biệt duy nhất nằm ở biên trái của vòng $l$, và đó cũng là chỗ lời giải đầu tiên của mình sai.

## Lời giải đầu tiên và chỗ sai

Ý tưởng ban đầu: đi từ trái sang phải, mỗi khi gặp một bộ `a..b..c` thì đếm mọi chuỗi con chứa bộ đó, rồi bỏ qua bộ đó và tìm bộ tiếp theo.

```java
if (c == 'c' && pA >= previousPos) {     // pA = vị trí 'a' của bộ a..b..c mới nhất
    count += (long) (pA - previousPos + 1) * (n - i);
    previousPos = i + 1;                  // nhảy qua cả bộ vừa dùng
}
```

Trong đầu mình hình dung các bộ `a..b..c` **tách rời** nhau: bộ thứ nhất, rồi bộ thứ hai nằm sau nó, v.v. Thử với `s = "abcabc"` ($n = 6$, tổng 21 chuỗi con):

| Điểm đầu | Chuỗi con hỏng | Số lượng |
| --- | --- | --- |
| 0 | `abc`, `abca`, `abcab`, `abcabc` | 4 |
| 1 | `bcabc` | 1 |
| 2 | `cabc` | 1 |
| 3 | `abc` | 1 |

Đáp án đúng là 7 chuỗi hỏng. Code trên đếm được $4 + 1 = 5$: nó bỏ sót `bcabc` và `cabc`. Hai chuỗi này **bắt đầu bên trong** bộ thứ nhất (vị trí 0..2) nhưng dùng bộ thứ hai (vị trí 3..5). Khi nhảy `previousPos = 3`, ta đã vứt điểm đầu 1 và 2 đi, dù chưa chữ `c` nào gánh chúng.

Lời giải này *gần như* là contribution: công thức `(số điểm đầu) * (n - i)` đã đúng dạng. Nó chỉ chưa trả lời rõ câu hỏi "chữ `c` này gánh **những** chuỗi con nào". Làm lại theo đúng các bước.

## Bước 1: brute force

```java
for (int l = 0; l < n; l++)
    for (int r = l; r < n; r++)
        if (containsAbc(l, r)) invalid++;
```

## Bước 2: chọn vị trí gánh

Đề hỏi **số lượng**, nên mỗi chuỗi con hỏng phải được giao cho **đúng một** vị trí.

Cố định điểm đầu $l$. Nếu $s[l..r]$ chứa `abc` thì $s[l..r+1]$ cũng chứa (thêm ký tự không phá dãy con đã có). Nên với mỗi $l$ có một vị trí $f(l)$, là **điểm cuối hỏng đầu tiên**:

- $r < f(l)$: hợp lệ,
- $r \ge f(l)$: hỏng.

$s[f(l)]$ luôn là chữ `c` (chính chữ `c` hoàn tất bộ `abc`). Giao chuỗi con hỏng $[l, r]$ cho vị trí $f(l)$. Mỗi chuỗi hỏng có đúng một $f(l)$, nên không đếm trùng.

So với 2495: ở đó "phần tử đầu tiên thỏa điều kiện" là số chẵn đầu tiên trong đoạn. Ở đây là vị trí đầu tiên mà, tính từ $l$, đoạn đã chứa đủ `abc`.

## Bước 3: đổi vòng, đưa vị trí gánh ra ngoài

```java
for (int i = 0; i < n; i++) if (s.charAt(i) == 'c')
    for (int l : những điểm đầu có f(l) == i)
        for (int r = i; r < n; r++)
            invalid++;
```

Vòng $r$ chạy $n - i$ lần, giống hệt 2495. Phần còn lại: tập "những điểm đầu có $f(l) = i$" trông thế nào?

### Các điểm đầu gánh bởi cùng một chữ `c` đứng liền nhau

Nếu $s[l+1..r]$ chứa `abc` thì $s[l..r]$ cũng chứa (chuỗi dài hơn). Nên $f(l) \le f(l+1)$: $f$ không giảm theo $l$. Các điểm đầu có cùng $f$ gom thành **khối liền nhau**:

```
điểm đầu l:  [ 0 ] [ 1  2  3 ] [ 4  5 ...
f(l):           2        5        không có
gánh bởi:     c@2      c@5
```

Mỗi điểm đầu thuộc đúng một khối, nên các khối **rời nhau và phủ hết**. Đây là điều kiện để phép đếm đúng, và cũng là thứ lời giải đầu tiên làm hỏng.

### Biên của khối

Gọi $L(i)$ là **điểm đầu lớn nhất** của một bộ `a..b..c` nằm trong $s[0..i]$. Khi đó:

$$
f(l) \le i \iff s[l..i] \text{ chứa } abc \iff l \le L(i)
$$

Các điểm đầu có $f(l) = i$ là những $l$ thỏa $l \le L(i)$ nhưng chưa thỏa ở chữ `c` gánh trước đó $i'$:

$$
L(i') < l \le L(i)
$$

Đặt `prev` $= L(i') + 1$, vòng $l$ chạy từ `prev` tới $L(i)$:

```java
for (int i = 0; i < n; i++) if (s.charAt(i) == 'c' && L(i) >= prev) {
    for (int l = prev; l <= L(i); l++)
        for (int r = i; r < n; r++)
            invalid++;
    prev = L(i) + 1;
}
```

## So với 2495: chỗ khác duy nhất

|  | 2495 (tích chẵn) | Bài này |
| --- | --- | --- |
| Vị trí gánh | số chẵn đầu tiên trong đoạn | chữ `c` làm đoạn hỏng lần đầu |
| Vòng $l$ | $(p_i, i]$ | $(L(i'), L(i)]$ |
| Biên trái mới sau khi đếm | `prevEven = i` | `prev = L(i) + 1` |
| Vòng $r$ | $[i, n)$ | $[i, n)$ |

Ở 2495, khối điểm đầu của số chẵn $i$ kết thúc **tại chính $i$**, nên biên mới là $i$. Mình mang thói quen đó sang đây và viết `previousPos = i + 1`.

Nhưng ở bài này khối của chữ `c` tại $i$ kết thúc tại $L(i)$, **trước** $i$. Các điểm đầu $L(i) + 1, \dots, i$ không dùng được bộ `abc` hiện tại (chữ `a` muộn nhất của bộ nằm trước chúng), nên chúng chưa được gánh và phải chờ chữ `c` sau. Nhảy tới $i + 1$ là đánh rơi chúng, khối không còn phủ hết.

Chạy lại `"abcabc"`:

| $i$ | $L(i)$ | khối điểm đầu | $n - i$ | cộng |
| --- | --- | --- | --- | --- |
| 2 | 0 | [0, 0] | 4 | 4 |
| 5 | 3 | [1, 3] | 1 | 3 |

Tổng 7. Điểm đầu 1 và 2 giờ được chữ `c` tại 5 gánh.

## Bước 4: thu vòng trong

Vòng $l$ chạy $L(i) - \texttt{prev} + 1$ lần, vòng $r$ chạy $n - i$ lần:

$$
\text{invalid} \mathrel{+}= (L(i) - \texttt{prev} + 1)(n - i)
$$

Còn lại là duy trì $L(i)$ trong $O(1)$. Muốn bộ `a..b..c` có điểm đầu lớn nhất thì ở mỗi chặng chọn chữ muộn nhất có thể:

- `a`: vị trí chữ `a` mới nhất.
- `ab`: khi gặp `b`, điểm đầu lớn nhất của `ab` kết thúc ở `b` này là `a` mới nhất trước nó, nên gán `ab = a`.
- khi gặp `c`: $L(i) = $ `ab`.

```java
class Solution {
    public long countValidSubstrings(String s) {
        int n = s.length();
        long total = (long) n * (n + 1) / 2, invalid = 0;
        int a = -1, ab = -1, prev = 0;   // ab = L(i): điểm đầu lớn nhất của dãy con "ab"
        for (int i = 0; i < n; i++) {
            char c = s.charAt(i);
            if (c == 'a') a = i;
            else if (c == 'b') ab = a;
            else if (ab >= prev) {       // chữ c tại i gánh các điểm đầu [prev, ab]
                invalid += (long) (ab - prev + 1) * (n - i);
                prev = ab + 1;           // khối kế tiếp bắt đầu ngay sau khối này
            }
        }
        return total - invalid;
    }
}
```

$O(n)$ thời gian, $O(1)$ bộ nhớ. Đã đối chiếu với brute force $O(n^2)$ trên 200 000 chuỗi ngẫu nhiên độ dài tới 12, kết quả khớp.

## "Các bộ ba trộn vào nhau" là bình thường

Thứ làm mình rối: các bộ `a..b..c` dùng cho các khối khác nhau có thể đan vào nhau, hoặc một bộ phục vụ nhiều điểm đầu. Ví dụ `s = "aabc"`: chỉ có bộ (1, 2, 3) được dùng, nhưng chữ `c` tại 3 gánh cả điểm đầu 0 lẫn 1.

Điều đó không làm sai phép đếm, vì thứ được chia **không phải** các chữ cái trong `s` mà là các chuỗi con, thông qua điểm đầu của chúng. Bộ ba chỉ là công cụ để tìm $f(l)$. Miễn là mỗi điểm đầu thuộc đúng một khối, phép đếm đúng, dù các bộ ba có chồng lên nhau hay không.

## Tóm tắt

1. Đếm phần bù: chuỗi hỏng dễ mô tả hơn chuỗi hợp lệ.
2. Chọn vị trí gánh sao cho mỗi chuỗi hỏng có **đúng một**: ở đây là $f(l)$, chữ `c` làm nó hỏng lần đầu.
3. Đổi vòng để vị trí gánh nằm ngoài, rồi tìm tập điểm đầu nó gánh. Nhờ $f$ không giảm, tập đó là một khối liền nhau.
4. Các khối phải **rời nhau và phủ hết**. Biên trái của khối mới là biên phải của khối cũ cộng một ($L(i) + 1$), không phải vị trí gánh cũ cộng một ($i + 1$).
5. Thu vòng trong thành $(L(i) - \texttt{prev} + 1)(n - i)$.
6. Viết brute force và so sánh trên chuỗi ngẫu nhiên ngắn. Chính `"abcabc"` sáu ký tự đã đủ lộ lỗi.
