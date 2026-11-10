---
title: "Mỗi vị trí gánh bao nhiêu đoạn?"
description: "Kỹ thuật contribution: giao mỗi đoạn cho một vị trí, sắp lại vòng lặp để biến chạy là vị trí đó, rồi đếm số đoạn nó gánh trong O(1). Sáu bài LeetCode."
date: 2026-11-10 10:13:41 +0700
categories: [algorithm]
tags: [leetcode, counting, contribution]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Đề hỏi một tổng hoặc một số lượng trên mọi đoạn con (hoặc mọi cặp), $n \le 10^5$. Brute force duyệt từng đoạn là $O(n^2)$ trở lên.

Kỹ thuật thường gọi là *contribution technique* (đếm đóng góp) đổi câu hỏi: thay vì hỏi "đoạn này cộng thêm bao nhiêu", hỏi "**mỗi vị trí gánh bao nhiêu đoạn**". Các bài chỉ khác nhau ở chỗ mỗi đoạn được giao cho vị trí nào:

| Bài | Một đoạn được giao cho | Số vị trí gánh một đoạn |
| --- | --- | --- |
| 2063 | mọi vị trí nằm trong nó | nhiều |
| 1513, 3084 | đầu phải của nó | đúng một |
| 2495 | số chẵn đầu tiên của nó | đúng một |
| 2938 | đầu phải của cặp | đúng một |

Khi đề hỏi **số lượng** đoạn, mỗi đoạn phải được giao cho **đúng một** vị trí, nếu không sẽ đếm trùng. 3958 cùng tinh thần, nhưng thứ gánh là cặp bi thay vì vị trí.

Cách làm:

1. Viết brute force bằng vòng lặp lồng nhau.
2. Sắp lại vòng lặp để biến chạy ngoài cùng là vị trí gánh.
3. Vòng trong lúc này chỉ đếm số đoạn vị trí đó gánh, nên thay được bằng một công thức $O(1)$.
4. Cộng lại, chỉ còn một vòng lặp $O(n)$.

## Ý tưởng

Tính tổng $f(i)$ trên mọi đoạn $[l, r]$. Brute force:

```java
for (int l = 0; l < n; l++)
    for (int r = l; r < n; r++)
        for (int i = l; i <= r; i++)
            total += f(i);
```

**Bước 1: đưa $i$ ra vòng ngoài.** Ba vòng lặp đi qua mọi bộ $(l, i, r)$ với $0 \le l \le i \le r \le n-1$. Cố định $i$ trước thì điều kiện tách thành $0 \le l \le i$ và $i \le r \le n-1$, nên viết lại được:

```java
for (int i = 0; i < n; i++)
    for (int l = 0; l <= i; l++)
        for (int r = i; r < n; r++)
            total += f(i);
```

Hai đoạn code cộng cùng các số hạng, chỉ khác thứ tự.

**Bước 2: thu vòng trong.** Hai vòng trong không dùng $l$, $r$: chúng chỉ đếm số đoạn chứa $i$, tức số đoạn $i$ gánh. Vòng $l$ chạy $i + 1$ lần, vòng $r$ chạy $n - i$ lần:

```java
for (int i = 0; i < n; i++)
    total += f(i) * (i + 1) * (n - i);
```

Viết bằng công thức:

$$
\sum_{l=0}^{n-1} \sum_{r=l}^{n-1} \sum_{i=l}^{r} f(i)
= \sum_{i=0}^{n-1} \sum_{l=0}^{i} \sum_{r=i}^{n-1} f(i)
= \sum_{i=0}^{n-1} f(i) \, (i+1)(n-i)
$$

Kiểm với `"aba"`, $f(i) = 1$ nếu là nguyên âm. Brute force cộng theo hàng, bản đã đổi vòng cộng theo cột:

| Đoạn $[l, r]$ | $i = 0$ (`a`) | $i = 1$ (`b`) | $i = 2$ (`a`) | Tổng hàng |
| --- | :---: | :---: | :---: | :---: |
| $[0, 0]$ | 1 | | | 1 |
| $[0, 1]$ | 1 | 0 | | 1 |
| $[0, 2]$ | 1 | 0 | 1 | 2 |
| $[1, 1]$ | | 0 | | 0 |
| $[1, 2]$ | | 0 | 1 | 1 |
| $[2, 2]$ | | | 1 | 1 |
| Số đoạn $i$ gánh | $3$ | $4$ | $3$ | |
| Tổng cột | 3 | 0 | 3 | **6** |

Mọi bài trong cụm đều nhắm tới cùng một chỗ: biến chạy là vị trí gánh, vòng trong chỉ còn đếm số đoạn nó gánh, nên thay được bằng $O(1)$. Có hai cách để đến đó:

- **Đổi vòng** như trên, khi vòng ngoài của brute force là đoạn: 2063, 2495, 3958.
- **Giữ vòng**, khi vòng ngoài đã là đầu phải $r$: số $l$ hợp lệ suy ra từ một biến cập nhật ở các vòng trước: 1513, 3084, 2938.

## Nhận diện qua đề bài

Đáp án là tổng của cột cuối khi biến chạy đi hết mảng.

| Bài | Đề hỏi | Cách | Vị trí gánh (biến chạy) | Số đoạn nó gánh |
| --- | --- | --- | --- | --- |
| 2063 | tổng số nguyên âm trên **mọi substring** | đổi vòng | vị trí $i$ | $(i+1)(n-i)$ |
| 2495 | số subarray có **tích chẵn** | đổi vòng | số chẵn **đầu tiên** $i$ | $(i - p_i)(n - i)$ |
| 3958 | chi phí tách, mỗi lần **`a * b`** | đổi vòng | cặp bi | $1$ |
| 1513 | số substring **toàn `1`** | giữ vòng | đầu phải $r$ | $r - z_r$ |
| 3084 | số substring **bắt đầu và kết thúc bằng `c`** | giữ vòng | đầu phải $r$ | số `c` từ $0$ đến $r$ |
| 2938 | số **swap kề** tối thiểu | giữ vòng | vị trí $b$ của mỗi `0` | số `1` trước $b$ |

## Dạng 1: đoạn giao cho mọi vị trí trong nó

**2063. Vowels of All Substrings.** Chính là ví dụ ở trên với $f(i) = 1$ nếu `word[i]` là nguyên âm.

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

Tại $i = n/2$: $(i+1)(n-i) \approx 2.5 \cdot 10^9 > 2^{31}$, nên ép `long` trước phép nhân.

## Dạng 2: đoạn giao cho đầu phải

Khi đếm đoạn, brute force là:

```java
for (int r = 0; r < n; r++)
    for (int l = 0; l <= r; l++)
        if (valid(l, r)) count++;
```

$r$ là vị trí gánh và đã nằm ở vòng ngoài, không cần đổi. Vòng $l$ đếm số đoạn $r$ gánh, thu được thành $O(1)$ nhờ một biến cập nhật dần khi $r$ tăng.

**1513. Number of Substrings With Only 1s.** Gọi $z_r$ là vị trí số `0` cuối cùng tính đến $r$ ($-1$ nếu chưa có). $[l, r]$ toàn `1` khi $z_r < l \le r$, nên vòng $l$ thu thành $r - z_r$. Biến `last` giữ $z_r$, cập nhật mỗi lần gặp `0`.

```java
class Solution {
    public int numSub(String s) {
        final int MOD = 1_000_000_007;
        long count = 0;
        int last = -1; // z_r
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '0') last = i;
            else count = (count + i - last) % MOD;
        }
        return (int) count;
    }
}
```

`"0110111"`: $1 + 2 + 1 + 2 + 3 = 9$.

**3084. Count Substrings Starting and Ending with Given Character.** $[l, r]$ hợp lệ khi `s[l] = s[r] = c`. Nếu `s[r] = c`, vòng $l$ thu thành số chữ `c` từ $0$ đến $r$. Giữ số đó trong một biến đếm:

```java
class Solution {
    public long countSubstrings(String s, char c) {
        long count = 0;
        int seen = 0; // số chữ c từ 0 đến r
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == c) count += ++seen;
        }
        return count;
    }
}
```

`"abada"`, `c = 'a'`: $1 + 2 + 3 = 6$.

## Dạng 3: đoạn giao cho phần tử đầu tiên thỏa điều kiện

**2495. Number of Subarrays Having Even Product.** Tích chẵn khi đoạn chứa ít nhất một số chẵn.

Muốn để số chẵn gánh đoạn như dạng 1, nhưng đề hỏi số lượng nên mỗi đoạn phải được giao cho **đúng một** vị trí. Nếu giao cho mọi số chẵn trong đoạn:

```java
for (int i = 0; i < n; i++) if (nums[i] % 2 == 0)
    for (int l = 0; l <= i; l++)
        for (int r = i; r < n; r++)
            count++; // sai
```

thì một đoạn có $m$ số chẵn được $m$ vị trí gánh, nên bị đếm $m$ lần. Với `[2, 4]`: $2 + 2 = 4$, nhưng chỉ có $3$ đoạn.

Sửa: chỉ giao đoạn cho số chẵn **đầu tiên** của nó. Gọi $p_i$ là vị trí số chẵn ngay trước $i$ ($-1$ nếu không có). Đoạn có số chẵn đầu tiên tại $i$ khi $l$ không lùi qua $p_i$:

```java
for (int i = 0; i < n; i++) if (nums[i] % 2 == 0)
    for (int l = p[i] + 1; l <= i; l++)
        for (int r = i; r < n; r++)
            count++;
```

Vòng $l$ chạy $i - p_i$ lần, vòng $r$ chạy $n - i$ lần:

```java
class Solution {
    public long evenProduct(int[] nums) {
        int n = nums.length;
        long count = 0;
        int prevEven = -1; // p_i
        for (int i = 0; i < n; i++) {
            if (nums[i] % 2 == 0) {
                count += (long) (i - prevEven) * (n - i);
                prevEven = i;
            }
        }
        return count;
    }
}
```

`[9, 6, 7, 13]`: $2 \cdot 3 = 6$. `[2, 4]`: $1 \cdot 2 + 1 \cdot 1 = 3$.

## Dạng 4: cặp giao cho đầu phải

**2938. Separate Black and White Balls.** Trước hết đưa bài về đếm. Nghịch thế là cặp $a < b$ với `s[a] = 1`, `s[b] = 0`.

- Một swap kề đổi thứ tự đúng một cặp, nên số nghịch thế giảm nhiều nhất $1$.
- Còn nghịch thế thì còn cặp `10` kề nhau, và đổi nó giảm đúng $1$.

Vậy đáp án là số nghịch thế. Giao mỗi cặp cho đầu phải $b$. Brute force đếm cặp đã có $b$ ở vòng ngoài, giữ nguyên như dạng 2:

```java
for (int b = 0; b < n; b++) if (s[b] == '0')
    for (int a = 0; a < b; a++)
        if (s[a] == '1') steps++;
```

Vòng $a$ thu thành số `1` đứng trước $b$, giữ trong một biến đếm:

```java
class Solution {
    public long minimumSteps(String s) {
        long steps = 0;
        int ones = 0; // số 1 trước b
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '1') ones++;
            else steps += ones;
        }
        return steps;
    }
}
```

`"100"`: $1 + 1 = 2$.

Khi giá trị tùy ý, "số phần tử lớn hơn đứng trước $b$" cần cây Fenwick (xem [Nén tọa độ và cây Fenwick]({% post_url 2026-11-06-compress-fenwick %})).

## Dạng 5: cặp bi gánh lần tách

**3958. Minimum Cost to Split into Ones II.** Tách $n$ thành $n$ số $1$, mỗi lần tách thành hai phần $a$, $b$ tốn $a \cdot b$.

Coi $n$ là $n$ viên bi. Tách thành hai nhóm $a$ và $b$ thì có đúng $a \cdot b$ cặp bi bị chia ra hai nhóm. Viết chi phí như một vòng lặp:

```text
for (mỗi lần tách)
    for (mỗi cặp bi bị lần tách này chia ra)
        cost++
```

Đổi vòng để cặp bi là thứ gánh:

```text
for (mỗi cặp bi)
    for (mỗi lần tách chia cặp này ra)
        cost++
```

Một cặp đã bị chia thì không chung nhóm lại, và cuối cùng mọi viên bi đều tách rời. Vậy vòng trong chạy đúng $1$ lần, nên $\text{cost} = \binom{n}{2}$ với **mọi** cách tách, không cần DP.

Kiểm với $n = 4$: tách $2 + 2$ rồi $1 + 1$, $1 + 1$ tốn $4 + 1 + 1 = 6$. Tách $1 + 3$, $1 + 2$, $1 + 1$ tốn $3 + 2 + 1 = 6$.

## Tóm tắt

1. Chọn vị trí gánh: mọi vị trí trong đoạn (khi cộng giá trị), hoặc đúng một vị trí như đầu phải, phần tử đầu tiên thỏa điều kiện (khi đếm số lượng).
2. Viết brute force, rồi đổi vòng để vị trí gánh nằm ngoài, hoặc giữ vòng nếu nó đã nằm ngoài.
3. Thu vòng trong, tức số đoạn vị trí đó gánh, thành công thức hoặc một biến cập nhật từ vòng trước.
4. Dùng `long`, ép kiểu trước phép nhân.

## Luyện thêm

| Bài | Gợi ý |
| --- | --- |
| 3284. Sum of Consecutive Subarrays | Như dạng 1, nhưng chỉ trong mỗi đoạn tăng (hoặc giảm) $1$ cực đại $[l, r]$: phần tử $k$ góp $(k-l+1)(r-k+1)$ lần. Đoạn độ dài $1$ bị đếm hai lần, trừ tổng mảng một lần. |
| 1887. Reduction Operations to Make the Array Elements Equal | Phần tử $x$ gánh các lần giảm: nó bị giảm một lần cho mỗi giá trị phân biệt nhỏ hơn $x$. |
| 3994. Minimum Adjacent Swaps to Partition Array | Như dạng 4, khóa có ba giá trị: hai biến đếm. |
| 3082. Find the Sum of the Power of All Subsequences | Đổi vòng: thay vì duyệt dãy con rồi đếm tập con tổng $k$ bên trong, duyệt tập con $S$ tổng $k$ rồi đếm dãy con chứa nó: $2^{n - \lvert S \rvert}$. |
