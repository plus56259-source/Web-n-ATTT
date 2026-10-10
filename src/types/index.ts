export type TabType = 'home' | 'discover' | 'methods' | 'skills' | 'tools' | 'games' | 'studyroom' | 'forum' | 'library';

export interface StudyParticipant {
  id: string;
  name: string;
  avatar: string;
  photoURL?: string;
  status: string;
  goal: string;
  goalCompleted: boolean;
  isCamOn: boolean;
  camMode?: 'webcam' | 'virtual';
  virtualTheme?: string;
  isMicOn: boolean;
  isSpeaking?: boolean;
  minutesStudied: number;
  streakDays: number;
  isRealUser?: boolean;
  cheersReceived?: number;
  lastSeen?: number;
}

export interface StudyChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isGoalUpdate?: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  title: string;
  content: string;
  category: 'tips' | 'gpa' | 'methods' | 'review' | 'wellbeing' | 'teamup';
  tags: string[];
  likes: number;
  likedBy: string[];
  commentCount: number;
  createdAt: string;
  pinned?: boolean;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface MethodItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  effectiveness: number; // 1-5
  ease: number; // 1-5
  whatAndWhy: string;
  scientificCitation: string;
  realExample: string;
  howTo: string[];
  commonMistakes: string;
  bestFor: string;
  category: 'memorization' | 'comprehension' | 'planning' | 'practice' | 'collaboration';
  icon: string;
  color: string;
  isPrimary?: boolean;
  tier?: 'primary' | 'supplementary';
  priorityOrder?: number;
  badgeLabel?: string;
  vividMetaphor?: string;
  campusScenario?: string;
  beforeVsAfter?: {
    before: string;
    after: string;
  };
}

export interface AcademicMaterial {
  id: string;
  title: string;
  subjectCode: string;
  credits: number;
  category: 'politics' | 'math_science' | 'it_tech' | 'economy_biz' | 'law_social' | 'medical';
  categoryLabel: string;
  university: string;
  universityShort: string;
  author: string;
  publisher?: string;
  year?: number;
  type: 'textbook' | 'syllabus' | 'slides' | 'exam_prep' | 'exercises';
  typeLabel: string;
  description: string;
  keyTopics: string[];
  tipsForExam: string;
  downloadUrl?: string;
  fileSize?: string;
  pages?: number;
  downloadsCount: number;
  rating: number;
  isOfficialCurriculum?: boolean;
}

export interface PlannerTimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface PlannerCellData {
  id: string;
  slotId: string;
  dayIndex: number; // 0 = Mon, ... 6 = Sun
  title: string;
  category: 'deep_work' | 'lecture' | 'review' | 'group' | 'deadline' | 'club' | 'rest';
  durationMinutes?: number;
  note?: string;
}

export interface SkillItem {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  practicalTips: string[];
  interactiveComponent?: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  importance: 'cao' | 'trung-binh' | 'can-biet';
  category: 'hoc-vu' | 'tin-chi' | 'ho-tro';
}

export interface MythbusterItem {
  id: string;
  myth: string;
  fact: string;
  researchCitation: string;
  badge: string;
}

export interface RoadmapYear {
  year: number;
  title: string;
  tagline: string;
  focus: string[];
  milestones: string[];
  proTip: string;
}

export interface HabitQuizQuestion {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
    profile: 'planner' | 'sprinter' | 'highlighter' | 'deep' | 'team';
  }[];
}

export interface HabitProfile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  strength: string;
  trap: string;
  recommendedMethods: string[];
  recommendedTool: string;
  recommendedGame: string;
  avatarBg: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  box: 1 | 2 | 3 | 4 | 5; // Leitner boxes
  lastReviewed?: string;
  nextReviewDate?: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
}

export interface DeadlineItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO string or YYYY-MM-DDTHH:mm
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0 - 100
  subtasks?: string[];
}

export interface GPACourse {
  id: string;
  name: string;
  credits: number;
  score10: number;
  letterGrade: string;
  score4: number;
}

export interface EisenhowerTask {
  id: string;
  title: string;
  category: 'do' | 'schedule' | 'delegate' | 'eliminate';
  subject?: string;
  completed: boolean;
}

export interface GardenPlant {
  id: string;
  type: 'bonsai' | 'sunflower' | 'cactus' | 'lavender' | 'sakura';
  name: string;
  plantedAt: string;
  status: 'bloomed' | 'wilted';
  durationMin: number;
  subject: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  uid?: string;
  email?: string;
  photoURL?: string;
  authProvider?: 'google' | 'guest';
  name: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  frozenStreakUsedThisWeek: boolean;
  badges: string[];
}

export interface WeeklyQuest {
  id: string;
  title: string;
  condition: string;
  rewardXP: number;
  rewardBadge?: string;
  current: number;
  target: number;
  completed: boolean;
}
