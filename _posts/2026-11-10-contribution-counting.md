---
title: "Đếm đóng góp (contribution): mỗi đoạn được tính cho vị trí nào?"
description: "Kỹ thuật contribution: chọn cho mỗi đoạn con (hoặc mỗi cặp) một vị trí đại diện, sao cho phần việc của từng vị trí tính được trong O(1). Lựa chọn mặc định là đầu mút phải r; ba câu hỏi giúp chọn đúng và đưa duyệt trâu O(n²), O(n³) về O(n). Sáu bài LeetCode."
date: 2026-11-10 10:13:41 +0700
categories: [algorithm]
tags: [leetcode, counting, contribution]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Đề hỏi một số lượng hoặc một tổng trên mọi đoạn con (hoặc mọi cặp), $n \le 10^5$. Duyệt trâu (brute force) từng đoạn tốn $O(n^2)$, thường là $O(n^3)$ vì mỗi đoạn còn phải kiểm tra điều kiện. Dấu hiệu nhận ra loại bài này: đề có chữ "mọi chuỗi con", "mọi mảng con", "số cặp", còn ràng buộc $n$ cỡ $10^5$.

Quy ước: chuỗi (hay mảng) $s$ có $n$ phần tử đánh số từ $0$. *Đoạn con* $s[l..r]$ gồm các phần tử liên tiếp từ vị trí $l$ đến vị trí $r$, với $0 \le l \le r \le n-1$. Gọi $l$ là *đầu mút trái*, $r$ là *đầu mút phải*. Mỗi đoạn ứng với đúng một cặp $(l, r)$, và ngược lại.

Ý tưởng chung của *kỹ thuật đóng góp* (contribution technique): thay vì duyệt từng đoạn rồi hỏi "đoạn này cộng thêm bao nhiêu", ta chọn cho mỗi đoạn một **vị trí đại diện**, rồi hỏi "mỗi vị trí có bao nhiêu đoạn thuộc về nó". Chọn khéo thì câu hỏi thứ hai trả lời được trong $O(1)$, và cả bài chỉ còn một vòng lặp. Khi đề hỏi số lượng, mỗi đoạn phải thuộc về **đúng một** vị trí, nếu không sẽ bị đếm trùng.

| Đề hỏi | Mỗi đoạn (hoặc cặp) được tính cho | Ví dụ |
| --- | --- | --- |
| số đoạn thỏa điều kiện | đầu mút phải $r$ của nó (lựa chọn mặc định) | 1513, 2495, 3084 |
| số cặp | phần tử đứng sau của cặp | 2938 |
| tổng giá trị trên mọi đoạn | mọi vị trí nằm trong đoạn | 2063 |

Bài viết đưa ra một quy trình cố định gồm ba câu hỏi để chọn vị trí đại diện và rút gọn phép đếm. Trả lời xong ba câu, lời giải $O(n)$ gần như tự viết ra. Mỗi bài ví dụ phía sau đi qua một nhánh khác nhau của quy trình.

## Phương pháp

**Bước 0: duyệt trâu theo đầu mút phải.** Viết bản "với mỗi $r$, đếm $l$":

```java
for (int r = 0; r < n; r++)
    for (int l = 0; l <= r; l++)
        if (P(l, r)) ans++;   // P(l, r) tự nó là một vòng lặp thứ ba
```

Mỗi đoạn có đúng một đầu mút phải $r$, nên nhóm theo $r$ thì mỗi đoạn được đếm đúng một lần. Nói theo ngôn ngữ contribution, đây là cách chọn $r$ làm vị trí đại diện. Mục tiêu là bỏ vòng thứ ba trong $P$, rồi rút gọn vòng lặp theo $l$ thành một công thức.

**Câu hỏi 1: đề đếm số đoạn, hay cộng giá trị từng phần tử trên mọi đoạn?**

- Đếm số đoạn thỏa điều kiện: sang câu hỏi 2.
- Cộng giá trị $f(i)$ của mọi phần tử, trên mọi đoạn: vòng trong cùng là $i$ chạy từ $l$ đến $r$. Đổi vòng để $i$ ra ngoài cùng, khi đó phần tử $i$ nằm trong $(i+1)(n-i)$ đoạn (bài 2063). Đây là nhánh cần đổi vòng khi đề cộng giá trị. Bài 3958 cũng thuộc nhánh này, với cặp bi thay cho phần tử.

**Câu hỏi 2: với $r$ cố định, các $l$ thỏa có liền khối không?** Gọi $P(l, r)$ là "đoạn $[l, r]$ thỏa điều kiện của đề". Kiểm bằng cách mở đoạn sang trái một vị trí, từ $[l, r]$ thành $[l-1, r]$ (với $l \ge 1$). Điều kiện có *tính chất đơn điệu* theo $l$ khi đúng một trong hai mệnh đề sau, với mọi $l \ge 1$:

- (A) $P(l, r)$ thỏa thì $P(l-1, r)$ vẫn thỏa;
- (B) $P(l, r)$ hỏng thì $P(l-1, r)$ vẫn hỏng.

Đoạn $[l-1, r]$ gồm mọi phần tử của $[l, r]$ và thêm $s[l-1]$. Điều kiện kiểu "có chứa một thứ" luôn thuộc (A), điều kiện kiểu "không chứa một thứ" luôn thuộc (B). Mỗi bài dưới đây sẽ nêu lý do bằng một câu.

| Mệnh đề đúng | Các $l$ thỏa | Cộng vào đáp án |
| --- | --- | --- |
| (A) thỏa thì vẫn thỏa | $0, 1, \dots, T(r)$ | $T(r) + 1$ |
| (B) hỏng thì vẫn hỏng | $T(r)+1, \dots, r$ | $r - T(r)$ |

Trường hợp (A): lấy $T(r)$ là $l$ thỏa lớn nhất. Áp dụng (A) liên tiếp từ $l = T(r)$ xuống $0$ thì mọi $l \le T(r)$ đều thỏa, còn mọi $l > T(r)$ hỏng vì $T(r)$ đã là $l$ thỏa lớn nhất. Trường hợp (B): lấy $T(r)$ là $l$ hỏng lớn nhất. Áp dụng (B) liên tiếp từ $l = T(r)$ xuống $0$ thì mọi $l \le T(r)$ đều hỏng, còn mọi $l > T(r)$ thỏa vì $T(r)$ đã là $l$ hỏng lớn nhất. Cả hai trường hợp đặt $T(r) = -1$ khi không có $l$ nào như thế.

Nếu không đơn điệu:

- Số $l$ thỏa vẫn đếm được bằng một biến đếm cập nhật dần khi $r$ tăng (bài 3084, 2938). Dấu hiệu dùng được: số $l$ thỏa tính ra được từ kết quả ở $r-1$ và từ $s[r]$, ví dụ "số vị trí chữ `c` trong $[0, r]$".
- Điều kiện dạng "đúng $k$" thì lấy hiệu hai bài "ít nhất $k$" và "ít nhất $k+1$", vì số đoạn có đúng $k$ bằng số đoạn có ít nhất $k$ trừ số đoạn có ít nhất $k+1$. Hai bài đó đều đơn điệu.

**Câu hỏi 3: $T(r)$ là vị trí gần nhất của thứ gì?** Hỏi: đoạn phải chứa gì thì mới thỏa (dòng một) hoặc mới hỏng (dòng hai)? Gọi $p(r)$ là *vị trí gần nhất* của thứ đó tính đến $r$, tức vị trí lớn nhất không vượt quá $r$ ($-1$ nếu chưa có). Đoạn $[l, r]$ chứa thứ đó khi có một vị trí của nó nằm trong $[l, r]$. Ta chứng minh:

$$
[l, r] \text{ chứa thứ đó} \iff l \le p(r).
$$

Nếu $l \le p(r)$ thì $l \le p(r) \le r$, tức $p(r) \in [l, r]$, nên đoạn chứa thứ đó. Ngược lại, nếu $l > p(r)$ thì mọi vị trí của thứ đó trong $[0, r]$ đều không vượt quá $p(r)$, tức nhỏ hơn $l$, nên không vị trí nào nằm trong $[l, r]$ và đoạn không chứa nó.

Vậy $T(r) = p(r)$, và một biến `last` cập nhật mỗi khi $r$ đi qua thứ đó là đủ. "Chứa thứ đó" thỏa với $l \le p(r)$, cho các $l$ thỏa là $0..p(r)$ (trường hợp (A)). "Không chứa thứ đó" thỏa với $l > p(r)$, cho các $l$ thỏa là $p(r)+1..r$ (trường hợp (B)).

Hai mở rộng thường gặp:

- Đoạn phải chứa **đồng thời** nhiều thứ, có vị trí gần nhất là $p_1(r)$, $p_2(r)$, ... Theo chứng minh trên, đoạn chứa thứ $j$ khi $l \le p_j(r)$, nên đoạn chứa đủ tất cả khi $l \le p_1(r)$ **và** $l \le p_2(r)$ **và** ..., tức $l \le \min(p_1(r), p_2(r), \dots)$. Vậy $T(r) = \min$ của các vị trí gần nhất (bài 1358 ở phần luyện thêm).
- Thứ đó chiếm **hai vị trí liền nhau** $(i, i+1)$, ví dụ "hai ký tự giống nhau đứng kề nhau". Đoạn $[l, r]$ chứa nó khi $l \le i$ và $i + 1 \le r$. Vậy $p(r)$ là $i$ lớn nhất có $i + 1 \le r$ và $s[i] = s[i+1]$. Khi $r$ đến vị trí mới, cặp $(r-1, r)$ vừa hoàn chỉnh, nên cập nhật `last = r - 1` nếu $s[r-1] = s[r]$. Đếm đoạn không chứa cặp giống nhau kề nhau thì cộng $r - \text{last}$ (trường hợp (B)).
- Thứ đó là một **mẫu nhiều ký tự theo thứ tự** (dãy con): dùng một chuỗi biến "gần nhất" theo từng tiền tố của mẫu, xem [Đếm chuỗi con không chứa "abc"]({% post_url 2026-11-16-dem-chuoi-con-khong-chua-abc %}).

**Khuôn code.**

```java
long ans = 0;
for (int r = 0; r < n; r++) {
    // 1. cập nhật các biến "gần nhất" bằng s[r]
    // 2. cộng số l hợp lệ với đầu mút phải r: T + 1, hoặc r - T, hoặc một biến đếm
    ans += ...;
}
```

Bước 1 đứng trước vì $p(r)$ phải tính cả vị trí $r$: đoạn $[r, r]$ đã chứa $s[r]$ nếu $s[r]$ là thứ cần tìm.

## Nhánh 1: cộng giá trị, đổi vòng

**2063. Vowels of All Substrings.** Tổng số nguyên âm trên mọi substring, tức $f(i) = 1$ nếu `word[i]` là nguyên âm. Câu hỏi 1: đề cộng giá trị từng phần tử, nên phải đổi vòng. Bản duyệt trâu có vòng trong cùng chạy qua $i$:

```java
for (int l = 0; l < n; l++)
    for (int r = l; r < n; r++)
        for (int i = l; i <= r; i++)
            total += f(i);
```

Ba vòng lặp đi qua mọi bộ $(l, i, r)$ với $0 \le l \le i \le r \le n-1$. Cố định $i$ trước thì điều kiện tách thành $0 \le l \le i$ và $i \le r \le n-1$. Hai điều kiện này mỗi cái chỉ chứa một biến ($l$ hoặc $r$), nên chọn $l$ không ảnh hưởng việc chọn $r$, và viết lại được:

```java
for (int i = 0; i < n; i++)
    for (int l = 0; l <= i; l++)
        for (int r = i; r < n; r++)
            total += f(i);
```

Hai đoạn code cộng cùng các số hạng, chỉ khác thứ tự. Thân hai vòng trong không dùng $l$, $r$: chúng chỉ đếm số đoạn chứa $i$. Với $i$ cố định, $l$ có $i + 1$ lựa chọn ($0, \dots, i$), $r$ có $n - i$ lựa chọn ($i, \dots, n-1$), và hai lựa chọn không ảnh hưởng nhau, nên có $(i+1)(n-i)$ đoạn chứa $i$. Rút gọn hai vòng trong thành một phép nhân, ta được $f(i)(i+1)(n-i)$:

```java
class Solution {
    public long countVowels(String word) {
        int n = word.length();
        long total = 0;
        for (int i = 0; i < n; i++) {
            if ("aeiou".indexOf(word.charAt(i)) >= 0) {
                total += (long) (i + 1) * (n - i);
            }
        }
        return total;
    }
}
```

Tích $(i+1)(n-i)$ lớn nhất ở giữa dãy, tại $i \approx n/2$ với $n = 10^5$ thì khoảng $2.5 \cdot 10^9 > 2^{31}$, nên ép `long` trước phép nhân.

Chạy tay với `"aba"`. Sáu đoạn `a`, `ab`, `aba`, `b`, `ba`, `a` có $1 + 1 + 2 + 0 + 1 + 1 = 6$ nguyên âm. Theo công thức, `a` ở $i = 0$ nằm trong $1 \cdot 3 = 3$ đoạn, `b` không tính, `a` ở $i = 2$ nằm trong $3 \cdot 1 = 3$ đoạn, tổng $6$.

**3958. Minimum Cost to Split into Ones II.** Đề (theo cách bài này hiểu): cho số nguyên dương $n$. Mỗi lần chọn một số $x > 1$ đang có, tách thành hai số nguyên dương $a + b = x$ với chi phí $a \cdot b$. Lặp đến khi chỉ còn $n$ số $1$, tìm tổng chi phí nhỏ nhất. Đề không ràng buộc cách chọn $x$ hay $a$, $b$, nên tổng chi phí là một tổng mà phần tử cộng vào là cặp bi, nghĩa là câu hỏi 1. Nếu mọi cách tách cho cùng một tổng thì "nhỏ nhất" chính là giá trị chung đó.

Coi $n$ là $n$ viên bi. Tách thành hai nhóm $a$ và $b$ thì có đúng $a \cdot b$ cặp bi bị chia ra hai nhóm. Viết chi phí như một vòng lặp:

```text
for (mỗi lần tách)
    for (mỗi cặp bi bị lần tách này chia ra)
        cost++
```

Đổi vòng để cặp bi ra ngoài:

```text
for (mỗi cặp bi)
    for (mỗi lần tách chia cặp này ra)
        cost++
```

Vòng trong chạy đúng $1$ lần. Một cặp đã bị chia ra hai nhóm thì không bao giờ chung nhóm trở lại, vì nhóm chỉ bị tách nhỏ thêm. Cuối cùng mọi viên bi đều đứng riêng, nên cặp nào cũng bị chia ra ở một lần tách nào đó. Vậy $\text{cost} = \binom{n}{2} = n(n-1)/2$ với **mọi** cách tách, không cần DP.

Kiểm với $n = 4$: tách $2 + 2$ rồi $1 + 1$, $1 + 1$ tốn $4 + 1 + 1 = 6$. Tách $1 + 3$, $1 + 2$, $1 + 1$ tốn $3 + 2 + 1 = 6$.

## Nhánh 2: đếm đoạn, có tính chất đơn điệu

**1513. Number of Substrings With Only 1s.** Đếm substring toàn `1`. Ở bước 0, $P(l, r)$ là "$[l, r]$ không chứa `0`".

- Câu 1: đếm số đoạn.
- Câu 2: nếu $[l, r]$ đã chứa `0` thì $[l-1, r]$ gồm mọi phần tử của $[l, r]$ nên cũng chứa `0`: hỏng thì vẫn hỏng (B). Các $l$ thỏa là $T(r)+1, \dots, r$, cộng $r - T(r)$.
- Câu 3: đoạn hỏng phải chứa một số `0`, nên $T(r)$ là vị trí số `0` gần nhất tính đến $r$. Biến `last` giữ nó.

```java
class Solution {
    public int numSub(String s) {
        final int MOD = 1_000_000_007;
        long ans = 0;
        int last = -1; // T(r): vị trí số 0 gần nhất
        for (int r = 0; r < s.length(); r++) {
            if (s.charAt(r) == '0') last = r;
            ans = (ans + r - last) % MOD;
        }
        return (int) ans;
    }
}
```

Khi `s[r]` là `0` thì `last = r` và $r - \text{last} = 0$, nên không cần nhánh riêng. Chạy tay `"0110111"`: `last` lần lượt là $0, 0, 0, 3, 3, 3, 3$ và $r - \text{last}$ lần lượt là $0, 1, 2, 0, 1, 2, 3$, tổng $9$.

**2495. Number of Subarrays Having Even Product.** Tích chẵn khi đoạn chứa ít nhất một số chẵn: một tích có thừa số chẵn thì chia hết cho $2$, còn nếu mọi thừa số lẻ thì tích lẻ.

- Câu 1: đếm số đoạn.
- Câu 2: đã chứa số chẵn thì mở rộng sang trái vẫn chứa số chẵn đó, nên thỏa thì vẫn thỏa (A). Các $l$ thỏa là $0, \dots, T(r)$, cộng $T(r) + 1$.
- Câu 3: đoạn phải chứa số chẵn, nên $T(r)$ là vị trí số chẵn gần nhất tính đến $r$.

```java
class Solution {
    public long evenProduct(int[] nums) {
        long ans = 0;
        int even = -1; // T(r): vị trí số chẵn gần nhất
        for (int r = 0; r < nums.length; r++) {
            if (nums[r] % 2 == 0) even = r;
            ans += even + 1;
        }
        return ans;
    }
}
```

Chạy tay `[9, 6, 7, 13]`: `even` lần lượt là $-1, 1, 1, 1$, cộng $0 + 2 + 2 + 2 = 6$. Với `[2, 4]`: $1 + 2 = 3$.

## Nhánh 3: đếm đoạn hoặc cặp, không đơn điệu

**3084. Count Substrings Starting and Ending with Given Character.** $[l, r]$ thỏa khi `s[l] = s[r] = c`.

- Câu 1: đếm số đoạn.
- Câu 2: không đơn điệu. Ví dụ `s = "cac"`, `c = 'c'`, $r = 2$: $l = 2$ thỏa (`"c"`), $l = 1$ hỏng (`s[1] = 'a'`), $l = 0$ lại thỏa. Thỏa thành hỏng nên (A) sai, hỏng thành thỏa nên (B) sai.
- Nhưng số $l$ thỏa vẫn đếm được. Nếu `s[r] != c` thì không có $l$ nào. Nếu `s[r] = c` thì các $l$ thỏa chính là các vị trí chữ `c` trong $[0, r]$, tính cả $l = r$. Số đó giữ trong biến `seen`.

```java
class Solution {
    public long countSubstrings(String s, char c) {
        long ans = 0;
        int seen = 0; // số chữ c từ 0 đến r
        for (int r = 0; r < s.length(); r++) {
            if (s.charAt(r) == c) ans += ++seen;
        }
        return ans;
    }
}
```

Chạy tay `"abada"`, `c = 'a'`: tại $r = 0, 2, 4$ thì `seen` là $1, 2, 3$, tổng $6$.

**2938. Separate Black and White Balls.** Trước hết đưa bài về đếm. Nghịch thế là cặp $a < b$ với `s[a] = 1`, `s[b] = 0`.

- Cận dưới: một swap kề chỉ đổi chỗ hai phần tử đứng cạnh nhau, nên chỉ cặp vị trí của hai phần tử đó đổi thứ tự, mọi cặp khác giữ nguyên. Vậy mỗi swap giảm số nghịch thế nhiều nhất $1$. Đích (mọi `0` đứng trước mọi `1`) có $0$ nghịch thế, nên cần ít nhất (số nghịch thế) swap.
- Đạt được: nếu còn nghịch thế thì có cặp `10` kề nhau. Thật vậy, giả sử không có `10` kề nhau, tức sau mỗi chữ `1` là chữ `1` hoặc hết chuỗi. Khi đó sau chữ `1` đầu tiên toàn là `1`, nên không còn nghịch thế, mâu thuẫn. Đổi chỗ cặp `10` kề nhau này sắp đúng thứ tự cặp đó và không đổi cặp nào khác, nên giảm đúng $1$. Lặp lại đến khi hết nghịch thế thì dùng đúng (số nghịch thế) swap.

Vậy đáp án là số nghịch thế. Đếm cặp cũng theo khuôn: cố định đầu mút phải $b$ của cặp, rồi đếm đầu mút trái $a$.

```java
for (int b = 0; b < n; b++) if (s[b] == '0')
    for (int a = 0; a < b; a++)
        if (s[a] == '1') steps++;
```

Cũng như 3084, các $a$ thỏa là các vị trí `1` trước $b$, không liền khối nhưng đếm được. Vòng $a$ rút gọn thành số `1` đứng trước $b$, giữ trong một biến đếm:

```java
class Solution {
    public long minimumSteps(String s) {
        long steps = 0;
        int ones = 0; // số 1 trước b
        for (int b = 0; b < s.length(); b++) {
            if (s.charAt(b) == '1') ones++;
            else steps += ones;
        }
        return steps;
    }
}
```

Chạy tay `"100"`: tại $b = 1$ có $1$ chữ `1` đứng trước, tại $b = 2$ cũng $1$, tổng $2$.

Nếu giá trị tùy ý (không chỉ `0`/`1`), "số phần tử lớn hơn đứng trước $b$" không còn là một biến đếm đơn giản, vì phải đếm theo ngưỡng $s[b]$ và cập nhật khi $b$ tăng. Phần đó dùng cây Fenwick, xem [Nén tọa độ và cây Fenwick]({% post_url 2026-11-06-compress-fenwick %}).

## Bảng tổng hợp

| Bài | Đề hỏi | Nhánh | $T(r)$ | Cộng ở mỗi $r$ |
| --- | --- | --- | --- | --- |
| 2063 | tổng nguyên âm trên mọi substring | cộng giá trị, đổi vòng | không có | mỗi $i$ cộng $f(i)(i+1)(n-i)$ |
| 3958 | chi phí tách, mỗi lần `a * b` | cộng giá trị, đổi vòng | không có | $\binom{n}{2}$ |
| 1513 | substring **không chứa** `0` | đơn điệu, hỏng vẫn hỏng | số `0` gần nhất | $r - T$ |
| 2495 | subarray **chứa** số chẵn | đơn điệu, thỏa vẫn thỏa | số chẵn gần nhất | $T + 1$ |
| 1358 | substring **chứa đủ** `a`, `b`, `c` | đơn điệu, thỏa vẫn thỏa | $\min$ vị trí gần nhất của `a`, `b`, `c` | $T + 1$ |
| [bài `abc`]({% post_url 2026-11-16-dem-chuoi-con-khong-chua-abc %}) | substring **không chứa dãy con** `abc` | đơn điệu, hỏng vẫn hỏng | `startABC` | $r - T$ |
| 3084 | substring bắt đầu và kết thúc bằng `c` | không đơn điệu | không có | số `c` từ $0$ đến $r$ |
| 2938 | số swap kề tối thiểu | không đơn điệu | không có | số `1` trước $r$ nếu `s[r] = 0` |

## Tóm tắt

1. Viết duyệt trâu "với mỗi $r$, đếm $l$".
2. Câu hỏi 1: cộng giá trị từng phần tử thì đổi vòng, phần tử $i$ nằm trong $(i+1)(n-i)$ đoạn. Còn lại là đếm đoạn.
3. Câu hỏi 2: mở đoạn sang trái, thỏa vẫn thỏa thì cộng $T + 1$, hỏng vẫn hỏng thì cộng $r - T$. Không đơn điệu thì dùng biến đếm khi số $l$ thỏa tính được từ $r-1$ và $s[r]$, hoặc lấy hiệu của hai bài "ít nhất $k$".
4. Câu hỏi 3: đoạn phải chứa thứ gì? $T(r)$ là vị trí gần nhất của thứ đó, lấy $\min$ nếu cần nhiều thứ cùng lúc, dùng chuỗi biến nếu là mẫu theo thứ tự, và nếu thứ đó chiếm hai vị trí liền nhau $(r-1, r)$ thì cập nhật khi $r$ đến vị trí sau.
5. Cập nhật biến rồi mới cộng, và dùng `long`, ép kiểu trước phép nhân.
6. Đối chiếu với duyệt trâu trên các input ngẫu nhiên nhỏ.

## Luyện thêm

| Bài | Gợi ý |
| --- | --- |
| 1358. Number of Substrings Containing All Three Characters | Cần chứa đồng thời `a`, `b`, `c`: $T(r)$ là $\min$ của ba vị trí gần nhất, cộng $T + 1$. |
| [Đếm chuỗi con không chứa "abc"]({% post_url 2026-11-16-dem-chuoi-con-khong-chua-abc %}) | Mẫu nhiều ký tự theo thứ tự: chuỗi biến `startA`, `startAB`, `startABC`, cộng $r - T$. |
| 3284. Sum of Consecutive Subarrays | Đoạn con "liên tiếp" là đoạn mà hai phần tử kề nhau luôn hơn kém đúng $+1$ (hoặc luôn đúng $-1$). Chia mảng thành các đoạn cực đại theo kiểu $+1$ (rồi riêng theo kiểu $-1$). Trong một đoạn cực đại $[L, R]$, phần tử $k$ nằm trong $(k-L+1)(R-k+1)$ đoạn con, như 2063. Đoạn con độ dài $1$ thuộc cả hai kiểu nên bị đếm hai lần, trừ tổng mảng một lần. |
| 1887. Reduction Operations to Make the Array Elements Equal | Các lần giảm thuộc về phần tử $x$: nó bị giảm một lần cho mỗi giá trị phân biệt nhỏ hơn $x$. |
| 3082. Find the Sum of the Power of All Subsequences | Đổi vòng: thay vì duyệt dãy con rồi đếm tập con tổng $k$ bên trong, duyệt tập con $S$ tổng $k$ rồi đếm dãy con chứa nó: $2^{n - \lvert S \rvert}$. |
