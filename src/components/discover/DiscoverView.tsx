import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GLOSSARY_DATA, MYTHBUSTERS_DATA, ROADMAP_DATA } from '../../data/learningData';
import {
  Compass,
  Repeat,
  AlertTriangle,
  MapPin,
  HelpCircle,
  CheckCircle,
  Lightbulb,
  Search,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const DiscoverView: React.FC = () => {
  const { setActiveTab } = useApp();

  // Flip card comparison state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const comparisonData = [
    {
      id: 1,
      aspect: 'Thời khoá biểu',
      highSchool: 'Cố định từ thứ 2 đến thứ 7, học cả ngày, có chuông reo báo tiết.',
      university: 'Tự đăng ký theo tín chỉ, lịch học rời rạc, có nhiều "tiết trống" giữa các ca.',
      survivalTip: 'Đừng lãng phí 2-3 tiếng tiết trống để lướt mạng, hãy biến nó thành giờ tự học ở thư viện.',
    },
    {
      id: 2,
      aspect: 'Tính tự học',
      highSchool: 'Giáo viên giao bài tập về nhà cụ thể, kiểm tra miệng và kiểm tra 15 phút thường xuyên.',
      university: 'Giảng viên chỉ định hướng khung bài giảng. Quy chế chuẩn yêu cầu 2 giờ tự học cho mỗi 1 giờ trên lớp.',
      survivalTip: 'Không ai nhắc bạn học bài. Đợi đến lúc giảng viên hỏi thì đã đến kỳ thi cuối kỳ!',
    },
    {
      id: 3,
      aspect: 'Đánh giá & Điểm số',
      highSchool: 'Nhiều bài kiểm tra hệ số 1, hệ số 2. Điểm kém bài này có thể gỡ bằng bài khác.',
      university: 'Điểm chuyên cần (10-20%) + Giữa kỳ (20-30%) + Cuối kỳ (50-60%). Một bài thi cuối kỳ có thể quyết định qua hay rớt môn!',
      survivalTip: 'Tuyệt đối không bỏ điểm chuyên cần và bài tập nhóm — đây là phao cứu sinh an toàn nhất.',
    },
    {
      id: 4,
      aspect: 'Tài liệu học tập',
      highSchool: 'Một cuốn sách giáo khoa chuẩn cho mỗi môn học, học gì thi nấy.',
      university: 'Giáo trình chính, slide bài giảng, bài báo khoa học, tài liệu tiếng Anh, nguồn dữ liệu mở.',
      survivalTip: 'Học cách đọc bài báo khoa học (Abstract -> Kết luận) và dùng phần mềm trích dẫn Zotero.',
    },
    {
      id: 5,
      aspect: 'Hỗ trợ & Quản lý',
      highSchool: 'Giáo viên chủ nhiệm theo sát từng ngày, phụ huynh được thông báo kết quả.',
      university: 'Cố vấn học tập, phòng đào tạo, câu lạc bộ. Bạn là người trưởng thành và phải chủ động tìm đến họ.',
      survivalTip: 'Nếu gặp khó khăn về đăng ký môn hoặc tâm lý, hãy liên hệ ngay cố vấn trước khi quá muộn.',
    },
    {
      id: 6,
      aspect: 'Sự tự do',
      highSchool: 'Rất ít tự do, môi trường được kiểm soát chặt chẽ.',
      university: 'Rất nhiều tự do — và đó vừa là cơ hội cất cánh, vừa là cạm bẫy lớn nhất của sinh viên.',
      survivalTip: 'Tự do đích thực đòi hỏi kỷ luật tự giác. Người làm chủ được lịch trình sẽ làm chủ cuộc chơi.',
    },
  ];

  const toggleFlip = (id: number) => {
    sound.playCardFlip();
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Glossary search & filter
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredGlossary = GLOSSARY_DATA.filter(item => {
    const matchesQuery =
      item.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossaryQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  // Mythbusters interactive toggle
  const [expandedMyth, setExpandedMyth] = useState<string | null>('myth-1');

  // Timeline year selector
  const [selectedYear, setSelectedYear] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6C4DFF]/20 text-[#6C4DFF] text-xs font-bold border border-[#6C4DFF]/30">
          <Compass className="w-3.5 h-3.5" />
          <span>Trụ Cột 01: Hiểu Luật Chơi</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Khám Phá Bản Đồ Đại Học
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          &quot;Cấp 3 có người nhắc bạn học. Đại học thì chỉ có deadline.&quot;
          <br />
          Nắm rõ luật chơi, giải mã thuật ngữ và định hình lộ trình 4 năm ngay từ vạch xuất phát.
        </p>
      </div>

      {/* 1. ĐẠI HỌC KHÁC CẤP 3 Ở ĐÂU? (3D FLIP CARDS) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              1. Đại Học Khác Cấp 3 Ở Đâu?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Chạm hoặc bấm vào thẻ để lật xem sự thật và lời khuyên sinh tồn:
            </p>
          </div>
          <span className="text-xs text-pink-300 flex items-center gap-1">
            <Repeat className="w-3.5 h-3.5" /> Bấm thẻ để lật (Flip Card)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {comparisonData.map(item => {
            const isFlipped = !!flippedCards[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleFlip(item.id)}
                className="h-64 cursor-pointer perspective-1000 group"
              >
                <div
                  className={`relative w-full h-full rounded-3xl transition-transform duration-500 preserve-3d shadow-xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Side: High School vs University preview */}
                  <div className="absolute inset-0 backface-hidden p-6 rounded-3xl bg-[#1E1A45] border border-white/15 flex flex-col justify-between group-hover:border-[#6C4DFF]/60 transition-colors">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                        <span>#0{item.id}</span>
                        <span className="text-pink-400 flex items-center gap-1">
                          Lật thẻ <Repeat className="w-3 h-3" />
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        {item.aspect}
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                          <span className="font-semibold text-slate-400">🏫 Cấp 3: </span>
                          <span className="text-slate-300">{item.highSchool}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-pink-300 font-semibold">Xem môi trường Đại học...</span>
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Back Side: University reality & Pro Tip */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 rounded-3xl bg-gradient-to-br from-[#2D1B69] to-[#14112E] border border-pink-500/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-pink-300 font-bold mb-2">
                        <span>🎓 ĐẠI HỌC THỰC TẾ</span>
                        <span>{item.aspect}</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed mb-3">
                        {item.university}
                      </p>
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        <span className="font-bold">💡 Mẹo sinh tồn: </span>
                        {item.survivalTip}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-white/10">
                      Chạm để quay lại
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. TỪ ĐIỂN SINH TỒN ĐẠI HỌC (GLOSSARY) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              2. Từ Điển Sinh Tồn Đại Học
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Giải mã toàn bộ thuật ngữ học vụ cốt lõi mà không trường đại học nào dạy chi tiết:
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={glossaryQuery}
                onChange={e => setGlossaryQuery(e.target.value)}
                placeholder="Tra từ khoá..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#6C4DFF]"
              />
            </div>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'hoc-vu', label: 'Học vụ' },
                { key: 'tin-chi', label: 'Tín chỉ' },
                { key: 'ho-tro', label: 'Hỗ trợ' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => { sound.playClick(); setSelectedCategory(f.key); }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    selectedCategory === f.key
                      ? 'bg-white/20 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGlossary.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#1E1A45] border border-white/10 hover:border-sky-400/50 transition-colors space-y-2 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {item.term}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.importance === 'cao'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.importance === 'trung-binh'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}
                  >
                    {item.importance === 'cao' ? 'Cực kỳ quan trọng' : item.importance === 'trung-binh' ? 'Quan trọng' : 'Nên biết'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 7 HIỂU LẦM KINH ĐIỂN (MYTHBUSTERS) */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              3. 7 Hiểu Lầm Kinh Điển (Mythbusters Học Đường)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Các quan niệm sai lầm khiến sinh viên mất hàng trăm giờ học mà không đạt kết quả mong muốn:
          </p>
        </div>

        <div className="space-y-3">
          {MYTHBUSTERS_DATA.map((myth, idx) => {
            const isExpanded = expandedMyth === myth.id;
            return (
              <div
                key={myth.id}
                className="rounded-2xl border border-white/10 bg-[#1E1A45] overflow-hidden transition-all"
              >
                <button
                  onClick={() => {
                    sound.playClick();
                    setExpandedMyth(isExpanded ? null : myth.id);
                  }}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-rose-400">
                        Hiểu lầm: &quot;{myth.myth}&quot;
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {myth.badge}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 shrink-0">
                    {isExpanded ? 'Thu gọn ▲' : 'Sự thật ▼'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-white/10 bg-white/[0.02] space-y-3 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-emerald-300 mb-1">
                          Sự thật theo nghiên cứu khoa học:
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {myth.fact}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Nguồn tài liệu: {myth.researchCitation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LỘ TRÌNH 4 NĂM ĐẠI HỌC (INTERACTIVE TIMELINE) */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              4. Lộ Trình 4 Năm Đại Học (Roadmap)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Bức tranh tổng thể từ lúc chân ướt chân ráo đến khi cầm tấm bằng tốt nghiệp loại Giỏi:
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(yr => (
              <button
                key={yr}
                onClick={() => {
                  sound.playClick();
                  setSelectedYear(yr);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedYear === yr
                    ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Năm {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Year Detailed Card */}
        {(() => {
          const yearData = ROADMAP_DATA.find(r => r.year === selectedYear) || ROADMAP_DATA[0];
          return (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider">
                    Giai đoạn chiến lược
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    {yearData.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{yearData.tagline}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center sm:text-right">
                  <div className="text-[11px] text-slate-400">Mục tiêu năm</div>
                  <div className="text-sm font-bold text-amber-300">GPA ≥ 3.2 - 3.6</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Focus areas */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Trọng Tâm Cần Thực Hiện
                  </h4>
                  <ul className="space-y-2">
                    {yearData.focus.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <span className="w-5 h-5 rounded-md bg-[#6C4DFF]/30 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          ✓
                        </span>
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestones & Pro Tip */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Cột Mốc Thành Tựu
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {yearData.milestones.map((m, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white/5 border border-white/10 text-emerald-300 flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{m}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <span className="font-bold flex items-center gap-1 mb-1">
                      <Lightbulb className="w-4 h-4 text-amber-400" /> Lời khuyên vàng từ khoá trên:
                    </span>
                    <p className="text-slate-200 leading-relaxed">{yearData.proTip}</p>
                  </div>
                </div>
              </div>

              {/* Direct Next Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('methods');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors flex items-center gap-2"
                >
                  <span>Chuyển sang Thư viện phương pháp học tập</span>
                  <Compass className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
};
