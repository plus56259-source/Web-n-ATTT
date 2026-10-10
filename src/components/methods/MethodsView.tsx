import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { METHODS_DATA, SITUATIONAL_GUIDE } from '../../data/learningData';
import { MethodItem } from '../../types';
import {
  BookOpen,
  Filter,
  Star,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  BookMarked,
  Info,
  Users,
  Timer,
  Network,
  Search,
  Clock,
  FileText,
  Lightbulb,
  Award,
  School,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const MethodsView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedTier, setSelectedTier] = useState<'all' | 'primary' | 'supplementary'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMethodModal, setActiveMethodModal] = useState<MethodItem | null>(null);

  // Filter based on tier & category
  const filteredMethods = METHODS_DATA.filter(m => {
    if (selectedTier === 'primary' && !m.isPrimary) return false;
    if (selectedTier === 'supplementary' && m.isPrimary) return false;
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  const primaryMethods = filteredMethods.filter(m => m.isPrimary);
  const supplementaryMethods = filteredMethods.filter(m => !m.isPrimary);

  const handleOpenToolForMethod = (methodId: string) => {
    sound.playClick();
    if (methodId === 'group-study') {
      setActiveTab('studyroom');
    } else if (methodId === 'pomodoro' || methodId === 'cornell-notes' || methodId === 'mind-mapping') {
      setActiveTab('tools');
    } else if (methodId === 'active-recall' || methodId === 'spaced-repetition') {
      setActiveTab('tools');
    } else {
      setActiveTab('tools');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6C4DFF]/20 text-[#A78BFA] text-xs font-bold border border-[#6C4DFF]/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Trụ Cột 02: Phương Pháp Học Tập Khoa Học</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Hệ Thống Phương Pháp Học Tập
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tập trung vào <strong className="text-amber-400">6 phương pháp cốt lõi hàng đầu</strong> theo thứ tự ưu tiên quan trọng, cùng các <strong className="text-pink-300">phương pháp bổ trợ mở rộng</strong> được đề xuất thêm cho sinh viên.
        </p>

        {/* Quick Priority Roadmap Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-left shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Thứ tự ưu tiên 6 phương pháp cốt lõi
            </span>
            <span className="text-[11px] text-slate-400">Áp dụng theo thứ tự quan trọng</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { num: '1', name: 'Mindmap', sub: 'Bản đồ tư duy', color: 'from-purple-500/30 to-indigo-500/20 text-purple-300 border-purple-500/40', id: 'mind-mapping' },
              { num: '2', name: 'Pomodoro', sub: 'Quả cà chua 25/5', color: 'from-emerald-500/30 to-teal-500/20 text-emerald-300 border-emerald-500/40', id: 'pomodoro' },
              { num: '3', name: 'Group Study', sub: 'Học nhóm tương hỗ', color: 'from-cyan-500/30 to-blue-500/20 text-cyan-300 border-cyan-500/40', id: 'group-study' },
              { num: '4', name: 'Active recall', sub: 'Truy xuất chủ động', color: 'from-indigo-500/30 to-pink-500/20 text-indigo-300 border-indigo-500/40', id: 'active-recall' },
              { num: '5', name: 'Spaced Repetition', sub: 'Lặp lại ngắt quãng', color: 'from-pink-500/30 to-rose-500/20 text-pink-300 border-pink-500/40', id: 'spaced-repetition' },
              { num: '6', name: 'Cornell Notes', sub: 'Ghi chép 3 vùng', color: 'from-sky-500/30 to-cyan-500/20 text-sky-300 border-sky-500/40', id: 'cornell-notes' },
            ].map(item => (
              <button
                key={item.num}
                onClick={() => {
                  sound.playClick();
                  const target = METHODS_DATA.find(m => m.id === item.id);
                  if (target) setActiveMethodModal(target);
                }}
                className={`p-2.5 rounded-xl border bg-gradient-to-br ${item.color} hover:scale-105 transition-all text-left flex flex-col justify-between group`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-white/10 text-white">
                    PP {item.num}
                  </span>
                  <span className="text-[10px] text-white/60 group-hover:text-white transition-colors">➔</span>
                </div>
                <div className="mt-1">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">{item.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. BẢNG TÌNH HUỐNG: "TÔI ĐANG GẶP..." (SITUATIONAL SELECTOR) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Cứu Nguy Cấp Tốc
            </span>
            <h2 className="text-2xl font-black text-white mt-0.5">
              Bảng Chọn Nhanh Theo Tình Huống (&quot;Tôi Đang Gặp...&quot;)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Khắc phục ngay bế tắc học tập theo phương pháp đúng</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SITUATIONAL_GUIDE.map((sit, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{sit.situation}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 my-2">
                  <div className="text-[11px] text-slate-400">Phương pháp khuyến nghị:</div>
                  <div className="text-xs font-bold text-white mt-0.5">{sit.tryFirst}</div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  💡 {sit.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px] truncate max-w-[170px]">
                  Công cụ: {sit.tool.split('&')[0]}
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    const lowerTool = sit.tool.toLowerCase();
                    if (lowerTool.includes('phòng học nhóm') || lowerTool.includes('study room')) {
                      setActiveTab('studyroom');
                    } else if (lowerTool.includes('pomodoro') || lowerTool.includes('gpa') || lowerTool.includes('cornell') || lowerTool.includes('flashcard')) {
                      setActiveTab('tools');
                    } else {
                      setActiveTab('games');
                    }
                  }}
                  className="text-pink-300 font-bold hover:text-white flex items-center gap-1 shrink-0"
                >
                  <span>Mở ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. BỘ LỌC TẦNG BẬC (TIER) & NHÓM KỸ NĂNG */}
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Danh Mục Phương Pháp Học Tập
            </h2>
            <p className="text-xs text-slate-300">
              6 phương pháp cốt lõi ưu tiên hàng đầu &amp; các phương pháp bổ trợ mở rộng.
            </p>
          </div>

          {/* Tier and Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tier Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedTier('all');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedTier === 'all'
                    ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Tất cả (11)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedTier('primary');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedTier === 'primary'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-amber-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>⭐ 6 Cốt Lõi (1-6)</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedTier('supplementary');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedTier === 'supplementary'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-sky-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>💡 Bổ trợ mở rộng (5)</span>
              </button>
            </div>

            {/* Category Dropdown/Pills */}
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {[
                { key: 'all', label: 'Tất cả dạng' },
                { key: 'memorization', label: 'Ghi nhớ' },
                { key: 'comprehension', label: 'Thấu hiểu' },
                { key: 'planning', label: 'Kế hoạch' },
                { key: 'collaboration', label: 'Học nhóm' },
                { key: 'practice', label: 'Luyện đề' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat.key);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    selectedCategory === cat.key
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION A: 6 PHƯƠNG PHÁP CỐT LÕI (THEO THỨ TỰ QUAN TRỌNG) */}
        {(selectedTier === 'all' || selectedTier === 'primary') && primaryMethods.length > 0 && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#6C4DFF]/15 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  ⭐
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    6 Phương Pháp Học Tập Cốt Lõi (Theo Thứ Tự Ưu Tiên)
                  </h3>
                  <p className="text-xs text-slate-300">
                    6 phương pháp nền tảng quan trọng nhất: Phương pháp 1: Mindmap ➔ Phương pháp 2: Pomodoro ➔ Phương pháp 3: Group Study ➔ Phương pháp 4: Active recall ➔ Phương pháp 5: Spaced Repetition ➔ Phương pháp 6: Cornell Notes.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap self-start sm:self-auto">
                6 Phương pháp quan trọng nhất
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {primaryMethods.map(item => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-[#1E1A45] border-2 border-white/10 hover:border-amber-400/60 transition-all shadow-xl flex flex-col justify-between space-y-4 group relative overflow-hidden"
                >
                  {/* Priority ribbon badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                      <span>⭐ Phương pháp {parseInt(item.number, 10)}</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Cốt Lõi #{item.priorityOrder || item.number}
                    </span>
                  </div>

                  <div>
                    {/* Number and Title */}
                    <div className="flex items-start gap-3 mt-1">
                      <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-mono font-black text-sm text-white group-hover:bg-[#6C4DFF] transition-colors shrink-0">
                        {item.number}
                      </span>
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    {/* Stars metrics */}
                    <div className="flex items-center gap-4 py-2 my-2 border-y border-white/5 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[11px]">Hiệu quả:</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < item.effectiveness ? 'fill-amber-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[11px]">Dễ áp dụng:</span>
                        <div className="flex text-emerald-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < item.ease ? 'fill-emerald-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Vivid Metaphor Box */}
                    {item.vividMetaphor && (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#6C4DFF]/15 to-pink-500/15 border border-amber-500/30 text-xs my-2">
                        <span className="font-bold text-amber-300 block mb-0.5">✨ Ẩn dụ gợi hình đặc sắc:</span>
                        <p className="text-slate-100 leading-relaxed font-medium text-[11px] sm:text-xs">{item.vividMetaphor}</p>
                      </div>
                    )}

                    {/* Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {item.whatAndWhy}
                    </p>

                    {/* Campus Scenario / Real Example */}
                    {item.campusScenario ? (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 my-2.5 text-xs">
                        <span className="font-bold text-cyan-300">🏛️ Thực chiến giảng đường: </span>
                        <span className="text-slate-200 line-clamp-2">{item.campusScenario}</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 my-2.5 text-xs">
                        <span className="font-bold text-pink-300">🎓 Ví dụ môn học: </span>
                        <span className="text-slate-200 line-clamp-2">{item.realExample}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleOpenToolForMethod(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 text-[11px] ${
                        item.id === 'group-study'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
                          : item.id === 'pomodoro'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {item.id === 'group-study' ? (
                        <>
                          <Users className="w-3 h-3" />
                          <span>Vào Phòng Học</span>
                        </>
                      ) : item.id === 'pomodoro' ? (
                        <>
                          <Timer className="w-3 h-3" />
                          <span>Bật Pomodoro</span>
                        </>
                      ) : (
                        <span>Mở công cụ</span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveMethodModal(item);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold transition-all flex items-center gap-1 text-[11px] hover:shadow-md"
                    >
                      <span>4 bước chi tiết</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION B: CÁC PHƯƠNG PHÁP BỔ TRỢ / PHỤ ĐỀ XUẤT THÊM CHO NGƯỜI DÙNG */}
        {(selectedTier === 'all' || selectedTier === 'supplementary') && supplementaryMethods.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-500/15 via-white/5 to-transparent border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  💡
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Phương Pháp Bổ Trợ Đề Xuất Thêm Cho Người Dùng
                  </h3>
                  <p className="text-xs text-slate-300">
                    Các phương pháp phụ hữu ích được đề xuất mở rộng để người dùng tham khảo và kết hợp theo từng tình huống cụ thể (đọc sách dày, đan xen bài tập, ôn cấp tốc).
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 whitespace-nowrap self-start sm:self-auto">
                Phương pháp phụ đề ra thêm
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplementaryMethods.map(item => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-[#1E1A45]/80 border border-white/10 hover:border-sky-400/40 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-mono font-bold">
                      💡 Bổ trợ #{item.number}
                    </span>
                    <span className="text-[11px] text-slate-400">Tham khảo thêm</span>
                  </div>

                  <div>
                    {/* Number and Title */}
                    <div className="flex items-start gap-3 mt-1">
                      <span className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-mono font-black text-sm text-slate-300 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
                        {item.number}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>

                    {/* Stars metrics */}
                    <div className="flex items-center gap-4 py-2 my-2 border-y border-white/5 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[11px]">Hiệu quả:</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < item.effectiveness ? 'fill-amber-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[11px]">Dễ áp dụng:</span>
                        <div className="flex text-emerald-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < item.ease ? 'fill-emerald-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Vivid Metaphor Box */}
                    {item.vividMetaphor && (
                      <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs my-2">
                        <span className="font-bold text-sky-300 block mb-0.5">✨ Ẩn dụ gợi hình đặc sắc:</span>
                        <p className="text-slate-100 leading-relaxed font-medium text-[11px] sm:text-xs">{item.vividMetaphor}</p>
                      </div>
                    )}

                    {/* Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {item.whatAndWhy}
                    </p>

                    {/* Real Example or Campus Scenario */}
                    {item.campusScenario ? (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 my-2.5 text-xs">
                        <span className="font-bold text-sky-300">🏛️ Thực chiến giảng đường: </span>
                        <span className="text-slate-200 line-clamp-2">{item.campusScenario}</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 my-2.5 text-xs">
                        <span className="font-bold text-sky-300">🎓 Ví dụ môn học: </span>
                        <span className="text-slate-200 line-clamp-2">{item.realExample}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
                      Phù hợp: {item.bestFor.split(',')[0]}
                    </span>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveMethodModal(item);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-1 text-[11px]"
                    >
                      <span>Xem quy trình</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. MODAL FOR DETAILED METHOD BREAKDOWN */}
      {activeMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className={`p-6 border-b border-white/10 flex items-start justify-between ${
              activeMethodModal.isPrimary
                ? 'bg-gradient-to-r from-amber-500/20 via-[#6C4DFF]/20 to-transparent'
                : 'bg-gradient-to-r from-sky-500/20 to-transparent'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    activeMethodModal.isPrimary
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-sky-500 text-white'
                  }`}>
                    {activeMethodModal.isPrimary
                      ? `⭐ PHƯƠNG PHÁP ${parseInt(activeMethodModal.number, 10)} · CỐT LÕI HÀNG ĐẦU`
                      : `💡 PHƯƠNG PHÁP BỔ TRỢ #${activeMethodModal.number}`}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mt-1.5">
                  {activeMethodModal.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{activeMethodModal.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveMethodModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Vivid Metaphor Banner */}
              {activeMethodModal.vividMetaphor && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-[#6C4DFF]/20 border border-amber-400/40 text-xs space-y-1.5 shadow-lg">
                  <div className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Hình Ảnh Ẩn Dụ &amp; Gợi Hình Đặc Sắc:</span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
                    {activeMethodModal.vividMetaphor}
                  </p>
                </div>
              )}

              {/* Campus Real Scenario */}
              {activeMethodModal.campusScenario && (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-2">
                  <div className="font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <School className="w-4 h-4 text-cyan-400" />
                    <span>Tình Huống Giảng Đường Thực Chiến (Đại Học Việt Nam):</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {activeMethodModal.campusScenario}
                  </p>
                </div>
              )}

              {/* Before vs After Contrast */}
              {activeMethodModal.beforeVsAfter && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs space-y-1">
                    <div className="font-bold text-rose-300 flex items-center gap-1">
                      <span>❌ Trước khi áp dụng:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {activeMethodModal.beforeVsAfter.before}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1">
                      <span>✅ Sau khi làm chủ:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {activeMethodModal.beforeVsAfter.after}
                    </p>
                  </div>
                </div>
              )}

              {/* Scientific Citation */}
              <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Bằng chứng khoa học: </span>
                  <span>{activeMethodModal.scientificCitation}</span>
                </div>
              </div>

              {/* What & Why */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-200 space-y-1">
                <div className="font-bold text-amber-300">Bản chất phương pháp &amp; Cơ chế não bộ:</div>
                <p className="leading-relaxed text-slate-300">{activeMethodModal.whatAndWhy}</p>
              </div>

              {/* Step by step How To */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cách Làm Từng Bước (Quy Trình Chuẩn)</span>
                </h4>
                <div className="space-y-2">
                  {activeMethodModal.howTo.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#6C4DFF] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {sIdx + 1}
                      </span>
                      <span className="text-slate-200 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Vietnam University Example */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="font-bold text-pink-300">🎓 Ví dụ môn học thực tế tại đại học:</div>
                <p className="text-slate-200 leading-relaxed">{activeMethodModal.realExample}</p>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <AlertOctagon className="w-4 h-4" /> Hay sai ở đâu? (Cần tránh)
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {activeMethodModal.commonMistakes}
                </p>
              </div>

              {/* Recommended tools in website */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span>Trải nghiệm ngay phương pháp này trên hệ thống UniLevelUp:</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    const targetId = activeMethodModal.id;
                    setActiveMethodModal(null);
                    handleOpenToolForMethod(targetId);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  {activeMethodModal.id === 'group-study' ? (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Vào Phòng Học Nhóm (Study Room)</span>
                    </>
                  ) : activeMethodModal.id === 'pomodoro' ? (
                    <>
                      <Timer className="w-4 h-4" />
                      <span>Mở Pomodoro Timer</span>
                    </>
                  ) : (
                    <span>Mở công cụ hỗ trợ</span>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
              <button
                onClick={() => setActiveMethodModal(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl bg-white/5 hover:bg-white/10"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
