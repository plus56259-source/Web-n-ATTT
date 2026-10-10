import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Timer,
  Calculator,
  Layers,
  Calendar,
  Clock,
  Grid,
  FileText,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Flame,
  Printer,
  Sliders,
  AlertCircle,
  HelpCircle,
  Edit3,
  Edit2,
  PlusCircle,
  RotateCw,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import { sound, AmbientPlayer } from '../../utils/soundEffects';

const ambientGen = new AmbientPlayer();

export const ToolsView: React.FC = () => {
  const {
    courses,
    addCourse,
    deleteCourse,
    deadlines,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    decks,
    updateCardReview,
    addFlashcardDeck,
    updateFlashcardDeck,
    deleteFlashcardDeck,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    resetDeckProgress,
    addPlantToGarden,
    eisenTasks,
    addEisenTask,
    toggleEisenTask,
    deleteEisenTask,
    user,
    addXP,
    setQuizOpen,
    setSearchOpen,
    toggleTheme,
    theme,
  } = useApp();

  const [activeToolTab, setActiveToolTab] = useState<string>('pomodoro');

  // --- TOOL 1: POMODORO STATE ---
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);
  const [pomoIsActive, setPomoIsActive] = useState(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'break'>('work');
  const [pomoSubject, setPomoSubject] = useState('Giải tích');
  const [pomoTaskName, setPomoTaskName] = useState('Giải 5 bài tập chương 2');
  const [pomoTotalSessionsToday, setPomoTotalSessionsToday] = useState(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pomoIsActive && pomoSecondsLeft > 0) {
      timer = setInterval(() => {
        setPomoSecondsLeft(s => s - 1);
      }, 1000);
      document.title = `${String(Math.floor(pomoSecondsLeft / 60)).padStart(2, '0')}:${String(pomoSecondsLeft % 60).padStart(2, '0')} · ${pomoMode === 'work' ? 'Tập trung' : 'Nghỉ ngơi'}`;
    } else if (pomoIsActive && pomoSecondsLeft === 0) {
      sound.playTing();
      setPomoIsActive(false);
      if (pomoMode === 'work') {
        setPomoTotalSessionsToday(c => c + 1);
        addPlantToGarden({
          type: 'sunflower',
          name: 'Hoa Hướng Dương ' + pomoSubject,
          status: 'bloomed',
          durationMin: pomoMinutes,
          subject: pomoSubject,
        });
        addXP(20, `Hoàn thành phiên Pomodoro môn ${pomoSubject}`);
        // Switch to break
        setPomoMode('break');
        setPomoSecondsLeft(5 * 60);
      } else {
        setPomoMode('work');
        setPomoSecondsLeft(pomoMinutes * 60);
        sound.playSuccess();
      }
    }
    return () => {
      clearInterval(timer);
      document.title = 'UniLevelUp — Lên Level Cùng Đại Học';
    };
  }, [pomoIsActive, pomoSecondsLeft, pomoMode, pomoMinutes, pomoSubject, addPlantToGarden, addXP]);

  const handleStartPomo = (mins: number) => {
    sound.playClick();
    setPomoMinutes(mins);
    setPomoSecondsLeft(mins * 60);
    setPomoMode('work');
    setPomoIsActive(true);
  };

  const handleTogglePomo = () => {
    sound.playClick();
    setPomoIsActive(!pomoIsActive);
  };

  const handleResetPomo = () => {
    sound.playClick();
    setPomoIsActive(false);
    setPomoSecondsLeft(pomoMinutes * 60);
  };

  // --- TOOL 2: GPA CALCULATOR & FORECAST ---
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseScore10, setNewCourseScore10] = useState(8.5);

  const calculateLetterAnd4 = (score10: number): { letter: string; score4: number } => {
    if (score10 >= 8.5) return { letter: 'A', score4: 4.0 };
    if (score10 >= 8.0) return { letter: 'B+', score4: 3.5 };
    if (score10 >= 7.0) return { letter: 'B', score4: 3.0 };
    if (score10 >= 6.5) return { letter: 'C+', score4: 2.5 };
    if (score10 >= 5.5) return { letter: 'C', score4: 2.0 };
    if (score10 >= 5.0) return { letter: 'D+', score4: 1.5 };
    if (score10 >= 4.0) return { letter: 'D', score4: 1.0 };
    return { letter: 'F', score4: 0.0 };
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    const { letter, score4 } = calculateLetterAnd4(newCourseScore10);
    addCourse({
      name: newCourseName.trim(),
      credits: newCourseCredits,
      score10: newCourseScore10,
      letterGrade: letter,
      score4,
    });
    setNewCourseName('');
  };

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalWeightedScore = courses.reduce((sum, c) => sum + c.score4 * c.credits, 0);
  const currentGPA = totalCredits > 0 ? (totalWeightedScore / totalCredits).toFixed(2) : '0.00';

  // GPA Target Forecaster
  const [targetGoalGPA, setTargetGoalGPA] = useState(3.6);
  const [plannedCreditsThisTerm, setPlannedCreditsThisTerm] = useState(15);
  // Formula: target = (currentWeighted + neededGPA * plannedCredits) / (totalCredits + plannedCredits)
  // => neededGPA = [targetGoalGPA * (totalCredits + plannedCredits) - currentWeighted] / plannedCredits
  const neededTermGPA = (
    (targetGoalGPA * (totalCredits + plannedCreditsThisTerm) - totalWeightedScore) /
    plannedCreditsThisTerm
  ).toFixed(2);

  // --- TOOL 3: FLASHCARD LEITNER STATE ---
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const currentDeck = decks[activeDeckIndex] || decks[0] || { id: 'temp', name: 'Bộ thẻ', description: '', cards: [] };
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [userTypedAnswer, setUserTypedAnswer] = useState('');
  const [showAnswerCheck, setShowAnswerCheck] = useState(false);
  const currentCard = currentDeck?.cards?.[activeCardIndex] || currentDeck?.cards?.[0];

  // Flashcard Deck & Card Management Modals & State
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const [newDeckNameInput, setNewDeckNameInput] = useState('');
  const [newDeckDescInput, setNewDeckDescInput] = useState('');

  const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false);
  const [editDeckNameInput, setEditDeckNameInput] = useState('');
  const [editDeckDescInput, setEditDeckDescInput] = useState('');

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [newCardQuestionInput, setNewCardQuestionInput] = useState('');
  const [newCardAnswerInput, setNewCardAnswerInput] = useState('');

  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editCardQuestionInput, setEditCardQuestionInput] = useState('');
  const [editCardAnswerInput, setEditCardAnswerInput] = useState('');

  const [showCardManager, setShowCardManager] = useState(false);
  const [searchCardText, setSearchCardText] = useState('');

  const handleFlipCard = () => {
    sound.playCardFlip();
    setIsCardFlipped(!isCardFlipped);
  };

  const handleCardRate = (rating: 'easy' | 'hard' | 'forgot') => {
    if (!currentCard || !currentDeck) return;
    updateCardReview(currentDeck.id, currentCard.id, rating);
    setIsCardFlipped(false);
    setUserTypedAnswer('');
    setShowAnswerCheck(false);
    if (currentDeck.cards && currentDeck.cards.length > 0) {
      setActiveCardIndex(prev => (prev + 1) % currentDeck.cards.length);
    }
  };

  // --- TOOL 4: 168H PLANNER STATE ---
  interface PlannerTimeSlotConfig {
    id: string;
    name: string;
    hours: string;
  }

  interface PlannerCellData {
    title: string;
    category: 'deep_work' | 'lecture' | 'review' | 'exercise' | 'group' | 'rest' | 'club';
    durationHours: number;
    note?: string;
  }

  const DEFAULT_PLANNER_SLOTS: PlannerTimeSlotConfig[] = [
    { id: 'morning', name: 'Sáng', hours: '07:00 – 11:30' },
    { id: 'afternoon', name: 'Chiều', hours: '13:00 – 17:00' },
    { id: 'evening', name: 'Tối', hours: '19:00 – 22:30' },
  ];

  const DEFAULT_PLANNER_CELLS: Record<string, PlannerCellData> = {
    'morning-0': { title: 'Lên lớp', category: 'lecture', durationHours: 4.5 },
    'morning-1': { title: 'Lên lớp', category: 'lecture', durationHours: 4.5 },
    'morning-2': { title: 'Tự học 90p', category: 'deep_work', durationHours: 1.5, note: 'Giải tích 1' },
    'morning-3': { title: 'Lên lớp', category: 'lecture', durationHours: 4.5 },
    'morning-4': { title: 'Lên lớp', category: 'lecture', durationHours: 4.5 },
    'morning-5': { title: 'Thể thao', category: 'exercise', durationHours: 2 },
    'morning-6': { title: 'Ngủ nướng & Chill', category: 'rest', durationHours: 3 },

    'afternoon-0': { title: 'Tự học 90p', category: 'deep_work', durationHours: 1.5, note: 'Kinh tế vi mô' },
    'afternoon-1': { title: 'Làm thêm / CLB', category: 'club', durationHours: 3 },
    'afternoon-2': { title: 'Lên lớp', category: 'lecture', durationHours: 4 },
    'afternoon-3': { title: 'Tự học 90p', category: 'deep_work', durationHours: 1.5, note: 'Triết học Mác' },
    'afternoon-4': { title: 'Ôn Flashcard', category: 'review', durationHours: 1 },
    'afternoon-5': { title: 'Dự án nhóm', category: 'group', durationHours: 2.5, note: 'Họp online' },
    'afternoon-6': { title: 'Tự học 60p', category: 'deep_work', durationHours: 1 },

    'evening-0': { title: 'Flashcard 20p', category: 'review', durationHours: 0.5 },
    'evening-1': { title: 'Đọc sách 30p', category: 'deep_work', durationHours: 0.5 },
    'evening-2': { title: 'Họp CLB', category: 'club', durationHours: 2 },
    'evening-3': { title: 'Flashcard 20p', category: 'review', durationHours: 0.5 },
    'evening-4': { title: 'Giải trí', category: 'rest', durationHours: 2 },
    'evening-5': { title: 'Bạn bè & Cà phê', category: 'rest', durationHours: 2 },
    'evening-6': { title: 'Tổng kết tuần 10p', category: 'deep_work', durationHours: 0.5 },
  };

  const [plannerSlots, setPlannerSlots] = useState<PlannerTimeSlotConfig[]>(() => {
    try {
      const saved = localStorage.getItem('unilevelup_planner_slots');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PLANNER_SLOTS;
  });

  const [plannerCells, setPlannerCells] = useState<Record<string, PlannerCellData>>(() => {
    try {
      const saved = localStorage.getItem('unilevelup_planner_cells');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PLANNER_CELLS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('unilevelup_planner_slots', JSON.stringify(plannerSlots));
    } catch {}
  }, [plannerSlots]);

  useEffect(() => {
    try {
      localStorage.setItem('unilevelup_planner_cells', JSON.stringify(plannerCells));
    } catch {}
  }, [plannerCells]);

  // Planner Modals
  const [editingCellCoord, setEditingCellCoord] = useState<{ slotId: string; dayIndex: number } | null>(null);
  const [cellEditTitle, setCellEditTitle] = useState('');
  const [cellEditCategory, setCellEditCategory] = useState<'deep_work' | 'lecture' | 'review' | 'exercise' | 'group' | 'rest' | 'club'>('deep_work');
  const [cellEditDuration, setCellEditDuration] = useState(1.5);
  const [cellEditNote, setCellEditNote] = useState('');

  const [editingSlotConfig, setEditingSlotConfig] = useState<PlannerTimeSlotConfig | null>(null);
  const [editSlotNameInput, setEditSlotNameInput] = useState('');
  const [editSlotHoursInput, setEditSlotHoursInput] = useState('');

  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlotNameInput, setNewSlotNameInput] = useState('');
  const [newSlotHoursInput, setNewSlotHoursInput] = useState('');

  const totalWeeklyStudyHours = Object.values(plannerCells).reduce((acc, cell) => {
    if (['deep_work', 'review', 'group'].includes(cell.category)) {
      return acc + (Number(cell.durationHours) || 0);
    }
    return acc;
  }, 0);

  // --- TOOL 5: DEADLINE TRACKER FORM ---
  const [newDeadTitle, setNewDeadTitle] = useState('');
  const [newDeadSubject, setNewDeadSubject] = useState('');
  const [newDeadDate, setNewDeadDate] = useState('');
  const [newDeadPriority, setNewDeadPriority] = useState<'high' | 'medium' | 'low'>('high');

  const handleAddDeadlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadTitle.trim() || !newDeadDate) return;
    addDeadline({
      title: newDeadTitle.trim(),
      subject: newDeadSubject.trim() || 'Môn học',
      dueDate: new Date(newDeadDate).toISOString(),
      priority: newDeadPriority,
      progress: 0,
      subtasks: ['Phiên 1: Lên dàn ý (25p)', 'Phiên 2: Thu thập tài liệu (25p)', 'Phiên 3: Soạn nội dung (25p)'],
    });
    setNewDeadTitle('');
    setNewDeadSubject('');
    setNewDeadDate('');
  };

  const getDaysLeft = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  // --- TOOL 6: EISENHOWER NEW TASK ---
  const [newEisenTitle, setNewEisenTitle] = useState('');
  const [newEisenCat, setNewEisenCat] = useState<'do' | 'schedule' | 'delegate' | 'eliminate'>('do');

  const handleAddEisenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEisenTitle.trim()) return;
    addEisenTask({
      title: newEisenTitle.trim(),
      category: newEisenCat,
    });
    setNewEisenTitle('');
  };

  // --- TOOL 7: CORNELL NOTES STATE ---
  const [cornellSubject, setCornellSubject] = useState('Kinh tế vi mô — Chương 3: Cơ Chế Giá Thị Trường');
  const [cornellDate, setCornellDate] = useState('2026-10-08');
  const [cornellKeywords, setCornellKeywords] = useState('• Giá trần (Price Ceiling) là gì?\n• Tác động thiếu hụt hàng hoá?\n• Ví dụ thị trường xăng dầu?\n• Giá sàn (Price Floor) áp dụng khi nào?');
  const [cornellNotes, setCornellNotes] = useState('1. Giá trần là mức giá tối đa do nhà nước quy định.\n2. Khi P_trần < P_cân bằng: Lượng cầu (Qd) > Lượng cung (Qs) dẫn đến hiện tượng thiếu hụt hàng hóa trên thị trường.\n3. Hậu quả thực tế: Xuất hiện thị trường chợ đen, phải xếp hàng phân phối bằng tem phiếu.\n4. Giá sàn áp dụng khi bảo vệ người sản xuất (ví dụ lương tối thiểu).');
  const [cornellSummary, setCornellSummary] = useState('Tóm tắt 3 câu: Giá trần bảo vệ người mua nhưng gây thiếu hụt nếu đặt thấp hơn giá cân bằng. Giá sàn bảo vệ người bán nhưng sinh ra dư thừa hàng hóa. Cần cân nhắc can thiệp của chính phủ.');
  const [hideNotesForRecall, setHideNotesForRecall] = useState(false);

  // --- TOOL 8: AMBIENT SOUND GENERATOR ---
  const [activeSoundType, setActiveSoundType] = useState<'rain' | 'noise' | 'lofi' | 'bell' | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.5);

  const handleToggleAmbient = (type: 'rain' | 'noise' | 'lofi' | 'bell') => {
    sound.playClick();
    if (activeSoundType === type) {
      ambientGen.stop();
      setActiveSoundType(null);
    } else {
      ambientGen.start(type, ambientVolume);
      setActiveSoundType(type);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    ambientGen.setVolume(vol);
  };

  const toolTabs = [
    { key: 'pomodoro', label: '1. Pomodoro Timer', icon: <Timer className="w-4 h-4" /> },
    { key: 'gpa', label: '2. Tính GPA & Dự báo', icon: <Calculator className="w-4 h-4" /> },
    { key: 'flashcard', label: '3. Flashcard Leitner', icon: <Layers className="w-4 h-4" /> },
    { key: 'planner', label: '4. Planner Tuần 168h', icon: <Calendar className="w-4 h-4" /> },
    { key: 'deadline', label: '5. Deadline Tracker', icon: <Clock className="w-4 h-4" /> },
    { key: 'eisenhower', label: '6. Ma trận Eisenhower', icon: <Grid className="w-4 h-4" /> },
    { key: 'cornell', label: '7. Ghi chép Cornell', icon: <FileText className="w-4 h-4" /> },
    { key: 'ambient', label: '8. Âm thanh tập trung', icon: <Volume2 className="w-4 h-4" /> },
    { key: 'streak', label: '9. Streak & Thói quen', icon: <Flame className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12B886]/20 text-[#12B886] text-xs font-bold border border-[#12B886]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trụ Cột 04: Bộ Công Cụ Trực Tuyến</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          12 Công Cụ Học Tập Thực Dụng
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Chạy trực tiếp trong trình duyệt máy tính và điện thoại. Dữ liệu lưu an toàn trong máy bạn, không lo mất mạng.
        </p>
      </div>

      {/* Tool Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto no-scrollbar">
        {toolTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              sound.playClick();
              setActiveToolTab(tab.key);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              activeToolTab === tab.key
                ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT CONTAINER --- */}
      <div className="space-y-8">
        {/* 1. POMODORO TIMER */}
        {activeToolTab === 'pomodoro' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                pomoMode === 'work'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {pomoMode === 'work' ? '🎯 GIAI ĐOẠN TẬP TRUNG SÂU' : '☕ GIAI ĐOẠN NGHỈ NGƠI TÍCH CỰC'}
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                Đồng Hồ Pomodoro Tập Trung
              </h2>
            </div>

            {/* Circular Progress & Clock */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-white/10 flex flex-col items-center justify-center bg-black/30 shadow-inner">
                {/* Visual state color aura */}
                <div
                  className={`absolute inset-4 rounded-full blur-2xl opacity-30 transition-colors ${
                    pomoMode === 'work' ? 'bg-[#6C4DFF]' : 'bg-[#12B886]'
                  }`}
                />
                <div className="relative z-10 text-6xl sm:text-7xl font-mono font-black text-white tracking-tight">
                  {String(Math.floor(pomoSecondsLeft / 60)).padStart(2, '0')}:
                  {String(pomoSecondsLeft % 60).padStart(2, '0')}
                </div>
                <div className="relative z-10 text-xs font-mono text-slate-400 mt-2">
                  {pomoIsActive ? 'Đang đếm ngược...' : 'Đã dừng'}
                </div>
              </div>

              {/* Subject & Task input */}
              <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Môn học đang làm:</label>
                  <input
                    type="text"
                    value={pomoSubject}
                    onChange={e => setPomoSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Đầu việc cụ thể:</label>
                  <input
                    type="text"
                    value={pomoTaskName}
                    onChange={e => setPomoTaskName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleTogglePomo}
                  className={`px-8 py-3.5 rounded-2xl text-sm font-extrabold transition-all flex items-center gap-2 shadow-xl ${
                    pomoIsActive
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-[#6C4DFF]/30'
                  }`}
                >
                  {pomoIsActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{pomoIsActive ? 'Tạm Dừng' : 'Bắt Đầu Làm (+20 XP)'}</span>
                </button>

                <button
                  onClick={handleResetPomo}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                  title="Đặt lại phiên"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-slate-400">Chọn nhanh:</span>
                {[
                  { m: 25, label: '25/5 (Chuẩn)' },
                  { m: 50, label: '50/10 (Sâu)' },
                  { m: 15, label: '15/3 (Khởi động)' },
                ].map(p => (
                  <button
                    key={p.m}
                    onClick={() => handleStartPomo(p.m)}
                    className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Bottom Stat Card */}
              <div className="w-full max-w-md p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  Hôm nay: <strong>{pomoTotalSessionsToday} phiên</strong> hoàn thành
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  +{pomoTotalSessionsToday * 20} XP tích lũy
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. TÍNH GPA & DỰ BÁO ĐIỂM */}
        {activeToolTab === 'gpa' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form & Add */}
              <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#FF4D8D]" />
                  <span>Thêm Môn Học Mới</span>
                </h3>

                <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Tên môn học:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Kinh tế lượng"
                      value={newCourseName}
                      onChange={e => setNewCourseName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#6C4DFF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Số tín chỉ:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newCourseCredits}
                        onChange={e => setNewCourseCredits(parseInt(e.target.value) || 1)}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Điểm hệ 10:</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={newCourseScore10}
                        onChange={e => setNewCourseScore10(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
                    Quy đổi tự động: <strong>Điểm {calculateLetterAnd4(newCourseScore10).letter}</strong> (Hệ 4: <strong>{calculateLetterAnd4(newCourseScore10).score4}</strong>)
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold transition-all shadow-md"
                  >
                    Thêm vào bảng điểm (+10 XP)
                  </button>
                </form>
              </div>

              {/* Middle & Right Column: Table & Forecast */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Bảng Điểm Học Tập</h3>
                    <p className="text-xs text-slate-400">
                      Tổng số tín chỉ: <strong className="text-white font-mono">{totalCredits}</strong>
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">GPA Tích Lũy</div>
                      <div className="text-2xl font-black font-mono text-amber-300">{currentGPA} / 4.0</div>
                    </div>
                    <div className="text-xs font-bold text-pink-300 border-l border-white/10 pl-3">
                      {parseFloat(currentGPA) >= 3.6
                        ? 'Xuất sắc 🏆'
                        : parseFloat(currentGPA) >= 3.2
                        ? 'Giỏi ⭐'
                        : parseFloat(currentGPA) >= 2.5
                        ? 'Khá'
                        : 'Trung bình'}
                    </div>
                  </div>
                </div>

                {/* Table of Courses */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-semibold">
                        <th className="py-2.5">Môn học</th>
                        <th className="py-2.5">Số tín</th>
                        <th className="py-2.5">Điểm hệ 10</th>
                        <th className="py-2.5">Điểm chữ</th>
                        <th className="py-2.5">Hệ 4</th>
                        <th className="py-2.5 text-right">Xoá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {courses.map(c => (
                        <tr key={c.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 font-semibold text-white">{c.name}</td>
                          <td className="py-3 font-mono text-slate-300">{c.credits}</td>
                          <td className="py-3 font-mono text-slate-300">{c.score10}</td>
                          <td className="py-3 font-mono font-bold text-pink-300">{c.letterGrade}</td>
                          <td className="py-3 font-mono font-bold text-amber-300">{c.score4}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => deleteCourse(c.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Target Forecast Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 space-y-3">
                  <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    <span>Công Cụ Dự Báo: &quot;Kỳ Này Cần Bao Nhiêu Điểm Để Đạt Mục Tiêu X?&quot;</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1">Mục tiêu CPA toàn khoá:</label>
                      <input
                        type="number"
                        min="2.0"
                        max="4.0"
                        step="0.05"
                        value={targetGoalGPA}
                        onChange={e => setTargetGoalGPA(parseFloat(e.target.value) || 3.6)}
                        className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Số tín chỉ đăng ký kỳ này:</label>
                      <input
                        type="number"
                        min="5"
                        max="30"
                        value={plannedCreditsThisTerm}
                        onChange={e => setPlannedCreditsThisTerm(parseInt(e.target.value) || 15)}
                        className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white">
                    🎯 Để đạt CPA <strong>{targetGoalGPA}</strong> sau khi hoàn thành <strong>{plannedCreditsThisTerm} tín chỉ</strong> kỳ này, bạn cần đạt GPA tối thiểu kỳ này là: <span className="font-mono font-black text-amber-400 text-sm">{neededTermGPA} / 4.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FLASHCARD HỘP LEITNER */}
        {activeToolTab === 'flashcard' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-8 max-w-4xl mx-auto">
            {/* Header & Deck Selector */}
            <div className="space-y-4 border-b border-white/10 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <span>Thẻ Flashcard &amp; Hộp Leitner</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                      Tự do ôn tập
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Hệ thống 5 hộp ngắt quãng: Tự do tạo bộ thẻ, câu hỏi, câu trả lời riêng theo môn học của bạn.
                  </p>
                </div>

                {/* Create New Deck Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setNewDeckNameInput('');
                    setNewDeckDescInput('');
                    setIsAddDeckModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 hover:opacity-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Tạo Bộ Thẻ Mới</span>
                </button>
              </div>

              {/* Deck selector bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {decks.map((d, dIdx) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveDeckIndex(dIdx);
                      setActiveCardIndex(0);
                      setIsCardFlipped(false);
                      setShowCardManager(false);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                      activeDeckIndex === dIdx
                        ? 'bg-[#FF4D8D] text-white shadow-lg'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <span>{d.name}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-black/30 text-[10px] font-mono">
                      {d.cards ? d.cards.length : 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Deck Control Bar */}
              {currentDeck && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{currentDeck.name}</span>
                      <span className="text-slate-400 text-xs font-normal">
                        ({currentDeck.cards ? currentDeck.cards.length : 0} thẻ)
                      </span>
                    </div>
                    {currentDeck.description && (
                      <p className="text-slate-400 text-xs mt-0.5">{currentDeck.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setNewCardQuestionInput('');
                        setNewCardAnswerInput('');
                        setIsAddCardModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Thêm Flashcard</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setShowCardManager(!showCardManager);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 text-[11px] ${
                        showCardManager
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-white/10 text-slate-200 hover:bg-white/15'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{showCardManager ? 'Đang quản lý thẻ' : 'Quản lý thẻ'}</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setEditDeckNameInput(currentDeck.name);
                        setEditDeckDescInput(currentDeck.description || '');
                        setIsEditDeckModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                      title="Đổi tên bộ thẻ"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Đặt lại toàn bộ ${currentDeck.cards?.length || 0} thẻ trong bộ "${currentDeck.name}" về Hộp 1 để ôn lại từ đầu?`)) {
                          sound.playSuccess();
                          resetDeckProgress(currentDeck.id);
                          setActiveCardIndex(0);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 transition-all"
                      title="Đặt lại tất cả thẻ về Hộp 1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    {decks.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa bộ thẻ "${currentDeck.name}"?`)) {
                            sound.playError();
                            deleteFlashcardDeck(currentDeck.id);
                            setActiveDeckIndex(0);
                            setActiveCardIndex(0);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all"
                        title="Xóa bộ thẻ này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CARD MANAGER LIST VIEW (EXPANDABLE) */}
            {showCardManager && currentDeck && (
              <div className="space-y-4 animate-in fade-in duration-200 p-4 rounded-2xl bg-black/20 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm thẻ trong bộ này..."
                      value={searchCardText}
                      onChange={e => setSearchCardText(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setNewCardQuestionInput('');
                      setNewCardAnswerInput('');
                      setIsAddCardModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm thẻ mới</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {(!currentDeck.cards || currentDeck.cards.length === 0) ? (
                    <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                      <p>Bộ thẻ này hiện chưa có thẻ nào!</p>
                      <button
                        onClick={() => {
                          setNewCardQuestionInput('');
                          setNewCardAnswerInput('');
                          setIsAddCardModalOpen(true);
                        }}
                        className="text-pink-300 underline font-semibold"
                      >
                        + Thêm câu hỏi và đáp án đầu tiên
                      </button>
                    </div>
                  ) : (
                    currentDeck.cards
                      .filter(c =>
                        !searchCardText.trim() ||
                        c.question.toLowerCase().includes(searchCardText.toLowerCase()) ||
                        c.answer.toLowerCase().includes(searchCardText.toLowerCase())
                      )
                      .map((card, cIdx) => (
                        <div
                          key={card.id}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 flex items-start justify-between gap-3 text-xs transition-colors"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                                #{cIdx + 1}
                              </span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#6C4DFF]/30 text-purple-200">
                                Hộp {card.box}
                              </span>
                              <span className="font-bold text-white">{card.question}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed pl-10">
                              Đáp án: {card.answer}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                sound.playClick();
                                setEditingCardId(card.id);
                                setEditCardQuestionInput(card.question);
                                setEditCardAnswerInput(card.answer);
                                setIsEditCardModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                              title="Chỉnh sửa thẻ này"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa thẻ này?')) {
                                  sound.playClick();
                                  deleteFlashcard(currentDeck.id, card.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                              title="Xóa thẻ này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* NORMAL STUDY & LEITNER PRACTICE VIEW */}
            {!showCardManager && (
              <>
                {/* Leitner Box Level indicators with real counts */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {[
                    { box: 1, label: 'Hộp 1', interval: '1 ngày' },
                    { box: 2, label: 'Hộp 2', interval: '3 ngày' },
                    { box: 3, label: 'Hộp 3', interval: '7 ngày' },
                    { box: 4, label: 'Hộp 4', interval: '14 ngày' },
                    { box: 5, label: 'Hộp 5', interval: '30 ngày' },
                  ].map(b => {
                    const cardsInThisBox = (currentDeck?.cards || []).filter(c => c.box === b.box).length;
                    const isCurrentCardInThisBox = currentCard && currentCard.box === b.box;
                    return (
                      <div
                        key={b.box}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          isCurrentCardInThisBox
                            ? 'bg-[#6C4DFF]/30 border-[#6C4DFF] text-white font-bold ring-2 ring-[#6C4DFF]/50'
                            : 'bg-white/5 border-white/5 text-slate-400'
                        }`}
                      >
                        <div className="font-mono text-[11px] flex items-center justify-center gap-1">
                          <span>{b.label}</span>
                          <span className="px-1 py-0.2 rounded bg-white/10 text-[10px] text-white">
                            {cardsInThisBox}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.interval}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty Deck Notice */}
                {(!currentDeck || !currentDeck.cards || currentDeck.cards.length === 0) ? (
                  <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center mx-auto text-xl">
                      🗂️
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">Bộ thẻ này hiện chưa có thẻ nào!</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Tự soạn các câu hỏi, khái niệm, công thức hoặc từ vựng riêng của bạn để bắt đầu chu trình ôn ngắt quãng Leitner.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setNewCardQuestionInput('');
                        setNewCardAnswerInput('');
                        setIsAddCardModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs shadow-lg inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Thêm Thẻ Đầu Tiên Ngay</span>
                    </button>
                  </div>
                ) : (
                  currentCard && (
                    <div className="space-y-6">
                      {/* Flashcard Item */}
                      <div
                        onClick={handleFlipCard}
                        className="w-full min-h-[220px] p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 hover:border-pink-500/50 shadow-xl cursor-pointer flex flex-col justify-between transition-all group select-none relative"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono bg-white/10 px-2 py-0.5 rounded-md">
                            Thẻ {activeCardIndex + 1} / {currentDeck.cards.length}
                          </span>
                          <span className="text-pink-300 flex items-center gap-1 font-semibold">
                            {isCardFlipped ? 'Đáp án (Mặt sau)' : 'Bấm để lật xem đáp án (Mặt trước)'}
                          </span>
                        </div>

                        <div className="text-center py-6">
                          <h4 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                            {isCardFlipped ? currentCard.answer : currentCard.question}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono text-[11px] text-purple-300">
                            Đang ở Hộp {currentCard.box} / 5
                          </span>
                          <span>
                            {isCardFlipped ? 'Chấm mức độ nhớ của bạn bên dưới' : 'Đang ở mặt Câu hỏi'}
                          </span>
                        </div>
                      </div>

                      {/* Card Navigation */}
                      <div className="flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            sound.playClick();
                            setIsCardFlipped(false);
                            setUserTypedAnswer('');
                            setShowAnswerCheck(false);
                            setActiveCardIndex(prev =>
                              prev > 0 ? prev - 1 : currentDeck.cards.length - 1
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                        >
                          ← Thẻ trước
                        </button>
                        <span className="text-slate-400 text-xs">
                          {activeCardIndex + 1} / {currentDeck.cards.length}
                        </span>
                        <button
                          onClick={() => {
                            sound.playClick();
                            setIsCardFlipped(false);
                            setUserTypedAnswer('');
                            setShowAnswerCheck(false);
                            setActiveCardIndex(prev =>
                              (prev + 1) % currentDeck.cards.length
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                        >
                          Thẻ tiếp theo →
                        </button>
                      </div>

                      {/* Active Recall text prompt: Type answer first */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>✍️ Chế độ Active Recall (Gõ thử đáp án trước khi lật):</span>
                          <button
                            onClick={() => setShowAnswerCheck(!showAnswerCheck)}
                            className="text-pink-300 text-xs font-semibold"
                          >
                            {showAnswerCheck ? 'Ẩn' : 'Kiểm tra gõ'}
                          </button>
                        </div>
                        {showAnswerCheck && (
                          <input
                            type="text"
                            placeholder="Gõ suy nghĩ hoặc định nghĩa của bạn vào đây..."
                            value={userTypedAnswer}
                            onChange={e => setUserTypedAnswer(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                          />
                        )}
                      </div>

                      {/* Rating buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => handleCardRate('forgot')}
                          className="py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors"
                        >
                          Quên (Về Hộp 1)
                        </button>
                        <button
                          onClick={() => handleCardRate('hard')}
                          className="py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs transition-colors"
                        >
                          Hơi khó (Giữ nguyên)
                        </button>
                        <button
                          onClick={() => handleCardRate('easy')}
                          className="py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dễ nhớ (Lên Hộp +5 XP)</span>
                        </button>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}

        {/* 4. PLANNER TUẦN 168H (TỰ DO TÙY BIẾN KHUNG GIỜ & THÀNH PHẦN) */}
        {activeToolTab === 'planner' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-6">
            {/* Header with Stats & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>Thời Khoá Biểu 168 Giờ Trong Tuần</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                    Tùy biến 100%
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Bấm vào từng ô để đổi tên hoạt động hoặc bấm biểu tượng bút ở đầu dòng để chỉnh sửa khung giờ (bắt đầu - kết thúc).
                </p>
              </div>

              {/* Dynamic stats & action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-bold">
                  ⚡ Giờ tự học: {totalWeeklyStudyHours.toFixed(1)}h / 168h
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setNewSlotNameInput('');
                    setNewSlotHoursInput('');
                    setIsAddSlotOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm Khung Giờ</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Khôi phục thời khoá biểu về mẫu chuẩn 168h tối ưu?')) {
                      sound.playSuccess();
                      setPlannerSlots(DEFAULT_PLANNER_SLOTS);
                      setPlannerCells(DEFAULT_PLANNER_CELLS);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
                  title="Khôi phục mẫu lịch ban đầu"
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  <span>Đặt lại mẫu</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Xóa sạch tất cả các ô trên thời khóa biểu để bạn tự xếp lịch từ đầu?')) {
                      sound.playClick();
                      setPlannerCells({});
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-colors"
                  title="Xóa trắng thời khóa biểu"
                >
                  <span>Xóa hết ô</span>
                </button>
              </div>
            </div>

            {/* Timetable grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="p-3 text-left w-36">Khung Giờ</th>
                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(d => (
                      <th key={d} className="p-3 font-bold text-white">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {plannerSlots.map(slot => (
                    <tr key={slot.id}>
                      {/* Slot Header column with Edit Button */}
                      <td className="p-3 text-left font-bold text-slate-300 align-middle">
                        <div className="flex items-center justify-between gap-1 group">
                          <div>
                            <div className="text-white font-bold">{slot.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{slot.hours}</div>
                          </div>
                          <button
                            onClick={() => {
                              sound.playClick();
                              setEditingSlotConfig(slot);
                              setEditSlotNameInput(slot.name);
                              setEditSlotHoursInput(slot.hours);
                            }}
                            className="p-1 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-white/15 text-slate-300 hover:text-white transition-opacity"
                            title="Chỉnh sửa tên và giờ của khung này"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* 7 Day cells */}
                      {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
                        const cellKey = `${slot.id}-${dayIdx}`;
                        const cell = plannerCells[cellKey];

                        // Badge colors based on category
                        let colorClass = 'bg-[#6C4DFF]/30 text-white font-bold border border-[#6C4DFF]/50';
                        if (cell) {
                          if (cell.category === 'lecture') colorClass = 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30';
                          else if (cell.category === 'review') colorClass = 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30';
                          else if (cell.category === 'exercise') colorClass = 'bg-amber-500/20 text-amber-200 border border-amber-500/30';
                          else if (cell.category === 'group') colorClass = 'bg-sky-500/20 text-sky-200 border border-sky-500/30';
                          else if (cell.category === 'rest') colorClass = 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
                          else if (cell.category === 'club') colorClass = 'bg-pink-500/20 text-pink-200 border border-pink-500/30';
                        }

                        return (
                          <td key={dayIdx} className="p-2 align-middle">
                            {cell && cell.title ? (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setEditingCellCoord({ slotId: slot.id, dayIndex: dayIdx });
                                  setCellEditTitle(cell.title);
                                  setCellEditCategory(cell.category || 'deep_work');
                                  setCellEditDuration(cell.durationHours || 1.5);
                                  setCellEditNote(cell.note || '');
                                }}
                                className={`w-full p-2.5 rounded-xl block text-center transition-all hover:scale-[1.02] shadow-sm relative group cursor-pointer ${colorClass}`}
                              >
                                <div className="font-semibold truncate">{cell.title}</div>
                                {cell.durationHours ? (
                                  <div className="text-[10px] opacity-75 font-mono">
                                    {cell.durationHours}h
                                  </div>
                                ) : null}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setEditingCellCoord({ slotId: slot.id, dayIndex: dayIdx });
                                  setCellEditTitle('');
                                  setCellEditCategory('deep_work');
                                  setCellEditDuration(1.5);
                                  setCellEditNote('');
                                }}
                                className="w-full p-2.5 rounded-xl block text-center border border-dashed border-white/10 hover:border-white/30 text-slate-500 hover:text-slate-300 text-[11px] transition-colors"
                              >
                                + Đặt việc
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Color Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-[11px] text-slate-400">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-300">Chú thích phân loại:</span>
                <span className="px-2 py-0.5 rounded-md bg-[#6C4DFF]/30 text-purple-200 border border-[#6C4DFF]/50 font-bold">
                  🟣 Tự học sâu
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                  🔵 Lên lớp
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                  🟢 Flashcard &amp; Ôn
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-200 border border-sky-500/30">
                  🌐 Dự án nhóm
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30">
                  🟡 Thể thao
                </span>
                <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-200 border border-pink-500/30">
                  🌸 CLB / Việc làm
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/30">
                  ⚪ Nghỉ ngơi
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                * Bấm vào ô bất kỳ để chỉnh sửa hoặc xóa
              </div>
            </div>
          </div>
        )}

        {/* 5. DEADLINE TRACKER */}
        {activeToolTab === 'deadline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Thêm Hạn Chót (Deadline)</span>
                </h3>

                <form onSubmit={handleAddDeadlineSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Tên bài tập / Đồ án:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nộp bài luận Triết học"
                      value={newDeadTitle}
                      onChange={e => setNewDeadTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Môn học:</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Triết học Mác"
                      value={newDeadSubject}
                      onChange={e => setNewDeadSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Ngày hết hạn:</label>
                      <input
                        type="date"
                        required
                        value={newDeadDate}
                        onChange={e => setNewDeadDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Mức ưu tiên:</label>
                      <select
                        value={newDeadPriority}
                        onChange={e => setNewDeadPriority(e.target.value as 'high' | 'medium' | 'low')}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                      >
                        <option value="high" className="bg-[#1E1A45]">Cao (Gấp)</option>
                        <option value="medium" className="bg-[#1E1A45]">Vừa</option>
                        <option value="low" className="bg-[#1E1A45]">Thấp</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold transition-all shadow-md mt-2"
                  >
                    Lưu Deadline (+15 XP)
                  </button>
                </form>
              </div>

              {/* Deadline List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Quy ước màu: &gt;7 ngày (Xanh) · 3–7 ngày (Vàng) · &lt;3 ngày (Đỏ)</span>
                  <span>{deadlines.length} công việc</span>
                </div>

                {deadlines.map(d => {
                  const daysLeft = getDaysLeft(d.dueDate);
                  const isUrgent = daysLeft < 3;
                  const isModerate = daysLeft >= 3 && daysLeft <= 7;

                  return (
                    <div
                      key={d.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3 ${
                        isUrgent
                          ? 'bg-rose-500/10 border-rose-500/40'
                          : isModerate
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">
                              [{d.subject}]
                            </span>
                            <h4 className="text-sm font-bold text-white">{d.title}</h4>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Hạn nộp: {new Date(d.dueDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                              isUrgent
                                ? 'bg-rose-500 text-white animate-pulse'
                                : isModerate
                                ? 'bg-amber-500 text-slate-900'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã đến hạn!'}
                          </span>
                          <button
                            onClick={() => deleteDeadline(d.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtasks / Pomodoro Breakdown */}
                      {d.subtasks && d.subtasks.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="text-[11px] font-semibold text-slate-300 mb-1">
                            Các bước Pomodoro chia nhỏ:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {d.subtasks.map((st, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-300"
                              >
                                ⏱️ {st}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 6. MA TRẬN EISENHOWER */}
        {activeToolTab === 'eisenhower' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Ma Trận Ưu Tiên Eisenhower</h3>
                <p className="text-xs text-slate-400">
                  Phân loại nhiệm vụ theo 2 chiều: Khẩn cấp &amp; Quan trọng để tối ưu hóa thời gian sống.
                </p>
              </div>

              {/* Quick Add */}
              <form onSubmit={handleAddEisenSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Thêm việc..."
                  value={newEisenTitle}
                  onChange={e => setNewEisenTitle(e.target.value)}
                  className="p-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
                <select
                  value={newEisenCat}
                  onChange={e => setNewEisenCat(e.target.value as any)}
                  className="p-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  <option value="do" className="bg-[#1E1A45]">1. Làm ngay</option>
                  <option value="schedule" className="bg-[#1E1A45]">2. Lên lịch</option>
                  <option value="delegate" className="bg-[#1E1A45]">3. Uỷ quyền</option>
                  <option value="eliminate" className="bg-[#1E1A45]">4. Bỏ bớt</option>
                </select>
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#6C4DFF] text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* 4 Quadrants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { cat: 'do', title: '1. Khẩn cấp & Quan trọng (LÀM NGAY)', color: 'border-rose-500/40 bg-rose-500/5 text-rose-300' },
                { cat: 'schedule', title: '2. Quan trọng, Chưa khẩn (LÊN LỊCH CỐ ĐỊNH)', color: 'border-blue-500/40 bg-blue-500/5 text-blue-300' },
                { cat: 'delegate', title: '3. Khẩn cấp, Không quan trọng (ỦY QUYỀN/GIẢM)', color: 'border-amber-500/40 bg-amber-500/5 text-amber-300' },
                { cat: 'eliminate', title: '4. Không khẩn, Không quan trọng (CẮT BỎ)', color: 'border-slate-500/40 bg-slate-500/5 text-slate-400' },
              ].map(q => {
                const tasksInCat = eisenTasks.filter(t => t.category === q.cat);
                return (
                  <div key={q.cat} className={`p-5 rounded-2xl border ${q.color} min-h-[180px] space-y-3`}>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {q.title}
                    </div>
                    <div className="space-y-1.5">
                      {tasksInCat.map(task => (
                        <div
                          key={task.id}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div
                            onClick={() => toggleEisenTask(task.id)}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <span className={task.completed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                              {task.completed ? '✓' : '○'}
                            </span>
                            <span className={task.completed ? 'line-through text-slate-500' : 'text-white'}>
                              {task.title}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteEisenTask(task.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {tasksInCat.length === 0 && (
                        <div className="text-[11px] text-slate-500 italic py-2">
                          Chưa có nhiệm vụ nào trong ô này.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. MẪU GHI CHÉP CORNELL TRỰC TUYẾN */}
        {activeToolTab === 'cornell' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Mẫu Ghi Chép Cornell Trực Tuyến</h3>
                <p className="text-xs text-slate-400">
                  Ghi chú 3 vùng: Cột câu hỏi gợi nhớ (30%) · Cột ghi chép bài (70%) · Tóm tắt đáy trang.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHideNotesForRecall(!hideNotesForRecall)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    hideNotesForRecall
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {hideNotesForRecall ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{hideNotesForRecall ? 'Đang che cột ghi (Ôn bài)' : 'Che cột ghi để tự kiểm tra'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In mẫu</span>
                </button>
              </div>
            </div>

            {/* Title & Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Môn học & Chủ đề:</label>
                <input
                  type="text"
                  value={cornellSubject}
                  onChange={e => setCornellSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Ngày học:</label>
                <input
                  type="text"
                  value={cornellDate}
                  onChange={e => setCornellDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Cornell Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[300px]">
              {/* Cue Column (~30% => 4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 flex flex-col">
                <label className="text-xs font-bold text-pink-300 uppercase tracking-wider block">
                  Cột Gợi Nhớ / Câu Hỏi (30%)
                </label>
                <textarea
                  value={cornellKeywords}
                  onChange={e => setCornellKeywords(e.target.value)}
                  rows={10}
                  className="w-full flex-1 p-2 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Ghi các từ khoá, câu hỏi kiểm tra sau buổi học..."
                />
              </div>

              {/* Note Column (~70% => 8 cols) */}
              <div className="lg:col-span-8 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 flex flex-col relative">
                <label className="text-xs font-bold text-sky-300 uppercase tracking-wider block">
                  Cột Ghi Bài Trong Lớp (70%)
                </label>
                {hideNotesForRecall ? (
                  <div className="flex-1 rounded-xl bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <EyeOff className="w-8 h-8 text-pink-400 animate-pulse" />
                    <p className="text-xs text-slate-300">
                      Cột ghi bài đang được che lại để bạn thực hành <strong>Active Recall</strong>!
                      <br />
                      Nhìn câu hỏi ở cột bên trái và tự viết ra giấy nháp trước khi mở lại.
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={cornellNotes}
                    onChange={e => setCornellNotes(e.target.value)}
                    rows={10}
                    className="w-full flex-1 p-2 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-mono"
                    placeholder="Ghi ý chính của bài giảng bằng từ viết tắt..."
                  />
                )}
              </div>
            </div>

            {/* Summary Area */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                Vùng Tóm Tắt Cuối Trang (2–3 câu cốt lõi)
              </label>
              <textarea
                value={cornellSummary}
                onChange={e => setCornellSummary(e.target.value)}
                rows={3}
                className="w-full p-2 bg-transparent text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
                placeholder="Tóm tắt ngắn gọn toàn bộ bài học sau 24h..."
              />
            </div>
          </div>
        )}

        {/* 8. ÂM THANH TẬP TRUNG (AMBIENT SOUND SYNTHESIZER) */}
        {activeToolTab === 'ambient' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Web Audio Synthesizer
              </span>
              <h3 className="text-3xl font-black text-white mt-1">
                Âm Thanh Tập Trung &amp; Thư Giãn
              </h3>
              <p className="text-xs text-slate-400">
                Sinh âm thanh trực tiếp bằng thuật toán âm học, không cần tải tệp nhạc bên ngoài.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { type: 'rain' as const, label: 'Mưa Rơi Nhẹ', icon: '🌧️', desc: 'Pink noise làm dịu' },
                { type: 'lofi' as const, label: 'Sóng Lo-Fi', icon: '☕', desc: 'Hợp âm Fmaj7 ấm áp' },
                { type: 'noise' as const, label: 'White Noise', icon: '💨', desc: 'Chắn tiếng ồn xung quanh' },
                { type: 'bell' as const, label: 'Chuông Tĩnh Tâm', icon: '🔔', desc: 'Tần số Solfeggio 528Hz' },
              ].map(item => {
                const isPlaying = activeSoundType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => handleToggleAmbient(item.type)}
                    className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-3 ${
                      isPlaying
                        ? 'bg-[#6C4DFF]/30 border-[#6C4DFF] shadow-lg shadow-[#6C4DFF]/30 scale-105'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPlaying ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                    }`}>
                      {isPlaying ? 'ĐANG PHÁT' : 'BẬT'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-400" /> Âm lượng:
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-48 accent-[#FF4D8D]"
              />
              <span className="text-xs font-mono text-white w-8">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* 9. THEO DÕI THÓI QUEN & STREAK */}
        {activeToolTab === 'streak' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>Theo Dõi Chuỗi Streak &amp; Thói Quen (GitHub Style)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Chuỗi ngày học liên tục giúp xây dựng tính kỷ luật bền bỉ mà không cần động lực nhất thời.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                  🔥 Chuỗi hiện tại: {user.streak} ngày liên tiếp
                </span>
              </div>
            </div>

            {/* 7x8 Contribution Matrix */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Lưới hoạt động 8 tuần gần nhất:</div>
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 8 }).map((_, colIdx) => (
                  <div key={colIdx} className="space-y-1.5">
                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                      const isActive = (colIdx * 7 + rowIdx) % 3 !== 0;
                      return (
                        <div
                          key={rowIdx}
                          className={`w-full h-4 sm:h-5 rounded-md transition-colors ${
                            isActive
                              ? colIdx >= 6
                                ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D]'
                                : 'bg-[#6C4DFF]/60'
                              : 'bg-white/5'
                          }`}
                          title={`Ngày ${colIdx * 7 + rowIdx + 1}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 pt-2">
                <span>Ít</span>
                <span className="w-3 h-3 rounded bg-white/5" />
                <span className="w-3 h-3 rounded bg-[#6C4DFF]/60" />
                <span className="w-3 h-3 rounded bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D]" />
                <span>Nhiều</span>
              </div>
            </div>
          </div>
        )}
        {/* --- MODALS FOR FLASHCARD & PLANNER CUSTOMIZATION --- */}

        {/* 1. PLANNER CELL EDITOR MODAL */}
        {editingCellCoord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📅 Chỉnh Sửa Hoạt Động</span>
                  <span className="text-xs font-mono text-cyan-300">
                    {plannerSlots.find(s => s.id === editingCellCoord.slotId)?.name} · {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'][editingCellCoord.dayIndex]}
                  </span>
                </h4>
                <button
                  onClick={() => setEditingCellCoord(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Tên hoạt động:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tự học Giải tích 90p, Lên lớp, Ôn Flashcard..."
                    value={cellEditTitle}
                    onChange={e => setCellEditTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Phân loại &amp; Màu sắc:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { key: 'deep_work' as const, label: '🟣 Tự học sâu', bg: 'bg-[#6C4DFF]/20 text-purple-200 border-[#6C4DFF]/40' },
                      { key: 'lecture' as const, label: '🔵 Lên lớp', bg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40' },
                      { key: 'review' as const, label: '🟢 Flashcard / Ôn', bg: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40' },
                      { key: 'exercise' as const, label: '🟡 Thể thao', bg: 'bg-amber-500/20 text-amber-200 border-amber-500/40' },
                      { key: 'group' as const, label: '🌐 Dự án nhóm', bg: 'bg-sky-500/20 text-sky-200 border-sky-500/40' },
                      { key: 'club' as const, label: '🌸 CLB / Làm thêm', bg: 'bg-pink-500/20 text-pink-200 border-pink-500/40' },
                      { key: 'rest' as const, label: '⚪ Nghỉ ngơi', bg: 'bg-slate-500/20 text-slate-200 border-slate-500/40' },
                    ].map(cat => (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setCellEditCategory(cat.key)}
                        className={`p-2 rounded-xl text-left border transition-all text-[11px] ${
                          cellEditCategory === cat.key
                            ? `${cat.bg} border-2 font-bold ring-1 ring-white/30`
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Thời lượng (tiếng):</label>
                    <select
                      value={cellEditDuration}
                      onChange={e => setCellEditDuration(parseFloat(e.target.value) || 1.5)}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                    >
                      <option value={0.5} className="bg-[#1E1A45]">0.5 giờ (30 phút)</option>
                      <option value={1} className="bg-[#1E1A45]">1.0 giờ (60 phút)</option>
                      <option value={1.5} className="bg-[#1E1A45]">1.5 giờ (90 phút)</option>
                      <option value={2} className="bg-[#1E1A45]">2.0 giờ</option>
                      <option value={2.5} className="bg-[#1E1A45]">2.5 giờ</option>
                      <option value={3} className="bg-[#1E1A45]">3.0 giờ</option>
                      <option value={4} className="bg-[#1E1A45]">4.0 giờ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Ghi chú (tuỳ chọn):</label>
                    <input
                      type="text"
                      placeholder="Phòng học, link bài..."
                      value={cellEditNote}
                      onChange={e => setCellEditNote(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    const key = `${editingCellCoord.slotId}-${editingCellCoord.dayIndex}`;
                    setPlannerCells(prev => {
                      const next = { ...prev };
                      delete next[key];
                      return next;
                    });
                    setEditingCellCoord(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold"
                >
                  Xóa ô này
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCellCoord(null)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!cellEditTitle.trim()) {
                        const key = `${editingCellCoord.slotId}-${editingCellCoord.dayIndex}`;
                        setPlannerCells(prev => {
                          const next = { ...prev };
                          delete next[key];
                          return next;
                        });
                      } else {
                        const key = `${editingCellCoord.slotId}-${editingCellCoord.dayIndex}`;
                        setPlannerCells(prev => ({
                          ...prev,
                          [key]: {
                            title: cellEditTitle.trim(),
                            category: cellEditCategory,
                            durationHours: Number(cellEditDuration) || 1.5,
                            note: cellEditNote.trim(),
                          },
                        }));
                        addXP(5, 'Cập nhật thời khóa biểu 168h');
                      }
                      setEditingCellCoord(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs shadow-md"
                  >
                    Lưu Hoạt Động
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PLANNER TIME SLOT EDITOR MODAL */}
        {editingSlotConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-bold text-white">Chỉnh Sửa Khung Giờ</h4>
                <button
                  onClick={() => setEditingSlotConfig(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Tên khung giờ:</label>
                  <input
                    type="text"
                    value={editSlotNameInput}
                    onChange={e => setEditSlotNameInput(e.target.value)}
                    placeholder="Ví dụ: Sáng, Chiều, Tối, Đêm muộn..."
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Khung thời gian (Bắt đầu – Kết thúc):</label>
                  <input
                    type="text"
                    value={editSlotHoursInput}
                    onChange={e => setEditSlotHoursInput(e.target.value)}
                    placeholder="Ví dụ: 07:00 – 11:30"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                {plannerSlots.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Xóa khung giờ "${editingSlotConfig.name}"?`)) {
                        setPlannerSlots(prev => prev.filter(s => s.id !== editingSlotConfig.id));
                        setEditingSlotConfig(null);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold"
                  >
                    Xóa dòng này
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlotConfig(null)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPlannerSlots(prev =>
                        prev.map(s =>
                          s.id === editingSlotConfig.id
                            ? {
                                ...s,
                                name: editSlotNameInput.trim() || s.name,
                                hours: editSlotHoursInput.trim() || s.hours,
                              }
                            : s
                        )
                      );
                      setEditingSlotConfig(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow-md"
                  >
                    Lưu Khung Giờ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ADD NEW TIME SLOT MODAL */}
        {isAddSlotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-bold text-white">+ Thêm Khung Giờ Mới</h4>
                <button
                  onClick={() => setIsAddSlotOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Tên khung giờ:</label>
                  <input
                    type="text"
                    value={newSlotNameInput}
                    onChange={e => setNewSlotNameInput(e.target.value)}
                    placeholder="Ví dụ: Đêm muộn, Sáng sớm, Ca chiều 2..."
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Khung giờ (Giờ bắt đầu – kết thúc):</label>
                  <input
                    type="text"
                    value={newSlotHoursInput}
                    onChange={e => setNewSlotHoursInput(e.target.value)}
                    placeholder="Ví dụ: 22:30 – 01:00"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = 'slot-' + Date.now();
                    setPlannerSlots(prev => [
                      ...prev,
                      {
                        id,
                        name: newSlotNameInput.trim() || 'Khung giờ mới',
                        hours: newSlotHoursInput.trim() || '00:00 – 00:00',
                      },
                    ]);
                    setIsAddSlotOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs shadow-md"
                >
                  Tạo Khung Giờ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. FLASHCARD ADD DECK MODAL */}
        {isAddDeckModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-bold text-white">+ Tạo Bộ Thẻ Flashcard Mới</h4>
                <button
                  onClick={() => setIsAddDeckModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Tên bộ thẻ:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Từ vựng IELTS 7.5, Giải phẫu xương, Kinh tế vi mô..."
                    value={newDeckNameInput}
                    onChange={e => setNewDeckNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-400"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Mô tả ngắn / Môn học:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Ôn thi cuối kỳ học kỳ 1"
                    value={newDeckDescInput}
                    onChange={e => setNewDeckDescInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddDeckModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newDeckNameInput.trim()) return;
                    sound.playSuccess();
                    addFlashcardDeck(newDeckNameInput.trim(), newDeckDescInput.trim());
                    setActiveDeckIndex(decks.length);
                    setIsAddDeckModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs shadow-md"
                >
                  Tạo Bộ Thẻ (+15 XP)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. FLASHCARD EDIT DECK MODAL */}
        {isEditDeckModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-bold text-white">Đổi Tên &amp; Mô Tả Bộ Thẻ</h4>
                <button
                  onClick={() => setIsEditDeckModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Tên bộ thẻ:</label>
                  <input
                    type="text"
                    required
                    value={editDeckNameInput}
                    onChange={e => setEditDeckNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Mô tả:</label>
                  <input
                    type="text"
                    value={editDeckDescInput}
                    onChange={e => setEditDeckDescInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditDeckModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!editDeckNameInput.trim() || !currentDeck) return;
                    sound.playClick();
                    updateFlashcardDeck(currentDeck.id, editDeckNameInput.trim(), editDeckDescInput.trim());
                    setIsEditDeckModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs shadow-md"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. FLASHCARD ADD CARD MODAL */}
        {isAddCardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Thêm Thẻ Flashcard Vào Bộ &quot;{currentDeck?.name}&quot;</span>
                </h4>
                <button
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Mặt trước (Câu hỏi, Thuật ngữ hoặc Khái niệm):
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ví dụ: Quy tắc L'Hopital dùng khi nào? / Active Recall là gì?"
                    value={newCardQuestionInput}
                    onChange={e => setNewCardQuestionInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Mặt sau (Câu trả lời, Định nghĩa, Công thức hoặc Giải thích):
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ví dụ: Dùng khi giới hạn có dạng vô định 0/0 hoặc vô cùng / vô cùng..."
                    value={newCardAnswerInput}
                    onChange={e => setNewCardAnswerInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newCardQuestionInput.trim() || !newCardAnswerInput.trim() || !currentDeck) return;
                    sound.playSuccess();
                    addFlashcard(currentDeck.id, newCardQuestionInput.trim(), newCardAnswerInput.trim());
                    setIsAddCardModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold text-xs shadow-md"
                >
                  Lưu Thẻ (+5 XP)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. FLASHCARD EDIT CARD MODAL */}
        {isEditCardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-cyan-400" />
                  <span>Chỉnh Sửa Nội Dung Thẻ Flashcard</span>
                </h4>
                <button
                  onClick={() => setIsEditCardModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Mặt trước (Câu hỏi / Khái niệm):
                  </label>
                  <textarea
                    rows={3}
                    value={editCardQuestionInput}
                    onChange={e => setEditCardQuestionInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Mặt sau (Câu trả lời / Giải thích):
                  </label>
                  <textarea
                    rows={4}
                    value={editCardAnswerInput}
                    onChange={e => setEditCardAnswerInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditCardModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!editingCardId || !editCardQuestionInput.trim() || !editCardAnswerInput.trim() || !currentDeck) return;
                    sound.playClick();
                    updateFlashcard(currentDeck.id, editingCardId, editCardQuestionInput.trim(), editCardAnswerInput.trim());
                    setIsEditCardModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow-md"
                >
                  Lưu Cập Nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
