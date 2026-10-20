---
title: "Băm dạng chuẩn tắc"
description: "Nhận diện bài toán gom nhóm theo quan hệ tương đương, tìm bất biến đầy đủ làm hash key thay vì mô phỏng hay so sánh từng cặp."
date: 2026-10-20 10:15:15 +0700
categories: [algorithm] # e.g. [Blogging, Tutorial] — max 2 levels
tags: [leetcode, hashing, counting, bucket-sort] # e.g. [jekyll, docker] — lowercase
pin: false # true to pin on the home page
toc: true # table of contents
comments: true
math: true # true to enable MathJax
mermaid: false # true to enable Mermaid diagrams
# author: <id> # needs an entry in _data/authors.yml (default: social.name)
# image:
#   path: /assets/img/posts/2026-10-20-bam-dang-chuan-tac/cover.png # recommended 1200x630
#   alt: Cover image description
---

## Băm theo dạng chuẩn tắc (Canonical Hash)

Tên gọi khác: group anagrams, normalize then bucket, signature as map key.

Ý tưởng cốt lõi: thay vì so sánh từng cặp phần tử ($O(n^2)$) hay mô phỏng các phép biến đổi, ta đưa mỗi phần tử về một **dạng chuẩn** (canonical form) sao cho hai phần tử "tương đương" khi và chỉ khi chúng có cùng dạng chuẩn. Dạng chuẩn đó chính là key của hash map, và bài toán thu gọn thành một vòng quét tuyến tính.

## Dấu hiệu nhận biết

- Cần gom nhóm, đếm, hoặc so sánh các phần tử khi chúng "sai khác" nhau một yếu tố nào đó, chẳng hạn khác biệt về thứ tự, phép tịnh tiến, phép dịch chuyển, cách gán nhãn. Mối quan hệ ở đây là quan hệ tương đương (equivalence relation), không phải bằng nhau tuyệt đối.
- Đề bài cho phép thực hiện một thao tác **miễn phí và không giới hạn số lần**, sau đó yêu cầu kiểm tra xem hai đối tượng có thể biến đổi thành nhau không, hoặc hỏi có bao nhiêu kết quả riêng biệt. Khi thấy **không giới hạn** và **miễn phí**, cốt lõi là đi tìm các bất biến (invariant), tuyệt đối đừng mô phỏng (simulate) lặp lại các thao tác.
- Đề bài yêu cầu tìm "có bao nhiêu phần tử **thực sự khác biệt**" hoặc "hãy gom nhóm chúng lại". Do chưa biết trước số lượng nhóm (lớp), cấu trúc dữ liệu phù hợp là Map với key là dạng chuẩn đại diện, thay vì mảng.
- Cần đếm số **cặp tương tự nhau** với $n$ lên đến $10^5$: duyệt so sánh từng cặp chắc chắn quá thời gian. Đáp án phải được tính bằng tổng các tổ hợp chập hai $C(g, 2)$ dựa trên kích thước $g$ của từng nhóm (bucket).
- Điều kiện kiểm tra một cặp phần tử có nhắc đến cả hai chỉ số, nhưng **có thể biến đổi đại số** để tách biệt sao cho mỗi vế của phương trình là một hàm chỉ phụ thuộc riêng vào một phần tử.

## Từ khóa trong đề bài và hướng tư duy

Các dấu hiệu trên mang tính trừu tượng, do đó bảng dưới đây đối chiếu chúng với những từ khóa cụ thể xuất hiện trong đề bài.

| Cụm từ trong đề | Dấu hiệu | Bài |
| --- | --- | --- |
| "**group the anagrams together**" | Gom nhóm theo tiêu chí **khác biệt thứ tự**: đưa từng phần tử về dạng chuẩn (normalize) rồi dùng nó làm key cho map | 49 |
| "We can keep shifting the string in both directions to form an endless shifting sequence" | Phép toán dùng vô hạn lần miễn phí: hãy tìm tính bất biến, đừng cố mô phỏng dịch chuyển | 249 |
| "You can select any non-empty subarray of **arr** and reverse it. You are allowed to make any number of steps" | Phép lặp vô hạn và miễn phí này sinh ra mọi hoán vị, do đó thao tác thực tế không mang thêm thông tin, chỉ cần đếm tần số xuất hiện và so sánh là đủ | 1460 |
| "Transform every occurrence of one existing character into another existing character, and do the same with the other character" | Việc đổi nhãn ký tự là miễn phí nhưng tần suất (count) thì giữ nguyên: bất biến ở đây là cặp (tập ký tự xuất hiện, danh sách tần suất đã sắp xếp) | 1657 |
| "Everything after the first plus sign will be ignored, ... will be forwarded to the same address" | Lời văn của đề bài chính là quy tắc chuẩn hóa: áp dụng quy tắc đó để đưa về dạng chuẩn, đáp án là kích thước của tập hợp | 929 |
| "Count the number of pairs $(i, j)$ such that $i < j$ ... words[i] and words[j] are similar" với $m \cdot n \le 10^5$ | Tương tự là một quan hệ tương đương, nên cần gom nhóm rồi cộng dồn $C(g, 2)$, tuyệt đối không duyệt so sánh từng cặp | 3085 |

## Phân tích tư duy từng bước: Bài 1657

Quá trình suy luận dưới đây minh họa cách tiếp cận mà không cần biết trước đáp án:

1. **Đọc hiểu yêu cầu:** Có hai phép toán được áp dụng vô hạn lần trên chuỗi: đổi chỗ hai ký tự, hoặc hoán đổi nhãn của hai ký tự đang tồn tại. Hỏi `word1` có thể biến đổi thành `word2` không?
2. **Suy nghĩ đầu tiên — Mô phỏng (simulate) hoặc duyệt theo chiều rộng (BFS):** Chỉ riêng phép 1 đã có thể sinh ra mọi hoán vị của chuỗi độ dài $10^5$, trong khi phép 2 tạo ra tới $26!$ cách đổi nhãn. Không gian trạng thái quá lớn để duyệt. Cụm từ "thực hiện bao nhiêu lần tùy ý" là tín hiệu bắt buộc phải ngừng mô phỏng và đi tìm tính bất biến (invariant).
3. **Suy nghĩ thứ hai — Dùng kỹ thuật anagram (sắp xếp và so sánh):** Bị bác bỏ ngay bởi Ví dụ 3: `word1 = "cabbba"` sắp xếp thành `"aabbbc"`, `word2 = "abbccc"` sắp xếp thành `"abbccc"`. Dù kết quả sắp xếp khác nhau, đáp án đúng vẫn là `true`. Vì phép 2 cho phép đổi nhãn, tần suất gắn với từng ký tự cụ thể không phải là bất biến.
4. **Suy nghĩ thứ ba — Chỉ cần tập các tần suất đếm (counts):** `"cabbba"` có tần suất `{c:1, a:2, b:3}` → `[1, 2, 3]`; `"abbccc"` có tần suất `{a:1, b:2, c:3}` → `[1, 2, 3]`. Dữ liệu khớp nhau, trả về `true` (thỏa mãn Ví dụ 3). Tuy nhiên, xét phản ví dụ: `word1 = "aab"`, `word2 = "ccd"`. Cả hai đều cho ra `[1, 2]`, nhưng đáp án đúng phải là `false` — do phép 2 chỉ hoán đổi nhãn giữa các ký tự đã tồn tại, nên `'a'` không thể biến thành `'c'`. Key phân loại này quá thô.
5. **Điểm mấu chốt:** Hãy tự hỏi mỗi phép toán **không thể** thay đổi điều gì. Phép 1 chỉ thay đổi vị trí: tập các loại ký tự và tập tần suất được giữ nguyên. Phép 2 hoán đổi tần suất giữa hai ký tự đang có: tập các loại ký tự và tập tần suất cũng được giữ nguyên. Vậy cặp (tập ký tự phân biệt, danh sách tần suất đã sắp xếp) chính là tính bất biến — và nó đầy đủ, vì khi cả hai yếu tố khớp nhau, ta chỉ cần đổi nhãn cho các ký tự có cùng tần suất rồi hoán vị vị trí là xong.
6. **Cách triển khai:** Khởi tạo hai mảng `int[26]`. So sánh xem loại ký tự nào có mặt ở hai bên; sau đó sắp xếp hai mảng tần suất và so sánh chúng. Không cần kiểm tra độ dài riêng, vì khi danh sách tần suất bằng nhau thì độ dài chuỗi bắt buộc bằng nhau (như Ví dụ 2, `"a"` và `"aa"` sẽ sai ngay từ bước so sánh `[1]` với `[2]`).
7. **Đánh giá giải pháp:** Độ phức tạp $O(n + 26 \log 26)$, bộ nhớ rất nhỏ và không mô phỏng bất cứ bước nào. Toàn bộ cốt lõi bài toán chỉ là tìm ra đúng key.
8. **Bài học rút ra:** Khi các thao tác là miễn phí và không giới hạn, hãy xác định mỗi thao tác bảo toàn những thuộc tính nào, rồi gom các thuộc tính đó thành một bộ (tuple) để làm hash key. Tiếp theo, hãy cố "tìm lỗ hổng" của key bằng cách tạo ra hai đầu vào có cùng key nhưng kết quả thực tế phải khác nhau. Nếu tìm được, key chưa đủ chặt (cần bổ sung thông tin); nếu mọi nỗ lực đều thất bại vì lý do logic rõ ràng, key đã hoàn thiện.

## Quy trình chung

- **Xác định tính chất quan hệ tương đương** (phản xạ, đối xứng, bắc cầu): Nếu thỏa mãn, các thành phần liên thông chính là các nhóm hash (bucket), và các clique cực đại chính là các lớp (class) — không cần dùng Union-Find hay thuật toán tìm clique (Bài 3839).
- **Xây dựng một bất biến hoàn chỉnh:** Tạo một hàm $f$ sao cho $f(x) = f(y)$ khi và chỉ khi $x \sim y$. Key phải chặt chẽ ở cả hai chiều: key quá thô sẽ khiến các lớp khác nhau bị gộp chung, còn key quá chi tiết sẽ khiến một lớp bị phân mảnh thành nhiều key. Một số mẫu hash thường gặp:
    - Hoán vị vị trí tự do → đưa về dạng đã sắp xếp, hoặc dùng vector tần suất dưới dạng chuỗi.
    - Dịch chuyển/quay/chênh lệch toàn cục → neo một tọa độ về một mốc hằng số (ví dụ dịch sao cho ký tự đầu luôn là `'a'`), tạo thành dãy chênh lệch.
    - Hoán vị vị trí kết hợp hoán đổi nhãn → dùng cặp (tập ký tự xuất hiện, danh sách tần suất đã sắp xếp).
    - Tịnh tiến một hình dạng → tính tọa độ tương đối so với điểm neo (anchor).
    - Cấu trúc lồng nhau hoặc cây → serialize thành chuỗi với dấu ngoặc rõ ràng và đánh dấu node null.
    - Hoán đổi phần tử ở khoảng cách $d$ cố định → tách theo lớp thặng dư modulo $d$, mỗi quỹ đạo dùng một multiset riêng.
    - Có quy tắc biến đổi tất định trên từng ký hiệu → chỉ cần áp dụng quy tắc đó rồi lấy kết quả làm dạng chuẩn.
    - Điều kiện đại số trên một cặp → chuyển tất cả các số hạng liên quan đến $i$ sang một vế, ví dụ $f(x) = x - \text{rev}(x)$.
- **Gom nhóm trong một vòng lặp duy nhất:** Dùng `map.computeIfAbsent(key, k -> new ArrayList<>()).add(item)` nếu cần lưu chi tiết các nhóm, hoặc `map.merge(key, 1, Integer::sum)` nếu chỉ cần đếm số lượng.
- **Tổng hợp kết quả từ các nhóm:** Số bucket tương ứng với số lớp. Các bucket có kích thước $\ge 2$ chứa phần tử trùng lặp hoặc nhóm hợp lệ. Công thức $\sum g(g - 1)/2$ dùng để tính số cặp tương đương.

## Tại sao phương pháp này hiệu quả?

- Dạng chuẩn tắc (canonical form) bản chất là một bất biến hoàn chỉnh, nên hai key bằng nhau tương đương hoàn toàn với việc hai phần tử có quan hệ với nhau. Sự đồng nhất này cho phép thay việc kiểm tra chéo từng cặp tốn $O(n^2)$ bằng một vòng quét tuyến tính duy nhất.
- Mọi lỗi sai khi áp dụng mẫu hình này đều xuất phát từ việc bất biến không thỏa mãn ở một trong hai chiều:
    - **Gộp quá đà** (các lớp khác nhau sinh cùng một key): Để tránh điều này khi serialize cây thành chuỗi, cần dấu ngoặc và marker cho node null; nếu thiếu, một node chỉ có nhánh trái sẽ bị mã hóa giống hệt một node chỉ có nhánh phải.
    - **Gộp chưa tới** (một lớp bị tách thành nhiều key): Xảy ra khi chuẩn hóa chuỗi dịch vòng mà không wrap modulo 26, hoặc khi thứ tự duyệt các ô của một "hòn đảo" không cố định — hai hình giống nhau nhưng duyệt khác thứ tự sẽ ra key khác nhau và bị đếm thành hai.
- Với các bài hỏi "có thể biến đổi thành nhau không", nền tảng luôn là lý thuyết nhóm (group theory): các thao tác cho phép sinh ra một nhóm tác động lên đối tượng. "Biến đổi thành" nghĩa là hai đối tượng nằm trong **cùng một quỹ đạo**, do đó đáp án là so sánh bất biến quỹ đạo của hai vế — không dùng thuật toán tìm kiếm trên không gian trạng thái.
    - Phép đảo mảng con sinh ra toàn bộ nhóm đối xứng (symmetric group), nên mọi hoán vị đều đạt được; thao tác lúc này chỉ là hư danh, điều kiện khả thi chỉ là so sánh hai multiset tần suất (Bài 1460).
    - Việc đổi chỗ ở khoảng cách $d$ sinh ra nhóm đối xứng bên trong mỗi lớp thặng dư modulo $d$ mà không có sự giao thoa giữa các lớp, nên bất biến là multiset ký tự của từng lớp thặng dư (Bài 2839, 2840).
    - Việc đổi chỗ kết hợp đổi nhãn theo cặp bảo toàn đúng hai yếu tố: những ký tự nào đang tồn tại, và multiset các con số tần suất. Đổi nhãn chỉ tráo tần suất giữa các ký tự chứ không sinh ra hay xóa đi ký tự nào, vì vậy bất biến đầy đủ là `(keySet, sorted values)` (Bài 1657).
    - Với Bài 1814, điều kiện `nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])` sau khi chuyển vế không còn là tính chất của một cặp nữa; nó trở thành phép so sánh key của từng phần tử độc lập: $x - \text{rev}(x)$.

## Những cạm bẫy thường gặp

- **Key sau khi serialize phải đơn ánh (injective).** Khi nối chuỗi, phải có dấu phân cách cùng marker cho node con rỗng; một chuỗi duyệt tiền thứ tự (preorder) nối bằng dấu phẩy nhưng thiếu marker sẽ bị trùng key (Bài 652).
- **Mảng trong Java không dùng trực tiếp làm hash key được.** `int[]` dùng `hashCode`/`equals` theo địa chỉ bộ nhớ (identity), nên `HashSet<List<int[]>>` không lọc được trùng — mỗi hình đều bị coi là khác nhau (Bài 694). Hãy dùng `String`, `List<Integer>`, hoặc một hàm ghép số nguyên (pairing function) đảm bảo đơn ánh.
- **Chuẩn hóa phép tịnh tiến phải xử lý cuộn vòng (wrap modulo).** Nếu không, giá trị ký tự có thể bị trừ xuống dưới `'a'`, khiến một lớp bị xé nhỏ thành nhiều lớp (Bài 249, 3805).
- **Chỉ chuẩn hóa đúng thành phần được yêu cầu.** Nếu luật chỉ áp dụng cho một phần chuỗi, cần tách chuỗi trước khi xử lý (Bài 929: chỉ xóa dấu chấm và phần sau dấu `+` ở phần local name, không đụng đến tên miền).
- **Key dạng chuỗi đã sắp xếp tốn $O(k \log k)$ mỗi phần tử.** Với phần tử dài, giải pháp $O(k)$ là đếm tần suất vào mảng 26 ký tự rồi sinh chuỗi từ mảng đó (Bài 49).
- **Rolling hash mang tính xác suất.** Hãy chọn cơ số (base) lớn hơn miền giá trị và modulo đủ lớn; chuyển sang Trie nếu cần kết quả chính xác tuyệt đối (Bài 2261).
- **Đếm cặp cần multiset, không phải set.** Tổng số cặp hoặc kích thước nhóm đòi hỏi số lượng phần tử trong bucket; nếu lưu key vào `HashSet`, các phần tử trùng sẽ âm thầm bị loại bỏ (Bài 3839, 3805).
- **Bài 149 tránh lỗi số thực của độ dốc** bằng cách biểu diễn đường thẳng dạng số nguyên chuẩn: $a = y_1 - y_2$, $b = x_2 - x_1$, $c = -a x_1 - b y_1$, sau đó chia cả ba cho $\gcd(a, b, c)$ và chuẩn hóa dấu để mỗi đường thẳng chỉ có một biểu diễn. Cách này loại bỏ sai số dấu phẩy động và trường hợp chia cho 0 (đường thẳng đứng), nhưng phải lưu map cho toàn bộ $O(n^2)$ đường thẳng. Cách phổ biến hơn là cố định từng điểm gốc và hash độ dốc dạng phân số $(dy/g, dx/g)$ đã tối giản qua gcd.
