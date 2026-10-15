import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Swords,
  Hourglass,
  Brain,
  Type,
  Flower2,
  Layers,
  Trophy,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Play,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import arcaneHtml from '../../games/arcane-dragon-rush.html?raw';
import deadlineHtml from '../../games/cu-bo-san-rong-deadline.html?raw';
import islandsHtml from '../../games/cu-bo-san-kien-thuc.html?raw';

interface StandaloneGame {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  url: string;
  html: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeColor: string;
  description: string;
  features: string[];
}

const EPIC_GAMES: StandaloneGame[] = [
  {
    id: 'arcane',
    name: 'Arcane Dragon Rush — Pháp Sư Săn Rồng',
    subtitle: 'Action Roguelike: Bắn phép ma thuật, combo dồn dập, đấu trí hạ quái & quyết chiến Rồng Vực Thẳm',
    badge: 'Game Chính 1 · Siêu Phẩm Ma Thuật',
    url: '/games/arcane-dragon-rush.html',
    html: arcaneHtml,
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    accentColor: 'from-purple-600/30 via-cyan-500/20 to-pink-500/20 border-cyan-400/50',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    description: 'Điều khiển Pháp sư bay lượn và xả đạn ma thuật tự động. Trả lời câu hỏi học thuật khi chạm trán quái vật, kích hoạt COMBO cực khủng để tăng nhịp điệu âm nhạc Synthwave và mở khóa 4 bản đồ huyền thoại!',
    features: [
      'Bắn phép, lướt né đòn Dash, chiêu thức Nova bộc phá',
      'Đấu trí trả lời câu hỏi khi chạm trán quái vật & Phục kích',
      'Đạt 40 Kills để triệu hồi và quyết chiến Rồng Vực Thẳm',
      'Tủ đồ phong phú: Mũ, áo choàng, vũ khí, hiệu ứng hào quang',
      'Tự nạp đề / câu hỏi ôn tập của riêng bạn trực tiếp trong game',
    ],
  },
  {
    id: 'owl-deadline',
    name: 'Cú Bơ Săn Rồng Deadline',
    subtitle: 'Side-scrolling Runner: Bay qua 6 ải phương pháp học, chọn cổng đáp án đúng, hạ gục Rồng Deadline',
    badge: 'Game Chính 2 · Sinh Tồn 6 Màn',
    url: '/games/cu-bo-san-rong-deadline.html',
    html: deadlineHtml,
    icon: <Hourglass className="w-5 h-5 text-cyan-400" />,
    accentColor: 'from-cyan-600/30 via-emerald-500/20 to-amber-500/20 border-emerald-400/50',
    badgeColor: 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black',
    description: 'Hóa thân thành Cú Bơ thông thái bay qua bầu trời campus. Tự động bắn bút mực diệt quái phân tâm (điện thoại, game, zzz) và bay xuyên qua làn có đáp án đúng để mở đường tiêu diệt Rồng Deadline!',
    features: [
      '6 Màn phương pháp học: Mindmap, Pomodoro, Group Study, Active Recall, Spaced Repetition, Cornell',
      'Cơ chế bay xuyên cổng đáp án (A, B, C, D hoặc Đúng/Sai)',
      'Bắn bút mực tiêu diệt quái phân tâm & nhặt cà phê hồi máu',
      'Đại chiến Trùm Rồng Deadline với cơ chế né cầu lửa',
      'Tùy chỉnh phụ kiện nón cử nhân, mũ phù thủy, kính ngầu, vương miện',
    ],
  },
  {
    id: 'owl-islands',
    name: 'Cú Bơ Săn Kiến Thức',
    subtitle: 'Open-world Campus: Khám phá 6 đảo tri thức kỳ vĩ, né điện thoại phân tâm & hạ gục Quái Trì Hoãn',
    badge: 'Game Chính 3 · Thế Giới Mở Campus',
    url: '/games/cu-bo-san-kien-thuc.html',
    html: islandsHtml,
    icon: <Compass className="w-5 h-5 text-rose-400" />,
    accentColor: 'from-pink-600/30 via-amber-500/20 to-indigo-500/20 border-pink-400/50',
    badgeColor: 'bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-black',
    description: 'Bay tự do trên bầu trời đêm campus rộng lớn 3600x2400. Chinh phục từng hòn đảo tri thức cổ xưa với 4 dạng câu hỏi đa dạng (trắc nghiệm, đúng/sai, sắp xếp thứ tự, điền từ) và tiêu diệt Quái Trì Hoãn!',
    features: [
      'Bản đồ thế giới mở Campus cực rộng kèm Radar định vị thu nhỏ',
      'Hệ thống 4 dạng câu đố: Trắc nghiệm, Đúng/Sai, Sắp xếp thứ tự, Điền từ',
      'Tránh né điện thoại thông minh bay lượn bám theo hút năng lượng não',
      'Thu thập cà phê hồi phục năng lượng & sách bí kíp thủ khoa',
      'Đại chiến trùm Quái Trì Hoãn khổng lồ "Zzz... Để mai!"',
    ],
  },
];

export const GameZoneView: React.FC = () => {
  const { addXP, setIsGameFullscreen } = useApp();
  const [selectedGameId, setSelectedGameId] = useState<string>('arcane');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Sync fullscreen state with App-level context to hide navbar and top features
  useEffect(() => {
    setIsGameFullscreen(isFullscreen);
    return () => {
      setIsGameFullscreen(false);
    };
  }, [isFullscreen, setIsGameFullscreen]);

  // Bonus mini-games states
  const [selectedMini, setSelectedMini] = useState<'none' | 'wordle' | 'memory' | 'garden' | 'sorter'>('none');

  // Mini Wordle
  const WORDLE_TARGET = 'FOCUS';
  const [wordleGuesses, setWordleGuesses] = useState<string[]>([]);
  const [currentWordleInput, setCurrentWordleInput] = useState('');
  const [wordleWon, setWordleWon] = useState(false);

  // Mini Memory
  const memoryPairs = [
    { id: '1', term: 'Tín chỉ', matchId: '1' },
    { id: '1_def', term: 'Đơn vị khối lượng học tập', matchId: '1' },
    { id: '2', term: 'Syllabus', matchId: '2' },
    { id: '2_def', term: 'Đề cương & lịch học môn', matchId: '2' },
    { id: '3', term: 'Active Recall', matchId: '3' },
    { id: '3_def', term: 'Tự nhớ lại thay vì đọc lại', matchId: '3' },
    { id: '4', term: 'GPA', matchId: '4' },
    { id: '4_def', term: 'Điểm trung bình học kỳ', matchId: '4' },
  ];
  const [memoryCards, setMemoryCards] = useState(() =>
    [...memoryPairs].sort(() => Math.random() - 0.5)
  );
  const [flippedMemoryCards, setFlippedMemoryCards] = useState<number[]>([]);
  const [matchedMemoryPairs, setMatchedMemoryPairs] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Mini Sorter
  const sorterTasks = [
    { title: 'Nộp báo cáo đồ án vi xử lý vào sáng mai', correct: 'do', explanation: 'Việc vừa khẩn cấp vừa quan trọng!' },
    { title: 'Lên kế hoạch ôn tập sức bền vật liệu trước 2 tuần', correct: 'schedule', explanation: 'Việc quan trọng nhưng chưa gấp.' },
    { title: 'Nhờ bạn cùng phòng mượn hộ giáo trình thư viện', correct: 'delegate', explanation: 'Việc khẩn nhưng có thể nhờ người khác.' },
    { title: 'Lướt mạng xã hội 3 tiếng vô định', correct: 'eliminate', explanation: 'Không khẩn, không quan trọng!' },
  ];
  const [sorterIndex, setSorterIndex] = useState(0);
  const [sorterFeedback, setSorterFeedback] = useState<string | null>(null);

  const activeEpicGame = EPIC_GAMES.find(g => g.id === selectedGameId) || EPIC_GAMES[0];

  const handleSelectGame = (id: string) => {
    sound.playClick();
    setSelectedGameId(id);
    setSelectedMini('none');
    setIframeKey(prev => prev + 1);
    addXP(15, `Khởi động ${EPIC_GAMES.find(g => g.id === id)?.name}`);
  };

  const handleReloadGame = () => {
    sound.playClick();
    setIframeKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    sound.playClick();
    try {
      const blob = new Blob([activeEpicGame.html], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(activeEpicGame.url, '_blank', 'noopener,noreferrer');
    }
  };

  const exitFullscreen = () => {
    sound.playClick();
    setIsFullscreen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (isFullscreen) {
      exitFullscreen();
    } else {
      setIsFullscreen(true);
    }
  };

  // Keyboard shortcut: Escape to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Sync with browser native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Đấu Trường Trò Chơi Học Thuật Đỉnh Cao</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Game Zone — 3 Game Chính Đại Chiến
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tận hưởng 3 tựa game hành động &amp; phiêu lưu học thuật đỉnh cao được tích hợp nguyên bản. Vừa thỏa sức giải trí, vừa rèn luyện kiến thức và nhận hàng trăm điểm XP!
        </p>
      </div>

      {/* --- 3 GAME CHÍNH SELECTION CARDS --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
            3 Game Chính Đỉnh Cao (Tam Trụ Game Đại Học)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EPIC_GAMES.map(g => {
            const isSelected = selectedGameId === g.id && selectedMini === 'none';
            return (
              <div
                key={g.id}
                onClick={() => handleSelectGame(g.id)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group shadow-xl ${
                  isSelected
                    ? `bg-gradient-to-br ${g.accentColor} ring-2 ring-cyan-400 scale-[1.02] shadow-cyan-500/20`
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${g.badgeColor}`}>
                      {g.badge}
                    </span>
                    <div className="p-2.5 rounded-2xl bg-white/10 group-hover:scale-110 transition-transform">
                      {g.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {g.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {g.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className={`font-bold flex items-center gap-1.5 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSelected ? 'Đang chơi ngay' : 'Bấm để chơi'}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MAIN GAME ARENA (FULLSCREEN OR EMBEDDED IFRAME) --- */}
      {selectedMini === 'none' && (
        <div
          className={`transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-[999999] w-screen h-screen bg-[#05040a] p-0 m-0 flex flex-col overflow-hidden'
              : 'relative space-y-4'
          }`}
        >
          {/* FLOATING QUICK EXIT FULLSCREEN BUTTON (ALWAYS VISIBLE OVERLAY WHEN FULLSCREEN) */}
          {isFullscreen && (
            <div className="fixed top-4 right-4 z-[9999999] flex items-center gap-2 drop-shadow-2xl">
              <button
                onClick={handleReloadGame}
                className="px-3 py-2 rounded-full bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-white/20 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Tải lại ván mới"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chơi lại</span>
              </button>
              <button
                onClick={exitFullscreen}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_8px_30px_rgba(225,29,72,0.7)] backdrop-blur-md border-2 border-white/40 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-rose-500/40"
                title="Bấm nút này hoặc nhấn phím ESC để thoát toàn màn hình"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Thoát Toàn Màn Hình</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/30 text-rose-100">ESC</span>
                <X className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          )}

          {/* Top Controls Toolbar - HIDDEN IN FULLSCREEN TO PREVENT COVERING EXIT BUTTON OR DISTRACTING */}
          {!isFullscreen && (
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300">
                  {activeEpicGame.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>{activeEpicGame.name}</span>
                    <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono">
                      ĐANG CHẠY TRỰC TIẾP
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    {activeEpicGame.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReloadGame}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Tải lại ván mới"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chơi lại</span>
                </button>
                <button
                  onClick={handleOpenInNewTab}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Mở toàn màn hình trong tab riêng"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tab mới</span>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer bg-gradient-to-r from-cyan-400 to-[#6C4DFF] text-slate-950"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Toàn màn hình</span>
                </button>
              </div>
            </div>
          )}

          {/* Embedded Standalone HTML5 Game */}
          <div className={isFullscreen ? 'w-full h-full flex-1 overflow-hidden bg-[#080616]' : 'relative rounded-3xl overflow-hidden border-2 border-cyan-400/40 shadow-2xl bg-[#080616]'}>
            <iframe
              key={`${selectedGameId}-${iframeKey}`}
              ref={iframeRef}
              srcDoc={activeEpicGame.html}
              title={activeEpicGame.name}
              className={`w-full border-0 bg-[#080616] ${
                isFullscreen ? 'w-full h-full' : 'h-[540px] sm:h-[720px] lg:h-[780px]'
              }`}
              allow="autoplay; fullscreen; clipboard-write; clipboard-read"
            />
          </div>

          {/* Mobile Gameplay Tip Bar */}
          {!isFullscreen && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs sm:hidden">
              <span className="text-base">📱</span>
              <span>
                <strong>Mẹo trên điện thoại:</strong> Game hỗ trợ đầy đủ cần điều khiển D-pad/Joystick ảo và nút Bắn/Lướt trên màn hình cảm ứng!
              </span>
            </div>
          )}

          {/* Game Features & Guide Pills */}
          {!isFullscreen && (
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tính Năng &amp; Cơ Chế Đỉnh Cao Của Tựa Game:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-200">
                {activeEpicGame.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- 4 MINI-GAMES RÈN LUYỆN BỔ TRỢ --- */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              Hoặc Thư Giãn Nhanh Với 4 Mini-Game Ôn Bài Nhẹ Nhàng:
            </h3>
          </div>
          {selectedMini !== 'none' && (
            <button
              onClick={() => setSelectedMini('none')}
              className="text-xs text-cyan-300 hover:text-white font-bold"
            >
              ← Quay lại 3 Game Chính
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'wordle' as const, label: 'Wordle Học Thuật', icon: <Type className="w-3.5 h-3.5" /> },
            { key: 'memory' as const, label: 'Memory Match', icon: <Brain className="w-3.5 h-3.5" /> },
            { key: 'garden' as const, label: 'Pomodoro Garden', icon: <Flower2 className="w-3.5 h-3.5" /> },
            { key: 'sorter' as const, label: 'Eisenhower Sorter', icon: <Layers className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                sound.playClick();
                setSelectedMini(tab.key);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                selectedMini === tab.key
                  ? 'bg-gradient-to-r from-pink-500 to-[#6C4DFF] text-white font-black shadow-md'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mini Game: Wordle */}
        {selectedMini === 'wordle' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#13192B] border border-white/15 shadow-2xl max-w-xl mx-auto space-y-6">
            <div className="border-b border-white/10 pb-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase">
                <Type className="w-3.5 h-3.5" />
                <span>Đoán Từ Học Thuật 5 Chữ Cái</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-0.5">Wordle Học Thuật</h3>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              {Array.from({ length: 6 }).map((_, rowIdx) => {
                const guess = wordleGuesses[rowIdx] || '';
                return (
                  <div key={rowIdx} className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }).map((_, colIdx) => {
                      const char = guess[colIdx] || '';
                      const isTarget = WORDLE_TARGET[colIdx] === char;
                      const inTarget = WORDLE_TARGET.includes(char);
                      let bg = 'bg-white/5 border-white/10 text-white';
                      if (guess) {
                        if (isTarget) bg = 'bg-emerald-500 text-slate-950 font-black';
                        else if (inTarget) bg = 'bg-amber-400 text-slate-950 font-bold';
                        else bg = 'bg-white/10 text-slate-500';
                      }
                      return (
                        <div
                          key={colIdx}
                          className={`aspect-square rounded-xl border flex items-center justify-center font-mono font-bold text-sm ${bg}`}
                        >
                          {char}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {!wordleWon && wordleGuesses.length < 6 ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (currentWordleInput.length !== 5 || wordleGuesses.length >= 6 || wordleWon) return;
                  const clean = currentWordleInput.toUpperCase();
                  setWordleGuesses([...wordleGuesses, clean]);
                  setCurrentWordleInput('');
                  if (clean === WORDLE_TARGET) {
                    sound.playSuccess();
                    setWordleWon(true);
                    addXP(30, 'Chiến thắng Wordle Học Thuật');
                  } else {
                    sound.playClick();
                  }
                }}
                className="flex gap-2 max-w-xs mx-auto"
              >
                <input
                  type="text"
                  maxLength={5}
                  value={currentWordleInput}
                  onChange={e => setCurrentWordleInput(e.target.value.toUpperCase())}
                  placeholder="NHẬP 5 KÝ TỰ..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white font-mono text-center tracking-widest uppercase text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Đoán
                </button>
              </form>
            ) : (
              <div className="text-center p-4 rounded-2xl bg-white/5 text-xs text-slate-200">
                <div className="font-bold text-cyan-300">{wordleWon ? 'CHÍNH XÁC!' : `ĐÁP ÁN: ${WORDLE_TARGET}`}</div>
                <p className="mt-1 text-slate-300">FOCUS: Tập trung chú ý vào một mục tiêu duy nhất / Tiêu điểm nhận thức</p>
              </div>
            )}
          </div>
        )}

        {/* Mini Game: Memory Match */}
        {selectedMini === 'memory' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#13192B] border border-white/15 shadow-2xl max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-pink-400 uppercase">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Ghép Cặp Thuật Ngữ Đại Học</span>
                </div>
                <h3 className="text-2xl font-black text-white mt-0.5">Memory Match</h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400 font-mono">Lượt lật: {memoryMoves}</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setMemoryCards([...memoryPairs].sort(() => Math.random() - 0.5));
                    setFlippedMemoryCards([]);
                    setMatchedMemoryPairs([]);
                    setMemoryMoves(0);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {memoryCards.map((card, idx) => {
                const isFlipped = flippedMemoryCards.includes(idx) || matchedMemoryPairs.includes(card.matchId);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (flippedMemoryCards.length === 2 || flippedMemoryCards.includes(idx)) return;
                      sound.playCardFlip();
                      const newFlipped = [...flippedMemoryCards, idx];
                      setFlippedMemoryCards(newFlipped);
                      if (newFlipped.length === 2) {
                        setMemoryMoves(m => m + 1);
                        const cardA = memoryCards[newFlipped[0]];
                        const cardB = memoryCards[newFlipped[1]];
                        if (cardA.matchId === cardB.matchId) {
                          sound.playSuccess();
                          setMatchedMemoryPairs(prev => [...prev, cardA.matchId]);
                          setFlippedMemoryCards([]);
                          if (matchedMemoryPairs.length + 1 === memoryPairs.length / 2) {
                            addXP(35, 'Hoàn thành Memory Match');
                          }
                        } else {
                          setTimeout(() => {
                            sound.playError();
                            setFlippedMemoryCards([]);
                          }, 900);
                        }
                      }
                    }}
                    className={`aspect-[4/3] rounded-2xl p-3 flex items-center justify-center text-center font-bold text-xs transition-all duration-300 border ${
                      isFlipped
                        ? 'bg-gradient-to-br from-cyan-500/20 to-[#6C4DFF]/30 border-cyan-400/50 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                    }`}
                  >
                    {isFlipped ? card.term : '?'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mini Game: Garden */}
        {selectedMini === 'garden' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#13192B] border border-white/15 shadow-2xl max-w-3xl mx-auto space-y-6">
            <div className="border-b border-white/10 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase">
                <Flower2 className="w-3.5 h-3.5" />
                <span>Khu Vườn Cây Tập Trung Pomodoro</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-0.5">Pomodoro Garden</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'p1', name: 'Hoa Hướng Dương', subject: 'Giải tích 1', min: 25 },
                { id: 'p2', name: 'Oải Hương Tập Trung', subject: 'Tiếng Anh học thuật', min: 50 },
                { id: 'p3', name: 'Bonsai Kiên Trì', subject: 'Kinh tế vi mô', min: 25 },
              ].map(p => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                    <Flower2 className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xs text-white">{p.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {p.subject} · {p.min} phút
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini Game: Sorter */}
        {selectedMini === 'sorter' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#13192B] border border-white/15 shadow-2xl max-w-xl mx-auto space-y-6">
            <div className="border-b border-white/10 pb-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase">
                <Layers className="w-3.5 h-3.5" />
                <span>Phân Loại Nhiệm Vụ 4 Ô</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-0.5">Eisenhower Sorter</h3>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center font-bold text-sm text-white">
              {sorterTasks[sorterIndex % sorterTasks.length].title}
            </div>

            {sorterFeedback && (
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs text-center font-semibold">
                {sorterFeedback}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { cat: 'do', label: '1. Làm ngay', color: 'bg-rose-500/20 border-rose-500/30 text-rose-300' },
                { cat: 'schedule', label: '2. Lên lịch', color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
                { cat: 'delegate', label: '3. Uỷ quyền', color: 'bg-amber-500/20 border-amber-500/30 text-amber-300' },
                { cat: 'eliminate', label: '4. Cắt bỏ', color: 'bg-slate-500/20 border-slate-500/30 text-slate-400' },
              ].map(b => (
                <button
                  key={b.cat}
                  onClick={() => {
                    const task = sorterTasks[sorterIndex % sorterTasks.length];
                    if (b.cat === task.correct) {
                      sound.playSuccess();
                      setSorterFeedback(`Chính xác! ${task.explanation}`);
                      addXP(10, 'Phân loại đúng Ma trận Eisenhower');
                    } else {
                      sound.playError();
                      setSorterFeedback(`Chưa đúng: ${task.explanation}`);
                    }
                    setTimeout(() => {
                      setSorterIndex(i => (i + 1) % sorterTasks.length);
                      setSorterFeedback(null);
                    }, 1500);
                  }}
                  className={`p-4 rounded-xl border text-xs font-bold transition-all hover:scale-102 active:scale-98 ${b.color}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
