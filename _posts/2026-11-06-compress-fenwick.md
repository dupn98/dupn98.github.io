---
title: "Nén tọa độ và cây Fenwick"
description: "Khung chuẩn cho bài toán đếm cặp i < j theo một chiều so sánh khi giá trị quá lớn: tuyến tính hóa điều kiện, nén tọa độ, đếm bằng Fenwick tree; kèm segment tree dạng lặp."
date: 2026-11-06 14:37:31 +0700
categories: [algorithm]
tags: [leetcode, fenwick-tree, coordinate-compression, segment-tree]
pin: false
toc: true
comments: true
math: true
mermaid: false
---

## Giới thiệu

Bản chất kỹ thuật: **nén tọa độ + cây Fenwick (BIT)**. Đây là bộ khung chuẩn để giải các bài toán đếm cặp $i < j$ (biến thể của đếm nghịch thế) khi giá trị cần so sánh vượt quá giới hạn bộ nhớ, không thể dùng trực tiếp làm chỉ số mảng.

## Dấu hiệu nhận diện

- Kích thước $N$ đến $10^5$, đi kèm giá trị $v$ đến $10^9$.
- Bản chất yêu cầu: đếm các cặp phần tử theo một chiều so sánh (lớn hơn, nhỏ hơn).
- So sánh tỷ lệ/trung bình trên subarray: đề yêu cầu đếm mảng con thỏa mãn một phân số (ví dụ $x / y \le a / b$) hoặc có công thức trừ đi một số hạng tịnh tiến theo chỉ số.
- Thuộc tính nhị phân: phép đếm có kèm điều kiện phụ (cùng màu, cùng tính chẵn lẻ) là dấu hiệu dùng nhiều cây BIT song song.

## Kỹ thuật cốt lõi: tuyến tính hóa phân số

Toàn bộ độ khó của dạng này thường nằm ở bước biến đổi toán học đầu tiên; phần cấu trúc dữ liệu phía sau chỉ là khuôn mẫu cài đặt. Khi đề yêu cầu so sánh hai phân số (mẫu dương), luôn nhân chéo để triệt tiêu phép chia.

Giả sử cần đếm subarray có tỷ lệ phần tử chẵn ($x$) trên lẻ ($y$) không vượt quá $a / b$:

$$\frac{x}{y} \le \frac{a}{b} \iff b x \le a y$$

Thay $x = E(r) - E(l)$ (với $E(i)$ là số phần tử chẵn trong $i$ phần tử đầu) và $y = (r - l) - x$, đẩy các số hạng chứa $r$ về một vế và $l$ về vế kia:

$$(a + b)E(r) - a r \le (a + b)E(l) - a l$$

Đặt $A[i] = (a + b)E(i) - a i$, bài toán quy về đếm cặp $l < r$ sao cho $A[r] \le A[l]$.

## Khuôn mẫu triển khai

Khi đã có mảng dẫn xuất $A$, thuật toán luôn theo 4 bước:

1. **Nén tọa độ:** clone mảng $A$, sort, loại trùng, lấy rank bằng binary search. Việc loại trùng giúp các giá trị rơi chính xác vào rank, không cần cộng trừ epsilon.
2. **Xác định chiều quét:** quét trái sang phải nếu đối tác hợp lệ đứng trước, ngược lại quét phải sang trái.
3. **Query trước, update sau:** query trên BIT để lấy số đối tác thỏa mãn, sau đó mới update phần tử hiện tại vào BIT.
4. **Cài Fenwick tree với index bắt đầu từ 1.**

```java
long countPairs(long[] A) {
    long[] sorted = Arrays.stream(A).sorted().distinct().toArray();
    int m = sorted.length;
    int[] bit = new int[m + 1];
    long count = 0;
    for (int r = 0; r < A.length; r++) {
        int rank = Arrays.binarySearch(sorted, A[r]) + 1; // 1-based
        // đếm l < r với A[l] >= A[r] = số đã thêm - số có rank < rank hiện tại
        count += r - prefix(bit, rank - 1);
        for (int i = rank; i <= m; i += i & -i) bit[i]++;
    }
    return count;
}

int prefix(int[] bit, int i) {
    int s = 0;
    for (; i > 0; i -= i & -i) s += bit[i];
    return s;
}
```

## Bẫy thực chiến

- **Tràn số tại mảng dẫn xuất:** nhân $(a + b)$ với $10^5$ dễ vượt mốc 2 tỷ. Viết `(long)(a + b) * count` trong Java thì phép cộng vẫn tính trên `int` rồi mới cast, có thể tràn ngầm. Phải viết `((long) a + b) * count`.
- **Mảng prefix phải có size $N + 1$:** vòng lặp duyệt cặp phải xuất phát từ index 0 để bao hàm các subarray bắt đầu từ phần tử đầu tiên của mảng gốc.
- **Nén sai đối tượng:** phải nén tọa độ trên mảng đã biến đổi ($A$), không nén mảng đầu vào (`nums`).
- **Nhầm hệ tọa độ rank:** chọn một quy ước duy nhất (thường là 1-based) và bám chặt vào nó để tránh lỗi lệch một (off-by-one).

## Cài segment tree dạng lặp

Segment tree tính kết quả phép toán (sum, min, max, xor...) trên đoạn $[l, r]$ trong $O(\log n)$ thay vì vòng for $O(n)$.

**Sơ đồ bộ nhớ: gốc là 1, lá ở nửa sau.**

- Kích thước $2N$, bỏ qua index 0.
- Gốc luôn là 1.
- Lá nằm từ $N$ đến $2N - 1$; mọi thao tác bắt đầu bằng việc nhảy xuống lá: `pos += n`.
- Quan hệ: cha `i / 2`, con trái `2 * i`, con phải `2 * i + 1`.

**Build** khi mảng gốc có sẵn:

```java
public IterativeSegmentTree(int[] arr) {
    n = arr.length;
    tree = new int[2 * n];
    // 1. Đặt mảng gốc vào vị trí các lá (từ n đến 2n - 1)
    for (int i = 0; i < n; i++) {
        tree[n + i] = arr[i];
    }
    // 2. Build ngược từ dưới lên (từ n - 1 lùi về 1)
    for (int i = n - 1; i > 0; i--) {
        tree[i] = tree[2 * i] + tree[2 * i + 1];
    }
}
```

**Update: cộng ở lá, chia 2 đi lên gốc.** Nhảy xuống lá, cập nhật, rồi liên tục chia 2 để lên cha, dừng khi đã qua gốc.

```java
public void update(int pos, int val) {
    pos += n;
    tree[pos] += val;
    while (pos > 1) {
        pos /= 2;
        tree[pos] = tree[2 * pos] + tree[2 * pos + 1];
    }
}
```

**Query $[l, r]$: trái lẻ, phải chẵn thì lấy rồi nhích vào trong.**

- Nhảy xuống hai lá: `l += n`, `r += n`, kẹp hai biên rồi dồn lên trên khi `l <= r`.
- `l` lẻ: lấy `tree[l]` rồi `l++`.
- `r` chẵn: lấy `tree[r]` rồi `r--`.

```java
public int query(int l, int r) {
    l += n;
    r += n;
    int sum = 0;
    while (l <= r) {
        if (l % 2 == 1) sum += tree[l++];
        if (r % 2 == 0) sum += tree[r--];
        l /= 2;
        r /= 2;
    }
    return sum;
}
```

Phần tử trung tính khi đổi phép toán:

| Phép toán | Phần tử trung tính |
| --- | --- |
| cộng, xor, or, gcd | `0` |
| nhân | `1` |
| max | `Integer.MIN_VALUE` |
| min | `Integer.MAX_VALUE` |
| and | `-1` (tức `~0`) |
