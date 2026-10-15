import React, { useState, useRef, useEffect } from 'react';
import {
  Network,
  Sparkles,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Edit3,
  Lightbulb,
  FileText,
  Share2,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export interface MindmapNode {
  id: string;
  title: string;
  note?: string;
  color?: string;
  collapsed?: boolean;
  children?: MindmapNode[];
}

const BRANCH_COLORS = [
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#6366F1', // Indigo
];

const PRESET_MINDMAPS: Record<string, MindmapNode> = {
  calculus: {
    id: 'root-calc',
    title: 'Toán Cao Cấp & Giải Tích Đại Học',
    note: 'Kiến thức cốt lõi dành cho sinh viên khối Kỹ thuật, Kinh tế và CNTT',
    color: '#6C4DFF',
    children: [
      {
        id: 'c-1',
        title: 'Đại Số Tuyến Tính',
        color: '#06B6D4',
        note: 'Nền tảng của Khoa học máy tính & Kinh tế lượng',
        children: [
          { id: 'c-1-1', title: 'Ma trận & Các phép toán', note: 'Nhân ma trận, ma trận nghịch đảo A⁻¹' },
          { id: 'c-1-2', title: 'Định thức Det(A)', note: 'Phương pháp định thức Gauss, Laplace' },
          { id: 'c-1-3', title: 'Hệ phương trình tuyến tính', note: 'Quy tắc Cramer, định lý Kronecker-Capelli' },
          { id: 'c-1-4', title: 'Không gian Vector & Ma trận riêng', note: 'Độc lập tuyến tính, Giá trị riêng Eigenvalues' },
        ],
      },
      {
        id: 'c-2',
        title: 'Giải Tích Một Biến',
        color: '#8B5CF6',
        note: 'Đạo hàm, vi phân và tích phân căn bản',
        children: [
          { id: 'c-2-1', title: 'Giới hạn & Tính liên tục', note: 'Quy tắc L’Hôpital, Vô cùng bé tương đương' },
          { id: 'c-2-2', title: 'Đạo hàm & Cực trị hàm số', note: 'Định lý Fermat, Rolle, Lagrange, Cauchy' },
          { id: 'c-2-3', title: 'Khai triển Taylor & Maclaurin', note: 'Xấp xỉ đa thức quanh điểm x₀' },
          { id: 'c-2-4', title: 'Tích phân xác định', note: 'Định lý Newton-Leibniz, đổi biến và từng phần' },
        ],
      },
      {
        id: 'c-3',
        title: 'Giải Tích Nhiều Biến',
        color: '#10B981',
        note: 'Hàm số 2 và 3 biến không gian',
        children: [
          { id: 'c-3-1', title: 'Đạo hàm riêng & Vi phân toàn phần', note: 'Gradient, Ma trận Hessian, Cực trị tự do' },
          { id: 'c-3-2', title: 'Cực trị có điều kiện', note: 'Phương pháp nhân tử Lagrange' },
          { id: 'c-3-3', title: 'Tích phân kép (Bội 2)', note: 'Tọa độ Đề-các và Tọa độ cực r, φ' },
          { id: 'c-3-4', title: 'Tích phân đường & mặt', note: 'Công thức Green, Gauss-Ostrogradsky, Stokes' },
        ],
      },
      {
        id: 'c-4',
        title: 'Phương Trình Vi Phân & Chuỗi',
        color: '#F59E0B',
        note: 'Mô hình hóa các quá trình biến thiên liên tục',
        children: [
          { id: 'c-4-1', title: 'PT Vi phân cấp 1', note: 'Phương trình tách biến, Tuyến tính cấp 1, Bernoulli' },
          { id: 'c-4-2', title: 'PT Vi phân cấp 2 hệ số hằng', note: 'Nghiệm phương trình đặc trưng k² + pk + q = 0' },
          { id: 'c-4-3', title: 'Chuỗi số & Tiêu chuẩn hội tụ', note: 'Tiêu chuẩn D’Alembert, Cauchy, Tích phân' },
          { id: 'c-4-4', title: 'Chuỗi lũy thừa & Bán kính hội tụ', note: 'Chuỗi Fourier và ứng dụng xử lý tín hiệu' },
        ],
      },
    ],
  },
  economics: {
    id: 'root-econ',
    title: 'Kinh Tế Vi Mô & Kinh Tế Vĩ Mô',
    note: 'Hệ thống kiến thức Kinh tế học căn bản cho sinh viên ĐH Kinh tế',
    color: '#6C4DFF',
    children: [
      {
        id: 'e-1',
        title: 'Kinh Tế Vi Mô: Cung - Cầu',
        color: '#06B6D4',
        note: 'Quy luật thị trường và cơ chế định giá',
        children: [
          { id: 'e-1-1', title: 'Quy luật Cung (Supply) & Cầu (Demand)', note: 'Đường cầu dốc xuống, đường cung dốc lên' },
          { id: 'e-1-2', title: 'Điểm cân bằng thị trường (P*, Q*)', note: 'Dư thừa (Surplus) và Thiếu hụt (Shortage)' },
          { id: 'e-1-3', title: 'Độ co giãn (Elasticity)', note: 'Co giãn theo giá Ed, theo thu nhập EI, chéo Exy' },
          { id: 'e-1-4', title: 'Thặng dư tiêu dùng & Thặng dư sản xuất', note: 'CS, PS và Tổn thất vô ích Deadweight Loss (DWL)' },
        ],
      },
      {
        id: 'e-2',
        title: 'Hành Vi Người Tiêu Dùng & Doanh Nghiệp',
        color: '#8B5CF6',
        note: 'Tối đa hóa lợi ích và lợi nhuận',
        children: [
          { id: 'e-2-1', title: 'Hàm hữu dụng (Utility) & Đường bàng quan', note: 'Tỷ lệ thay thế biên MRS, ngân sách I = Px·X + Py·Y' },
          { id: 'e-2-2', title: 'Hàm sản xuất & Năng suất biên', note: 'Quy luật năng suất biên giảm dần (Diminishing MP)' },
          { id: 'e-2-3', title: 'Chi phí sản xuất ngắn & dài hạn', note: 'FC, VC, TC, ATC, AVC, Chi phí biên MC' },
          { id: 'e-2-4', title: 'Cấu trúc thị trường', note: 'Cạnh tranh hoàn hảo, Độc quyền thuần túy, Độc quyền nhóm' },
        ],
      },
      {
        id: 'e-3',
        title: 'Kinh Tế Vĩ Mô: Chỉ Số Toàn Cầu',
        color: '#10B981',
        note: 'Đo lường sản lượng và sức khỏe nền kinh tế',
        children: [
          { id: 'e-3-1', title: 'Tổng sản phẩm quốc nội (GDP)', note: 'GDP danh nghĩa, GDP thực tế, 3 phương pháp tính' },
          { id: 'e-3-2', title: 'Lạm phát & Chỉ số giá tiêu dùng CPI', note: 'Lạm phát do cầu kéo và lạm phát do chi phí đẩy' },
          { id: 'e-3-3', title: 'Tỷ lệ thất nghiệp (Unemployment)', note: 'Thất nghiệp tự nhiên, cơ cấu, chu kỳ, ma sát' },
          { id: 'e-3-4', title: 'Tổng cầu (AD) & Tổng cung (AS)', note: 'Mô hình AD-AS cân bằng kinh tế vĩ mô' },
        ],
      },
      {
        id: 'e-4',
        title: 'Chính Sách Điều Tiết Kinh Tế',
        color: '#EC4899',
        note: 'Công cụ điều hành của Chính phủ và Ngân hàng Trung ương',
        children: [
          { id: 'e-4-1', title: 'Chính sách Tài khóa (Fiscal Policy)', note: 'Thuế (T) và Chi tiêu chính phủ (G), Cán cân ngân sách' },
          { id: 'e-4-2', title: 'Chính sách Tiền tệ (Monetary Policy)', note: 'Cung tiền M, Lãi suất, Tỷ lệ dự trữ bắt buộc, OMO' },
          { id: 'e-4-3', title: 'Thương mại & Tỷ giá hối đoái', note: 'Cán cân thanh toán BOP, Tỷ giá thả nổi vs cố định' },
          { id: 'e-4-4', title: 'Tăng trưởng kinh tế & Chu kỳ kinh doanh', note: 'Hồi phục, Đỉnh cao, Suy thoái, Đáy vực' },
        ],
      },
    ],
  },
  react_fullstack: {
    id: 'root-fullstack',
    title: 'Lập Trình Web Fullstack (React & Node.js)',
    note: 'Lộ trình phát triển ứng dụng Web hiện đại chuẩn Production',
    color: '#6C4DFF',
    children: [
      {
        id: 'f-1',
        title: 'Frontend Architecture: React & TS',
        color: '#06B6D4',
        note: 'Giao diện tương tác và trải nghiệm người dùng',
        children: [
          { id: 'f-1-1', title: 'Core React: Virtual DOM & JSX', note: 'Component-driven, Unidirectional data flow' },
          { id: 'f-1-2', title: 'React Hooks Hiện Đại', note: 'useState, useEffect, useMemo, useCallback, useRef' },
          { id: 'f-1-3', title: 'Quản lý State Toàn Cục', note: 'Context API, Zustand, Redux Toolkit, TanStack Query' },
          { id: 'f-1-4', title: 'TypeScript & Styling', note: 'Interface, Type union, Generics, Tailwind CSS v4' },
        ],
      },
      {
        id: 'f-2',
        title: 'Backend & RESTful API',
        color: '#8B5CF6',
        note: 'Xử lý logic nghiệp vụ và định tuyến máy chủ',
        children: [
          { id: 'f-2-1', title: 'Node.js & Express / Fastify', note: 'Event Loop, Non-blocking I/O, Async/Await' },
          { id: 'f-2-2', title: 'Kiến trúc RESTful API chuẩn', note: 'HTTP Methods GET, POST, PUT, DELETE, Status Codes' },
          { id: 'f-2-3', title: 'Authentication & Security', note: 'JWT Bearer token, OAuth2, Bcrypt, CORS, Helmet' },
          { id: 'f-2-4', title: 'Validation & Error Handling', note: 'Zod / Joi validation, Centralized error middleware' },
        ],
      },
      {
        id: 'f-3',
        title: 'Cơ Sở Dữ Liệu & ORM',
        color: '#10B981',
        note: 'Lưu trữ và truy vấn dữ liệu hiệu năng cao',
        children: [
          { id: 'f-3-1', title: 'Relational Database: PostgreSQL', note: 'Schema, ACID, Primary & Foreign Keys, Joins' },
          { id: 'f-3-2', title: 'NoSQL: MongoDB / Firebase', note: 'Document model, Collections, Realtime Firestore' },
          { id: 'f-3-3', title: 'ORM & Query Builder: Prisma / Drizzle', note: 'Type-safe queries, Migrations, Relations' },
          { id: 'f-3-4', title: 'Indexing & Performance Caching', note: 'B-Tree Index, Redis In-memory Cache' },
        ],
      },
      {
        id: 'f-4',
        title: 'DevOps & Deployment',
        color: '#F59E0B',
        note: 'Đưa ứng dụng lên đám mây ổn định',
        children: [
          { id: 'f-4-1', title: 'Git & Version Control', note: 'Git Flow, Branching, PR Review, Merge conflict' },
          { id: 'f-4-2', title: 'Docker & Containerization', note: 'Dockerfile, docker-compose, Multi-stage builds' },
          { id: 'f-4-3', title: 'CI/CD Pipeline: GitHub Actions', note: 'Automated test suite, Linting, Build & Deploy' },
          { id: 'f-4-4', title: 'Cloud Infrastructure & Hosting', note: 'Vercel, Render, AWS EC2 / S3, Nginx Reverse Proxy' },
        ],
      },
    ],
  },
  philosophy: {
    id: 'root-philo',
    title: 'Triết Học Mác - Lênin & Khoa Học Xã Hội',
    note: 'Sơ đồ tư duy ôn tập điểm A các môn Lý luận chính trị đại học',
    color: '#6C4DFF',
    children: [
      {
        id: 'p-1',
        title: 'Chủ Nghĩa Duy Vật Biện Chứng',
        color: '#EC4899',
        note: 'Thế giới quan và phương pháp luận triết học duy vật',
        children: [
          { id: 'p-1-1', title: 'Vấn đề cơ bản của Triết học', note: 'Mặt thứ nhất (Bản thể luận) và mặt thứ hai (Nhận thức luận)' },
          { id: 'p-1-2', title: 'Vật chất & Ý thức', note: 'Định nghĩa vật chất của Lênin, Nguồn gốc và bản chất của ý thức' },
          { id: 'p-1-3', title: 'Mối quan hệ Biện chứng', note: 'Vật chất quyết định ý thức, ý thức tác động trở lại qua thực tiễn' },
        ],
      },
      {
        id: 'p-2',
        title: '3 Quy Luật Biện Chứng Cốt Lõi',
        color: '#8B5CF6',
        note: 'Quy luật vận động và phát triển phổ biến của thế giới',
        children: [
          { id: 'p-2-1', title: 'Quy luật Lượng - Chất', note: 'Độ, Điểm nút, Bước nhảy; Tích lũy về lượng dẫn đến biến đổi về chất' },
          { id: 'p-2-2', title: 'Quy luật Mâu thuẫn (Hạt nhân biện chứng)', note: 'Mặt đối lập, Thống nhất và đấu tranh giữa các mặt đối lập' },
          { id: 'p-2-3', title: 'Quy luật Phủ định của phủ định', note: 'Kế thừa biện chứng, Khuynh hướng phát triển theo đường xoáy ốc' },
        ],
      },
      {
        id: 'p-3',
        title: '6 Cặp Phạm Trù Cơ Bản',
        color: '#06B6D4',
        note: 'Các mối quan hệ phổ biến giữa các sự vật hiện tượng',
        children: [
          { id: 'p-3-1', title: 'Cái Riêng & Cái Chung', note: 'Cái chung chỉ tồn tại trong cái riêng, cái riêng sinh động hơn' },
          { id: 'p-3-2', title: 'Nguyên Nhân & Kết Quả', note: 'Quan hệ nhân quả khách quan, một nguyên nhân sinh nhiều kết quả' },
          { id: 'p-3-3', title: 'Tất Nhiên & Ngẫu Nhiên', note: 'Tất nhiên vạch đường đi qua vô số cái ngẫu nhiên' },
          { id: 'p-3-4', title: 'Nội Dung & Hình Thức', note: 'Nội dung quyết định hình thức, hình thức tác động trở lại' },
        ],
      },
      {
        id: 'p-4',
        title: 'Chủ Nghĩa Duy Vật Lịch Sử',
        color: '#10B981',
        note: 'Quy luật vận động và phát triển của xã hội loài người',
        children: [
          { id: 'p-4-1', title: 'Lực lượng sản xuất & Quan hệ sản xuất', note: 'Quy luật QHSX phù hợp với trình độ phát triển của LLSX' },
          { id: 'p-4-2', title: 'Cơ sở hạ tầng & Kiến trúc thượng tầng', note: 'CSHT kinh tế quyết định KTTT chính trị, pháp luật, tư tưởng' },
          { id: 'p-4-3', title: 'Hình thái kinh tế - xã hội', note: 'Sự phát triển của các hình thái KT-XH là quá trình lịch sử - tự nhiên' },
          { id: 'p-4-4', title: 'Vai trò Quần chúng nhân dân', note: 'Quần chúng nhân dân là người sáng tạo chân chính ra lịch sử' },
        ],
      },
    ],
  },
  ielts: {
    id: 'root-ielts',
    title: 'Chiến Lược Chinh Phục IELTS 7.5+ Toàn Diện',
    note: 'Hệ thống hóa kỹ năng và phương pháp làm bài thi Academic',
    color: '#6C4DFF',
    children: [
      {
        id: 'i-1',
        title: 'Writing Task 2: Advanced Structure',
        color: '#06B6D4',
        note: 'Cấu trúc bài luận 250+ từ đạt điểm cao Lexical & Task Response',
        children: [
          { id: 'i-1-1', title: 'Các dạng bài kinh điển', note: 'Opinion (Agree/Disagree), Discussion, Problem-Solution, Two-part' },
          { id: 'i-1-2', title: 'Mở bài 2 câu Paraphrase', note: 'Paraphrase đề bài + Thesis Statement rõ ràng quan điểm' },
          { id: 'i-1-3', title: 'Thân bài PEEL Method', note: 'Point (Luận điểm) - Explanation - Example - Link' },
          { id: 'i-1-4', title: 'Lexical Resource & Collocations', note: 'Từ vựng C1/C2 theo chủ đề Environment, Education, Tech' },
        ],
      },
      {
        id: 'i-2',
        title: 'Speaking 3 Phần & Fluency',
        color: '#8B5CF6',
        note: 'Tự tin giao tiếp lưu loát và tư duy phản biện',
        children: [
          { id: 'i-2-1', title: 'Part 1: Câu trả lời tự nhiên 3-4 câu', note: 'Direct Answer + Lý do chi tiết + Ví dụ đời sống' },
          { id: 'i-2-2', title: 'Part 2: Storytelling 2 Phút', note: 'Chuẩn bị dàn ý 1 phút theo 5W1H (Who, What, Where, When, Why, How)' },
          { id: 'i-2-3', title: 'Part 3: Critical Thinking Thảo luận sâu', note: 'Mở rộng quan điểm xã hội, so sánh quá khứ vs tương lai' },
          { id: 'i-2-4', title: 'Pronunciation & Intonation', note: 'Ngữ điệu tự nhiên, nối âm (Connected Speech), trọng âm câu' },
        ],
      },
      {
        id: 'i-3',
        title: 'Reading: Skimming & Scanning',
        color: '#10B981',
        note: 'Quản lý 60 phút 3 bài đọc học thuật',
        children: [
          { id: 'i-3-1', title: 'True / False / Not Given Mastery', note: 'Xác định Fact rõ ràng, tránh suy diễn cá nhân' },
          { id: 'i-3-2', title: 'Matching Headings & Information', note: 'Đọc câu chủ đề Topic Sentence và câu kết đoạn' },
          { id: 'i-3-3', title: 'Bẫy Paraphrase & Từ đồng nghĩa', note: 'Lập bảng từ khóa Keywords Table sau mỗi bài giải đề' },
          { id: 'i-3-4', title: 'Phân bổ thời gian: 15 - 20 - 25 phút', note: 'Hoàn thành Passage 1 nhanh để dành thời gian cho Passage 3' },
        ],
      },
      {
        id: 'i-4',
        title: 'Listening: Bắt Nhịp Âm Thanh',
        color: '#F59E0B',
        note: 'Phản xạ nghe 4 phần không bỏ sót thông tin',
        children: [
          { id: 'i-4-1', title: 'Section 1 & 2: Ngữ cảnh thường nhật', note: 'Đánh vần tên riêng, số điện thoại, bản đồ chỉ đường' },
          { id: 'i-4-2', title: 'Section 3 & 4: Bài giảng học thuật', note: 'Dự đoán từ loại (Noun, Verb, Adj) trước khi nghe' },
          { id: 'i-4-3', title: 'Bẫy Distractors (Đổi ý vào phút chót)', note: 'Chú ý các từ nối: But, However, Actually, Instead' },
          { id: 'i-4-4', title: 'Shadowing Technique', note: 'Luyện nói nhại theo băng để quen phản xạ nối âm' },
        ],
      },
    ],
  },
  studyskills: {
    id: 'root-study',
    title: 'Phương Pháp Học Tập Đỉnh Cao & Quản Lý Thời Gian',
    note: 'Bộ công cụ khoa học não bộ giúp học nhanh, nhớ lâu, không mệt mỏi',
    color: '#6C4DFF',
    children: [
      {
        id: 's-1',
        title: 'Ghi Nhớ Khoa Học Não Bộ',
        color: '#06B6D4',
        note: 'Khai thác cơ chế củng cố trí nhớ dài hạn',
        children: [
          { id: 's-1-1', title: 'Active Recall (Chủ động truy hồi)', note: 'Tự gấp sách trả lời câu hỏi thay vì đọc thụ động' },
          { id: 's-1-2', title: 'Spaced Repetition (Lặp lại ngắt quãng)', note: 'Khoảng cách ôn tập: Ngày 1, Ngày 3, Ngày 7, Ngày 14, Ngày 30' },
          { id: 's-1-3', title: 'Kỹ thuật Feynman (Giảng dạy đơn giản)', note: 'Giải thích kiến thức khó cho một bạn 10 tuổi hiểu' },
          { id: 's-1-4', title: 'Sơ đồ Mindmap & Hình ảnh hóa', note: 'Kết nối hai bán cầu não trái (logic) và não phải (sáng tạo)' },
        ],
      },
      {
        id: 's-2',
        title: 'Quản Lý Thời Gian & Năng Lượng',
        color: '#8B5CF6',
        note: 'Làm chủ 24 giờ mỗi ngày hiệu quả',
        children: [
          { id: 's-2-1', title: 'Phương pháp Pomodoro 25/5', note: '25 phút tập trung cao độ, 5 phút nghỉ ngơi, lặp lại 4 chu kỳ' },
          { id: 's-2-2', title: 'Ma trận Eisenhower 4 ô', note: 'Phân loại: Khẩn cấp/Quan trọng, Lên lịch, Ủy quyền, Loại bỏ' },
          { id: 's-2-3', title: 'Quy tắc 2 Phút (Two-Minute Rule)', note: 'Việc nào làm dưới 2 phút hãy giải quyết ngay tức thì' },
          { id: 's-2-4', title: 'Time Blocking (Khối thời gian)', note: 'Cố định khung giờ cho Deep Work, không xao nhãng mạng xã hội' },
        ],
      },
      {
        id: 's-3',
        title: 'Hệ Thống Ghi Chép Thông Minh',
        color: '#10B981',
        note: 'Biến ghi chép trên lớp thành tài sản ôn thi A+',
        children: [
          { id: 's-3-1', title: 'Phương pháp Cornell Note 3 phần', note: 'Cột Cues gợi nhớ, Cột Notes ghi chép, Hàng Summary tóm tắt' },
          { id: 's-3-2', title: 'Hệ thống Zettelkasten & Smart Notes', note: 'Ghi chú nguyên tử (Atomic notes) có liên kết chéo' },
          { id: 's-3-3', title: 'Hộp Flashcard Leitner 5 ngăn', note: 'Thẻ trả lời sai giữ ở Ngăn 1, thẻ đúng chuyển lên Ngăn cao' },
        ],
      },
      {
        id: 's-4',
        title: 'Tâm Lý Học & Chống Trì Hoãn',
        color: '#F59E0B',
        note: 'Duy trì động lực và kỷ luật bền bỉ',
        children: [
          { id: 's-4-1', title: 'Trạng thái Dòng chảy (Flow State)', note: 'Cân bằng giữa độ khó của nhiệm vụ và kỹ năng cá nhân' },
          { id: 's-4-2', title: 'Nuôi dưỡng Chuỗi Streak thói quen', note: 'Chỉ cần tiến bộ 1% mỗi ngày (Atomic Habits)' },
          { id: 's-4-3', title: 'Thiết kế Môi trường không xao nhãng', note: 'Để điện thoại phòng khác, dùng nhạc Lofi / Sóng Alpha 10Hz' },
        ],
      },
    ],
  },
};

export const MindmapGenerator: React.FC = () => {
  const [rootNode, setRootNode] = useState<MindmapNode>(PRESET_MINDMAPS.calculus);
  const [selectedPreset, setSelectedPreset] = useState<string>('calculus');
  const [promptTopic, setPromptTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle node collapse
  const handleToggleCollapse = (nodeId: string) => {
    sound.playClick();
    const updateRecursive = (node: MindmapNode): MindmapNode => {
      if (node.id === nodeId) {
        return { ...node, collapsed: !node.collapsed };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateRecursive),
        };
      }
      return node;
    };
    setRootNode(prev => updateRecursive(prev));
  };

  // Add child node
  const handleAddChild = (parentId: string) => {
    sound.playClick();
    const newChild: MindmapNode = {
      id: `node-${Date.now()}`,
      title: 'Nhánh mới',
      note: 'Nhấp biểu tượng bút để chỉnh sửa ghi chú',
      color: BRANCH_COLORS[Math.floor(Math.random() * BRANCH_COLORS.length)],
    };

    const addRecursive = (node: MindmapNode): MindmapNode => {
      if (node.id === parentId) {
        return {
          ...node,
          collapsed: false,
          children: [...(node.children || []), newChild],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(addRecursive),
        };
      }
      return node;
    };

    setRootNode(prev => addRecursive(prev));
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    sound.playClick();
    if (nodeId === rootNode.id) return; // Cannot delete root
    const deleteRecursive = (node: MindmapNode): MindmapNode => {
      if (!node.children) return node;
      return {
        ...node,
        children: node.children.filter(c => c.id !== nodeId).map(deleteRecursive),
      };
    };
    setRootNode(prev => deleteRecursive(prev));
  };

  // Start editing
  const handleStartEdit = (node: MindmapNode) => {
    sound.playClick();
    setEditingNodeId(node.id);
    setEditTitle(node.title);
    setEditNote(node.note || '');
  };

  // Save edit
  const handleSaveEdit = () => {
    if (!editingNodeId) return;
    sound.playSuccess();
    const saveRecursive = (node: MindmapNode): MindmapNode => {
      if (node.id === editingNodeId) {
        return {
          ...node,
          title: editTitle.trim() || node.title,
          note: editNote.trim() || undefined,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(saveRecursive),
        };
      }
      return node;
    };
    setRootNode(prev => saveRecursive(prev));
    setEditingNodeId(null);
  };

  // Auto-generate mindmap from topic or notes
  const handleAutoGenerate = async () => {
    const topic = promptTopic.trim();
    if (!topic || isGenerating) return;

    sound.playClick();
    setIsGenerating(true);

    try {
      // First try to call backend AI chat API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const promptMessage = `Hãy tạo một sơ đồ tư duy (Mindmap) chi tiết, đầy đủ kiến thức học thuật đại học cho chủ đề: "${topic}".
Trả về định dạng JSON DUY NHẤT không có markdown text bao quanh theo cấu trúc sau:
{
  "title": "Tên chủ đề chính",
  "note": "Tóm tắt mục tiêu môn học ngắn gọn",
  "children": [
    {
      "title": "Nhánh chính 1",
      "note": "Ghi chú luận điểm 1",
      "children": [
        { "title": "Khái niệm con 1.1", "note": "Chi tiết / Công thức / Ví dụ" },
        { "title": "Khái niệm con 1.2", "note": "Chi tiết / Công thức / Ví dụ" }
      ]
    },
    {
      "title": "Nhánh chính 2",
      "note": "Ghi chú luận điểm 2",
      "children": [
        { "title": "Khái niệm con 2.1", "note": "Chi tiết / Công thức / Ví dụ" },
        { "title": "Khái niệm con 2.2", "note": "Chi tiết / Công thức / Ví dụ" }
      ]
    },
    {
      "title": "Nhánh chính 3",
      "note": "Ghi chú luận điểm 3",
      "children": [
        { "title": "Khái niệm con 3.1", "note": "Chi tiết / Công thức / Ví dụ" },
        { "title": "Khái niệm con 3.2", "note": "Chi tiết / Công thức / Ví dụ" }
      ]
    }
  ]
}`;

      let parsedResult: any = null;

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: promptMessage, history: [] }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data?.reply) {
            // Attempt to extract JSON from reply
            const jsonMatch = data.reply.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedResult = JSON.parse(jsonMatch[0]);
            }
          }
        }
      } catch {
        // Fallback to local heuristic generator
      }

      // If AI failed or returned invalid JSON, use smart heuristic academic mindmap generator
      if (!parsedResult || !parsedResult.title || !Array.isArray(parsedResult.children)) {
        parsedResult = generateHeuristicMindmap(topic);
      }

      // Colorize nodes
      const formattedRoot: MindmapNode = {
        id: `root-${Date.now()}`,
        title: parsedResult.title || topic,
        note: parsedResult.note || `Sơ đồ tư duy học phần: ${topic}`,
        color: '#6C4DFF',
        children: (parsedResult.children || []).map((branch: any, idx: number) => ({
          id: `branch-${Date.now()}-${idx}`,
          title: branch.title || `Trọng tâm ${idx + 1}`,
          note: branch.note || 'Khái niệm và nguyên lý cốt lõi',
          color: BRANCH_COLORS[idx % BRANCH_COLORS.length],
          children: (branch.children || []).map((sub: any, sIdx: number) => ({
            id: `sub-${Date.now()}-${idx}-${sIdx}`,
            title: sub.title || `Khái niệm ${sIdx + 1}`,
            note: sub.note || 'Giải thích chi tiết & công thức ứng dụng',
          })),
        })),
      };

      setRootNode(formattedRoot);
      setSelectedPreset('custom');
      setPromptTopic('');
      sound.playSuccess();
    } catch {
      // In case of unexpected error, generate guaranteed local mindmap
      const fallback = generateHeuristicMindmap(topic);
      setRootNode(fallback);
      sound.playSuccess();
    } finally {
      setIsGenerating(false);
    }
  };

  // Heuristic Smart Generator for instant 100% reliable mindmaps
  const generateHeuristicMindmap = (topic: string): MindmapNode => {
    const cleanTopic = topic.trim();
    return {
      id: `root-${Date.now()}`,
      title: cleanTopic,
      note: `Hệ thống hóa kiến thức trọng tâm cho môn học: ${cleanTopic}`,
      color: '#6C4DFF',
      children: [
        {
          id: `b-1-${Date.now()}`,
          title: '1. Khái Niệm Cốt Lõi & Cơ Sở Lý Thuyết',
          color: '#06B6D4',
          note: 'Định nghĩa khoa học, tiên đề và bản chất hiện tượng',
          children: [
            { id: `b-1-1-${Date.now()}`, title: 'Định nghĩa & Phạm vi áp dụng', note: 'Bản chất cơ bản của ' + cleanTopic },
            { id: `b-1-2-${Date.now()}`, title: 'Các giả định & Điều kiện biên', note: 'Môi trường thực nghiệm và tiên đề toán học/kinh tế' },
            { id: `b-1-3-${Date.now()}`, title: 'Hệ thống thuật ngữ chuyên ngành', note: 'Các khái niệm nền tảng cần nắm vững để hiểu sâu' },
          ],
        },
        {
          id: `b-2-${Date.now()}`,
          title: '2. Công Thức & Mô Hình Tính Toán',
          color: '#8B5CF6',
          note: 'Phương pháp giải toán, công thức định lượng và ma trận',
          children: [
            { id: `b-2-1-${Date.now()}`, title: 'Công thức nghiệm & Biểu thức toán học', note: 'Phương trình và đẳng thức cơ bản' },
            { id: `b-2-2-${Date.now()}`, title: 'Quy trình giải quyết từng bước', note: 'Bước 1: Phân tích; Bước 2: Lập mô hình; Bước 3: Tính toán' },
            { id: `b-2-3-${Date.now()}`, title: 'Các trường hợp đặc biệt & Bẫy đề thi', note: 'Các điểm kỳ dị và sai lầm thường gặp khi làm bài' },
          ],
        },
        {
          id: `b-3-${Date.now()}`,
          title: '3. Ứng Dụng Thực Tiễn & Case Study',
          color: '#10B981',
          note: 'Liên hệ thực tế doanh nghiệp, bài toán công nghệ & xã hội',
          children: [
            { id: `b-3-1-${Date.now()}`, title: 'Tình huống thực tế (Case Studies)', note: 'Cách áp dụng vào bài toán thực tế đời sống' },
            { id: `b-3-2-${Date.now()}`, title: 'Tối ưu hóa & Đánh giá hiệu quả', note: 'Đo lường kết quả và kiểm thử giải pháp' },
            { id: `b-3-3-${Date.now()}`, title: 'Xu hướng phát triển hiện đại', note: 'Đổi mới sáng tạo và góc nhìn chuyên gia' },
          ],
        },
        {
          id: `b-4-${Date.now()}`,
          title: '4. Tóm Tắt Ôn Tập & Mẹo Thi A+',
          color: '#F59E0B',
          note: 'Ghi nhớ nhanh, phương pháp Active Recall và Spaced Repetition',
          children: [
            { id: `b-4-1-${Date.now()}`, title: 'Bản đồ từ khóa ghi nhớ nhanh', note: '5 từ khóa quan trọng nhất của bài học' },
            { id: `b-4-2-${Date.now()}`, title: 'Flashcard câu hỏi tự kiểm tra', note: 'Tự vấn đáp để củng cố trí nhớ dài hạn' },
            { id: `b-4-3-${Date.now()}`, title: 'Dạng bài tập thường xuất hiện trong đề thi', note: 'Ôn tập có trọng tâm cho kỳ thi kết thúc học phần' },
          ],
        },
      ],
    };
  };

  // Convert mindmap to markdown outline
  const generateMarkdown = (node: MindmapNode, depth = 0): string => {
    const indent = '  '.repeat(depth);
    let md = `${indent}- **${node.title}**${node.note ? `: _${node.note}_` : ''}\n`;
    if (node.children) {
      for (const child of node.children) {
        md += generateMarkdown(child, depth + 1);
      }
    }
    return md;
  };

  // Copy outline as Markdown
  const handleCopyMarkdown = () => {
    sound.playClick();
    const md = generateMarkdown(rootNode);
    navigator.clipboard.writeText(md);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Export as JSON
  const handleExportJSON = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rootNode, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindmap-${rootNode.title.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl border border-white/15 shadow-2xl transition-all duration-300 overflow-hidden relative ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] bg-[#091124] p-4 sm:p-6 overflow-y-auto'
          : 'bg-[#1E1A45] p-5 sm:p-8 space-y-6'
      }`}
    >
      {/* Top Header & Preset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Công Cụ Tự Tạo Sơ Đồ Tư Duy (Mindmap)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Sơ Đồ Tư Duy Tương Tác &amp; Tự Tạo AI</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
              Interactive Flow
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hệ thống hóa bài giảng, trực quan hóa cây kiến thức đa tầng, mở rộng các nhánh con và xuất dàn ý Markdown ôn thi tức thì.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => {
                sound.playClick();
                setZoomLevel(z => Math.max(0.6, z - 0.1));
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              title="Thu nhỏ sơ đồ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1 w-11 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setZoomLevel(z => Math.min(1.4, z + 0.1));
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              title="Phóng to sơ đồ"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setZoomLevel(1);
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              title="Đặt lại kích thước chuẩn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Sao chép toàn bộ dàn ý dưới dạng Markdown bullet list"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Đã chép đề cương</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Sao chép Đề cương</span>
              </>
            )}
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-colors"
            title="Tải file Mindmap JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsFullscreen(!isFullscreen);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-colors"
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Chế độ toàn màn hình tập trung'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preset Subject Templates Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>Mẫu sơ đồ kiến thức học thuật sẵn có:</span>
          </span>
          <span className="text-[11px] text-slate-400">Nhấp để nạp nhanh cây sơ đồ chuẩn</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'calculus', label: 'Toán Cao Cấp & Giải Tích', icon: '📐' },
            { id: 'economics', label: 'Kinh Tế Vi Mô & Vĩ Mô', icon: '📊' },
            { id: 'react_fullstack', label: 'Lập Trình Web Fullstack', icon: '💻' },
            { id: 'philosophy', label: 'Triết Học Mác - Lênin', icon: '🏛️' },
            { id: 'ielts', label: 'IELTS 7.5+ Toàn Diện', icon: '🎯' },
            { id: 'studyskills', label: 'Phương Pháp Học Tập Đỉnh Cao', icon: '🧠' },
          ].map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                sound.playClick();
                setSelectedPreset(preset.id);
                setRootNode(PRESET_MINDMAPS[preset.id]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                selectedPreset === preset.id
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Generate Bar: Prompt / Topic input */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tự Tạo Sơ Đồ Tư Duy Cho Bất Kỳ Môn Học Nào</span>
          </label>
          <span className="text-[11px] text-cyan-300 font-mono">Tự động cấu trúc 4 tầng logic</span>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            handleAutoGenerate();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={promptTopic}
            onChange={e => setPromptTopic(e.target.value)}
            placeholder="Nhập môn học hoặc chủ đề: vd 'Pháp luật đại cương', 'Giải tích ma trận', 'Machine Learning', 'Marketing Căn Bản'..."
            disabled={isGenerating}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!promptTopic.trim() || isGenerating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-[#6C4DFF] to-pink-500 hover:opacity-90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Đang phân tích cấu trúc...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Tự động tạo Mindmap</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* --- INTERACTIVE MINDMAP CANVAS --- */}
      <div
        className="w-full rounded-2xl bg-slate-950/70 border border-white/10 p-4 sm:p-8 overflow-x-auto overflow-y-auto min-h-[460px] relative scrollbar-thin transition-transform origin-top-left"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Central Root Node Card */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 sm:px-8 sm:py-5 rounded-3xl bg-gradient-to-r from-[#6C4DFF] via-purple-600 to-[#FF4D8D] text-white shadow-2xl shadow-purple-900/50 border border-white/30 text-center max-w-xl group relative">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-300">
                Chủ Đề Trung Tâm
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
              {rootNode.title}
            </h3>
            {rootNode.note && (
              <p className="text-xs text-white/85 mt-1.5 leading-relaxed line-clamp-2">
                {rootNode.note}
              </p>
            )}

            {/* Quick Actions for Root */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-white/20">
              <button
                onClick={() => handleStartEdit(rootNode)}
                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-semibold text-white flex items-center gap-1 transition-colors"
                title="Sửa tiêu đề chủ đề trung tâm"
              >
                <Edit3 className="w-3 h-3" /> Sửa
              </button>
              <button
                onClick={() => handleAddChild(rootNode.id)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold text-white flex items-center gap-1 transition-colors shadow"
                title="Thêm nhánh chính mới"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm nhánh chính
              </button>
            </div>
          </div>
        </div>

        {/* Branches Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative">
          {(rootNode.children || []).map((branch, branchIdx) => {
            const isCollapsed = !!branch.collapsed;
            const branchColor = branch.color || BRANCH_COLORS[branchIdx % BRANCH_COLORS.length];

            return (
              <div
                key={branch.id}
                className="flex flex-col gap-3 rounded-2xl p-4 bg-white/5 border border-white/10 hover:border-white/25 transition-all relative group"
                style={{ borderTop: `4px solid ${branchColor}` }}
              >
                {/* Branch Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: branchColor }}
                      />
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-wider"
                        style={{ color: branchColor }}
                      >
                        Nhánh 0{branchIdx + 1}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white leading-tight">
                      {branch.title}
                    </h4>
                    {branch.note && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {branch.note}
                      </p>
                    )}
                  </div>

                  {/* Header actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleCollapse(branch.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title={isCollapsed ? 'Mở rộng nhánh' : 'Thu gọn nhánh'}
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleStartEdit(branch)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Sửa nhánh này"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNode(branch.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa nhánh này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-nodes list */}
                {!isCollapsed && (
                  <div className="space-y-2 mt-1 pt-2 border-t border-white/5">
                    {(branch.children || []).map((subNode, subIdx) => (
                      <div
                        key={subNode.id}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group/sub relative"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex-1">
                            <div className="text-xs font-bold text-slate-200 group-hover/sub:text-white flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" />
                              <span>{subNode.title}</span>
                            </div>
                            {subNode.note && (
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed pl-3 line-clamp-2">
                                {subNode.note}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEdit(subNode)}
                              className="p-1 text-slate-400 hover:text-white"
                              title="Sửa nội dung"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteNode(subNode.id)}
                              className="p-1 text-slate-400 hover:text-rose-400"
                              title="Xóa ý này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Sub-node Button */}
                    <button
                      onClick={() => handleAddChild(branch.id)}
                      className="w-full py-1.5 rounded-xl border border-dashed border-white/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm ý con vào nhánh</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- EDIT NODE MODAL --- */}
      {editingNodeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>Chỉnh Sửa Nhánh Sơ Đồ</span>
              </h4>
              <button
                onClick={() => setEditingNodeId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">
                  Tiêu đề nhánh / khái niệm:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs sm:text-sm"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">
                  Ghi chú / Công thức / Chi tiết lý thuyết:
                </label>
                <textarea
                  rows={3}
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  placeholder="Nhập ghi chú ngắn gọn để gợi nhớ khi ôn thi..."
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs sm:text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingNodeId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer tips */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Mẹo ôn thi: Sau khi xem Mindmap, hãy dùng <strong>Active Recall</strong> vẽ lại sơ đồ từ trí nhớ ra giấy nháp để khắc sâu kiến thức vào não bộ.
          </span>
        </div>
        <div className="text-right font-mono text-cyan-300">
          UniLevelUp Visual Knowledge Engine
        </div>
      </div>
    </div>
  );
};
