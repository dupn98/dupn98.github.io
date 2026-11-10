---
title: "Đếm đóng góp"
description: "Khi đề hỏi tổng hay số lượng trên mọi đoạn con, đổi thứ tự lấy tổng: với mỗi phần tử, đếm xem nó nằm trong bao nhiêu đoạn. Năm dạng thường gặp, mỗi dạng gắn với một bài LeetCode."
date: 2026-11-10 10:13:41 +0700
categories: [algorithm]
tags: [leetcode, counting, contribution]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Nhiều bài hỏi một tổng hoặc một số lượng trên **mọi** đoạn con (subarray, substring, cặp), với $n$ tới $10^5$. Có khoảng $n^2/2 \approx 5 \cdot 10^9$ đoạn, nên không thể liệt kê. Cách thoát là đổi thứ tự lấy tổng.

Gọi $f(i)$ là giá trị của phần tử tại $i$, và đoạn $[l, r]$ gồm các phần tử $l..r$. Tổng đề hỏi là: duyệt mọi đoạn, cộng $f$ của các phần tử trong đoạn:

$$
\text{total} = \sum_{l=0}^{n-1} \sum_{r=l}^{n-1} \sum_{i=l}^{r} f(i)
$$

**Bước 1: xem ba vòng lặp chạy qua những gì.** Mỗi lần cộng ứng với một bộ ba $(l, i, r)$: chọn đoạn ($l \le r$), rồi chọn $i$ trong đoạn ($l \le i \le r$). Gộp lại, ba vòng lặp đi qua đúng các bộ ba thỏa

$$
0 \le l \le i \le r \le n - 1
$$

**Bước 2: đọc cùng điều kiện đó theo $i$ trước.** Chọn $i$ bất kỳ trong $0..n-1$. Điều kiện còn lại tách thành hai phần độc lập: $0 \le l \le i$ và $i \le r \le n-1$. Vậy $l$ chạy từ $0$ đến $i$, $r$ chạy từ $i$ đến $n-1$. Cách đọc này liệt kê đúng tập bộ ba ở trên, chỉ khác thứ tự, nên tổng không đổi:

$$
\sum_{l=0}^{n-1} \sum_{r=l}^{n-1} \sum_{i=l}^{r} f(i)
\;=\;
\sum_{i=0}^{n-1} \sum_{l=0}^{i} \sum_{r=i}^{n-1} f(i)
$$

Viết thành vòng lặp, hai đoạn code dưới đây cộng cùng các số hạng, chỉ khác thứ tự lặp:

```java
// Vế trái: duyệt từng đoạn, rồi từng phần tử trong đoạn
for (int l = 0; l < n; l++)
    for (int r = l; r < n; r++)
        for (int i = l; i <= r; i++)
            total += f(i);

// Vế phải: duyệt từng phần tử, rồi từng đoạn chứa nó
for (int i = 0; i < n; i++)
    for (int l = 0; l <= i; l++)
        for (int r = i; r < n; r++)
            total += f(i);
```

**Bước 3: đưa $f(i)$ ra ngoài.** Ở vế phải, $f(i)$ không phụ thuộc $l$ hay $r$, nên hai vòng trong chỉ cộng cùng một số $f(i)$ lặp đi lặp lại. Số lần lặp là số giá trị của $l$ nhân số giá trị của $r$:

$$
\sum_{l=0}^{i} \sum_{r=i}^{n-1} f(i)
\;=\;
f(i) \cdot \underbrace{(i+1)}_{\text{số giá trị } l} \cdot \underbrace{(n-i)}_{\text{số giá trị } r}
$$

Trong code, hai vòng trong thu lại thành một dòng, chỉ còn một vòng lặp $O(n)$:

```java
for (int i = 0; i < n; i++)
    total += f(i) * (i + 1) * (n - i);
```

Ví dụ với `word = "aba"`, $f(i) = 1$ nếu `word[i]` là nguyên âm, ngược lại $f(i) = 0$. Mỗi hàng là một đoạn, mỗi cột là một phần tử, ô trống nghĩa là phần tử nằm ngoài đoạn:

| Đoạn $[l, r]$ | $i = 0$ (`a`) | $i = 1$ (`b`) | $i = 2$ (`a`) | Tổng hàng |
| --- | :---: | :---: | :---: | :---: |
| $[0, 0]$ `a` | 1 | | | 1 |
| $[0, 1]$ `ab` | 1 | 0 | | 1 |
| $[0, 2]$ `aba` | 1 | 0 | 1 | 2 |
| $[1, 1]$ `b` | | 0 | | 0 |
| $[1, 2]$ `ba` | | 0 | 1 | 1 |
| $[2, 2]$ `a` | | | 1 | 1 |
| **Số đoạn chứa $i$** | $1 \cdot 3 = 3$ | $2 \cdot 2 = 4$ | $3 \cdot 1 = 3$ | |
| **Tổng cột** $f(i) \cdot (i+1)(n-i)$ | 3 | 0 | 3 | **6** |

Vế trái cộng theo hàng, vế phải cộng theo cột. Cả hai cộng cùng các ô của bảng nên luôn bằng nhau, nhưng cộng theo hàng phải đi qua $n(n+1)/2$ hàng, còn mỗi cột tính được bằng một phép nhân.

## Nhận diện qua đề bài

| Đề có chữ | Dạng | Bài |
| --- | --- | --- |
| "sum of the number of vowels in **every substring**" | Cộng giá trị trên mọi đoạn: mỗi phần tử góp $(i+1)(n-i)$ lần | 2063 |
| "number of substrings with **all characters 1's**" | Đếm đoạn theo đầu phải | 1513 |
| "substrings that **start and end with** `c`" | Đếm đoạn theo đầu phải, biến đếm chạy | 3084 |
| "number of subarrays having an **even product**" | Gán mỗi đoạn cho đúng một nhân chứng | 2495 |
| "choose two **adjacent** balls and swap them … **minimum number of steps**" | Swap kề tối thiểu = số nghịch thế | 2938 |
| "**minimum** total cost", mỗi lần tách tốn `a * b` | Chi phí tích = số cặp bị tách, không phụ thuộc thứ tự | 3958 |

## Dạng 1: cộng giá trị trên mọi đoạn

**2063. Vowels of All Substrings.** Tính tổng số nguyên âm của mọi substring của `word`, $n \le 10^5$.

- Duyệt substring rồi đếm: $O(n^3)$.
- Thêm mảng tiền tố để đếm trong $O(1)$: vẫn còn $5 \cdot 10^9$ substring. Mảng tiền tố chỉ làm nhanh phần bên trong, còn thứ phải bỏ là vòng lặp qua từng đoạn.
- Đổi thứ tự: cộng theo cột thay vì theo hàng. Nguyên âm tại $i$ góp $(i+1)(n-i)$.

Kiểm với `"aba"`: chính là dòng tổng cột của bảng ở đầu bài, $3 + 0 + 3 = 6$, khớp Example 1.

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

`(long)` phải đứng trước phép nhân: tại $i \approx n/2$, $(i+1)(n-i) \approx 2.5 \cdot 10^9$, đã tràn `int` ngay trong phép nhân.

## Dạng 2: đếm đoạn theo đầu phải

Khi đề đếm đoạn (mỗi đoạn hợp lệ góp $1$) thay vì cộng giá trị, gán mỗi đoạn cho đầu phải của nó và hỏi: có bao nhiêu đoạn hợp lệ **kết thúc tại** $i$? Mỗi đoạn có đúng một đầu phải, nên không đoạn nào bị đếm hai lần.

**1513. Number of Substrings With Only 1s.** Đoạn toàn số `1` kết thúc tại $i$ phải bắt đầu sau số `0` gần nhất. Gọi `last` là vị trí số `0` gần nhất, khởi tạo $-1$ để tính cả các đoạn bắt đầu từ $0$. Số đoạn kết thúc tại $i$ là $i - \text{last}$.

```java
class Solution {
    public int numSub(String s) {
        final int MOD = 1_000_000_007;
        long count = 0;
        int last = -1;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '0') last = i;
            else count = (count + i - last) % MOD;
        }
        return (int) count;
    }
}
```

Kiểm với `"0110111"`: các vị trí `1` góp $1, 2, 1, 2, 3$, tổng $9$, khớp Example 1.

**3084. Count Substrings Starting and Ending with Given Character.** Đoạn kết thúc tại lần xuất hiện thứ $j$ của `c` có đầu trái là một trong $j$ lần xuất hiện tính đến đó, kể cả chính nó. Giữ biến đếm và cộng nó mỗi lần gặp `c`.

```java
class Solution {
    public long countSubstrings(String s, char c) {
        long count = 0;
        int seen = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == c) count += ++seen;
        }
        return count;
    }
}
```

Kiểm với `"abada"`, `c = 'a'`: $1 + 2 + 3 = 6$, khớp Example 1. Ở bài này tổng có công thức đóng $k(k+1)/2$, nhưng biến đếm chạy vẫn dùng được ở những bài không có công thức như vậy (xem 2938 bên dưới).

## Dạng 3: gán mỗi đoạn cho một nhân chứng

**2495. Number of Subarrays Having Even Product.** Tích chẵn khi và chỉ khi đoạn chứa ít nhất một số chẵn.

Cách sai là cho mỗi số chẵn tại $i$ góp $(i+1)(n-i)$. Với `[2, 4]`, công thức cho $1 \cdot 2 + 2 \cdot 1 = 4$, nhưng mảng chỉ có $3$ subarray: đoạn `[2, 4]` chứa hai số chẵn nên bị đếm hai lần. Công thức của dạng 1 đúng khi cộng giá trị; khi đếm đoạn, mỗi đoạn phải được gán cho **đúng một** phần tử.

Cách đúng là gán mỗi đoạn cho số chẵn **đầu tiên** của nó. Gọi `prevEven` là vị trí số chẵn ngay trước $i$ (khởi tạo $-1$). Đoạn $[l, r]$ có số chẵn đầu tiên tại $i$ khi:

- $l$ nằm trong $\text{prevEven} + 1 .. i$, để đoạn không chứa số chẵn nào trước $i$: có $i - \text{prevEven}$ cách;
- $r$ nằm trong $i .. n-1$: có $n - i$ cách.

Hai lựa chọn độc lập, nên có $(i - \text{prevEven})(n - i)$ đoạn. Đây vẫn là phép đếm $l$ và $r$ như ở đầu bài, chỉ là $l$ bị chặn thêm bởi `prevEven`.

```java
class Solution {
    public long evenProduct(int[] nums) {
        int n = nums.length;
        long count = 0;
        int prevEven = -1;
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

Kiểm với `[9, 6, 7, 13]`: chỉ có số chẵn tại $1$, góp $2 \cdot 3 = 6$, khớp Example 1. Với `[2, 4]`: $1 \cdot 2 + 1 \cdot 1 = 3$.

Trước khi tin một công thức đếm đoạn, hãy chỉ ra được mỗi đoạn được gán cho phần tử nào.

## Dạng 4: swap kề tối thiểu bằng số nghịch thế

**2938. Separate Black and White Balls.** Chuỗi nhị phân, `1` là bóng đen, `0` là bóng trắng. Mỗi bước đổi chỗ hai bóng kề nhau. Tìm số bước ít nhất để dồn bóng trắng sang trái, bóng đen sang phải.

Gọi nghịch thế là một cặp `1` đứng trước `0` (không cần kề nhau). Trạng thái đích `00…011…1` có $0$ nghịch thế.

- Đổi hai bóng kề nhau chỉ thay đổi thứ tự của đúng cặp đó, nên số nghịch thế thay đổi nhiều nhất $1$. Vậy cần ít nhất bằng số nghịch thế ban đầu.
- Còn nghịch thế thì luôn có một cặp `10` kề nhau. Đổi nó thành `01` giảm đúng $1$ nghịch thế, nên đạt được con số đó.

Vậy đáp án là số nghịch thế: đây là bài đếm cặp, không phải bài tìm kiếm. Để đếm cặp, dùng lại cách đổi thứ tự ở đầu bài: thay vì duyệt từng cặp, duyệt từng `0` và đếm số `1` đứng trước nó.

```java
class Solution {
    public long minimumSteps(String s) {
        long steps = 0;
        int ones = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '1') ones++;
            else steps += ones;
        }
        return steps;
    }
}
```

Kiểm với `"100"`: số `0` thứ nhất và thứ hai đều có một số `1` đứng trước, tổng $2$, khớp Example 2.

Khi khóa nhận giá trị tùy ý, đếm "bao nhiêu phần tử đứng trước lớn hơn" cần cây Fenwick (xem [Nén tọa độ và cây Fenwick]({% post_url 2026-11-06-compress-fenwick %})). Khi khóa chỉ có vài giá trị, vài biến đếm là đủ: 3994 có ba lớp, dùng hai biến đếm.

## Dạng 5: chi phí $a \cdot b$ là số cặp bị tách

**3958. Minimum Cost to Split into Ones II.** Tách $n$ thành $n$ số $1$. Mỗi lần tách một phần thành hai phần kích thước $a$ và $b$ tốn $a \cdot b$. Tìm chi phí nhỏ nhất.

Coi $n$ là $n$ viên bi đánh số. Tách một nhóm thành hai nhóm $a$ và $b$ thì có đúng $a \cdot b$ cặp bi bị chia ra hai nhóm khác nhau, nên chi phí của lần tách bằng số cặp bị chia ra ở lần đó. Đổi thứ tự như ở đầu bài: thay vì cộng theo từng lần tách, cộng theo từng cặp bi.

- Hai viên bi đã nằm ở hai nhóm khác nhau thì không bao giờ chung nhóm lại, nên mỗi cặp bị chia ra nhiều nhất một lần.
- Kết thúc thì mỗi viên bi ở một nhóm riêng, nên mỗi cặp bị chia ra ít nhất một lần.

Mỗi cặp góp đúng $1$, nên **mọi** cách tách đều tốn $\binom{n}{2} = n(n-1)/2$. Chữ "minimum" là mồi nhử, không cần DP.

Kiểm với $n = 4$:

- $4 \to 2 + 2$ tốn $4$, rồi hai lần $2 \to 1 + 1$ tốn $1 + 1$: tổng $6$.
- $4 \to 1 + 3$ tốn $3$, $3 \to 1 + 2$ tốn $2$, $2 \to 1 + 1$ tốn $1$: tổng $6$.

Cả hai đều bằng $\binom{4}{2} = 6$.

## Tóm tắt

1. **Cộng giá trị trên mọi đoạn?** Mỗi phần tử góp $f(i) \cdot (i+1)(n-i)$.
2. **Đếm đoạn?** Đếm theo đầu phải, hoặc gán mỗi đoạn cho một nhân chứng duy nhất. Đừng dùng thẳng $(i+1)(n-i)$.
3. **"Tối thiểu" với swap kề hoặc chi phí tích?** Đó là bài đếm cặp: đếm theo từng phần tử của cặp, không cần tìm kiếm hay DP.
4. **Luôn dùng `long`**, và ép kiểu trước phép nhân.

## Luyện thêm

| Bài | Gợi ý |
| --- | --- |
| 3284. Sum of Consecutive Subarrays | Trong mỗi đoạn tăng (hoặc giảm) $1$ cực đại $[l, r]$, phần tử tại $k$ góp $(k-l+1)(r-k+1)$ lần. Đoạn độ dài $1$ bị đếm ở cả hai lượt nên trừ tổng mảng một lần. |
| 1887. Reduction Operations to Make the Array Elements Equal | Mỗi phần tử bị giảm đúng một lần cho mỗi giá trị phân biệt nhỏ hơn nó. |
| 3994. Minimum Adjacent Swaps to Partition Array | Như 2938, nhưng khóa có ba giá trị: hai biến đếm. |
| 3082. Find the Sum of the Power of All Subsequences | Đổi thứ tự: thay vì với mỗi dãy con đếm các tập con tổng $k$ của nó, với mỗi tập con $S$ tổng $k$ đếm số dãy con chứa nó, là $2^{n-\lvert S\rvert}$. |
