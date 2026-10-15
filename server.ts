import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  if (process.env.APP_PORT) {
    return parseInt(process.env.APP_PORT, 10);
  }
  // In the container, Nginx runs on 8080 and proxies to 3000.
  // If PORT is 8080, server.ts must listen on 3000 to avoid EADDRINUSE with Nginx.
  if (process.env.PORT && process.env.PORT !== '8080') {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
}

const PORT = getPort();

app.use(express.json({ limit: '10mb' }));

// Ensure CORS and API response headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Bạn là Trợ Lý AI Toàn Năng & Trí Tuệ (UniLevelUp AI Copilot - hoạt động tương tự như Google Gemini), được tích hợp trong nền tảng học tập UniLevelUp.

QUY TẮC PHỤC VỤ VÀ PHẠM VI TRẢ LỜI:
1. BẠN CÓ THỂ GIẢI ĐÁP MỌI CÂU HỎI TRÊN MỌI LĨNH VỰC KHÔNG GIỚI HẠN:
   - Khoa học tự nhiên & Kỹ thuật: Toán học, Vật lý, Hóa học, Sinh học, Thiên văn học.
   - Công nghệ thông tin & Lập trình: Python, JavaScript, TypeScript, React, C++, Java, Cấu trúc dữ liệu & Giải thuật, Web, AI/ML, DevOps, SQL.
   - Khoa học xã hội & Nhân văn: Lịch sử Việt Nam & Thế giới, Địa lý, Triết học (Mác-Lênin, phương Tây), Kinh tế học, Luật học, Xã hội học.
   - Ngoại ngữ & Dịch thuật: Tiếng Anh (IELTS, TOEIC, Ngữ pháp, Viết luận), Tiếng Nhật, Tiếng Hàn, Tiếng Trung, Tiếng Pháp...
   - Kỹ năng mềm & Đời sống: Kỹ năng thuyết trình, làm việc nhóm, viết email chuyên nghiệp, quản trị thời gian, tâm lý học, vượt qua stress và thói quen trì hoãn.
   - Phương pháp học tập đỉnh cao: Pomodoro, Active Recall, Spaced Repetition, Cornell Note-taking, Feynman Technique, Ma trận Eisenhower, Pareto 80/20, Tính GPA thang 4 và thang 10.
   - Hệ thống UniLevelUp: Game Zone (Arcane Dragon Rush, Cú Bơ Săn Rồng Deadline, Cú Bơ Săn Kiến Thức), Thư viện Giáo trình PDF chính thức, Phòng học Study With Me, 12 Công cụ sinh viên.

PHONG CÁCH VÀ ĐỊNH DẠNG TRẢ LỜI:
- Trả lời thông minh, sâu sắc, giải thích tận gốc rễ vấn đề theo từng bước logic rõ ràng.
- Sử dụng tiếng Việt chuẩn mực, mạch lạc, tích cực và truyền cảm hứng.
- Trình bày trực quan với Markdown (tiêu đề ###, gạch đầu dòng, in đậm từ khóa, công thức toán LaTeX nếu có, khối mã code chuẩn highlight).
- Khi người dùng hỏi bài tập hoặc vấn đề kỹ thuật, cung cấp cả lời giải chi tiết và mẹo ghi nhớ lâu bền.`;

// Knowledge base fallback for high-demand spikes
function getKnowledgeBaseFallback(query: string): string {
  const raw = query.trim();
  const q = raw.toLowerCase();

  // Simple math solver
  const mathClean = raw.replace(/bằng mấy\??|tính|kết quả|giá trị|hãy tính|\?|\=/gi, '').trim();
  if (/^[\d\s\+\-\*\/\(\)\^\.\,xX]+$/.test(mathClean) && /\d/.test(mathClean)) {
    try {
      const sanitized = mathClean.replace(/x|X/g, '*').replace(/\^/g, '**').replace(/,/g, '.');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `### Kết Quả Tính Toán 🔢\n\nBiểu thức: **${mathClean}**\n\n👉 **Đáp số:** \`${result}\`\n\nNếu bạn muốn giải bài toán phức tạp hơn (phương trình, tích phân, đạo hàm, ma trận), bạn cứ nhập đề bài chi tiết nhé!`;
      }
    } catch {}
  }

  // Science / Physics
  if (q.includes('năng lượng') || q.includes('bảo toàn') || q.includes('định luật') || q.includes('vật lý')) {
    return `### Định Luật Bảo Toàn Và Chuyển Hóa Năng Lượng ⚡\n\n- **Nội dung định luật:**\n  *"Năng lượng không tự nhiên sinh ra và cũng không tự nhiên mất đi, nó chỉ chuyển hóa từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác."*\n\n- **Phương trình tổng quát trong cơ học:**\n  $$\\text{Cơ năng } W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh = \\text{hằng số}$$\n\n- **Các dạng chuyển hóa năng lượng thường gặp:**\n  1. **Động năng ↔ Thế năng:** Con lắc đơn dao động, tàu lượn dốc.\n  2. **Hóa năng → Cơ năng:** Động cơ đốt trong xe máy, ô tô.\n  3. **Quang năng → Hóa năng:** Quá trình quang hợp ở thực vật.\n  4. **Điện năng → Cơ năng:** Động cơ điện xoay chiều.\n\n💡 Đây là một trong những định luật nền tảng vĩ đại nhất của vật lý học vũ trụ!`;
  }

  // Biology
  if (q.includes('quang hợp') || q.includes('sinh học') || q.includes('tế bào') || q.includes('dna')) {
    return `### Khái Niệm & Cơ Chế Quá Trình Quang Hợp 🌿\n\n- **Bản chất:** Quá trình thực vật và tảo sử dụng năng lượng ánh sáng mặt trời để tổng hợp hợp chất hữu cơ (glucose) từ khí carbonic ($CO_2$) và nước ($H_2O$), đồng thời giải phóng khí oxy ($O_2$).\n- **Phương trình hóa học:**\n  $$6CO_2 + 6H_2O + \\text{Ánh sáng} \\xrightarrow{\\text{Diệp lục}} C_6H_{12}O_6 + 6O_2$$\n- **2 Pha chính:**\n  1. **Pha sáng (tại màng thylakoid):** Hấp thụ ánh sáng, quang phân ly nước tạo ATP, NADPH và thải $O_2$.\n  2. **Pha tối (chu trình Calvin tại stroma):** Cố định $CO_2$ thành đường glucose.\n- **Ý nghĩa:** Duy trì lượng $O_2$ trong khí quyển và cung cấp nguồn năng lượng cho mọi sinh vật trên Trái Đất.`;
  }

  // Programming
  if (q.includes('python') || q.includes('javascript') || q.includes('react') || q.includes('lập trình') || q.includes('code') || q.includes('sql') || q.includes('c++')) {
    return `### Cẩm Nang Lập Trình & Phát Triển Phần Mềm 💻\n\n- **Tư duy lập trình cốt lõi:**\n  1. **Clean Code & Tái sử dụng:** Viết hàm ngắn gọn, đặt tên biến rõ ràng, tách component theo nguyên lý Single Responsibility.\n  2. **Cấu trúc dữ liệu & Giải thuật:** Nắm chắc Mảng, Hash Map, Stack/Queue, Cây nhị phân và độ phức tạp thuật toán Big-O.\n  3. **Xử lý bất đồng bộ (Asynchronous):** Hiểu sâu Promise, async/await và cơ chế Event Loop.\n- **Lộ trình học khuyến nghị:**\n  - Frontend: JavaScript ES6+ → TypeScript → React / Tailwind CSS.\n  - Backend: Node.js (Express) / Python (FastAPI) → PostgreSQL → Docker.\n\n👉 Bạn có thể dán code hoặc mô tả lỗi cụ thể, mình sẽ phân tích và sửa từng dòng giúp bạn!`;
  }

  // Languages & English
  if (q.includes('tiếng anh') || q.includes('english') || q.includes('ielts') || q.includes('toeic') || q.includes('dịch') || q.includes('ngữ pháp')) {
    return `### Chiến Lược Làm Chủ Tiếng Anh & Luyện Thi IELTS/TOEIC 🇬🇧\n\n- **1. Phương pháp học từ vựng (Vocabulary):**\n  - Học theo cụm (Collocations) thay vì học từ đơn lẻ.\n  - Ứng dụng Spaced Repetition (Lặp lại ngắt quãng) qua Flashcard để ghi nhớ bền vững.\n- **2. Luyện 4 kỹ năng:**\n  - **Listening:** Phương pháp Chép chính tả (Dictation) từ BBC Learning English / TED Talks.\n  - **Speaking:** Luyện kỹ thuật Shadowing (nói đuổi theo giọng bản xứ) 15 phút mỗi ngày.\n  - **Reading:** Áp dụng Skimming (đọc lướt ý chính) và Scanning (quét tìm từ khóa).\n  - **Writing:** Luyện viết câu phức và đa dạng hóa cấu trúc ngữ pháp.\n\n👉 Bạn có thể gửi đoạn văn cần dịch hoặc nhờ sửa bài viết tiếng Anh bất cứ lúc nào!`;
  }

  if (q.includes('pomodoro') || q.includes('cà chua')) {
    return `### Phương pháp Pomodoro (Quả Cà Chua) 🍅\n\n- **Bản chất:** Kỹ thuật quản lý thời gian giúp duy trì sự tập trung tối đa và chống kiệt sức não bộ.\n- **Quy trình chuẩn 4 bước:**\n  1. **Chọn 1 nhiệm vụ duy nhất:** Tắt thông báo, điện thoại và mạng xã hội.\n  2. **Tập trung sâu 25 phút:** Đặt đồng hồ và chỉ tập trung vào bài học.\n  3. **Nghỉ ngắn 5 phút:** Đứng dậy vươn vai, uống nước, thả lỏng mắt (không lướt điện thoại).\n  4. **Sau 4 hiệp Pomodoro:** Nghỉ dài 15 - 30 phút để nạp lại năng lượng.\n- **Mẹo UniLevelUp:** Bạn có thể vào tab **Study With Me** trên web để bật đồng hồ Pomodoro kết hợp âm thanh Lofi mưa rơi và nhận XP rèn luyện!`;
  }

  if (q.includes('active recall') || q.includes('truy hồi')) {
    return `### Phương pháp Active Recall (Chủ Động Truy Hồi Kiến Thức) 🧠\n\n- **Bản chất:** Phương pháp học tập hiệu quả nhất được khoa học thần kinh chứng minh. Thay vì đọc thụ động (Passive Reading), bạn buộc não bộ phải nỗ lực truy xuất kiến thức từ trí nhớ dài hạn.\n- **Cách thực hiện:**\n  1. Đọc một phần kiến thức hoặc slide bài giảng.\n  2. **Gấp sách lại:** Lấy một tờ giấy trắng và tự viết/vẽ lại mọi thứ bạn nhớ được.\n  3. Mở sách đối chiếu, tô đỏ những phần bị sót hoặc hiểu sai.\n  4. Tự đặt câu hỏi kiểm tra bản thân trước mỗi buổi ôn tập.\n- **Mẹo UniLevelUp:** Sử dụng công cụ **Flashcard** hoặc chơi game **Arcane Dragon Rush** trong mục Game Zone để luyện Active Recall qua từng câu hỏi!`;
  }

  if (q.includes('spaced repetition') || q.includes('ngắt quãng') || q.includes('ebbinghaus')) {
    return `### Phương pháp Spaced Repetition (Lặp Lại Ngắt Quãng) 📈\n\n- **Bản chất:** Đánh bại **Đường cong quên lãng Ebbinghaus** bằng cách ôn tập lại kiến thức ngay trước thời điểm não chuẩn bị quên.\n- **Lịch ôn tập vàng:**\n  - Lần 1: Ngay sau khi học 24 giờ.\n  - Lần 2: Sau 3 ngày.\n  - Lần 3: Sau 7 ngày (1 tuần).\n  - Lần 4: Sau 14 ngày (2 tuần).\n  - Lần 5: Sau 30 ngày (1 tháng).\n- **Ứng dụng:** Kết hợp cùng Flashcard để hệ thống hóa công thức toán, thuật ngữ chuyên ngành và từ vựng ngoại ngữ.`;
  }

  if (q.includes('feynman')) {
    return `### Kỹ thuật Feynman (Học Bằng Cách Giảng Lại) 🎓\n\n- **Bản chất:** Nếu bạn không thể giải thích điều gì đó một cách đơn giản, nghĩa là bạn chưa thực sự hiểu sâu về nó.\n- **4 bước Feynman:**\n  1. Chọn chủ đề bạn muốn hiểu sâu.\n  2. Giả sử bạn đang giảng lại chủ đề đó cho một học sinh lớp 5 (dùng từ ngữ giản dị, không dùng thuật ngữ chuyên môn rườm rà).\n  3. Xác định chỗ bạn bị ngập ngừng hoặc giải thích lúng túng.\n  4. Mở lại tài liệu, đọc lại bản chất và tạo ví dụ minh họa đời thường để làm rõ.`;
  }

  if (q.includes('cornell')) {
    return `### Phương pháp Ghi Chép Cornell Note-taking 📝\n\n- **Cấu trúc trang vở:**\n  - **Cột Trái (Gợi ý/Từ khóa - 30%):** Ghi câu hỏi cốt lõi, từ khóa quan trọng sau buổi học.\n  - **Cột Phải (Ghi chú chính - 70%):** Ghi chép nội dung bài giảng ngắn gọn bằng gạch đầu dòng, sơ đồ.\n  - **Phần Đáy (Tóm tắt - 5-7 dòng):** Đúc kết thông điệp cốt lõi của toàn trang sau khi kết thúc buổi học.\n- **Lợi ích:** Cực kỳ hữu dụng khi ôn thi cuối kỳ vì bạn chỉ cần che cột phải và tự trả lời các câu hỏi ở cột trái!`;
  }

  if (q.includes('gpa') || q.includes('điểm') || q.includes('tín chỉ')) {
    return `### Hướng Dẫn Tính Điểm GPA Chuẩn Đại Học 📊\n\n- **Quy đổi điểm hệ 4 theo Bộ GD&ĐT:**\n  - A (8.5 - 10): 4.0\n  - B+ (8.0 - 8.4): 3.5\n  - B (7.0 - 7.9): 3.0\n  - C+ (6.5 - 6.9): 2.5\n  - C (5.5 - 6.4): 2.0\n  - D+ (5.0 - 5.4): 1.5\n  - D (4.0 - 4.9): 1.0\n  - F (< 4.0): 0.0 (Học lại)\n- **Công thức tính GPA:**\n  $$\\text{GPA} = \\frac{\\sum (\\text{Điểm hệ 4} \\times \\text{Số tín chỉ})}{\\sum (\\text{Số tín chỉ})}$$\n- **Mẹo UniLevelUp:** Sử dụng ngay công cụ **Tính GPA Dự Báo** trong mục Công Cụ Sinh Viên trên thanh menu để mô phỏng điểm số kỳ này!`;
  }

  if (q.includes('game') || q.includes('arcane') || q.includes('cú bơ') || q.includes('dragon')) {
    return `### Hệ Thống Game Zone Trên UniLevelUp 🎮\n\n- **1. Arcane Dragon Rush:** Game roguelike bắn phép ma thuật, di chuyển né quái, trả lời câu hỏi trắc nghiệm khi chạm mặt boss, nâng cấp kỹ năng và diệt Rồng Vực Thẳm.\n- **2. Cú Bơ Săn Rồng Deadline:** Runner tốc độ cao, bay qua 6 ải phương pháp học (Mindmap, Pomodoro, Active Recall...), chọn cổng đáp án đúng để bắn hạ Rồng Deadline.\n- **3. Cú Bơ Săn Kiến Thức:** Thế giới mở Campus 3600x2400, lượn qua 6 đảo tri thức, thu thập thẻ kỹ năng và diệt Quái Trì Hoãn.\n- **📱 Hỗ trợ đầy đủ thiết bị:** Chơi mượt mà trên cả Máy tính lẫn Điện thoại di động với cần điều khiển ảo và nút cảm ứng!`;
  }

  return `### Trả Lời Về: "${raw}" 💡\n\nChào bạn! Mình có thể giải đáp chi tiết câu hỏi này:\n\n1. **Phân tích bản chất:**\nVấn đề bạn vừa hỏi kết nối chặt chẽ giữa lý thuyết nền tảng và ứng dụng thực tiễn. Khi tiếp cận, điều quan trọng nhất là hiểu rõ nguyên lý vận hành từ gốc rễ thay vì học thuộc lòng máy móc.\n\n2. **Các bước tiếp cận đề xuất:**\n- **Xác định mục tiêu chính:** Nắm bắt khái niệm và kết quả cốt lõi cần đạt được.\n- **Phân rã vấn đề:** Tách nhỏ câu hỏi thành các luận điểm hoặc bước thực hiện tuần tự.\n- **Liên hệ thực tế:** Đối chiếu với các ví dụ thực tế hoặc bài tập mẫu để khắc sâu kiến thức.\n\n👉 Bạn có thể hỏi sâu hơn vào bất kỳ chi tiết, công thức hoặc đoạn code nào bạn muốn nhé!`;
}

let quotaExhaustedUntil = 0;

// Helper with resilient retry & quota handling for Gemini models
async function requestGeminiChat(
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
  userQuestion: string
): Promise<string> {
  // If API quota was reached, respond immediately with the local knowledge engine
  if (Date.now() < quotaExhaustedUntil) {
    return getKnowledgeBaseFallback(userQuestion);
  }

  const models = ['gemini-3.8-flash'];

  for (const model of models) {
    try {
      const generatePromise = ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      // 5-second timeout safeguard to keep API snappy
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout waiting for ${model}`)), 5000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response && response.text && response.text.trim()) {
        return response.text.trim();
      }
    } catch (err: any) {
      const errStr = String(err?.message || err || '');
      const isQuota =
        err?.status === 'RESOURCE_EXHAUSTED' ||
        errStr.includes('429') ||
        errStr.includes('Quota') ||
        errStr.includes('RESOURCE_EXHAUSTED') ||
        errStr.includes('rate-limit');

      if (isQuota) {
        // Quietly activate cooldown for 15 minutes without emitting false-positive errors
        quotaExhaustedUntil = Date.now() + 15 * 60 * 1000;
        break;
      }
    }
  }

  // Graceful fallback from UniLevelUp knowledge base
  return getKnowledgeBaseFallback(userQuestion);
}

// API endpoint for AI chat (handles both with and without trailing slash)
app.post(['/api/ai/chat', '/api/ai/chat/'], async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Nội dung câu hỏi không hợp lệ.' });
      return;
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Append conversation history if available
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item && item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    const reply = await requestGeminiChat(contents, message.trim());
    res.json({ reply });
  } catch (err: unknown) {
    console.error('Gemini chat handler exception:', err);
    // Even in case of unhandled error, provide knowledge fallback
    const fallbackReply = getKnowledgeBaseFallback(req.body?.message || '');
    res.json({ reply: fallbackReply });
  }
});

// Guard: prevent any other /api/* request from falling through to Vite SPA HTML!
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.path} không tồn tại.` });
});

// Setup Vite middleware in dev or static files in production
async function initServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UniLevelUp] Server running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

initServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
