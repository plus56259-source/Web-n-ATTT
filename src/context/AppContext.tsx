import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  TabType,
  UserProfile,
  Badge,
  DeadlineItem,
  GPACourse,
  Flashcard,
  FlashcardDeck,
  GardenPlant,
  EisenhowerTask,
  WeeklyQuest,
} from '../types';
import { LEVEL_THRESHOLDS, INITIAL_BADGES, WEEKLY_QUESTS } from '../data/learningData';
import { sound } from '../utils/soundEffects';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'xp';
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  firebaseUser: User | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  badges: Badge[];
  quests: WeeklyQuest[];
  deadlines: DeadlineItem[];
  courses: GPACourse[];
  decks: FlashcardDeck[];
  gardenPlants: GardenPlant[];
  eisenTasks: EisenhowerTask[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quizOpen: boolean;
  setQuizOpen: (open: boolean) => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addXP: (amount: number, reason: string) => void;
  removeToast: (id: string) => void;
  addDeadline: (deadline: Omit<DeadlineItem, 'id'>) => void;
  updateDeadline: (id: string, updates: Partial<DeadlineItem>) => void;
  deleteDeadline: (id: string) => void;
  addCourse: (course: Omit<GPACourse, 'id'>) => void;
  deleteCourse: (id: string) => void;
  updateCardReview: (deckId: string, cardId: string, rating: 'easy' | 'hard' | 'forgot') => void;
  addFlashcardDeck: (name: string, description?: string) => string;
  updateFlashcardDeck: (deckId: string, name: string, description: string) => void;
  deleteFlashcardDeck: (deckId: string) => void;
  addFlashcard: (deckId: string, question: string, answer: string) => void;
  updateFlashcard: (deckId: string, cardId: string, question: string, answer: string) => void;
  deleteFlashcard: (deckId: string, cardId: string) => void;
  resetDeckProgress: (deckId: string) => void;
  addPlantToGarden: (plant: Omit<GardenPlant, 'id' | 'plantedAt'>) => void;
  addEisenTask: (task: Omit<EisenhowerTask, 'id' | 'completed'>) => void;
  toggleEisenTask: (id: string) => void;
  deleteEisenTask: (id: string) => void;
  unlockBadge: (badgeId: string) => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'unilevelup:v1';

const INITIAL_COURSES: GPACourse[] = [
  { id: 'c1', name: 'Giải tích 1', credits: 3, score10: 8.5, letterGrade: 'A', score4: 4.0 },
  { id: 'c2', name: 'Triết học Mác - Lênin', credits: 3, score10: 7.5, letterGrade: 'B', score4: 3.0 },
  { id: 'c3', name: 'Kinh tế vi mô', credits: 3, score10: 8.2, letterGrade: 'B+', score4: 3.5 },
  { id: 'c4', name: 'Nhập môn Lập trình', credits: 4, score10: 9.0, letterGrade: 'A', score4: 4.0 },
  { id: 'c5', name: 'Tiếng Anh học thuật 1', credits: 3, score10: 7.8, letterGrade: 'B', score4: 3.0 },
];

const INITIAL_DEADLINES: DeadlineItem[] = [
  {
    id: 'd1',
    title: 'Báo cáo bài tập lớn Kinh tế vi mô',
    subject: 'Kinh tế vi mô',
    dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    priority: 'high',
    progress: 60,
    subtasks: ['Thu thập số liệu thị trường', 'Vẽ đồ thị cung cầu', 'Viết nhận xét chính sách'],
  },
  {
    id: 'd2',
    title: 'Thuyết trình nhóm: Ứng dụng AI',
    subject: 'Nhập môn Tin học',
    dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    priority: 'medium',
    progress: 30,
    subtasks: ['Lập dàn ý slide', 'Phân công thành viên', 'Tập nói thử 15 phút'],
  },
  {
    id: 'd3',
    title: 'Tiểu luận kết thúc học phần',
    subject: 'Triết học Mác - Lênin',
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    priority: 'low',
    progress: 10,
    subtasks: ['Đọc 3 tài liệu tham khảo', 'Soạn đề cương chi tiết'],
  },
];

const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-uni-terms',
    name: 'Từ điển Sinh tồn Đại học',
    description: 'Tín chỉ, GPA, Syllabus, Học phần tiên quyết & Cố vấn',
    cards: [
      { id: 'c1', deckId: 'deck-uni-terms', question: 'Tín chỉ là gì?', answer: 'Đơn vị đo khối lượng học tập. 1 tín chỉ tương đương ~15 tiết lý thuyết và tối thiểu 30 giờ tự học bên ngoài.', box: 2 },
      { id: 'c2', deckId: 'deck-uni-terms', question: 'CPA khác GPA ở điểm nào?', answer: 'GPA là điểm trung bình theo từng kỳ hoặc năm học, còn CPA là điểm trung bình tích luỹ toàn khoá tính từ năm nhất.', box: 1 },
      { id: 'c3', deckId: 'deck-uni-terms', question: 'Syllabus (Đề cương môn học) có công dụng gì?', answer: 'Cung cấp mục tiêu học tập, lịch trình từng tuần, tài liệu tham khảo và tỷ lệ % điểm thành phần của môn học.', box: 3 },
      { id: 'c4', deckId: 'deck-uni-terms', question: 'Học phần tiên quyết là gì?', answer: 'Môn bắt buộc phải thi đạt trước mới được đăng ký học môn kế tiếp. Rớt môn tiên quyết có thể trễ tiến độ cả năm.', box: 2 },
    ],
  },
  {
    id: 'deck-methods',
    name: 'Phương Pháp Học Tập Khoa Học',
    description: 'Active Recall, Spaced Repetition, Feynman, Cornell, SQ3R',
    cards: [
      { id: 'm1', deckId: 'deck-methods', question: 'Bản chất của Active Recall là gì?', answer: 'Tự nỗ lực truy xuất thông tin từ trí nhớ (gấp sách, tự kiểm tra) thay vì đọc lại thụ động.', box: 2 },
      { id: 'm2', deckId: 'deck-methods', question: 'Kỹ thuật Feynman vận hành theo 4 bước nào?', answer: '1. Chọn khái niệm -> 2. Giải thích cho đứa trẻ 12 tuổi -> 3. Tìm lỗ hổng ấp úng -> 4. Tinh giản & dùng ví dụ đời thường.', box: 1 },
      { id: 'm3', deckId: 'deck-methods', question: 'Trang ghi chép Cornell gồm 3 phần nào?', answer: 'Cột phải ghi bài (~70%), Cột trái ghi từ khoá/câu hỏi (~30%), Vùng tóm tắt ở đáy trang (2-3 dòng).', box: 3 },
      { id: 'm4', deckId: 'deck-methods', question: 'Interleaving giúp ích gì so với làm một dạng bài liên tục?', answer: 'Rèn luyện phản xạ nhận diện đúng dạng bài trước khi giải, sát với điều kiện làm bài thi thật.', box: 1 },
    ],
  },
  {
    id: 'deck-english',
    name: 'Academic English Words',
    description: 'Từ vựng tiếng Anh học thuật 5 chữ cái và chuyên ngành',
    cards: [
      { id: 'e1', deckId: 'deck-english', question: 'FOCUS (v/n)', answer: 'Tập trung chú ý vào một mục tiêu duy nhất / Tiêu điểm.', box: 3 },
      { id: 'e2', deckId: 'deck-english', question: 'ESSAY (n)', answer: 'Bài tiểu luận, bài văn học thuật phân tích chủ đề.', box: 2 },
      { id: 'e3', deckId: 'deck-english', question: 'THEME (n)', answer: 'Chủ đề tư tưởng xuyên suốt của nghiên cứu hoặc tác phẩm.', box: 2 },
      { id: 'e4', deckId: 'deck-english', question: 'SOLVE (v)', answer: 'Giải quyết, tìm ra lời giải cho một bài toán hay vấn đề hóc búa.', box: 4 },
    ],
  },
];

const INITIAL_GARDEN: GardenPlant[] = [
  { id: 'p1', type: 'sunflower', name: 'Hoa Hướng Dương', plantedAt: '2026-10-06', status: 'bloomed', durationMin: 25, subject: 'Giải tích 1' },
  { id: 'p2', type: 'lavender', name: 'Oải Hương Tập Trung', plantedAt: '2026-10-07', status: 'bloomed', durationMin: 50, subject: 'Tiếng Anh' },
  { id: 'p3', type: 'bonsai', name: 'Bonsai Kiên Trì', plantedAt: '2026-10-07', status: 'bloomed', durationMin: 25, subject: 'Kinh tế vi mô' },
];

const INITIAL_EISEN: EisenhowerTask[] = [
  { id: 'et1', title: 'Hoàn thiện nộp báo cáo Kinh tế vi mô', category: 'do', subject: 'Kinh tế vi mô', completed: false },
  { id: 'et2', title: 'Đọc trước slide chương 4 Giải tích', category: 'schedule', subject: 'Giải tích', completed: false },
  { id: 'et3', title: 'Nhờ bạn cùng phòng photo tài liệu học', category: 'delegate', completed: true },
  { id: 'et4', title: 'Lướt mạng xã hội lúc đang làm tiểu luận', category: 'eliminate', completed: false },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch {}
    return {
      name: 'Sinh viên UniLevelUp',
      xp: 340,
      level: 3,
      streak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      frozenStreakUsedThisWeek: false,
      badges: ['deep-focus'],
    };
  });

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [quests] = useState<WeeklyQuest[]>(WEEKLY_QUESTS);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.deadlines) return parsed.deadlines;
      }
    } catch {}
    return INITIAL_DEADLINES;
  });

  const [courses, setCourses] = useState<GPACourse[]>(INITIAL_COURSES);
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.decks && Array.isArray(parsed.decks) && parsed.decks.length > 0) {
          return parsed.decks;
        }
      }
    } catch {}
    return INITIAL_DECKS;
  });
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>(INITIAL_GARDEN);
  const [eisenTasks, setEisenTasks] = useState<EisenhowerTask[]>(INITIAL_EISEN);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings?.theme === 'light' || parsed.settings?.theme === 'dark') {
          return parsed.settings.theme;
        }
      }
    } catch {}
    return 'dark';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'xp' = 'info') => {
    const toastId = 't-' + Date.now() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id: toastId, title, message, type }]);
    setTimeout(() => removeToast(toastId), 4500);
  }, [removeToast]);

  // Load cloud data when Firebase user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setIsAuthLoading(false);

      if (fbUser) {
        // User logged in with Google!
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const cloudData = userSnap.data();
            setUser(prev => ({
              ...prev,
              uid: fbUser.uid,
              name: fbUser.displayName || cloudData.name || 'Sinh viên UniLevelUp',
              email: fbUser.email || cloudData.email || '',
              photoURL: fbUser.photoURL || cloudData.photoURL || '',
              authProvider: 'google',
              xp: cloudData.xp ?? prev.xp,
              level: cloudData.level ?? prev.level,
              streak: cloudData.streak ?? prev.streak,
              badges: cloudData.badges ?? prev.badges,
              lastActiveDate: cloudData.lastActiveDate ?? prev.lastActiveDate,
            }));
          } else {
            // First time login - save initial profile to Firestore
            const initialProfile: UserProfile = {
              uid: fbUser.uid,
              name: fbUser.displayName || 'Sinh viên UniLevelUp',
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || '',
              authProvider: 'google',
              xp: user.xp,
              level: user.level,
              streak: user.streak,
              lastActiveDate: new Date().toISOString().split('T')[0],
              frozenStreakUsedThisWeek: false,
              badges: user.badges,
            };
            await setDoc(userDocRef, {
              ...initialProfile,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setUser(initialProfile);
          }

          // Fetch user's cloud deadlines
          try {
            const dlQuery = query(collection(db, 'deadlines'), where('userId', '==', fbUser.uid));
            const dlSnap = await getDocs(dlQuery);
            if (!dlSnap.empty) {
              const cloudDeadlines: DeadlineItem[] = dlSnap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<DeadlineItem, 'id'>),
              }));
              setDeadlines(cloudDeadlines);
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'deadlines');
          }

          // Fetch user's cloud courses
          try {
            const cQuery = query(collection(db, 'courses'), where('userId', '==', fbUser.uid));
            const cSnap = await getDocs(cQuery);
            if (!cSnap.empty) {
              const cloudCourses: GPACourse[] = cSnap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<GPACourse, 'id'>),
              }));
              setCourses(cloudCourses);
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'courses');
          }

          // Fetch user's cloud tasks
          try {
            const eQuery = query(collection(db, 'eisen_tasks'), where('userId', '==', fbUser.uid));
            const eSnap = await getDocs(eQuery);
            if (!eSnap.empty) {
              const cloudTasks: EisenhowerTask[] = eSnap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<EisenhowerTask, 'id'>),
              }));
              setEisenTasks(cloudTasks);
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'eisen_tasks');
          }

          // Fetch user's cloud garden plants
          try {
            const pQuery = query(collection(db, 'garden_plants'), where('userId', '==', fbUser.uid));
            const pSnap = await getDocs(pQuery);
            if (!pSnap.empty) {
              const cloudPlants: GardenPlant[] = pSnap.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<GardenPlant, 'id'>),
              }));
              setGardenPlants(cloudPlants);
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.LIST, 'garden_plants');
          }

          sound.playSuccess();
          showToast('Đăng nhập thành công!', `Chào mừng ${fbUser.displayName || 'bạn'}! Dữ liệu đã đồng bộ đám mây.`, 'success');
        } catch (error) {
          console.error('Error syncing cloud user:', error);
        }
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  // Sync state to localStorage (always keeps client safe)
  useEffect(() => {
    try {
      const dataToSave = {
        profile: user,
        badges: badges.filter(b => b.unlocked).map(b => b.id),
        deadlines,
        courses,
        decks,
        eisenTasks,
        gardenPlants,
        settings: { theme, sound: soundEnabled },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {}
  }, [user, badges, deadlines, courses, decks, eisenTasks, gardenPlants, theme, soundEnabled]);

  // Sync theme to root class and attributes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    sound.playClick();
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      showToast(
        'Đã đổi giao diện',
        nextTheme === 'light' ? 'Chuyển sang chế độ Sáng (Light Mode)' : 'Chuyển sang chế độ Tối (Dark Mode)',
        'info'
      );
      return nextTheme;
    });
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      sound.enabled = !prev;
      return !prev;
    });
  };

  // Google Login & Logout handlers
  const loginWithGoogle = async () => {
    sound.playClick();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      sound.playError();
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      showToast('Đăng nhập không thành công', msg, 'info');
    }
  };

  const logout = async () => {
    sound.playClick();
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUser(prev => ({
        ...prev,
        uid: undefined,
        email: undefined,
        photoURL: undefined,
        authProvider: 'guest',
      }));
      showToast('Đã đăng xuất', 'Bạn đang dùng tài khoản cục bộ khách trên thiết bị này.', 'info');
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Helper to sync user profile changes to Firestore
  const syncUserToFirestore = async (updatedUser: UserProfile) => {
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          xp: updatedUser.xp,
          level: updatedUser.level,
          streak: updatedUser.streak,
          badges: updatedUser.badges,
          lastActiveDate: updatedUser.lastActiveDate,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
      }
    }
  };

  const addXP = (amount: number, reason: string) => {
    if (amount <= 0) return;
    setUser(prev => {
      const newXP = prev.xp + amount;
      const currentLevel = prev.level;
      let nextLevel = currentLevel;
      for (const t of LEVEL_THRESHOLDS) {
        if (newXP >= t.minXP) {
          nextLevel = t.level;
        }
      }

      const updatedUser: UserProfile = {
        ...prev,
        xp: newXP,
        level: nextLevel,
      };

      if (nextLevel > currentLevel) {
        sound.playSuccess();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6C4DFF', '#FF4D8D', '#FFB703', '#12B886'],
        });
        const levelObj = LEVEL_THRESHOLDS.find(l => l.level === nextLevel);
        showToast(
          `🎉 LÊN CẤP ${nextLevel}: ${levelObj?.title}!`,
          `Bạn vừa đạt mốc ${newXP} XP! Tiếp tục phát huy nhé!`,
          'success'
        );
      } else {
        sound.playTing();
      }

      showToast(`+${amount} XP: ${reason}`, `Tổng điểm hiện tại: ${newXP} XP`, 'xp');

      syncUserToFirestore(updatedUser);
      return updatedUser;
    });
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b => {
        if (b.id === badgeId && !b.unlocked) {
          sound.playSuccess();
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#FFB703', '#FF4D8D', '#12B886'],
          });
          showToast(`🏆 MỞ KHÓA HUY HIỆU: ${b.name}!`, b.description, 'success');
          const nextBadges = [...user.badges, b.id];
          const updatedUser = { ...user, badges: nextBadges };
          setUser(updatedUser);
          syncUserToFirestore(updatedUser);
          return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return b;
      })
    );
  };

  const addDeadline = async (item: Omit<DeadlineItem, 'id'>) => {
    const id = 'd-' + Date.now();
    const newItem: DeadlineItem = { ...item, id };
    setDeadlines(prev => [newItem, ...prev]);
    addXP(15, 'Thêm kế hoạch deadline mới');

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'deadlines', id), {
          ...item,
          userId: firebaseUser.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `deadlines/${id}`);
      }
    }
  };

  const updateDeadline = async (id: string, updates: Partial<DeadlineItem>) => {
    setDeadlines(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates } : d))
    );

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'deadlines', id), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `deadlines/${id}`);
      }
    }
  };

  const deleteDeadline = async (id: string) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'deadlines', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `deadlines/${id}`);
      }
    }
  };

  const addCourse = async (course: Omit<GPACourse, 'id'>) => {
    const id = 'course-' + Date.now();
    const newCourse: GPACourse = { ...course, id };
    setCourses(prev => [...prev, newCourse]);
    addXP(10, 'Cập nhật bảng điểm GPA');

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'courses', id), {
          ...course,
          userId: firebaseUser.uid,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `courses/${id}`);
      }
    }
  };

  const deleteCourse = async (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'courses', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `courses/${id}`);
      }
    }
  };

  const updateCardReview = (deckId: string, cardId: string, rating: 'easy' | 'hard' | 'forgot') => {
    setDecks(prev =>
      prev.map(deck => {
        if (deck.id !== deckId) return deck;
        return {
          ...deck,
          cards: deck.cards.map(card => {
            if (card.id !== cardId) return card;
            let nextBox = card.box;
            if (rating === 'easy') {
              nextBox = Math.min(5, card.box + 1) as 1 | 2 | 3 | 4 | 5;
            } else if (rating === 'forgot') {
              nextBox = 1;
            }
            return {
              ...card,
              box: nextBox,
              lastReviewed: new Date().toISOString(),
            };
          }),
        };
      })
    );
    addXP(rating === 'easy' ? 5 : 2, 'Ôn tập thẻ Flashcard');
  };

  const addFlashcardDeck = (name: string, description: string = '') => {
    const newDeckId = 'deck-' + Date.now();
    const newDeck: FlashcardDeck = {
      id: newDeckId,
      name,
      description,
      cards: [],
    };
    setDecks(prev => [...prev, newDeck]);
    addXP(15, `Tạo bộ thẻ Flashcard: ${name}`);
    return newDeckId;
  };

  const updateFlashcardDeck = (deckId: string, name: string, description: string) => {
    setDecks(prev => prev.map(d => (d.id === deckId ? { ...d, name, description } : d)));
  };

  const deleteFlashcardDeck = (deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId));
  };

  const addFlashcard = (deckId: string, question: string, answer: string) => {
    const newCardId = 'c-' + Date.now();
    const newCard: Flashcard = {
      id: newCardId,
      deckId,
      question,
      answer,
      box: 1,
      lastReviewed: new Date().toISOString(),
    };
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        return {
          ...d,
          cards: [...d.cards, newCard],
        };
      })
    );
    addXP(5, 'Thêm thẻ Flashcard tự tạo');
  };

  const updateFlashcard = (deckId: string, cardId: string, question: string, answer: string) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        return {
          ...d,
          cards: d.cards.map(c => (c.id === cardId ? { ...c, question, answer } : c)),
        };
      })
    );
  };

  const deleteFlashcard = (deckId: string, cardId: string) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        return {
          ...d,
          cards: d.cards.filter(c => c.id !== cardId),
        };
      })
    );
  };

  const resetDeckProgress = (deckId: string) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        return {
          ...d,
          cards: d.cards.map(c => ({ ...c, box: 1 })),
        };
      })
    );
  };

  const addPlantToGarden = async (plant: Omit<GardenPlant, 'id' | 'plantedAt'>) => {
    const id = 'p-' + Date.now();
    const dateStr = new Date().toISOString().split('T')[0];
    const newPlant: GardenPlant = {
      ...plant,
      id,
      plantedAt: dateStr,
    };
    setGardenPlants(prev => [newPlant, ...prev]);

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'garden_plants', id), {
          ...plant,
          userId: firebaseUser.uid,
          plantedAt: dateStr,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `garden_plants/${id}`);
      }
    }
  };

  const addEisenTask = async (task: Omit<EisenhowerTask, 'id' | 'completed'>) => {
    const id = 'et-' + Date.now();
    const newTask: EisenhowerTask = {
      ...task,
      id,
      completed: false,
    };
    setEisenTasks(prev => [newTask, ...prev]);
    addXP(10, 'Phân loại công việc ma trận');

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'eisen_tasks', id), {
          ...task,
          userId: firebaseUser.uid,
          completed: false,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `eisen_tasks/${id}`);
      }
    }
  };

  const toggleEisenTask = async (id: string) => {
    sound.playClick();
    const targetTask = eisenTasks.find(t => t.id === id);
    if (!targetTask) return;
    const nextCompleted = !targetTask.completed;

    setEisenTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'eisen_tasks', id), {
          completed: nextCompleted,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `eisen_tasks/${id}`);
      }
    }
  };

  const deleteEisenTask = async (id: string) => {
    setEisenTasks(prev => prev.filter(t => t.id !== id));
    if (firebaseUser) {
      try {
        await deleteDoc(doc(db, 'eisen_tasks', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `eisen_tasks/${id}`);
      }
    }
  };

  const exportDataJSON = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      deadlines,
      courses,
      gardenPlants,
      eisenTasks,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.user) setUser(parsed.user);
      if (parsed.deadlines) setDeadlines(parsed.deadlines);
      if (parsed.courses) setCourses(parsed.courses);
      if (parsed.gardenPlants) setGardenPlants(parsed.gardenPlants);
      if (parsed.eisenTasks) setEisenTasks(parsed.eisenTasks);
      sound.playSuccess();
      return true;
    } catch {
      sound.playError();
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        firebaseUser,
        isAuthLoading,
        loginWithGoogle,
        logout,
        badges,
        quests,
        deadlines,
        courses,
        decks,
        gardenPlants,
        eisenTasks,
        theme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        searchOpen,
        setSearchOpen,
        quizOpen,
        setQuizOpen,
        profileOpen,
        setProfileOpen,
        toasts,
        addXP,
        removeToast,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        addCourse,
        deleteCourse,
        updateCardReview,
        addFlashcardDeck,
        updateFlashcardDeck,
        deleteFlashcardDeck,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        resetDeckProgress,
        addPlantToGarden,
        addEisenTask,
        toggleEisenTask,
        deleteEisenTask,
        unlockBadge,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
