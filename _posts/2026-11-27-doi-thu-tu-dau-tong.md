---
title: "Đổi thứ tự dấu tổng (Σ) một cách máy móc, không cần tưởng tượng"
description: "Quy trình ba bước để đổi thứ tự các dấu tổng lồng nhau: gom cận thành chuỗi bất đẳng thức, tìm cận mới từ ngoài vào trong, rồi rút thừa số hoặc đếm bằng tổ hợp."
date: 2026-11-27 10:00:00 +0700
categories: [algorithm]
tags: [leetcode, counting, contribution, summation]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

Ở bài [Đếm đóng góp (contribution): mỗi đoạn được tính cho vị trí nào?]({% post_url 2026-11-10-contribution-counting %}), bài 2063 được giải bằng cách đổi vòng lặp: cố định $i$, cho $l$ chạy sang trái và $r$ chạy sang phải. Khi có bốn, năm dấu tổng với cận phụ thuộc lẫn nhau, chỉ cần hình dung lệch một chỗ là công thức sai mà không có gì báo lỗi. Bài này thay việc hình dung bằng một quy trình chỉ dùng bất đẳng thức.

Quy ước: mọi biến đều nguyên, $\sum_{x=L}^{R}$ chạy $x = L, \dots, R$ và bằng $0$ khi $R < L$. Mọi quan hệ đều viết bằng $\le$, với hằng số chuyển sang vế trái. Khi viết lại, biến ngoài cùng viết cận trên Σ, các cụm còn lại viết điều kiện dưới Σ.

## Vì sao đổi thứ tự được

Đưa mọi điều kiện xuống dưới một dấu Σ duy nhất:

$$
\sum_{l=0}^{n-1}\sum_{r=l}^{n-1}\sum_{i=l}^{r} f(i)
\;\longrightarrow\;
\sum_{\substack{0\le l\le n-1\\ l\le r\le n-1\\ l\le i\le r}} f(i)
\;=\;
\sum_{0\le l\le i\le r\le n-1} f(i)
$$

Dấu tổng lồng nhau là tổng của $f$ trên mọi bộ thỏa mãn đồng thời tất cả điều kiện. Thứ tự các dấu Σ chỉ là thứ tự liệt kê các bộ đó, nên đổi thứ tự là viết lại cùng một tập bộ theo thứ tự biến khác.

## Quy trình ba bước

### B1. Gom thành chuỗi $\le$

Xếp các biến thành một chuỗi: biến bị kẹp giữa hai biến khác thì đứng giữa, cận dư (như $l \le r$, $l \le n-1$ ở trên) bỏ đi vì suy ra được từ chuỗi. Mọi quan hệ viết bằng $\le$:

| Ban đầu | Dạng $\le$ |
| --- | --- |
| $x < y$ | $x + 1 \le y$ |
| $b \ge a + 2$ | $a + 2 \le b$ |
| $0 < a$, $d < n$ | $1 \le a$, $d \le n - 1$ |

Với 2063, chuỗi $0 \le l \le i \le r \le n-1$ đã ở dạng $\le$.

### B2. Tìm cận mới từ ngoài vào trong

Cận của một biến chỉ được chứa hằng và các biến đứng ngoài nó. Không cần công thức: viết từng bất đẳng thức của chuỗi ra, rồi bắc cầu từng bước cho tới khi chỉ còn hằng.

Ví dụ $0 < a \le b < c \le d < n$, đưa $c$ ra ngoài cùng. Các bất đẳng thức là $1 \le a$, $a \le b$, $b + 1 \le c$, $c \le d$, $d \le n - 1$.

$$
\begin{aligned}
1 \le a,\;\; a \le b &\;\Rightarrow\; 1 \le b\\
1 \le b,\;\; b + 1 \le c &\;\Rightarrow\; 2 \le c\\
c \le d,\;\; d \le n - 1 &\;\Rightarrow\; c \le n - 1
\end{aligned}
$$

Vậy $2 \le c \le n - 1$. Khi $c$ đã cố định, mỗi biến còn lại đọc thẳng từ hai bất đẳng thức với hai biến kề nó: $1 \le a \le b$, $a \le b \le c - 1$, $c \le d \le n - 1$. Nhóm nào chỉ còn đếm (thân bằng $1$) thì dùng mục "Đếm một cụm $\Sigma 1$" ở dưới.

Với 2063, $i$ ra ngoài cùng, $l$ nằm giữa $0$ và $i$, $r$ nằm giữa $i$ và $n-1$:

$$
\sum_{i=0}^{n-1}\sum_{0\le l\le i}\sum_{i\le r\le n-1} f(i).
$$

### B3. Rút thừa số

1. Biểu thức không chứa biến của một dấu Σ thì đưa ra ngoài dấu Σ đó.
2. Hai cụm mà cận của cụm này không chứa biến của cụm kia thì tổng nhân với nhau.

Với 2063, $f(i)$ ra ngoài, và cận của $r$ không chứa $l$ nên hai cụm tách thành tích:

$$
\sum_{i=0}^{n-1} f(i)\Big(\sum_{0\le l\le i}1\Big)\Big(\sum_{i\le r\le n-1}1\Big) = \sum_{i=0}^{n-1} f(i)\,(i+1)(n-i).
$$

Phản ví dụ cho quy tắc 2: $\sum_{a=1}^{c}\sum_{b=a}^{c}1$ có cận của $b$ chứa $a$, nên không bằng $c^2$. Với $c = 2$ chỉ có $3$ bộ $(1,1), (1,2), (2,2)$, không phải $4$.

Trước khi đổi thứ tự:

```java
long total = 0;
for (int l = 0; l < n; l++)
    for (int r = l; r < n; r++)
        for (int i = l; i <= r; i++) total += f[i];
```

Sau khi đổi:

```java
long total = 0;
for (int i = 0; i < n; i++) total += f[i] * (long) (i + 1) * (n - i);
```

## Đếm một cụm $\Sigma 1$

Cụm một biến: $\sum_{L\le x\le R} 1 = R - L + 1$, đúng khi $R \ge L - 1$. Cụm nhiều biến thì đếm từ trong ra ngoài, mỗi lần dùng công thức một biến:

$$
\sum_{1\le a\le b\le c} 1 = \sum_{b=1}^{c}\;\sum_{1\le a\le b} 1 = \sum_{b=1}^{c} b = \frac{c(c+1)}{2}.
$$

Ghi chú: chuỗi $k$ biến toàn dấu $\le$ trên $N$ giá trị có $\binom{N+k-1}{k}$ bộ. Ở trên $k = 2$, $N = c$ nên là $\binom{c+1}{2}$.

## Ví dụ bốn dấu tổng

$$
S = \sum_{a=1}^{n}\sum_{b=a}^{n}\sum_{c=b}^{n}\sum_{d=c}^{n} f(c) = \sum_{1\le a\le b\le c\le d\le n} f(c).
$$

**B1.** Chuỗi $1 \le a \le b \le c \le d \le n$ đã ở dạng $\le$.

**B2.** Chọn $c$ ra ngoài cùng: $1 \le a \le b \le c \Rightarrow 1 \le c$ và $c \le d \le n \Rightarrow c \le n$. Nhóm trái $1 \le a \le b \le c$, nhóm phải $c \le d \le n$.

**B3.** Hai nhóm không chung biến, và $f(c)$ ra ngoài:

$$
S = \sum_{c=1}^{n} f(c)\Big(\sum_{1\le a\le b\le c} 1\Big)\Big(\sum_{c\le d\le n} 1\Big).
$$

**Đếm.** Nhóm trái bằng $\frac{c(c+1)}{2}$ như ở mục trên, nhóm phải một biến bằng $n - c + 1$:

$$
S = \sum_{c=1}^{n} f(c)\,\frac{c(c+1)}{2}\,(n-c+1).
$$

## Ví dụ có hằng số: $b \ge a + 2$

Đề: $S = \sum_{a=1}^{n}\sum_{b=a+2}^{n}\sum_{c=b}^{n}\sum_{d=c+1}^{n} f(c)$, cần đưa $c$ ra ngoài cùng.

**B1. Gom.** Đọc cận của từng dấu Σ:

- $\sum_{a=1}^{n}$ cho $1 \le a \le n$.
- $\sum_{b=a+2}^{n}$ cho $a + 2 \le b \le n$.
- $\sum_{c=b}^{n}$ cho $b \le c \le n$.
- $\sum_{d=c+1}^{n}$ cho $c + 1 \le d \le n$.

Ghép thành chuỗi $1 \le a$, $a + 2 \le b$, $b \le c$, $c + 1 \le d$, $d \le n$. Các cận $a \le n$, $b \le n$, $c \le n$ bỏ đi vì suy ra được từ chuỗi.

**B2. Đưa $c$ ra ngoài cùng.** Bắc cầu về hai phía:

$$
\begin{aligned}
1 \le a,\;\; a + 2 \le b &\;\Rightarrow\; 3 \le b\\
3 \le b,\;\; b \le c &\;\Rightarrow\; 3 \le c\\
c + 1 \le d,\;\; d \le n &\;\Rightarrow\; c \le n - 1
\end{aligned}
$$

Khi $c$ đã cố định, chuỗi tách thành hai cụm: cụm trái $1 \le a$, $a + 2 \le b \le c$ và cụm phải $c + 1 \le d \le n$:

$$
S = \sum_{c=3}^{n-1} f(c)\Big(\sum_{\substack{1 \le a\\ a + 2 \le b \le c}} 1\Big)\Big(\sum_{c+1 \le d \le n} 1\Big).
$$

**B3. Đếm từng cụm.**

- Cụm phải chỉ có $d$, nên có $n - c$ giá trị.
- Cụm trái có hai biến, nên lặp lại B2 bên trong cụm, coi $c$ là hằng. Chọn $b$ đứng ngoài: bắc cầu $1 \le a$, $a + 2 \le b$ cho $3 \le b \le c$; còn $a$ đọc theo $b$: $1 \le a \le b - 2$. Vậy

$$
\sum_{b=3}^{c}\;\sum_{a=1}^{b-2} 1 = \sum_{b=3}^{c} (b - 2) = 1 + 2 + \dots + (c-2) = \frac{(c-2)(c-1)}{2}.
$$

Ghép lại:

$$
S = \sum_{c=3}^{n-1} f(c)\cdot\frac{(c-2)(c-1)}{2}\cdot(n - c).
$$

**Kiểm tra** với $n = 5$, $f = 1$: công thức cho $1 \cdot 2 + 3 \cdot 1 = 5$. Liệt kê theo $c$:

| $c$ | $(a, b)$ | $d$ | Số bộ |
| :---: | :---: | :---: | :---: |
| $3$ | $(1,3)$ | $4, 5$ | $2$ |
| $4$ | $(1,3), (1,4), (2,4)$ | $5$ | $3$ |

Nếu thay $a + 2 \le b$ bằng $a < b$ (tức $a + 1 \le b$) thì chỉ hằng số đổi: bắc cầu cho $2 \le c$, và cụm trái thành $\sum_{b=2}^{c}(b-1) = \frac{(c-1)c}{2}$. Các bước giữ nguyên.

## Hai trường hợp khác

- **Nhiều cận cùng phía:** lấy $\max$ của các cận dưới, $\min$ của các cận trên. Ví dụ $\sum_{a=1}^{n}\sum_{b=1}^{n}\sum_{c=\max(a,b)}^{n} f(c)$: đặt $c$ ra ngoài, $a$ và $b$ mỗi biến chạy $1..c$ và độc lập nhau, nên tổng bằng $\sum_{c=1}^{n} f(c)\,c^2$.
- **Hệ số khác 1:** $b \ge 2a + 1$ cho $a \le \lfloor (b-1)/2 \rfloor$. Ví dụ $\sum_{a=1}^{n}\sum_{b=2a+1}^{n} f(b) = \sum_{b=3}^{n} f(b)\lfloor (b-1)/2 \rfloor$, vì cận $a \le n$ thừa.

## Bẫy: khoảng rỗng

$\sum_{x=L}^{R} 1 = R - L + 1$ chỉ đúng khi $R \ge L - 1$. Khi $R < L - 1$ vòng lặp chạy $0$ lần nhưng vế phải âm. Vì vậy khi thay bằng dạng đóng phải giữ nguyên cận ngoài từ B2: chính cận đó bảo đảm mọi khoảng bên trong có $R \ge L - 1$.

Ở ví dụ $b \ge a + 2$, nếu trong cụm trái cho $b$ chạy từ $1$ thay vì $3$ thì $b = 1$ cho $b - 2 = -1$, trong khi $a$ chạy $1..{-1}$ là rỗng và phải cho $0$. Mỗi giá trị $c$ bị trừ oan $1$: với $n = 5$, bản đúng cho $5$, bản sai cho $2$. Nên chạy thử bản cũ và bản mới với $n \le 8$ để bắt lỗi kiểu này.

## Tóm tắt

Ba bước và một phép đếm:

1. **Gom:** mọi cận thành một chuỗi $\le$, hằng số chuyển sang vế trái ($x < y$ thành $x + 1 \le y$).
2. **Cận mới:** viết từng bất đẳng thức, bắc cầu tới khi chỉ còn hằng; biến bên trong đọc từ hai biến kề.
3. **Rút thừa số:** biểu thức không chứa biến của Σ thì ra ngoài; hai cụm có cận không chứa biến của nhau thì nhân.
4. **Đếm $\Sigma 1$:** một biến cho $R - L + 1$, nhiều biến thì đếm từ trong ra ngoài.
5. **Cận rỗng:** giữ cận ngoài từ B2 và chạy thử với $n \le 8$.

## Bài tập tự luyện

Mỗi bài: viết chuỗi $\le$, bắc cầu tìm cận của biến được chọn, biểu diễn các biến còn lại theo biến đó, rồi rút gọn thành một vòng lặp $O(n)$. $g$ là một mảng bất kỳ.

1. **Chuỗi $\le$ cơ bản.** Đưa $j$ ra ngoài cùng: $\sum_{i=1}^{n}\sum_{j=i}^{n}\sum_{k=j}^{n} g(j)$.
2. **Dấu $<$, chỉ số từ $0$.** Đưa $b$ ra ngoài cùng: $\sum_{a=0}^{n-1}\sum_{b=a+1}^{n-1}\sum_{c=b+1}^{n-1} g(b)$.
3. **Có hằng số, cụm nhiều biến.** Đưa $z$ ra ngoài cùng: $\sum_{x=1}^{n}\sum_{y=x}^{n}\sum_{z=y+3}^{n} g(z)$.
4. **Bốn biến, hai cụm hai phía.** Đưa $b$ ra ngoài cùng: $\sum_{a=1}^{n}\sum_{b=a}^{n}\sum_{c=b+1}^{n}\sum_{d=c}^{n} g(b)$.
5. **Không phải chuỗi.** Đưa $c$ ra ngoài cùng: $\sum_{a=1}^{n}\sum_{b=1}^{n}\sum_{c=1}^{\min(a,b)} g(c)$.

<details markdown="1">
<summary>Đáp án</summary>

1. Chuỗi $1 \le i \le j \le k \le n$. Cận $1 \le j \le n$; $i$ chạy $1..j$, $k$ chạy $j..n$. Kết quả $\sum_{j=1}^{n} g(j)\cdot j\cdot(n-j+1)$.
2. Chuỗi $0 \le a$, $a + 1 \le b$, $b + 1 \le c$, $c \le n-1$. Bắc cầu cho $1 \le b \le n-2$; $a$ chạy $0..b-1$ ($b$ giá trị), $c$ chạy $b+1..n-1$ ($n-1-b$ giá trị). Kết quả $\sum_{b=1}^{n-2} g(b)\cdot b\cdot(n-1-b)$.
3. Chuỗi $1 \le x \le y$, $y + 3 \le z \le n$. Bắc cầu cho $4 \le z \le n$; cụm $1 \le x \le y \le z - 3$ đếm từ trong ra ngoài: $\sum_{y=1}^{z-3} y = \frac{(z-3)(z-2)}{2}$. Kết quả $\sum_{z=4}^{n} g(z)\cdot\frac{(z-3)(z-2)}{2}$.
4. Chuỗi $1 \le a \le b$, $b + 1 \le c \le d \le n$. Bắc cầu cho $1 \le b \le n-1$; cụm trái $1 \le a \le b$ có $b$ giá trị; cụm phải $b + 1 \le c \le d \le n$ có $m = n - b$ giá trị cho mỗi biến nên đếm được $\frac{m(m+1)}{2}$ cặp. Kết quả $\sum_{b=1}^{n-1} g(b)\cdot b\cdot\frac{(n-b)(n-b+1)}{2}$.
5. $c \le \min(a,b)$ nghĩa là $c \le a$ và $c \le b$: hai nhánh, không phải một chuỗi. Cận $1 \le c \le n$; $a$ và $b$ mỗi biến chạy $c..n$, độc lập nhau. Kết quả $\sum_{c=1}^{n} g(c)\,(n-c+1)^2$.

</details>

## Luyện thêm

| Bài | Gợi ý |
| --- | --- |
| [2063. Vowels of All Substrings](https://leetcode.com/problems/vowels-of-all-substrings/) | Chạy lại quy trình từ ba vòng lặp $l, r, i$: kết quả là $f(i)(i+1)(n-i)$. |
| [1588. Sum of All Odd Length Subarrays](https://leetcode.com/problems/sum-of-all-odd-length-subarrays/) | Thêm điều kiện $r - l$ chẵn, nên $l$ và $r$ không còn độc lập. Tách theo tính chẵn lẻ của $l$; $r$ phải cùng tính chẵn lẻ: mỗi lớp chẵn lẻ lại là một tích hai cụm độc lập. Số đoạn chứa $i$ là $\big\lceil (i+1)(n-i)/2 \big\rceil$. |
