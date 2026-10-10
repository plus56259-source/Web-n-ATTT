import { StudyParticipant, StudyChatMessage } from '../types';

export interface RoomBackground {
  id: string;
  name: string;
  description: string;
  themeClass: string;
  gradient: string;
  ambienceKey: 'rain' | 'cafe' | 'night' | 'nature' | 'cyber';
  icon: string;
}

export const ROOM_BACKGROUNDS: RoomBackground[] = [
  {
    id: 'tokyo-cafe',
    name: 'Quán Cafe Lofi Mưa Đêm',
    description: 'Ánh đèn vàng ấm áp, giọt mưa tí tách ngoài hiên kính, hương cà phê thư thái',
    themeClass: 'from-[#1A102F] via-[#2A1838] to-[#120B20]',
    gradient: 'from-amber-500/20 via-purple-600/20 to-indigo-900/40',
    ambienceKey: 'cafe',
    icon: '☕',
  },
  {
    id: 'dalat-cabin',
    name: 'Nhà Gỗ Rừng Thông Đà Lạt',
    description: 'Gió thông vi vu, lò sưởi bập bùng, hoàng hôn cam dịu phủ kín sườn đồi',
    themeClass: 'from-[#1B1A24] via-[#2D1B1C] to-[#14121E]',
    gradient: 'from-orange-600/20 via-rose-700/20 to-stone-900/40',
    ambienceKey: 'nature',
    icon: '🌲',
  },
  {
    id: 'night-library',
    name: 'Thư Viện Đại Học 2:00 AM',
    description: 'Kệ sách cao ngút, ánh đèn học bàn xanh ngọc tĩnh lặng, đêm trăng tròn tĩnh mịch',
    themeClass: 'from-[#0D1829] via-[#0E2338] to-[#0A101D]',
    gradient: 'from-cyan-600/20 via-blue-700/20 to-slate-900/40',
    ambienceKey: 'night',
    icon: '🌙',
  },
  {
    id: 'zen-garden',
    name: 'Vườn Thiền Nhật Bản',
    description: 'Hồ cá Koi êm ả, lá phong đỏ rơi nhẹ, tiếng chuông gió trúc êm dịu',
    themeClass: 'from-[#11241C] via-[#1B362A] to-[#0A1A14]',
    gradient: 'from-emerald-600/20 via-teal-700/20 to-emerald-950/40',
    ambienceKey: 'nature',
    icon: '🌸',
  },
  {
    id: 'cyber-saigon',
    name: 'Cyberpunk Study Pod Neo-Saigon',
    description: 'Đèn neon tím hồng cyberpunk, view toàn cảnh thành phố tương lai mưa bay',
    themeClass: 'from-[#1B0D33] via-[#331140] to-[#120826]',
    gradient: 'from-fuchsia-600/20 via-pink-600/20 to-purple-950/40',
    ambienceKey: 'cyber',
    icon: '🚀',
  },
];

export const INITIAL_STUDY_PARTICIPANTS: StudyParticipant[] = [
  {
    id: 'bot-1',
    name: 'Minh Trí (ĐH Bách Khoa)',
    avatar: '👨‍💻',
    status: 'Đang cắm tai nghe code 🎧',
    goal: 'Hoàn thành 3 thuật toán đồ thị trong Đồ án 2',
    goalCompleted: false,
    isCamOn: true,
    isMicOn: false,
    minutesStudied: 58,
    streakDays: 14,
  },
  {
    id: 'bot-2',
    name: 'Thảo Nhi (ĐH Ngoại Thương)',
    avatar: '👩‍🎓',
    status: 'Đang phân tích case study 📑',
    goal: 'Làm slide thuyết trình môn Marketing Quốc tế',
    goalCompleted: true,
    isCamOn: true,
    isMicOn: false,
    minutesStudied: 84,
    streakDays: 21,
  },
  {
    id: 'bot-3',
    name: 'Bảo Long (ĐH Y Dược)',
    avatar: '🩺',
    status: 'Đang học Flashcard Dược lý 💊',
    goal: 'Ôn 80 thẻ giải phẫu thần kinh phần 2',
    goalCompleted: false,
    isCamOn: false,
    isMicOn: false,
    minutesStudied: 112,
    streakDays: 45,
  },
  {
    id: 'bot-4',
    name: 'Khánh Linh (ĐH Kinh Tế)',
    avatar: '🎨',
    status: 'Vẽ sơ đồ tư duy Mindmap ✍️',
    goal: 'Tóm tắt 4 chương Kinh tế vĩ mô',
    goalCompleted: false,
    isCamOn: true,
    isMicOn: false,
    minutesStudied: 35,
    streakDays: 8,
  },
  {
    id: 'bot-cat',
    name: 'Mèo Lofi Garfield (Trợ giảng)',
    avatar: '🐱',
    status: 'Ngủ khò bên chồng sách 💤',
    goal: 'Đồng hành giữ bình tĩnh cho cả phòng học',
    goalCompleted: true,
    isCamOn: true,
    isMicOn: false,
    minutesStudied: 180,
    streakDays: 99,
  },
];

export const INITIAL_CHAT_MESSAGES: StudyChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'bot-2',
    senderName: 'Thảo Nhi (FTU)',
    senderAvatar: '👩‍🎓',
    text: 'Chào cả phòng nha! Chúc mọi người một buổi tối học bài thật năng suất nhé ✨',
    timestamp: '20:15',
  },
  {
    id: 'msg-2',
    senderId: 'bot-1',
    senderName: 'Minh Trí (HUST)',
    senderAvatar: '👨‍💻',
    text: 'Hôm nay mình quyết tâm ngồi cày cho xong Đồ án, ai buồn ngủ nhớ uống ngụm nước ấm!',
    timestamp: '20:22',
  },
  {
    id: 'msg-3',
    senderId: 'bot-cat',
    senderName: 'Mèo Lofi',
    senderAvatar: '🐱',
    text: 'Meoww~ Chúc bạn học bài không bị phân tâm bởi điện thoại nhen! 🐾',
    timestamp: '20:25',
  },
  {
    id: 'msg-4',
    senderId: 'bot-3',
    senderName: 'Bảo Long (Y Dược)',
    senderAvatar: '🩺',
    text: 'Vừa hoàn thành phiên Pomodoro thứ 3, đầu óc thông thoáng hẳn!',
    timestamp: '20:38',
  },
];

export interface SharedStickyNote {
  id: string;
  author: string;
  content: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
  createdAt: string;
  likes: number;
}

export const INITIAL_STICKY_NOTES: SharedStickyNote[] = [
  {
    id: 'note-1',
    author: 'Minh Trí',
    content: 'Định luật Parkinson: Công việc luôn tự nở ra để lấp đầy thời gian bạn dành cho nó. Hãy đặt deadline ngắn hơn!',
    color: 'yellow',
    createdAt: 'Hôm nay',
    likes: 8,
  },
  {
    id: 'note-2',
    author: 'Thảo Nhi',
    content: 'Ôn thi không phải là đọc thuộc lòng, mà là tự đặt câu hỏi và trả lời không nhìn tập (Active Recall)',
    color: 'pink',
    createdAt: 'Hôm nay',
    likes: 12,
  },
  {
    id: 'note-3',
    author: 'Bảo Long',
    content: 'Nhớ uống đủ 500ml nước trong 2 tiếng ngồi học để não không bị hạ năng suất nhen anh em!',
    color: 'blue',
    createdAt: 'Hôm nay',
    likes: 15,
  },
];

export const QUICK_CHEERS = [
  'Uống miếng nước ấm đi bạn ơi! 💧',
  'Đừng lướt điện thoại nha, còn xíu nữa xong rồi! 📱🚫',
  'Cố lên bạn ơi, hôm nay làm tốt lắm! 💪',
  'Bạn đỉnh chóp lắm, giữ vững phong độ nhé! ⭐',
  'Hít thở sâu 3 nhịp nào, bình tĩnh xử lý deadline! 🧘‍♂️',
  'Cùng chiến hết mình nào anh em! 🔥',
];
