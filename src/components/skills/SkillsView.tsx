import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Clock,
  Calendar,
  PenTool,
  Users,
  Flame,
  FileSearch,
  Bot,
  Heart,
  Copy,
  Check,
  Wind,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const SkillsView: React.FC = () => {
  const { setActiveTab, addXP } = useApp();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // 14-day exam checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    0: true,
  });

  const examDays = [
    { day: 'Ngày 14–11', title: 'Thu thập tài liệu & Lập kế hoạch', desc: 'Gom đề cương, slide, đề thi cũ các năm. Liệt kê các chủ đề cốt lõi, ước lượng độ khó và chia đều vào các ngày.' },
    { day: 'Ngày 10–7', title: 'Học sâu & Đóng gói thẻ nhớ', desc: 'Học lại từng chủ đề bằng Kỹ thuật Feynman + Cornell. Tạo ngay bộ Flashcard cho các công thức, thuật ngữ trọng điểm.' },
    { day: 'Ngày 6–3', title: 'Giải đề thử có bấm giờ', desc: 'Làm đề thi thử với thời gian thực tế. Sửa lỗi sai, ghi vào "Sổ lỗi sai". Dùng Blurting cho những phần kiến thức còn hay quên.' },
    { day: 'Ngày 2', title: 'Ôn lại Sổ lỗi sai', desc: 'Ôn lại toàn bộ các câu trong sổ lỗi sai và lướt nhanh Flashcard Hộp 1. Giải 1 đề cuối cùng và DỪNG HỌC SỚM lúc 9h tối.' },
    { day: 'Ngày 1', title: 'Nghỉ ngơi & Nạp năng lượng', desc: 'Xem lướt tờ tóm tắt 1 trang, chuẩn bị đồ dùng (thẻ sinh viên, bút, máy tính). Tuyệt đối không nhồi nhét kiến thức mới. Đi ngủ trước 10h30.' },
    { day: 'Ngày thi', title: 'Tự tin bước vào phòng thi', desc: 'Ăn sáng nhẹ, đến sớm 20 phút hít thở sâu. Đọc kỹ đề, làm câu chắc điểm trước để tích lũy sự tự tin, kiểm soát thời gian.' },
  ];

  const toggleExamStep = (idx: number) => {
    sound.playClick();
    setCompletedSteps(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      if (next[idx]) {
        addXP(10, 'Hoàn thành bước trong quy trình ôn thi 14 ngày');
      }
      return next;
    });
  };

  // AI Prompt templates with one-click copy
  const aiPrompts = [
    {
      title: 'Prompt 1: Đóng vai Giảng viên phản biện',
      prompt: 'Hãy đóng vai giảng viên môn [Tên Môn Học]. Hãy hỏi mình 5 câu hỏi ôn tập trọng tâm về chủ đề [Tên Chủ Đề], từng câu một. Sau khi mình trả lời mỗi câu, hãy nhận xét chi tiết, chỉ ra chỗ còn thiếu và cho điểm theo thang 10.',
    },
    {
      title: 'Prompt 2: Giải thích đơn giản (Feynman)',
      prompt: 'Hãy giải thích khái niệm [Tên Khái Niệm] như thể đang nói chuyện với một học sinh 12 tuổi chưa từng học qua chuyên ngành này. Sau đó cho mình 3 ví dụ so sánh trực quan trong đời sống hàng ngày.',
    },
    {
      title: 'Prompt 3: Gợi ý sửa lỗi bài giải (Không cho đáp án ngay)',
      prompt: 'Đây là bài giải/đoạn mã của mình cho bài toán sau: [Dán nội dung]. Xin đừng đưa đáp án hoàn chỉnh ngay — hãy chỉ ra bước nào mình có thể đang mắc sai lầm logic và gợi ý câu hỏi để mình tự khắc phục.',
    },
  ];

  const handleCopyPrompt = (text: string, title: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedPrompt(title);
    addXP(10, 'Sao chép prompt AI học tập');
    setTimeout(() => setCopiedPrompt(null), 2500);
  };

  // Interactive 4-6 Breathing Exercise
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    if (!breathingActive) return;
    const interval = setInterval(() => {
      setBreathCount(c => {
        if (c > 1) return c - 1;
        // switch phase
        if (breathPhase === 'inhale') {
          setBreathPhase('exhale');
          return 6; // 6s exhale
        } else {
          setBreathPhase('inhale');
          return 4; // 4s inhale
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  const toggleBreathing = () => {
    sound.playClick();
    if (!breathingActive) {
      setBreathPhase('inhale');
      setBreathCount(4);
      setBreathingActive(true);
    } else {
      setBreathingActive(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12B886]/20 text-[#12B886] text-xs font-bold border border-[#12B886]/30">
          <Award className="w-3.5 h-3.5" />
          <span>Trụ Cột 03 & 05: Kỹ Năng Nền Tảng & Sức Khỏe</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          7 Kỹ Năng Nền Tảng &amp; Wellbeing
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Quản lý thời gian, quy trình ôn thi 14 ngày, ghi chép hiệu quả, làm việc nhóm, chống trì hoãn, nghiên cứu tài liệu và ứng dụng AI có đạo đức.
        </p>
      </div>

      {/* KỸ NĂNG 1 & 2: QUẢN LÝ THỜI GIAN & QUY TRÌNH ÔN THI 14 NGÀY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kỹ Năng 1: Quản lý thời gian */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-sky-400">KỸ NĂNG 01</span>
                <h3 className="text-xl font-bold text-white">Quản Lý Thời Gian Cho Sinh Viên</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Thời gian không &quot;đủ&quot; hay &quot;thiếu&quot; — nó cần được đặt chỗ trước. Hãy bắt đầu từ việc kiểm soát 168 giờ mỗi tuần của bạn:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="font-bold text-white mb-1">⚡ Quy tắc 2 phút</div>
                <p className="text-slate-300">Việc gì giải quyết xong trong dưới 2 phút (trả lời email, nộp link form) → Làm ngay lập tức!</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="font-bold text-white mb-1">🐸 Ăn con ếch (Eat That Frog)</div>
                <p className="text-slate-300">Việc khó nhất, sợ nhất làm đầu tiên vào buổi sáng khi đầu óc minh mẫn nhất.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="font-bold text-white mb-1">🛡️ Khoảng đệm 20%</div>
                <p className="text-slate-300">Luôn chừa 20% thời gian trống mỗi tuần cho sự cố bất ngờ (hỏng xe, bài tập phát sinh).</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="font-bold text-white mb-1">🗓️ Tổng kết Chủ nhật 10p</div>
                <p className="text-slate-300">Tối CN dành 10 phút nhìn lại tuần cũ tốt gì, tuần mới cần điều chỉnh điều gì.</p>
              </div>
            </div>

            {/* Timetable Preview Matrix */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Thời khoá biểu 168 giờ mẫu</span>
                <span className="text-pink-300 font-mono">Tự học 90p/ngày</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                  <div key={d} className="p-1 rounded bg-white/10 font-bold text-white">{d}</div>
                ))}
                {['Lớp', 'Lớp', 'Tự học', 'Lớp', 'Lớp', 'Thể thao', 'Nghỉ'].map((s, i) => (
                  <div key={i} className="p-1 rounded bg-indigo-500/20 text-indigo-200 truncate">{s}</div>
                ))}
                {['Tự học', 'CLB', 'Lớp', 'Tự học', 'Flashcard', 'Đồ án', 'Tự học'].map((s, i) => (
                  <div key={i} className="p-1 rounded bg-pink-500/20 text-pink-200 truncate">{s}</div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tools');
            }}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Mở Planner Tuần kéo thả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* Kỹ Năng 2: Ôn thi quy trình 14 ngày */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-rose-400">KỸ NĂNG 02</span>
                <h3 className="text-xl font-bold text-white">Ôn Thi: Quy Trình 14 Ngày Vàng</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Xóa bỏ hoàn toàn nỗi sợ học dồn thâu đêm. Đánh dấu từng mốc bạn đã hoàn thành để nhận +XP:
            </p>

            <div className="space-y-2.5">
              {examDays.map((step, idx) => {
                const isChecked = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleExamStep(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 transition-colors ${
                        isChecked ? 'bg-emerald-500 text-white font-bold' : 'border border-white/20 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className={isChecked ? 'text-emerald-300 line-through' : 'text-white'}>
                          {step.day}: {step.title}
                        </span>
                        {isChecked && <span className="text-[10px] text-emerald-400 font-mono">+10 XP</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 italic">
            &quot;Người chuẩn bị chu đáo 14 ngày bước vào phòng thi như đi dạo.&quot;
          </div>
        </section>
      </div>

      {/* KỸ NĂNG 3, 4, 5, 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Kỹ Năng 3: Ghi chép */}
        <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
          <div>
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 w-fit mb-3">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">KỸ NĂNG 03</span>
            <h4 className="text-base font-bold text-white mt-1">Ghi Chép Hiệu Quả</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              • Ghi ý cốt lõi, không chép nguyên văn slide.
              <br />• Dùng hệ thống ký hiệu viết tắt riêng (→, ≠, =&gt;, v.v.).
              <br />• Trong 24 giờ sau buổi học: xem lại và đặt câu hỏi tự kiểm tra theo cột Cornell.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tools');
            }}
            className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 pt-2 border-t border-white/10"
          >
            Mẫu Cornell Note <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kỹ Năng 4: Học nhóm không biến thành tán gẫu */}
        <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
          <div>
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 w-fit mb-3">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">KỸ NĂNG 04</span>
            <h4 className="text-base font-bold text-white mt-1">Học Nhóm Chuẩn 10-40-10</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              • Quy trình 70 phút: 10p chốt mục tiêu → 40p mỗi người giảng phần mình → 10p đố nhau câu hỏi khó → 10p tổng kết.
              <br />• Luân phiên phân vai: Người giảng, Người phản biện, Người ghi biên bản.
            </p>
          </div>
          <div className="text-[11px] text-amber-300 pt-2 border-t border-white/10 font-medium">
            Tối ưu 3-5 thành viên/nhóm
          </div>
        </div>

        {/* Kỹ Năng 5: Chống trì hoãn */}
        <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
          <div>
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 w-fit mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">KỸ NĂNG 05</span>
            <h4 className="text-base font-bold text-white mt-1">Đánh Bại Sự Trì Hoãn</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              • <strong>Giảm ma sát:</strong> Mở sẵn tài liệu từ tối hôm trước.
              <br />• <strong>Bắt đầu nhỏ xíu:</strong> &quot;Chỉ mở file viết đúng 1 câu&quot;.
              <br />• <strong>Body doubling:</strong> Học chung trong im lặng với bạn bè.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tools');
            }}
            className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 pt-2 border-t border-white/10"
          >
            Bật Pomodoro 25p <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kỹ Năng 6: Đọc tài liệu & Nghiên cứu */}
        <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
          <div>
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 w-fit mb-3">
              <FileSearch className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">KỸ NĂNG 06</span>
            <h4 className="text-base font-bold text-white mt-1">Nghiên Cứu & Trích Dẫn</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              • Đọc bài báo khoa học theo thứ tự: <strong>Abstract → Kết luận → Hình/Bảng → Phương pháp</strong>.
              <br />• Quản lý nguồn bằng Zotero/Mendeley theo chuẩn APA/IEEE ngay từ năm nhất.
            </p>
          </div>
          <div className="text-[11px] text-teal-300 pt-2 border-t border-white/10 font-medium">
            Học chuẩn trích dẫn khoa học
          </div>
        </div>
      </div>

      {/* KỸ NĂNG 7: DÙNG AI ĐỂ HỌC ĐÚNG CÁCH, TRUNG THỰC (VỚI PROMPT COPY BUTTONS) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E1A45] to-[#2B1B54] border border-white/15 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#6C4DFF]/30 text-[#6C4DFF]">
              <Bot className="w-6 h-6" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-[#FF4D8D]">KỸ NĂNG 07 · LIÊM CHÍNH HỌC THUẬT</span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Dùng AI Để Học (Đúng Cách, Trung Thực)
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Dùng AI như Gia Sư — Không phải Người Làm Hộ
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Bạn nên nhờ AI giải thích lại khái niệm theo cách khác, tạo câu hỏi ôn tập, đóng vai giảng viên vấn đáp, hoặc chỉ ra bước làm bài bị sai. Tuyệt đối không sao chép nguyên văn để nộp bài tập. Luôn kiểm tra lại độ chính xác và tuân thủ quy định liêm chính học thuật của nhà trường.
        </p>

        {/* 3 Prompts with one-click copy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiPrompts.map((p, idx) => {
            const isCopied = copiedPrompt === p.title;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#6C4DFF]/50 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                    <span>{p.title}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                    &quot;{p.prompt}&quot;
                  </p>
                </div>

                <button
                  onClick={() => handleCopyPrompt(p.prompt, p.title)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Đã sao chép vào clipboard!' : 'Sao chép Prompt'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* WELLBEING: GIỮ SỨC KHOẺ ĐỂ HỌC LÂU DÀI & BÀI TẬP THỞ 4-6 */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-8">
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Heart className="w-6 h-6" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400">TRỤ CỘT 05</span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Wellbeing: Giữ Sức Khỏe Để Học Bền Bỉ
              </h2>
            </div>
          </div>
          <span className="text-xs text-slate-400">Não bộ bạn cũng là một cơ quan sinh học</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-bold text-white text-sm">😴 Giấc ngủ 7–9 Giờ</div>
            <p className="text-slate-300 leading-relaxed">
              Ngủ đủ giấc giúp dọn dẹp độc tố và cố định ký ức dài hạn. Thức xuyên đêm trước thi thường phản tác dụng nhớ bài.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-bold text-white text-sm">🚶 Vận động 20 Phút</div>
            <p className="text-slate-300 leading-relaxed">
              Đi bộ nhẹ hoặc leo cầu thang giúp tăng tuần hoàn máu lên não. Tỉnh táo hơn nhiều so với việc ngồi yên một chỗ.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-bold text-white text-sm">💧 Ăn uống &amp; Nước</div>
            <p className="text-slate-300 leading-relaxed">
              Uống đủ nước, ăn đủ bữa. Hạn chế lạm dụng nước tăng lực và cà phê đậm sau 4h chiều để tránh phá hủy nhịp sinh học.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-bold text-white text-sm">🧘 Hít thở 4–6</div>
            <p className="text-slate-300 leading-relaxed">
              Khi lo âu trước phòng thi, hít vào 4 giây và thở ra chậm 6 giây để kích hoạt hệ thần kinh phó giao cảm hạ nhịp tim.
            </p>
          </div>
        </div>

        {/* Interactive 4-6 Breathing Circle Widget */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>Thực Hành Nhịp Thở 4-6 Giảm Căng Thẳng Ngay Bây Giờ</span>
            </h4>
            <p className="text-xs text-slate-300">
              Nhấn bắt đầu và hít vào/thở ra theo nhịp kim đồng hồ để giải tỏa áp lực tức thì.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Animated Breathing Circle */}
            <div
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-center transition-all duration-1000 ${
                breathingActive
                  ? breathPhase === 'inhale'
                    ? 'scale-125 bg-gradient-to-tr from-sky-500 to-indigo-500 shadow-xl shadow-sky-500/30'
                    : 'scale-90 bg-gradient-to-tr from-indigo-600 to-purple-600'
                  : 'bg-white/10'
              }`}
            >
              <span className="text-xs font-bold text-white">
                {breathingActive ? (breathPhase === 'inhale' ? 'HÍT VÀO' : 'THỞ RA') : 'TĨNH TÂM'}
              </span>
              {breathingActive && (
                <span className="text-base font-mono font-black text-white">
                  {breathCount}s
                </span>
              )}
            </div>

            <button
              onClick={toggleBreathing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                breathingActive
                  ? 'bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-md'
              }`}
            >
              {breathingActive ? 'Dừng bài tập' : 'Bắt đầu thở 4-6'}
            </button>
          </div>
        </div>

        {/* Khi nào nên tìm giúp đỡ */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300 space-y-1">
          <div className="font-bold text-rose-300 flex items-center gap-1.5">
            🚨 Khi nào bạn nên tìm kiếm sự trợ giúp y tế / chuyên gia tâm lý?
          </div>
          <p className="leading-relaxed">
            Nếu tình trạng buồn bã, mất ngủ, mất hứng thú hoặc lo lắng kéo dài liên tục trên 2 tuần — hãy liên hệ Phòng Công tác sinh viên / Trung tâm tư vấn tâm lý trường hoặc cơ sở y tế. Website chỉ cung cấp thông tin học tập tham khảo, không thay thế chẩn đoán chuyên khoa.
          </p>
        </div>
      </section>

      {/* THƯ VIỆN TÀI NGUYÊN ĐỀ XUẤT */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Tài Nguyên Đề Xuất (Thư Viện Tri Thức)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sách, khóa học trực tuyến mở và công cụ hỗ trợ uy tín hàng đầu cho sinh viên:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Books */}
          <div className="p-5 rounded-2xl bg-[#1E1A45] border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-pink-400" />
              <span>Sách Khoa Học Nên Đọc</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• <strong>Make It Stick</strong> (Brown, Roediger, McDaniel) — Khoa học học tập đột phá.</li>
              <li>• <strong>A Mind for Numbers</strong> (Barbara Oakley) — Bí quyết học giỏi Toán & Khoa học.</li>
              <li>• <strong>Atomic Habits</strong> (James Clear) — Thay đổi tí hon, hiệu quả bất ngờ.</li>
              <li>• <strong>Deep Work</strong> (Cal Newport) — Làm việc sâu trong thế giới xao nhãng.</li>
            </ul>
          </div>

          {/* Courses */}
          <div className="p-5 rounded-2xl bg-[#1E1A45] border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-sky-400" />
              <span>Khóa Học Mở Trực Tuyến</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• <strong>Learning How to Learn</strong> (Coursera, Barbara Oakley) — Miễn phí và xuất sắc nhất.</li>
              <li>• <strong>Khan Academy</strong> — Nền tảng ôn luyện Toán, Kinh tế vi mô, Thống kê.</li>
              <li>• <strong>MIT OpenCourseWare</strong> — Bài giảng đại học mở chuẩn quốc tế.</li>
            </ul>
          </div>

          {/* Apps & Creators */}
          <div className="p-5 rounded-2xl bg-[#1E1A45] border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Phần Mềm & Kênh YouTube</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• <strong>Anki / Quizlet:</strong> Ôn luyện flashcard di động.</li>
              <li>• <strong>Zotero:</strong> Quản lý nguồn trích dẫn nghiên cứu khoa học.</li>
              <li>• <strong>Ali Abdaal &amp; Justin Sung:</strong> Kênh chia sẻ phương pháp học chủ động.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
