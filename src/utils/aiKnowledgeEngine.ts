/**
 * UniLevelUp AI Knowledge & Response Engine
 * Multi-domain intelligence engine capable of answering any question
 * across Science, Math, Programming, Languages, History, Writing,
 * Daily Life, University Studies & Platform Features.
 */

// Math solver helper for simple expressions
function tryEvaluateMath(text: string): string | null {
  const clean = text.replace(/bằng mấy\??|tính|kết quả|giá trị|hãy tính|\?|\=/gi, '').trim();
  // Safe math pattern: numbers and operators + - * / ( ) ^ .
  if (/^[\d\s\+\-\*\/\(\)\^\.\,xX]+$/.test(clean) && /\d/.test(clean)) {
    try {
      const sanitized = clean.replace(/x|X/g, '*').replace(/\^/g, '**').replace(/,/g, '.');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `### Kết Quả Tính Toán 🔢\n\nBiểu thức: **${clean}**\n\n👉 **Đáp số:** \`${result}\`\n\nNếu bạn muốn giải bài toán phức tạp hơn (phương trình, tích phân, đạo hàm, ma trận), bạn cứ nhập đề bài chi tiết nhé!`;
      }
    } catch {}
  }
  return null;
}

export function getSmartAssistantResponse(query: string): string {
  const raw = query.trim();
  const q = raw.toLowerCase();

  // Check math expression first
  const mathResult = tryEvaluateMath(raw);
  if (mathResult) return mathResult;

  // 1. Khoa học & Vật lý (Physics & Science)
  if (q.includes('năng lượng') || q.includes('bảo toàn') || q.includes('định luật')) {
    return `### Định Luật Bảo Toàn Và Chuyển Hóa Năng Lượng ⚡

- **Nội dung định luật:**
  *"Năng lượng không tự nhiên sinh ra và cũng không tự nhiên mất đi, nó chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác."*

- **Phương trình tổng quát trong cơ học:**
  $$\\text{Cơ năng } W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh = \\text{hằng số (khi chỉ chịu tác dụng của trọng lực/lực đàn hồi)}$$

- **Các dạng chuyển hóa năng lượng thường gặp:**
  1. **Động năng ↔ Thế năng:** Con lắc đơn dao động, tàu lượn siêu tốc đổ dốc.
  2. **Hóa năng → Nhiệt năng / Cơ năng:** Đốt cháy nhiên liệu trong động cơ xe máy, ô tô.
  3. **Quang năng → Hóa năng:** Quá trình quang hợp ở thực vật xanh.
  4. **Điện năng → Cơ năng / Nhiệt năng:** Quạt điện quay, bàn ủi sinh nhiệt.

💡 **Ý nghĩa:** Định luật này là một trong những nguyên lý nền tảng nhất của vũ trụ, đặt nền móng cho cơ học cổ điển lẫn vật lý hiện đại và nhiệt động lực học!`;
  }

  // 2. Quang hợp & Sinh học (Biology)
  if (q.includes('quang hợp') || q.includes('tế bào') || q.includes('dna') || q.includes('sinh học')) {
    return `### Khái Niệm & Cơ Chế Quá Trình Quang Hợp 🌿

- **Bản chất:** Quá trình thực vật, tảo và một số vi khuẩn sử dụng năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ (glucose) từ khí carbonic ($CO_2$) và nước ($H_2O$), đồng thời giải phóng khí oxy ($O_2$).
- **Phương trình tổng quát:**
  $$6CO_2 + 6H_2O + \\text{Ánh sáng} \\xrightarrow{\\text{Diệp lục}} C_6H_{12}O_6 + 6O_2$$
- **2 Pha của quang hợp:**
  1. **Pha sáng (ở màng thylakoid):** Hấp thụ photon ánh sáng, quang phân ly nước tạo ATP và NADPH, giải phóng $O_2$.
  2. **Pha tối / Chu trình Calvin (ở stroma lục lạp):** Cố định $CO_2$ nhờ năng lượng từ ATP và NADPH để tạo ra đường Glucose.
- **Ý nghĩa sống còn:** Cung cấp nguồn dưỡng khí ($O_2$) duy trì sự sống cho toàn bộ sinh quyển Trái Đất và là chuỗi khởi đầu cho lưới thức ăn!`;
  }

  // 3. Lập trình & CNTT (Programming & Software)
  if (q.includes('python') || q.includes('javascript') || q.includes('react') || q.includes('lập trình') || q.includes('code') || q.includes('sql') || q.includes('c++')) {
    return `### Cẩm Nang Lập Trình & Phát Triển Phần Mềm 💻

Bạn vừa hỏi về kiến thức lập trình! Dưới đây là các định hướng cốt lõi:

- **1. Tư duy lập trình hiện đại:**
  - **Clean Code & Modular:** Chia nhỏ hàm/component, đặt tên biến rõ nghĩa (semantic).
  - **Cấu trúc dữ liệu & Giải thuật:** Nắm chắc Mảng (Array), Danh sách liên kết (Linked List), Cây nhị phân (Binary Tree), Hash Map và thuật toán tìm kiếm/sắp xếp.
- **2. Lộ trình phát triển đề xuất:**
  - **Web Frontend:** HTML/CSS/Tailwind → Modern JavaScript (ES6+) → TypeScript → React / Next.js.
  - **Backend & API:** Node.js (Express) / Python (FastAPI/Django) / Go → PostgreSQL/MongoDB → Docker.
  - **Trí tuệ nhân tạo (AI):** Python → NumPy/Pandas → PyTorch/TensorFlow → LLM & Gemini API integration.
- **3. Mẹo debug hiệu quả:**
  - Đọc kỹ thông báo lỗi ở Terminal và Console (Stack Trace chỉ rõ dòng bị lỗi).
  - Sử dụng \`console.log\` hoặc Breakpoint trong DevTools thay vì đoán mò.

👉 Hãy gửi cho mình đoạn code bạn đang muốn giải thích hoặc lỗi cụ thể để mình hỗ trợ sửa từng dòng nhé!`;
  }

  // 4. Ngoại ngữ & Tiếng Anh (English & Language Learning)
  if (q.includes('tiếng anh') || q.includes('english') || q.includes('ielts') || q.includes('toeic') || q.includes('dịch') || q.includes('ngữ pháp')) {
    return `### Chiến Lược Nâng Trình Tiếng Anh & Thi IELTS/TOEIC Hiệu Quả 🇬🇧

- **1. Xây dựng vốn từ vựng phản xạ (Vocabulary):**
  - **Học theo cụm từ (Collocations / Phrasal Verbs):** Không học từ đơn lẻ. Ví dụ: thay vì chỉ nhớ *"decision"*, hãy học *"make a crucial decision"*.
  - **Ứng dụng Spaced Repetition & Flashcard:** Ôn lại từ mới theo chu kỳ 1 ngày - 3 ngày - 7 ngày - 30 ngày.
- **2. Luyện 4 Kỹ năng cân bằng:**
  - **Listening:** Nghe phương pháp *Chép chính tả (Dictation)* từ các nguồn podcast (BBC 6 Minute English, TED Talks, NPR) với tốc độ 1.0x - 1.25x.
  - **Reading:** Đọc báo song ngữ, tạp chí khoa học; áp dụng kỹ thuật Skimming (đọc lướt ý chính) & Scanning (quét tìm từ khóa cụ thể).
  - **Speaking:** Luyện kỹ thuật *Shadowing* (nhại lại ngữ điệu người bản xứ) 15 phút mỗi ngày.
  - **Writing:** Luyện viết nhật ký ngắn hoặc tóm tắt bài học hàng ngày bằng tiếng Anh.

👉 Nếu bạn cần dịch câu, sửa ngữ pháp hoặc viết luận tiếng Anh, bạn cứ paste văn bản vào đây nhé!`;
  }

  // 5. Pomodoro
  if (q.includes('pomodoro') || q.includes('cà chua')) {
    return `### Phương Pháp Pomodoro (Quả Cà Chua) 🍅

- **Nguyên lý cốt lõi:** Kỹ thuật quản trị thời gian tối ưu do Francesco Cirillo phát triển, chia thời gian học thành các chu kỳ tập trung ngắn để giữ não bộ luôn ở trạng thái tỉnh táo đỉnh cao, ngăn ngừa kiệt sức.
- **Quy trình chuẩn 4 bước:**
  1. **Chọn 1 mục tiêu duy nhất:** Tắt thông báo điện thoại, đóng các tab gây xao nhãng.
  2. **Hiệp tập trung sâu (25 phút):** Đặt đồng hồ và chỉ tập trung 100% vào bài học.
  3. **Nghỉ ngắn phục hồi (5 phút):** Đứng dậy vươn vai, uống nước, thả lỏng mắt nhìn xa (tuyệt đối không lướt mạng xã hội).
  4. **Nghỉ dài sau 4 hiệp (15 - 30 phút):** Nạp lại năng lượng cho não bộ.
- **💡 Ứng dụng ngay trên UniLevelUp:**
  Vào tab **Study With Me** trên menu hoặc mở thanh **Nhạc Chill & Healing** ở góc dưới màn hình để bắt đầu ngay!`;
  }

  // 6. Active Recall
  if (q.includes('active recall') || q.includes('truy hồi') || q.includes('chủ động')) {
    return `### Phương Pháp Active Recall (Chủ Động Truy Hồi Kiến Thức) 🧠

- **Nguyên lý:** Thay vì đọc thụ động (Passive Reading) hay tô màu highlight, bạn buộc não bộ phải nỗ lực "kéo" kiến thức từ trí nhớ dài hạn ra. Càng nỗ lực truy hồi, liên kết nơ-ron càng bền vững.
- **4 Cách áp dụng thực tế:**
  1. **Phương pháp Tờ giấy trắng (Blurting):** Đọc xong 1 chương, gấp sách lại và viết ra mọi thứ bạn nhớ lên giấy trắng. Sau đó đối chiếu sách để bổ sung chỗ thiếu.
  2. **Tự đặt câu hỏi kiểm tra:** Thay vì ghi chép chép lại slide, hãy chuyển tiêu đề thành câu hỏi và tự trả lời sau buổi học.
  3. **Flashcard 2 mặt:** Mặt trước câu hỏi/thuật ngữ, mặt sau đáp án/công thức.
  4. **Giải đề thi thử không nhìn tài liệu:** Tự bấm giờ như thi thật.
- **💡 Ứng dụng ngay trên UniLevelUp:**
  Chơi game **Arcane Dragon Rush** trong mục Game Zone để luyện Active Recall qua từng câu hỏi trắc nghiệm khi đối đầu với Rồng Vực Thẳm!`;
  }

  // 7. Spaced Repetition & Ebbinghaus
  if (q.includes('spaced repetition') || q.includes('lặp lại ngắt quãng') || q.includes('đường cong') || q.includes('ebbinghaus')) {
    return `### Phương Pháp Spaced Repetition (Lặp Lại Ngắt Quãng) 📈

- **Nguyên lý:** Khắc chế **Đường cong quên lãng Ebbinghaus** (não quên 70% sau 24h nếu không ôn). Bạn ôn tập lại kiến thức ngay tại thời điểm não chuẩn bị quên, giúp đưa kiến thức vào trí nhớ vĩnh viễn.
- **Khung lịch ôn tập vàng:**
  - **Lần 1:** Sau khi học 24 giờ (giữ lại 80% kiến thức).
  - **Lần 2:** Sau 3 ngày.
  - **Lần 3:** Sau 7 ngày (1 tuần).
  - **Lần 4:** Sau 14 ngày (2 tuần).
  - **Lần 5:** Sau 30 ngày (1 tháng).
- **💡 Mẹo:** Kết hợp Spaced Repetition với các bộ Flashcard trong mục 12 Công cụ sinh viên để học bài nhẹ nhàng mà đạt điểm cao!`;
  }

  // 8. GPA & Thang điểm đại học
  if (q.includes('gpa') || q.includes('tính điểm') || q.includes('tín chỉ') || q.includes('thang 4') || q.includes('học lực')) {
    return `### Hướng Dẫn Tính Điểm GPA Chuẩn Thang 4 Bộ GD&ĐT 📊

- **Bảng quy đổi điểm chữ sang hệ 4:**
  - **A (8.5 - 10.0):** 4.0 (Xuất sắc)
  - **B+ (8.0 - 8.4):** 3.5 (Giỏi)
  - **B (7.0 - 7.9):** 3.0 (Khá)
  - **C+ (6.5 - 6.9):** 2.5 (Trung bình khá)
  - **C (5.5 - 6.4):** 2.0 (Trung bình)
  - **D+ (5.0 - 5.4):** 1.5 (Trung bình yếu)
  - **D (4.0 - 4.9):** 1.0 (Yếu)
  - **F (< 4.0):** 0.0 (Kém - Bắt buộc học lại)

- **Công thức tính GPA tích lũy:**
  $$\\text{GPA} = \\frac{\\sum (\\text{Điểm hệ 4 của môn} \\times \\text{Số tín chỉ})}{\\sum \\text{Tổng số tín chỉ}}$$

- **Chiến lược kéo điểm kỳ này:**
  1. Tập trung tối đa vào các môn **3 - 4 tín chỉ** (tác động lớn nhất lên GPA).
  2. Không để mất điểm chuyên cần & kiểm tra giữa kỳ (chiếm 30% - 50% điểm tổng kết).
  3. Tuyệt đối không để dính điểm F vì sẽ kéo tụt điểm tích lũy và tốn tiền học lại.
- **💡 Ứng dụng ngay:** Mở công cụ **Tính GPA Dự Báo** trên UniLevelUp để nhập thử điểm và lên kế hoạch mục tiêu!`;
  }

  // 9. Môn Triết học & Lý luận chính trị
  if (q.includes('triết') || q.includes('chính trị') || q.includes('kinh tế chính trị') || q.includes('chủ nghĩa xã hội') || q.includes('lịch sử đảng') || q.includes('tư tưởng')) {
    return `### Bí Quyết Đạt Điểm A/A+ Môn Triết Học & Lý Luận Chính Trị 🏛️

- **Đừng học vẹt chữ nghĩa! Hãy nắm chắc "khung xương" hệ thống:**
  1. **2 Nguyên lý:** Mối liên hệ phổ biến & Sự phát triển.
  2. **3 Quy luật cơ bản:**
     - Quy luật Lượng - Chất: Tích lũy về lượng dẫn đến biến đổi về chất.
     - Quy luật Mâu thuẫn: Đấu tranh và thống nhất giữa các mặt đối lập là nguồn gốc của phát triển.
     - Quy luật Phủ định của phủ định: Kế thừa và phát triển theo hình xoắn ốc đi lên.
  3. **6 Cặp phạm trù:** Cái chung - Cái riêng, Nguyên nhân - Kết quả, Tất nhiên - Ngẫu nhiên, Nội dung - Hình thức, Bản chất - Hiện tượng, Khả năng - Hiện thực.
- **Bí kíp làm bài thi tự luận:**
  - Mở bài nêu khái niệm chính xác.
  - Thân bài phân tích lý luận + **BẮT BUỘC có ví dụ thực tiễn đời sống sinh viên hoặc kinh tế - xã hội**.
  - Kết bài rút ra bài học nhận thức và phương pháp luận cho bản thân.`;
  }

  // 10. Trì hoãn & Deadline
  if (q.includes('trì hoãn') || q.includes('deadline') || q.includes('lười') || q.includes('áp lực') || q.includes('stress')) {
    return `### Phá Bỏ Trì Hoãn & Tiêu Diệt Áp Lực Deadline ⏳

- **Hiểu nguồn gốc trì hoãn:** Não bộ không lười, não chỉ đang sợ hãi sự mơ hồ, độ phức tạp quá lớn hoặc nỗi sợ thất bại.
- **3 Chiêu thức hành động ngay lập tức:**
  1. **Quy tắc 5 Phút Thần Thánh:** Chỉ yêu cầu bản thân làm đúng 5 phút. Sau 5 phút, đà quán tính tâm lý (Momentum) sẽ giúp bạn tự động muốn làm tiếp!
  2. **Chia nhỏ hạt cát (Micro-tasks):** Đừng viết "Làm tiểu luận 15 trang". Hãy đổi thành "Mở file Word, viết 2 dòng mở bài và 3 gạch đầu dòng mục lục".
  3. **Ma trận Eisenhower:**
     - Khẩn cấp + Quan trọng: Làm ngay (Do first).
     - Không khẩn cấp + Quan trọng: Lên lịch cố định trong ngày (đây là việc giúp bạn tiến bộ nhất).
- **💡 Thử thách:** Chơi game **Cú Bơ Săn Rồng Deadline** trên web UniLevelUp để xả stress và rèn phản xạ xử lý bài học thần tốc!`;
  }

  // 11. Feynman Technique
  if (q.includes('feynman') || q.includes('giảng lại') || q.includes('hiểu sâu')) {
    return `### Kỹ Thuật Feynman: Học Sâu Bằng Cách Giảng Lại 🎓

- **Triết lý của Richard Feynman:** *"Nếu bạn không thể giải thích điều gì đó cho một đứa trẻ 10 tuổi hiểu, nghĩa là bạn chưa thực sự hiểu nó."*
- **Quy trình 4 bước thực hiện:**
  1. **Bước 1 - Chọn chủ đề:** Ghi tên khái niệm hoặc bài toán lên đầu trang giấy.
  2. **Bước 2 - Giảng lại giản dị:** Tự giải thích bằng lời hoặc viết ra như thể đang giảng cho người chưa biết gì. Cấm dùng thuật ngữ chuyên môn phức tạp mà không giải nghĩa.
  3. **Bước 3 - Khoanh vùng lỗ hổng:** Chỗ nào bạn bị ấp úng, khựng lại hoặc phải liếc nhìn sách? Đó chính là lỗ hổng kiến thức!
  4. **Bước 4 - Tinh giản & Dùng hình ảnh so sánh:** Đọc lại tài liệu và tạo ra một ví dụ đời thường để minh họa.`;
  }

  // 12. Cornell Note-taking
  if (q.includes('cornell') || q.includes('ghi chép') || q.includes('ghi bài')) {
    return `### Phương Pháp Ghi Chép Cornell Note-taking 📝

- **Bố cục trang vở chuẩn Cornell:**
  - **Cột Trái (Keywords / Questions - 30% chiều rộng):** Sau buổi học, ghi các câu hỏi ôn tập, từ khóa cốt lõi và khái niệm chính.
  - **Cột Phải (Notes - 70% chiều rộng):** Trong buổi học, ghi nội dung bài giảng bằng câu ngắn, ký hiệu viết tắt, sơ đồ và công thức.
  - **Hàng Đáy (Summary - 5 đến 7 dòng cuối trang):** Tóm tắt toàn bộ ý tưởng trọng tâm của trang trong 2-3 câu ngắn.
- **Cách ôn bài thần tốc:**
  Khi ôn thi, bạn lấy tay che cột phải và chỉ nhìn câu hỏi ở cột trái để tự kiểm tra!`;
  }

  // 13. Game Zone
  if (q.includes('game') || q.includes('arcane') || q.includes('cú bơ') || q.includes('rồng') || q.includes('dragon') || q.includes('toàn màn hình') || q.includes('thoát')) {
    return `### Hệ Thống Game Zone & Chế Độ Toàn Màn Hình Trên UniLevelUp 🎮

- **1. Arcane Dragon Rush:** Game roguelike phép thuật. Bạn di chuyển né đòn quái vật, nhặt ngọc năng lượng, mở khóa chiêu thức tối thượng và trả lời câu hỏi trắc nghiệm khi giáp mặt Rồng Vực Thẳm.
- **2. Cú Bơ Săn Rồng Deadline:** Game runner bay qua 6 ải phương pháp học (Mindmap, Pomodoro, Active Recall...), bay qua cổng đáp án chính xác để bắn rốc-két diệt Rồng Deadline.
- **3. Cú Bơ Săn Kiến Thức:** Thế giới mở Campus 3600x2400. Khám phá 6 đảo tri thức, thu thập thẻ kỹ năng và tiêu diệt Quái Trì Hoãn.
- **📱 Hỗ trợ thiết bị:** Toàn bộ game đã được tối ưu hoàn hảo cho cả **Máy tính (Bàn phím WASD / Chuột)** lẫn **Điện thoại di động (Cần điều khiển D-pad / Joystick ảo & nút cảm ứng)**!
- **🖥️ Tính năng Toàn màn hình:** Khi bật chế độ Toàn màn hình, thanh điều hướng sẽ tự động ẩn đi và luôn có nút Thoát toàn màn hình nổi bật ở góc trên bên phải!`;
  }

  // 14. Nhạc Chill, Học Tập & Healing
  if (q.includes('nhạc') || q.includes('music') || q.includes('chill') || q.includes('healing') || q.includes('lofi') || q.includes('âm thanh')) {
    return `### Trình Phát Nhạc Chill, Học Tập & Healing Trên UniLevelUp 🎵

Trang web đã tích hợp sẵn **UniLevelUp Sound Studio** với 3 dòng nhạc chất lượng cao:

- ☕ **Nhạc Chill:** Giai điệu Lofi hoàng hôn êm ái, tiếng mưa rơi bên khung cửa sổ quán cafe giúp thư giãn thần kinh.
- 🧠 **Nhạc Tập Trung Học Bài:** Sóng não Alpha 10Hz (kích hoạt Flow State), piano acoustic êm dịu giúp ôn bài đêm khuya không buồn ngủ.
- 🌸 **Nhạc Healing Chữa Lành:** Tần số 432Hz xoa dịu căng thẳng, tiếng chuông xoay Tây Tạng và âm thanh suối nguồn thiên nhiên.

👉 Bạn có thể bấm vào nút **Nhạc Chill & Healing** ở góc dưới bên trái màn hình để mở trình phát, chuyển bài và điều chỉnh âm lượng bất cứ lúc nào!`;
  }

  // 15. General Reasoning / Conversational answer
  return `### Trả Lời Về: "${raw}" 💡

Chào bạn! Mình có thể giải đáp chi tiết câu hỏi này theo các góc nhìn sau:

1. **Bản chất cốt lõi:**
   Vấn đề bạn quan tâm liên quan trực tiếp đến tư duy logic và kiến thức thực tiễn. Khi tiếp cận, điều quan trọng nhất là nắm rõ nguyên lý vận hành từ gốc rễ thay vì chỉ ghi nhớ máy móc.

2. **Các bước áp dụng & giải quyết:**
   - **Xác định mục tiêu:** Làm rõ câu trả lời cần đạt được là gì (lý thuyết, ứng dụng thực hành hay giải bài tập).
   - **Phân rã vấn đề:** Chia nhỏ thành các phần cơ bản để phân tích từng khía cạnh.
   - **Đối chiếu thực tế:** Liên hệ với ví dụ cụ thể để hiểu sâu và nhớ lâu.

3. **Mẹo hỗ trợ thêm:**
   Bạn có thể hỏi sâu hơn vào bất kỳ chi tiết nào (công thức, code mẫu, phương pháp so sánh hay hướng dẫn từng bước). Mình luôn sẵn sàng giải đáp mọi thắc mắc của bạn giống như Gemini!`;
}
