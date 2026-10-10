import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QUIZ_BANK } from '../../data/learningData';
import {
  Gamepad2,
  Zap,
  RotateCcw,
  Heart,
  Award,
  Sparkles,
  Shield,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const GameZoneView: React.FC = () => {
  const { addXP, unlockBadge, gardenPlants } = useApp();
  const [selectedGame, setSelectedGame] = useState<'rush' | 'memory' | 'survivor' | 'wordle' | 'garden' | 'sorter' | 'boss'>('rush');

  // --- GAME 1: QUIZ RUSH STATE ---
  const [rushTimeLeft, setRushTimeLeft] = useState(60);
  const [rushIsPlaying, setRushIsPlaying] = useState(false);
  const [rushScore, setRushScore] = useState(0);
  const [rushCombo, setRushCombo] = useState(1);
  const [rushHearts, setRushHearts] = useState(3);
  const [rushCurrentQIndex, setRushCurrentQIndex] = useState(0);
  const [rushGameOver, setRushGameOver] = useState(false);
  const [rushCorrectCount, setRushCorrectCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rushIsPlaying && rushTimeLeft > 0 && rushHearts > 0) {
      timer = setInterval(() => {
        setRushTimeLeft(t => t - 1);
      }, 1000);
    } else if (rushIsPlaying && (rushTimeLeft === 0 || rushHearts === 0)) {
      setRushIsPlaying(false);
      setRushGameOver(true);
      const earnedXP = Math.round(rushScore / 2);
      addXP(earnedXP, `Quiz Rush đạt ${rushScore} điểm`);
      if (rushCorrectCount >= 10) {
        unlockBadge('quiz-speedster');
      }
    }
    return () => clearInterval(timer);
  }, [rushIsPlaying, rushTimeLeft, rushHearts, rushScore, rushCorrectCount, addXP, unlockBadge]);

  const startQuizRush = () => {
    sound.playClick();
    setRushTimeLeft(60);
    setRushScore(0);
    setRushCombo(1);
    setRushHearts(3);
    setRushCurrentQIndex(0);
    setRushGameOver(false);
    setRushCorrectCount(0);
    setRushIsPlaying(true);
  };

  const handleRushAnswer = (choiceIdx: number) => {
    if (!rushIsPlaying) return;
    const q = QUIZ_BANK[rushCurrentQIndex % QUIZ_BANK.length];
    if (choiceIdx === q.correct) {
      sound.playSuccess();
      const points = 10 * rushCombo;
      setRushScore(s => s + points);
      setRushCombo(c => Math.min(5, c + 1));
      setRushCorrectCount(c => c + 1);
    } else {
      sound.playError();
      setRushCombo(1);
      setRushHearts(h => h - 1);
    }
    setRushCurrentQIndex(prev => prev + 1);
  };

  // --- GAME 2: MEMORY MATCH STATE ---
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

  const handleMemoryCardClick = (idx: number) => {
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
  };

  const resetMemoryMatch = () => {
    sound.playClick();
    setMemoryCards([...memoryPairs].sort(() => Math.random() - 0.5));
    setFlippedMemoryCards([]);
    setMatchedMemoryPairs([]);
    setMemoryMoves(0);
  };

  // --- GAME 3: DEADLINE SURVIVOR STATE ---
  const [survivorDay, setSurvivorDay] = useState(1);
  const [survivorStats, setSurvivorStats] = useState({ knowledge: 30, energy: 80, morale: 70, social: 50 });
  const [survivorLogs, setSurvivorLogs] = useState<string[]>(['Bắt đầu kỳ thi 7 ngày phía trước. Hãy cân bằng 4 chỉ số!']);
  const [survivorEnded, setSurvivorEnded] = useState(false);

  const handleSurvivorAction = (action: 'study' | 'sleep' | 'party' | 'exercise') => {
    sound.playClick();
    let newStats = { ...survivorStats };
    let logMsg = '';

    if (action === 'study') {
      newStats.knowledge = Math.min(100, newStats.knowledge + 20);
      newStats.energy = Math.max(0, newStats.energy - 15);
      newStats.morale = Math.max(0, newStats.morale - 5);
      logMsg = `Ngày ${survivorDay}: Học Pomodoro sâu (+20 Kiến thức, -15 Năng lượng)`;
    } else if (action === 'sleep') {
      newStats.energy = Math.min(100, newStats.energy + 30);
      newStats.morale = Math.min(100, newStats.morale + 10);
      logMsg = `Ngày ${survivorDay}: Ngủ đủ 8 tiếng (+30 Năng lượng, +10 Tinh thần)`;
    } else if (action === 'party') {
      newStats.social = Math.min(100, newStats.social + 25);
      newStats.morale = Math.min(100, newStats.morale + 15);
      newStats.energy = Math.max(0, newStats.energy - 20);
      logMsg = `Ngày ${survivorDay}: Đi chơi với bạn bè (+25 Quan hệ, -20 Năng lượng)`;
    } else if (action === 'exercise') {
      newStats.energy = Math.min(100, newStats.energy + 10);
      newStats.morale = Math.min(100, newStats.morale + 15);
      logMsg = `Ngày ${survivorDay}: Tập thể dục & hít thở (+15 Tinh thần)`;
    }

    setSurvivorStats(newStats);
    setSurvivorLogs(prev => [logMsg, ...prev]);

    if (survivorDay < 7) {
      setSurvivorDay(d => d + 1);
    } else {
      setSurvivorEnded(true);
      addXP(40, 'Vượt qua mô phỏng 7 ngày sinh viên');
    }
  };

  const resetSurvivor = () => {
    sound.playClick();
    setSurvivorDay(1);
    setSurvivorStats({ knowledge: 30, energy: 80, morale: 70, social: 50 });
    setSurvivorLogs(['Khởi động lại mô phỏng 7 ngày.']);
    setSurvivorEnded(false);
  };

  // --- GAME 4: WORDLE HỌC THUẬT STATE ---
  const WORDLE_TARGET = 'FOCUS';
  const WORDLE_MEANING = 'FOCUS: Tập trung chú ý vào một mục tiêu duy nhất / Tiêu điểm nhận thức';
  const [wordleGuesses, setWordleGuesses] = useState<string[]>([]);
  const [currentWordleInput, setCurrentWordleInput] = useState('');
  const [wordleWon, setWordleWon] = useState(false);

  const handleWordleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWordleInput.length !== 5 || wordleGuesses.length >= 6 || wordleWon) return;
    const cleanWord = currentWordleInput.toUpperCase();
    const updated = [...wordleGuesses, cleanWord];
    setWordleGuesses(updated);
    setCurrentWordleInput('');

    if (cleanWord === WORDLE_TARGET) {
      sound.playSuccess();
      setWordleWon(true);
      addXP(30, 'Chiến thắng Wordle Học Thuật');
    } else {
      sound.playClick();
    }
  };

  // --- GAME 6: EISENHOWER SORTER STATE ---
  const sorterTasks = [
    { title: 'Nộp báo cáo tiểu luận vào ngày mai', correct: 'do', explanation: 'Việc vừa khẩn cấp vừa quan trọng!' },
    { title: 'Lên kế hoạch ôn thi trước 2 tuần', correct: 'schedule', explanation: 'Việc quan trọng nhưng chưa gấp.' },
    { title: 'Nhờ bạn cùng phòng lấy hộ gói hàng', correct: 'delegate', explanation: 'Việc khẩn nhưng có thể nhờ người khác.' },
    { title: 'Lướt TikTok 2 tiếng vô định', correct: 'eliminate', explanation: 'Không khẩn, không quan trọng!' },
  ];
  const [sorterIndex, setSorterIndex] = useState(0);
  const [sorterScore, setSorterScore] = useState(0);
  const [sorterFeedback, setSorterFeedback] = useState<string | null>(null);

  const handleSorterChoice = (cat: string) => {
    const task = sorterTasks[sorterIndex % sorterTasks.length];
    if (cat === task.correct) {
      sound.playSuccess();
      setSorterScore(s => s + 10);
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
  };

  // --- GAME 7: BOSS FIGHT KỲ THI CUỐI KỲ STATE ---
  const [bossHP, setBossHP] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [bossQIndex, setBossQIndex] = useState(0);
  const [bossWon, setBossWon] = useState(false);
  const [bossLost, setBossLost] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);

  const currentBossQ = QUIZ_BANK[bossQIndex % QUIZ_BANK.length];

  const handleBossAttack = (idx: number) => {
    if (bossWon || bossLost) return;
    if (idx === currentBossQ.correct) {
      sound.playSuccess();
      const dmg = 20;
      const nextHP = Math.max(0, bossHP - dmg);
      setBossHP(nextHP);
      if (nextHP === 0) {
        setBossWon(true);
        addXP(60, 'Đánh bại Boss Kỳ Thi Cuối Kỳ');
        unlockBadge('boss-slayer');
      }
    } else {
      sound.playError();
      if (shieldActive) {
        setShieldActive(false);
      } else {
        const nextEnergy = Math.max(0, playerEnergy - 25);
        setPlayerEnergy(nextEnergy);
        if (nextEnergy === 0) {
          setBossLost(true);
        }
      }
    }
    setBossQIndex(prev => prev + 1);
  };

  const handleUseShield = () => {
    sound.playClick();
    setShieldActive(true);
  };

  const resetBossFight = () => {
    sound.playClick();
    setBossHP(100);
    setPlayerEnergy(100);
    setBossQIndex(0);
    setBossWon(false);
    setBossLost(false);
    setShieldActive(false);
  };

  const gameTabs = [
    { key: 'rush', label: '1. Quiz Rush', icon: '⚡' },
    { key: 'memory', label: '2. Memory Match', icon: '🧠' },
    { key: 'survivor', label: '3. Deadline Survivor', icon: '⏳' },
    { key: 'wordle', label: '4. Wordle Học Thuật', icon: '🔤' },
    { key: 'garden', label: '5. Pomodoro Garden', icon: '🌻' },
    { key: 'sorter', label: '6. Eisenhower Sorter', icon: '🗂️' },
    { key: 'boss', label: '7. Boss Fight Cuối Kỳ', icon: '👹' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFB703]/20 text-amber-300 text-xs font-bold border border-[#FFB703]/30">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Trụ Cột 04: Luyện Bằng Chơi (Gamification)</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Game Zone — Lên Cấp Cùng Đại Học
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Nguyên tắc: Mỗi game phải dạy được một phương pháp khoa học. Vừa chơi vừa ghi nhớ, tích luỹ XP và rinh huy hiệu độc quyền!
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto no-scrollbar">
        {gameTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              sound.playClick();
              setSelectedGame(tab.key as any);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              selectedGame === tab.key
                ? 'bg-gradient-to-r from-[#FFB703] to-[#FF4D8D] text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- G1: QUIZ RUSH --- */}
      {selectedGame === 'rush' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400">ACTIVE RECALL TỐC ĐỘ CAO</span>
              <h3 className="text-2xl font-black text-white mt-0.5">G1: Quiz Rush (60 Giây)</h3>
            </div>

            {rushIsPlaying && (
              <div className="flex items-center gap-4 text-xs">
                <span className="font-mono font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                  ⏱️ {rushTimeLeft}s
                </span>
                <span className="font-mono font-bold text-[#FFB703] bg-amber-500/10 px-3 py-1 rounded-lg">
                  Điểm: {rushScore}
                </span>
                <span className="font-mono font-bold text-pink-400">
                  Combo: x{rushCombo}
                </span>
                <div className="flex text-rose-400">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 ${i < rushHearts ? 'fill-rose-500' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {!rushIsPlaying && !rushGameOver ? (
            <div className="text-center py-10 space-y-4">
              <Zap className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-bold text-white">Sẵn sàng phản xạ với Quiz Rush?</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                60 giây giải câu đố phương pháp học tập đại học. Đúng liên tiếp kích hoạt combo x2, x3, x5 điểm thưởng!
              </p>
              <button
                onClick={startQuizRush}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#FFB703] to-[#FF4D8D] text-slate-900 font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
              >
                Bắt đầu Quiz Rush
              </button>
            </div>
          ) : rushGameOver ? (
            <div className="text-center py-8 space-y-4">
              <Award className="w-16 h-16 text-amber-400 mx-auto" />
              <h4 className="text-2xl font-black text-white">Kết Thúc Ván Chơi!</h4>
              <div className="text-3xl font-mono font-black text-pink-400">
                {rushScore} ĐIỂM
              </div>
              <p className="text-xs text-slate-300">
                Đúng {rushCorrectCount} câu hỏi · Nhận +{Math.round(rushScore / 2)} XP
              </p>
              <button
                onClick={startQuizRush}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Chơi Lại Ván Khác
              </button>
            </div>
          ) : (
            /* Live Question */
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-base font-bold text-white leading-relaxed">
                {QUIZ_BANK[rushCurrentQIndex % QUIZ_BANK.length].question}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUIZ_BANK[rushCurrentQIndex % QUIZ_BANK.length].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleRushAnswer(oIdx)}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left text-xs text-slate-200 hover:text-white font-medium transition-all group active:scale-98"
                  >
                    <span className="font-bold text-[#FFB703] mr-2">
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- G2: MEMORY MATCH --- */}
      {selectedGame === 'memory' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-pink-400">GHÉP THUẬT NGỮ ĐẠI HỌC</span>
              <h3 className="text-2xl font-black text-white mt-0.5">G2: Memory Match</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400 font-mono">Số lượt lật: {memoryMoves}</span>
              <button
                onClick={resetMemoryMatch}
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
                  onClick={() => handleMemoryCardClick(idx)}
                  className={`h-28 rounded-2xl p-3 text-center flex flex-col items-center justify-center border transition-all ${
                    isFlipped
                      ? 'bg-gradient-to-tr from-[#6C4DFF]/30 to-[#FF4D8D]/30 border-pink-500/50 text-white font-bold text-xs'
                      : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 text-sm'
                  }`}
                >
                  {isFlipped ? card.term : '❓'}
                </button>
              );
            })}
          </div>

          {matchedMemoryPairs.length === memoryPairs.length / 2 && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <div className="text-base font-bold text-emerald-300">
                🎉 Hoàn thành xuất sắc trong {memoryMoves} lượt! (+35 XP)
              </div>
              <button
                onClick={resetMemoryMatch}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-900 font-bold text-xs"
              >
                Chơi Lại Ván Mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- G3: DEADLINE SURVIVOR --- */}
      {selectedGame === 'survivor' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400">MÔ PHỎNG 7 NGÀY SINH VIÊN</span>
              <h3 className="text-2xl font-black text-white mt-0.5">G3: Deadline Survivor</h3>
            </div>
            <span className="text-xs font-mono font-bold text-pink-300">
              {survivorEnded ? 'Kết Thúc Kỳ Thi' : `Ngày ${survivorDay} / 7`}
            </span>
          </div>

          {/* 4 Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-400 mb-1">📚 Kiến thức</div>
              <div className="text-base font-bold font-mono text-sky-400">{survivorStats.knowledge}/100</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-400 mb-1">⚡ Năng lượng</div>
              <div className="text-base font-bold font-mono text-emerald-400">{survivorStats.energy}/100</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-400 mb-1">🧘 Tinh thần</div>
              <div className="text-base font-bold font-mono text-amber-400">{survivorStats.morale}/100</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-slate-400 mb-1">🤝 Quan hệ</div>
              <div className="text-base font-bold font-mono text-pink-400">{survivorStats.social}/100</div>
            </div>
          </div>

          {!survivorEnded ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 font-semibold">
                Chọn hành động cho ngày {survivorDay}:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleSurvivorAction('study')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all"
                >
                  📖 Học Pomodoro
                </button>
                <button
                  onClick={() => handleSurvivorAction('sleep')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all"
                >
                  😴 Ngủ phục hồi
                </button>
                <button
                  onClick={() => handleSurvivorAction('party')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all"
                >
                  🎉 Gặp bạn bè
                </button>
                <button
                  onClick={() => handleSurvivorAction('exercise')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all"
                >
                  🏃 Tập thể thao
                </button>
              </div>

              {/* Log */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-[11px] text-slate-400 max-h-24 overflow-y-auto space-y-1">
                {survivorLogs.map((l, i) => (
                  <div key={i}>• {l}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <h4 className="text-xl font-bold text-white">Kết Quả 7 Ngày:</h4>
              <p className="text-xs text-slate-300">
                {survivorStats.knowledge >= 70 && survivorStats.energy >= 40
                  ? '🏆 XẾP HẠNG: HUYỀN THOẠI CAMPUS! Bạn cân bằng hoàn hảo giữa điểm số và sức khỏe!'
                  : survivorStats.knowledge >= 50
                  ? '⭐ XẾP HẠNG: SỐNG SÓT QUA MÔN! Hãy chú ý ngủ nhiều hơn.'
                  : '⚠️ CẢNH BÁO: KIỆT SỨC! Hãy thử lại và bảo vệ giấc ngủ nhé.'}
              </p>
              <button
                onClick={resetSurvivor}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Chơi Lại Tuần Mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- G4: WORDLE HỌC THUẬT --- */}
      {selectedGame === 'wordle' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1 border-b border-white/10 pb-4">
            <span className="text-xs font-mono font-bold text-emerald-400">TỪ VỰNG TIẾNG ANH HỌC THUẬT</span>
            <h3 className="text-2xl font-black text-white">G4: Wordle Học Thuật</h3>
            <p className="text-xs text-slate-400">Đoán từ tiếng Anh 5 chữ cái trong 6 lượt:</p>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, rowIdx) => {
              const guess = wordleGuesses[rowIdx] || (rowIdx === wordleGuesses.length ? currentWordleInput.padEnd(5, ' ') : '     ');
              return (
                <div key={rowIdx} className="grid grid-cols-5 gap-2">
                  {guess.split('').map((char, cIdx) => {
                    const isSubmitted = rowIdx < wordleGuesses.length;
                    let bg = 'bg-white/5 border-white/10';
                    if (isSubmitted) {
                      if (WORDLE_TARGET[cIdx] === char) {
                        bg = 'bg-emerald-500 text-white border-emerald-500';
                      } else if (WORDLE_TARGET.includes(char)) {
                        bg = 'bg-amber-500 text-slate-900 border-amber-500';
                      } else {
                        bg = 'bg-slate-700 text-slate-400 border-slate-700';
                      }
                    }
                    return (
                      <div
                        key={cIdx}
                        className={`h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-lg text-white ${bg}`}
                      >
                        {char.trim()}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {!wordleWon && wordleGuesses.length < 6 ? (
            <form onSubmit={handleWordleSubmit} className="flex gap-2">
              <input
                type="text"
                maxLength={5}
                placeholder="Gõ từ 5 ký tự..."
                value={currentWordleInput}
                onChange={e => setCurrentWordleInput(e.target.value.toUpperCase())}
                className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-center tracking-widest uppercase focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs"
              >
                Đoán
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1 text-center">
              <div className="font-bold">🎉 {wordleWon ? 'CHÍNH XÁC!' : 'ĐÁP ÁN: ' + WORDLE_TARGET}</div>
              <p className="text-slate-200">{WORDLE_MEANING}</p>
            </div>
          )}
        </div>
      )}

      {/* --- G5: POMODORO GARDEN --- */}
      {selectedGame === 'garden' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400">TRỒNG CÂY TẬP TRUNG</span>
              <h3 className="text-2xl font-black text-white mt-0.5">G5: Pomodoro Garden</h3>
            </div>
            <span className="text-xs font-mono text-amber-300">
              Tổng số cây: {gardenPlants.length}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Mỗi phiên Pomodoro bạn hoàn thành sẽ nuôi lớn 1 mầm cây. Tích luỹ đủ 7 cây trong tuần để nhận danh hiệu &quot;Rừng Nhỏ Campus&quot;!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gardenPlants.map(p => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2 hover:border-emerald-400 transition-colors"
              >
                <div className="text-4xl">
                  {p.type === 'sunflower' ? '🌻' : p.type === 'bonsai' ? '🪴' : '🪻'}
                </div>
                <div className="text-xs font-bold text-white truncate">{p.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {p.durationMin} phút tập trung
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- G6: EISENHOWER SORTER --- */}
      {selectedGame === 'sorter' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400">PHÂN LOẠI 4 Ô ƯU TIÊN</span>
              <h3 className="text-2xl font-black text-white mt-0.5">G6: Eisenhower Sorter</h3>
            </div>
            <span className="text-xs font-mono font-bold text-white bg-white/10 px-3 py-1 rounded-xl">
              Điểm: {sorterScore}
            </span>
          </div>

          {/* Current card */}
          <div className="p-6 rounded-2xl bg-white/10 border border-white/15 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Nhiệm vụ cần phân loại:
            </span>
            <h4 className="text-lg font-black text-white">
              {sorterTasks[sorterIndex % sorterTasks.length].title}
            </h4>
          </div>

          {sorterFeedback && (
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 text-center">
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
                onClick={() => handleSorterChoice(b.cat)}
                className={`p-4 rounded-xl border text-xs font-bold transition-all hover:scale-102 active:scale-98 ${b.color}`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- G7: BOSS FIGHT KỲ THI CUỐI KỲ --- */}
      {selectedGame === 'boss' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-rose-400">TRẬN CHIẾN CUỐI CÙNG</span>
              <h3 className="text-2xl font-black text-white mt-0.5">G7: Boss Fight Kỳ Thi Cuối Kỳ</h3>
            </div>
            <button
              onClick={resetBossFight}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Boss & Player HP Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Boss HP */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-rose-300">
                <span>👹 Ông Kẹ Cuối Kỳ</span>
                <span className="font-mono">{bossHP} / 100 HP</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${bossHP}%` }}
                />
              </div>
            </div>

            {/* Player Energy */}
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-sky-300">
                <span>🛡️ Năng Lượng Của Bạn</span>
                <span className="font-mono">{playerEnergy} / 100</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-300"
                  style={{ width: `${playerEnergy}%` }}
                />
              </div>
            </div>
          </div>

          {!bossWon && !bossLost ? (
            <div className="space-y-6">
              {/* Question */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white">
                {currentBossQ.question}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentBossQ.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleBossAttack(optIdx)}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left text-xs text-white font-medium transition-all"
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {/* Skill Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Vật phẩm kỹ năng:</span>
                <button
                  onClick={handleUseShield}
                  disabled={shieldActive}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>{shieldActive ? 'Khiên đang bảo vệ' : 'Kích hoạt Khiên Chắn'}</span>
                </button>
              </div>
            </div>
          ) : bossWon ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
              <h4 className="text-2xl font-black text-emerald-300">🏆 KHUẤT PHỤC BOSS THÀNH CÔNG!</h4>
              <p className="text-xs text-slate-200">
                Bạn đã vượt qua mọi câu hỏi hóc búa của kỳ thi cuối kỳ! Nhận +60 XP và Huy hiệu Boss Slayer!
              </p>
              <button
                onClick={resetBossFight}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-900 font-extrabold text-xs"
              >
                Đấu lại
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
              <h4 className="text-2xl font-black text-rose-300">💀 BẠN ĐÃ HẾT NĂNG LƯỢNG!</h4>
              <p className="text-xs text-slate-200">
                Đừng lo, hãy ôn lại Flashcard và thử sức lại nhé!
              </p>
              <button
                onClick={resetBossFight}
                className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs"
              >
                Thử Lại Trận Đấu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
