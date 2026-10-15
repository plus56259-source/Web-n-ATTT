import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { METHODS_DATA, GLOSSARY_DATA } from '../../data/learningData';
import { ACADEMIC_MATERIALS } from '../../data/academicLibraryData';
import { Search, X, BookOpen, Wrench, Gamepad2, ArrowRight, GraduationCap } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter items
  const matchedMethods = METHODS_DATA.filter(
    m => m.title.toLowerCase().includes(cleanQuery) || m.subtitle.toLowerCase().includes(cleanQuery)
  );

  const matchedGlossary = GLOSSARY_DATA.filter(
    g => g.term.toLowerCase().includes(cleanQuery) || g.definition.toLowerCase().includes(cleanQuery)
  );

  const toolItems = [
    { name: 'Đồng hồ Pomodoro', desc: 'Hẹn giờ tập trung 25/5 & 50/10' },
    { name: 'Tính GPA & Dự báo điểm', desc: 'Quy đổi hệ 10, chữ và hệ 4' },
    { name: 'Thẻ Flashcard Leitner', desc: 'Hệ thống 5 hộp lặp ngắt quãng' },
    { name: 'Thời khóa biểu Planner tuần', desc: 'Phân bổ 168 giờ sinh viên' },
    { name: 'Deadline Tracker', desc: 'Đếm ngược hạn chót & chia nhỏ Pomodoro' },
    { name: 'Ma trận Eisenhower', desc: 'Phân loại 4 nhóm ưu tiên' },
    { name: 'Trình soạn Cornell Note', desc: 'Ghi chú 3 vùng có che tự kiểm tra' },
    { name: 'Âm thanh tập trung Ambient', desc: 'Mưa nhẹ, sóng não Lo-fi, white noise' },
  ].filter(t => t.name.toLowerCase().includes(cleanQuery) || t.desc.toLowerCase().includes(cleanQuery));

  const gameItems = [
    { name: 'Quiz Rush', desc: 'Thử thách 60s đối kháng thời gian' },
    { name: 'Memory Match', desc: 'Ghép cặp thuật ngữ đại học' },
    { name: 'Deadline Survivor', desc: 'Mô phỏng 7 ngày cân bằng chỉ số sinh viên' },
    { name: 'Wordle Học Thuật', desc: 'Đoán từ tiếng Anh học thuật 5 chữ cái' },
    { name: 'Pomodoro Garden', desc: 'Trồng cây xanh khi tập trung sâu' },
    { name: 'Eisenhower Sorter', desc: 'Kéo thả thẻ công việc rơi tự do' },
    { name: 'Boss Fight Cuối Kỳ', desc: 'Đánh bại Boss Kỳ Thi với thanh máu' },
  ].filter(g => g.name.toLowerCase().includes(cleanQuery) || g.desc.toLowerCase().includes(cleanQuery));

  const communityItems = [
    { name: 'Phòng học Study With Me Chill', desc: 'Phòng học ảo webcam, lofi mưa rơi, Pomodoro chung và thả reaction', tab: 'studyroom' as const },
    { name: 'Diễn đàn Sinh viên UniLevelUp', desc: 'Chia sẻ kinh nghiệm kéo GPA, bí kíp học tập và tìm bạn cùng tiến', tab: 'forum' as const },
  ].filter(c => c.name.toLowerCase().includes(cleanQuery) || c.desc.toLowerCase().includes(cleanQuery));

  const matchedMaterials = ACADEMIC_MATERIALS.filter(
    mat =>
      mat.title.toLowerCase().includes(cleanQuery) ||
      mat.subjectCode.toLowerCase().includes(cleanQuery) ||
      mat.university.toLowerCase().includes(cleanQuery) ||
      mat.author.toLowerCase().includes(cleanQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1E1A45] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm phương pháp, công cụ, thuật ngữ, game (vd: ôn thi, pomodoro, gpa)..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="px-2 py-1 text-xs text-slate-400 hover:text-white rounded bg-white/5 border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Quick shortcuts if query is empty */}
          {!query && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Gợi ý tìm kiếm phổ biến
              </div>
              <div className="flex flex-wrap gap-2">
                {['Mindmap', 'Pomodoro', 'Group Study', 'Active Recall', 'Spaced Repetition', 'Cornell', 'Tính GPA'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 text-xs text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg border border-white/10 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Community Items */}
          {communityItems.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-base">☕</span>
                <span>Không Gian & Cộng Đồng ({communityItems.length})</span>
              </div>
              <div className="grid gap-1.5">
                {communityItems.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(c.tab);
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-pink-300 group-hover:text-white transition-colors">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-lg">
                        {c.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Methods */}
          {matchedMethods.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#6C4DFF]" />
                <span>Phương Pháp Học Tập ({matchedMethods.length})</span>
              </div>
              <div className="grid gap-1.5">
                {matchedMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('methods');
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-[#FF4D8D] transition-colors">
                        {m.number}. {m.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-lg">
                        {m.subtitle}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Academic Materials */}
          {matchedMaterials.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Giáo Trình & Tài Liệu Trường Học ({matchedMaterials.length})</span>
              </div>
              <div className="grid gap-1.5">
                {matchedMaterials.map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('library');
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <span>{mat.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-200 font-mono">
                          {mat.universityShort}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 truncate max-w-lg mt-0.5">
                        {mat.subjectCode} · {mat.credits} TC · ✍️ {mat.author.split(',')[0]}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Tools */}
          {toolItems.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#12B886]" />
                <span>Công Cụ Hỗ Trợ ({toolItems.length})</span>
              </div>
              <div className="grid gap-1.5">
                {toolItems.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('tools');
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-[#12B886] transition-colors">
                        {t.name}
                      </div>
                      <div className="text-xs text-slate-400">{t.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Games */}
          {gameItems.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-[#FFB703]" />
                <span>Mini-Game Ôn Bài ({gameItems.length})</span>
              </div>
              <div className="grid gap-1.5">
                {gameItems.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('games');
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-[#FFB703] transition-colors">
                        {g.name}
                      </div>
                      <div className="text-xs text-slate-400">{g.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Glossary */}
          {matchedGlossary.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Thuật Ngữ Đại Học ({matchedGlossary.length})
              </div>
              <div className="grid gap-1.5">
                {matchedGlossary.map(g => (
                  <button
                    key={g.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('discover');
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-sky-400 transition-colors">
                        {g.term}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{g.definition}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query &&
            matchedMethods.length === 0 &&
            matchedMaterials.length === 0 &&
            matchedGlossary.length === 0 &&
            toolItems.length === 0 &&
            gameItems.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <p className="text-sm">Không tìm thấy nội dung nào khớp với &quot;{query}&quot;</p>
                <p className="text-xs text-slate-500 mt-1">
                  Thử tìm từ khoá khác như: &quot;thi&quot;, &quot;pomodoro&quot;, &quot;nhóm&quot;, &quot;tập trung&quot;
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
