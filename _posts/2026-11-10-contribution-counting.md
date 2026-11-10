---
title: "Đếm đóng góp"
description: "Tổng trên mọi đoạn con: đổi thứ tự lấy tổng, gom theo phần tử thay vì theo đoạn. Năm dạng, mỗi dạng một bài LeetCode."
date: 2026-11-10 10:13:41 +0700
categories: [algorithm]
tags: [leetcode, counting, contribution]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Đề hỏi một tổng trên mọi đoạn con, $n \le 10^5$, tức khoảng $5 \cdot 10^9$ đoạn. Cách giải: đổi thứ tự lấy tổng.

## Công thức

Gọi $f(i)$ là giá trị phần tử tại $i$. Tổng trên mọi đoạn $[l, r]$ là tổng trên mọi bộ ba $l \le i \le r$:

$$
\text{total}
= \sum_{l=0}^{n-1} \sum_{r=l}^{n-1} \sum_{i=l}^{r} f(i)
= \sum_{0 \le l \le i \le r \le n-1} f(i)
$$

Gom theo $i$. Với $i$ cố định, $0 \le l \le i$ và $i \le r \le n-1$ độc lập, nên có $(i+1)(n-i)$ cặp $(l, r)$:

$$
\text{total} = \sum_{i=0}^{n-1} f(i) \, (i+1)(n-i)
$$

Ví dụ `"aba"`, $f(i) = 1$ nếu `word[i]` là nguyên âm, ngược lại $0$. Gom theo đoạn là cộng theo hàng, gom theo $i$ là cộng theo cột:

| Đoạn $[l, r]$ | $i = 0$ (`a`) | $i = 1$ (`b`) | $i = 2$ (`a`) | Tổng hàng |
| --- | :---: | :---: | :---: | :---: |
| $[0, 0]$ | 1 | | | 1 |
| $[0, 1]$ | 1 | 0 | | 1 |
| $[0, 2]$ | 1 | 0 | 1 | 2 |
| $[1, 1]$ | | 0 | | 0 |
| $[1, 2]$ | | 0 | 1 | 1 |
| $[2, 2]$ | | | 1 | 1 |
| $(i+1)(n-i)$ | $3$ | $4$ | $3$ | |
| Tổng cột | 3 | 0 | 3 | **6** |

## Nhận diện qua đề bài

| Đề có chữ | Dạng | Bài |
| --- | --- | --- |
| "sum of the number of vowels in **every substring**" | Cộng giá trị: $\sum f(i)(i+1)(n-i)$ | 2063 |
| "number of substrings with **all characters 1's**" | Đếm đoạn theo đầu phải | 1513 |
| "substrings that **start and end with** `c`" | Đếm đoạn theo đầu phải | 3084 |
| "number of subarrays having an **even product**" | Gán mỗi đoạn cho một phần tử duy nhất | 2495 |
| "**adjacent** … swap … **minimum number of steps**" | Số swap = số nghịch thế | 2938 |
| "**minimum** total cost", mỗi lần tách tốn `a * b` | Chi phí = số cặp bị tách $= \binom{n}{2}$ | 3958 |

## Dạng 1: cộng giá trị

**2063. Vowels of All Substrings.** Áp thẳng công thức với $f(i) = 1$ nếu `word[i]` là nguyên âm.

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

## Dạng 2: đếm đoạn theo đầu phải

Khi đếm đoạn hợp lệ, gom theo đầu phải $r$:

$$
\#\text{đoạn} = \sum_{r=0}^{n-1} \#\{\, l \le r : [l, r] \text{ hợp lệ} \,\}
$$

**1513. Number of Substrings With Only 1s.** Gọi $z_r$ là vị trí số `0` cuối cùng $\le r$ ($-1$ nếu chưa có). $[l, r]$ toàn `1` khi $z_r < l \le r$, nên có $r - z_r$ giá trị $l$.

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

**3084. Count Substrings Starting and Ending with Given Character.** $[l, r]$ hợp lệ khi `s[l] = s[r] = c`. Nếu `s[r]` là lần xuất hiện thứ $j$ của `c` thì có $j$ giá trị $l$, nên tổng là $1 + 2 + \dots + k = k(k+1)/2$.

```java
class Solution {
    public long countSubstrings(String s, char c) {
        long count = 0;
        int seen = 0; // j
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == c) count += ++seen;
        }
        return count;
    }
}
```

`"abada"`, `c = 'a'`: $1 + 2 + 3 = 6$.

## Dạng 3: gán mỗi đoạn cho một phần tử duy nhất

**2495. Number of Subarrays Having Even Product.** Tích chẵn khi đoạn chứa ít nhất một số chẵn.

Sai: $\sum_{i \text{ chẵn}} (i+1)(n-i)$ đếm một đoạn có $m$ số chẵn $m$ lần. Với `[2, 4]`: $2 + 2 = 4$, nhưng chỉ có $3$ đoạn.

Đúng: gán mỗi đoạn cho số chẵn **đầu tiên** của nó. Gọi $p_i$ là vị trí số chẵn ngay trước $i$ ($-1$ nếu không có). Đoạn có số chẵn đầu tiên tại $i$ khi $p_i < l \le i$ và $i \le r \le n-1$:

$$
\#\text{đoạn} = \sum_{i \text{ chẵn}} (i - p_i)(n - i)
$$

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

## Dạng 4: số swap kề bằng số nghịch thế

**2938. Separate Black and White Balls.** Dồn `0` sang trái, `1` sang phải bằng swap kề. Nghịch thế là cặp $a < b$ với `s[a] = 1`, `s[b] = 0`.

- Một swap kề đổi thứ tự đúng một cặp, nên số nghịch thế giảm nhiều nhất $1$.
- Còn nghịch thế thì còn cặp `10` kề nhau, và đổi nó giảm đúng $1$.

Vậy đáp án là số nghịch thế. Gom theo $b$:

$$
\text{inv} = \sum_{b \,:\, s[b] = 0} \#\{\, a < b : s[a] = 1 \,\}
$$

```java
class Solution {
    public long minimumSteps(String s) {
        long steps = 0;
        int ones = 0; // #{a < b : s[a] = 1}
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '1') ones++;
            else steps += ones;
        }
        return steps;
    }
}
```

`"100"`: $1 + 1 = 2$.

Khi khóa nhận giá trị tùy ý, vế phải cần cây Fenwick (xem [Nén tọa độ và cây Fenwick]({% post_url 2026-11-06-compress-fenwick %})).

## Dạng 5: chi phí $a \cdot b$

**3958. Minimum Cost to Split into Ones II.** Tách $n$ thành $n$ số $1$, mỗi lần tách thành hai phần $a$, $b$ tốn $a \cdot b$.

Coi $n$ là $n$ viên bi. Tách thành $a$ và $b$ chia đúng $a \cdot b$ cặp bi ra hai nhóm. Mỗi cặp bị chia đúng một lần: đã chia thì không gộp lại, và cuối cùng mọi viên bi tách rời. Đổi thứ tự lấy tổng:

$$
\sum_{\text{lần tách}} a \cdot b
= \sum_{\text{lần tách}} \#\{\text{cặp bị chia ở lần đó}\}
= \sum_{\text{cặp}} \#\{\text{lần cặp bị chia}\}
= \sum_{\text{cặp}} 1
= \binom{n}{2}
$$

Mọi cách tách đều tốn $\binom{n}{2}$, không cần DP. Với $n = 4$: $4 + 1 + 1 = 3 + 2 + 1 = 6$.

## Tóm tắt

1. Cộng giá trị trên mọi đoạn: $\sum_i f(i)(i+1)(n-i)$.
2. Đếm đoạn: gom theo đầu phải, hoặc theo một phần tử duy nhất của mỗi đoạn.
3. Swap kề, chi phí tích: đếm cặp, gom theo một đầu của cặp.
4. Dùng `long`, ép kiểu trước phép nhân.

## Luyện thêm

| Bài | Gợi ý |
| --- | --- |
| 3284. Sum of Consecutive Subarrays | Trong mỗi đoạn tăng (hoặc giảm) $1$ cực đại $[l, r]$, phần tử $k$ góp $(k-l+1)(r-k+1)$ lần. Đoạn độ dài $1$ bị đếm hai lần, trừ tổng mảng một lần. |
| 1887. Reduction Operations to Make the Array Elements Equal | Phần tử $x$ bị giảm một lần cho mỗi giá trị phân biệt nhỏ hơn $x$. |
| 3994. Minimum Adjacent Swaps to Partition Array | Như 2938, khóa có ba giá trị: hai biến đếm. |
| 3082. Find the Sum of the Power of All Subsequences | Gom theo tập con: mỗi tập con $S$ có tổng $k$ nằm trong $2^{n - \lvert S \rvert}$ dãy con. |
