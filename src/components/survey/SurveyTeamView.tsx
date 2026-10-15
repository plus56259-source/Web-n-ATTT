import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  PieChart,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldCheck,
  Target,
  FileText,
  Presentation,
  Code,
  Layers,
  ArrowRight,
  Info,
  Smartphone,
  BookOpen,
  Timer,
  Bot,
  ExternalLink,
} from 'lucide-react';
import {
  SURVEY_CHARTS,
  SURVEY_METRICS,
  TEAM_MEMBERS,
  SurveyChart,
  PieSlice,
  BarItem,
  TeamMember,
} from '../../data/surveyData';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/soundEffects';

export const SurveyTeamView: React.FC = () => {
  const { theme, setActiveTab, showToast } = useApp();
  const [activeSection, setActiveSection] = useState<'all' | 'charts' | 'team'>('all');
  const [copiedChartId, setCopiedChartId] = useState<string | null>(null);
  const [activeChartFilter, setActiveChartFilter] = useState<'all' | 'pie' | 'bar'>('all');

  const handleCopyChartData = (chart: SurveyChart) => {
    sound.playClick();
    let text = `${chart.title}\n(Tổng số: ${chart.totalResponses} câu trả lời)\n---\n`;
    if (chart.type === 'pie') {
      const slices = chart.data as PieSlice[];
      slices.forEach((s) => {
        text += `• ${s.label}: ${s.percent}% (${s.count} bạn)\n`;
      });
    } else {
      const bars = chart.data as BarItem[];
      bars.forEach((b) => {
        text += `• ${b.label}: ${b.count} (${b.percent}%)\n`;
      });
    }
    navigator.clipboard.writeText(text);
    setCopiedChartId(chart.id);
    showToast('Đã sao chép!', `Số liệu "${chart.title}" đã được lưu vào bộ nhớ tạm.`, 'success');
    setTimeout(() => setCopiedChartId(null), 2500);
  };

  const filteredCharts = SURVEY_CHARTS.filter((c) => {
    if (activeChartFilter === 'all') return true;
    return c.type === activeChartFilter;
  });

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 font-sans">
      {/* --- HERO HEADER --- */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border border-sky-400/20 bg-gradient-to-br from-[#0c1633]/90 via-[#131d42]/90 to-[#090e24]/90 backdrop-blur-2xl shadow-2xl">
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C4DFF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF4D8D]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#6C4DFF]/30 to-[#FF4D8D]/30 border border-[#6C4DFF]/40 text-pink-300 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Khảo Sát Thực Tiễn & Hồ Sơ Nhóm
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Quy mô mẫu: 102 sinh viên
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Độ tin cậy: 100% Số liệu gốc
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Khảo Sát Thực Tiễn Học Tập &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-purple-300 to-[#FF4D8D]">
                Đội Ngũ Thực Hiện
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Dữ liệu nghiên cứu thực tiễn từ <strong>102 sinh viên đại học</strong> về khó khăn, thói quen tự học, phương pháp khoa học và công cụ công nghệ — nền tảng xây dựng hệ sinh thái học tập <strong>UniLevelUp</strong>.
            </p>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mẫu khảo sát</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">102</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sinh viên trả lời</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> Dùng công cụ AI
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-200 mt-1">92,2%</div>
              <div className="text-[11px] text-purple-300/80 mt-0.5">94 / 102 sinh viên</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> Xao nhãng bởi ĐT
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-200 mt-1">68,6%</div>
              <div className="text-[11px] text-rose-300/80 mt-0.5">Khó khăn số 1 (70 bạn)</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> Thích Pomodoro
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-200 mt-1">58,8%</div>
              <div className="text-[11px] text-emerald-300/80 mt-0.5">Phương pháp dẫn đầu</div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSection('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSection === 'all'
                  ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-lg shadow-[#6C4DFF]/30 scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Xem Tất Cả</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveSection('charts');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSection === 'charts'
                  ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-lg shadow-[#6C4DFF]/30 scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Biểu Đồ Khảo Sát (7 biểu đồ)</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveSection('team');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSection === 'team'
                  ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-lg shadow-[#6C4DFF]/30 scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Thành Viên Nhóm Dự Án (7 bạn)</span>
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 1: KHẢO SÁT THỰC TIỄN (CHARTS) --- */}
      {(activeSection === 'all' || activeSection === 'charts') && (
        <section className="rounded-3xl border border-sky-400/20 bg-gradient-to-br from-[#0c1633]/80 via-[#10193d]/80 to-[#090e24]/80 backdrop-blur-2xl p-5 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8 relative overflow-hidden">
          {/* Subtle ambient glow inside section */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#6C4DFF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#6C4DFF] to-pink-500" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  I. Báo Cáo Khảo Sát Thực Tiễn (102 Câu Trả Lời)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 ml-4.5">
                Toàn bộ tên câu hỏi, hạng mục và số liệu được giữ nguyên bản tuyệt đối theo phiếu khảo sát
              </p>
            </div>

            {/* Sub-filter for charts */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveChartFilter('all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeChartFilter === 'all' ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả (7)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveChartFilter('pie');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  activeChartFilter === 'pie' ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <PieChart className="w-3 h-3" /> Tròn (4)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveChartFilter('bar');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  activeChartFilter === 'bar' ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3 h-3" /> Cột (3)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 relative z-10">
            {filteredCharts.map((chart, idx) => (
              <div
                key={chart.id}
                className={`rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0e172e]/90 backdrop-blur-xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-xl hover:border-sky-400/40 hover:shadow-2xl hover:shadow-sky-950/30 transition-all duration-300 relative group overflow-hidden min-w-0 ${
                  chart.type === 'bar' && chart.data.length > 5 ? 'lg:col-span-2' : ''
                }`}
              >
                {/* Chart Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-cyan-400/20">
                          Biểu đồ #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {chart.totalResponses} câu trả lời
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-300 transition-colors leading-snug">
                        {chart.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {chart.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyChartData(chart)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shrink-0 active:scale-95 shadow-sm"
                      title="Sao chép toàn bộ số liệu câu hỏi này"
                    >
                      {copiedChartId === chart.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Chart Body Render */}
                <div className="my-5 sm:my-6 min-w-0">
                  {chart.type === 'pie' ? (
                    <DonutChartRenderer slices={chart.data as PieSlice[]} total={chart.totalResponses} />
                  ) : (
                    <HorizontalBarRenderer bars={chart.data as BarItem[]} total={chart.totalResponses} />
                  )}
                </div>

                {/* Chart Footer & Key Takeaway */}
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="text-white">Ý nghĩa thực tiễn: </strong>
                      <span>{chart.takeaway}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SECTION 2: GIỚI THIỆU THÀNH VIÊN NHÓM --- */}
      {(activeSection === 'all' || activeSection === 'team') && (
        <section className="rounded-3xl border border-pink-400/20 bg-gradient-to-br from-[#0c1633]/80 via-[#10193d]/80 to-[#090e24]/80 backdrop-blur-2xl p-5 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8 relative overflow-hidden">
          {/* Subtle ambient glow inside section */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FF4D8D]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#FF4D8D] to-purple-500" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  II. Đội Ngũ Thành Viên Nhóm Dự Án
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 ml-4.5">
                Thông tin phân công nhiệm vụ và mã số sinh viên theo đúng tài liệu hồ sơ
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                7 Thành viên chính thức
              </span>
            </div>
          </div>

          {/* Standard Academic Table Representation */}
          <div className="rounded-3xl border border-white/10 bg-[#0e172e]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 bg-white/5 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Bảng Phân Công Nhiệm Vụ Thành Viên Nhóm
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-sky-300 font-medium sm:hidden">
                  Vuốt ngang để xem đủ bảng →
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Mẫu chuẩn hồ sơ báo cáo
                </span>
              </div>
            </div>

            <div className="overflow-x-auto touch-pan-x scrollbar-thin">
              <table className="w-full text-left text-xs sm:text-sm min-w-[550px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/60 text-slate-300 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-4 sm:px-6 w-20">Thứ tự</th>
                    <th className="py-3.5 px-4 sm:px-6">Vai trò</th>
                    <th className="py-3.5 px-4 sm:px-6">Họ và tên</th>
                    <th className="py-3.5 px-4 sm:px-6 w-36 font-mono">MSSV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {TEAM_MEMBERS.map((member, i) => (
                    <tr
                      key={member.id}
                      className={`hover:bg-white/5 transition-colors ${
                        i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-bold font-mono">
                        <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-cyan-300">
                          {member.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-200 font-medium">
                        {member.role}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${member.avatarColor} text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0`}
                          >
                            {member.initials}
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-emerald-400">
                        {member.studentId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modern Member Profile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#131d42]/90 to-[#0a1024]/90 backdrop-blur-xl p-5 flex flex-col justify-between shadow-xl hover:border-pink-500/40 hover:-translate-y-1 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${member.avatarColor} text-white font-black text-base flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200 border border-white/20`}
                    >
                      {member.initials}
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black font-mono bg-white/10 border border-white/15 text-pink-300">
                      {member.code}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-white group-hover:text-pink-300 transition-colors">
                    {member.name}
                  </h4>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">MSSV:</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      {member.studentId}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-[#6C4DFF]" />
                      <span>Vai trò phụ trách:</span>
                    </div>
                    <p className="text-xs font-semibold text-white leading-relaxed">
                      {member.role}
                    </p>

                    <div className="pt-2 space-y-1.5">
                      {member.detailedTasks.map((task, tidx) => (
                        <div key={tidx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 mt-1.5" />
                          <span className="line-clamp-2">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Dự án UniLevelUp</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Đã nghiệm thu
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SECTION 3: LIÊN KẾT GIẢI PHÁP UNILEVELUP --- */}
      <section className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-pink-900/40 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-400" />
              Từ Khảo Sát Thực Tiễn Đến Nền Tảng UniLevelUp
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Toàn bộ tính năng trên website đều được xây dựng dựa trên kết quả giải quyết trực diện 4 khó khăn lớn nhất của 102 sinh viên: Xao nhãng, quá tải kiến thức, thiếu quản lý thời gian và cách áp dụng AI hiệu quả.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('studyroom');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:opacity-95 transition-all"
            >
              <span>Vào Study With Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('tools');
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span>Xem 12 Công Cụ</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- SUB-COMPONENT: DONUT CHART RENDERER (SVG) --- */
const DonutChartRenderer: React.FC<{ slices: PieSlice[]; total: number }> = ({ slices, total }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG parameters tuned so the stroke never clips or overflows the viewBox
  const size = 180;
  const strokeWidth = 24;
  const radius = 72; // max stroke radius on hover: 72 + 14 = 86 < 90 (180/2), zero clipping guaranteed
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const segments = slices.map((s, idx) => {
    const strokeDasharray = `${(s.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += s.percent;
    return {
      ...s,
      idx,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 min-w-0">
      {/* Donut SVG */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 overflow-visible"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg) => (
            <circle
              key={seg.idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={hoveredIdx === seg.idx ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(seg.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-3">
          {activeSlice ? (
            <>
              <span className="text-xl sm:text-2xl font-black text-white">{activeSlice.percent}%</span>
              <span className="text-[10px] font-bold text-slate-300 truncate max-w-[110px]" title={activeSlice.label}>
                {activeSlice.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeSlice.count} / {total} bạn
              </span>
            </>
          ) : (
            <>
              <span className="text-xl sm:text-2xl font-black text-white">{total}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Phản hồi
              </span>
              <span className="text-[9px] text-pink-300/80 mt-0.5">Rê chuột xem</span>
            </>
          )}
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="flex-1 w-full min-w-0 space-y-1.5 sm:space-y-2">
        {slices.map((slice, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 min-w-0 ${
                isHovered
                  ? 'bg-white/10 border-white/25 shadow-md translate-x-0.5'
                  : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
              }`}
              title={`${slice.label}: ${slice.percent}% (${slice.count} sinh viên)`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-xs font-semibold text-slate-200 truncate block">
                  {slice.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-right">
                <span className="text-xs font-mono font-bold text-white px-1.5 py-0.5 rounded bg-white/10">
                  {slice.percent}%
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ({slice.count})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* --- SUB-COMPONENT: HORIZONTAL BAR RENDERER --- */
const HorizontalBarRenderer: React.FC<{ bars: BarItem[]; total: number }> = ({ bars, total }) => {
  return (
    <div className="space-y-3.5 min-w-0">
      {bars.map((bar, idx) => (
        <div key={idx} className="space-y-1.5 group/bar min-w-0">
          <div className="flex items-center justify-between gap-3 text-xs min-w-0">
            <span
              className="font-semibold text-slate-200 group-hover/bar:text-white transition-colors truncate block flex-1 min-w-0"
              title={bar.label}
            >
              {bar.label}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono font-black text-sm text-white">
                {bar.count}
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-300">
                {bar.percent}%
              </span>
            </div>
          </div>

          {/* Progress Track */}
          <div className="h-3 w-full rounded-full bg-white/5 border border-white/10 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${bar.accentClass} transition-all duration-700 ease-out`}
              style={{ width: `${bar.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
