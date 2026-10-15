export interface PieSlice {
  label: string;
  percent: number;
  count: number;
  color: string;
  gradient: string;
}

export interface BarItem {
  label: string;
  count: number;
  percent: number;
  color: string;
  accentClass: string;
}

export interface SurveyChart {
  id: string;
  title: string;
  subtitle: string;
  type: 'pie' | 'bar';
  totalResponses: number;
  takeaway: string;
  data: PieSlice[] | BarItem[];
}

export interface TeamMember {
  id: string;
  code: string; // TV1, TV2...
  name: string;
  studentId: string; // MSSV
  role: string;
  detailedTasks: string[];
  avatarColor: string;
  initials: string;
  highlight?: boolean;
}

export const SURVEY_METRICS = {
  totalParticipants: 102,
  sampleDescription: '102 sinh viên các trường Đại học trên địa bàn TP.HCM và cả nước',
  aiAdoptionRate: 92.2,
  distractionRate: 68.6,
  studyTime1to3Hours: 56.9,
  pomodoroAdoption: 58.8,
  mindmapAdoption: 52.9,
};

export const SURVEY_CHARTS: SurveyChart[] = [
  {
    id: 'chart-1',
    title: 'Bạn đang là sinh viên năm mấy?',
    subtitle: 'Phân bố đối tượng khảo sát theo năm học đại học',
    type: 'pie',
    totalResponses: 102,
    takeaway: 'Gần 50% người tham gia là tân sinh viên năm 1 cần được trang bị phương pháp học tập đại học ngay từ đầu để tránh sốc văn hóa và áp lực khối lượng tín chỉ.',
    data: [
      { label: 'Năm 1', percent: 49.0, count: 50, color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
      { label: 'Năm 2', percent: 21.6, count: 22, color: '#EA580C', gradient: 'from-orange-500 to-amber-600' },
      { label: 'Năm 3', percent: 14.7, count: 15, color: '#F59E0B', gradient: 'from-amber-400 to-yellow-500' },
      { label: 'Năm 4', percent: 8.8, count: 9, color: '#10B981', gradient: 'from-emerald-400 to-teal-600' },
      { label: 'Đã tốt nghiệp', percent: 5.9, count: 6, color: '#8B5CF6', gradient: 'from-purple-500 to-fuchsia-600' },
    ],
  },
  {
    id: 'chart-2',
    title: 'Bạn thuộc nhóm ngành học nào?',
    subtitle: 'Cơ cấu ngành học của sinh viên tham gia khảo sát',
    type: 'pie',
    totalResponses: 102,
    takeaway: 'Khối Kinh tế (33,3%) và Khoa học tự nhiên (25,5%) chiếm ưu thế lớn, đòi hỏi cả tư duy phân tích số liệu lẫn kỹ năng ghi nhớ khái niệm trừu tượng.',
    data: [
      { label: 'Kinh tế', percent: 33.3, count: 34, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-500' },
      { label: 'Khoa học tự nhiên', percent: 25.5, count: 26, color: '#F59E0B', gradient: 'from-amber-500 to-orange-500' },
      { label: 'Khoa học xã hội', percent: 17.6, count: 18, color: '#EF4444', gradient: 'from-rose-500 to-red-600' },
      { label: 'Y dược', percent: 10.8, count: 11, color: '#10B981', gradient: 'from-emerald-500 to-teal-600' },
      { label: 'Nghệ thuật, Giáo dục, Truyền thông, Thiết kế thời trang...', percent: 12.8, count: 13, color: '#A855F7', gradient: 'from-purple-500 to-pink-500' },
    ],
  },
  {
    id: 'chart-3',
    title: 'Khó khăn mà bạn gặp phải khi học Đại học là gì? (Chọn 1 hoặc nhiều phương án)',
    subtitle: 'Rào cản lớn nhất cản trở hiệu quả học tập và phong độ học đường',
    type: 'bar',
    totalResponses: 102,
    takeaway: 'Hơn 68% sinh viên chật vật vì xao nhãng điện thoại và 61,8% quá tải kiến thức — đây là lý do UniLevelUp xây dựng phòng học Study With Me cách ly xao nhãng và hệ thống bài học vi mô (Micro-learning).',
    data: [
      {
        label: 'Thiếu khả năng tập trung, dễ bị xao nhãng bởi điện thoại, mạng xã hội...',
        count: 70,
        percent: 68.6,
        color: '#EF4444',
        accentClass: 'from-rose-500 to-red-600 shadow-rose-500/30',
      },
      {
        label: 'Khối lượng kiến thức quá nhiều',
        count: 63,
        percent: 61.8,
        color: '#F97316',
        accentClass: 'from-orange-500 to-amber-600 shadow-orange-500/30',
      },
      {
        label: 'Chưa biết cách quản lý thời gian',
        count: 43,
        percent: 42.2,
        color: '#F59E0B',
        accentClass: 'from-amber-400 to-yellow-500 shadow-amber-500/30',
      },
      {
        label: 'Thiếu động lực học',
        count: 41,
        percent: 40.2,
        color: '#8B5CF6',
        accentClass: 'from-purple-500 to-indigo-600 shadow-purple-500/30',
      },
      {
        label: 'Giảng viên truyền đạt khó hiểu',
        count: 25,
        percent: 24.5,
        color: '#3B82F6',
        accentClass: 'from-blue-500 to-cyan-600 shadow-blue-500/30',
      },
    ],
  },
  {
    id: 'chart-4',
    title: 'Thời gian bạn dành cho việc tự học mỗi ngày là bao nhiêu?',
    subtitle: 'Thói quen đầu tư thời gian tự học ngoài giờ lên lớp',
    type: 'pie',
    totalResponses: 102,
    takeaway: '56,9% sinh viên chỉ tự học từ 1-3 tiếng/ngày và 17,6% dưới 1 tiếng. Với quỹ thời gian hạn hẹp, học thông minh và tối ưu từng phút là chìa khóa duy nhất để bứt phá.',
    data: [
      { label: 'Từ 1-3 tiếng', percent: 56.9, count: 58, color: '#EA580C', gradient: 'from-orange-600 to-amber-600' },
      { label: 'Từ 3-5 tiếng', percent: 21.6, count: 22, color: '#F59E0B', gradient: 'from-amber-400 to-yellow-500' },
      { label: 'Dưới 1 tiếng', percent: 17.6, count: 18, color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600' },
      { label: 'Trên 5 tiếng', percent: 3.9, count: 4, color: '#10B981', gradient: 'from-emerald-400 to-teal-600' },
    ],
  },
  {
    id: 'chart-5',
    title: 'Bạn đã áp dụng những phương pháp học tập nào? (Chọn 1 hoặc nhiều phương án)',
    subtitle: 'Mức độ phổ biến của các phương pháp học tập khoa học trong sinh viên',
    type: 'bar',
    totalResponses: 102,
    takeaway: 'Pomodoro (58,8%) và Mindmap (52,9%) là 2 phương pháp được ưa chuộng nhất, chứng minh nhu cầu cấp thiết về công cụ bấm giờ Pomodoro tự động và vẽ Mindmap tích hợp ngay trên UniLevelUp.',
    data: [
      {
        label: 'Pomodoro (Quản lý thời gian, x...)',
        count: 60,
        percent: 58.8,
        color: '#EC4899',
        accentClass: 'from-pink-500 to-rose-600 shadow-pink-500/30',
      },
      {
        label: 'Mindmap (Sơ đồ tư duy)',
        count: 54,
        percent: 52.9,
        color: '#6366F1',
        accentClass: 'from-indigo-500 to-purple-600 shadow-indigo-500/30',
      },
      {
        label: 'Group Study (Học nhóm)',
        count: 53,
        percent: 52.0,
        color: '#06B6D4',
        accentClass: 'from-cyan-500 to-blue-600 shadow-cyan-500/30',
      },
      {
        label: 'Active Recall (Chủ động gợi nh...)',
        count: 41,
        percent: 40.2,
        color: '#F59E0B',
        accentClass: 'from-amber-400 to-orange-500 shadow-amber-500/30',
      },
      {
        label: 'Spaced Repetition (Ôn tập ngắ...)',
        count: 24,
        percent: 23.5,
        color: '#10B981',
        accentClass: 'from-emerald-400 to-teal-600 shadow-emerald-500/30',
      },
      {
        label: 'Feynman (Đóng vai người dạy...)',
        count: 19,
        percent: 18.6,
        color: '#8B5CF6',
        accentClass: 'from-purple-500 to-violet-600 shadow-purple-500/30',
      },
      {
        label: 'Cornell Notes (Ghi chép theo c...)',
        count: 18,
        percent: 17.6,
        color: '#3B82F6',
        accentClass: 'from-blue-500 to-sky-600 shadow-blue-500/30',
      },
    ],
  },
  {
    id: 'chart-6',
    title: 'Đánh giá mức độ hiệu quả của phương pháp học tập?',
    subtitle: 'Cảm nhận của người học về kết quả thực tế mang lại',
    type: 'pie',
    totalResponses: 102,
    takeaway: '50% thấy hiệu quả và 26,5% thấy hiệu quả nhưng chưa tối ưu. Sinh viên rất cần một quy trình chuẩn hóa và công cụ hướng dẫn chi tiết để nâng hiệu quả lên mức cao nhất.',
    data: [
      { label: 'Hiệu quả', percent: 50.0, count: 51, color: '#EA580C', gradient: 'from-orange-600 to-amber-600' },
      { label: 'Hiệu quả nhưng chưa tối ưu', percent: 26.5, count: 27, color: '#F59E0B', gradient: 'from-amber-400 to-yellow-500' },
      { label: 'Rất hiệu quả', percent: 19.6, count: 20, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-600' },
      { label: 'Không hiệu quả', percent: 3.9, count: 4, color: '#10B981', gradient: 'from-emerald-500 to-teal-600' },
    ],
  },
  {
    id: 'chart-7',
    title: 'Bạn thường sử dụng những công cụ nào để hỗ trợ học tập? (Chọn 1 hoặc nhiều phương án)',
    subtitle: 'Hệ sinh thái công nghệ học đường sinh viên sử dụng mỗi ngày',
    type: 'bar',
    totalResponses: 102,
    takeaway: 'Tỉ lệ kỷ lục 92,2% sinh viên sử dụng Công cụ AI hỗ trợ (ChatGPT, Gemini, Claude...). Điều này khẳng định tính đúng đắn khi UniLevelUp tích hợp Trợ lý AI học thuật trực tiếp 24/7.',
    data: [
      {
        label: 'Công cụ AI hỗ trợ ( Chat GPT, Gemini, Claude...)',
        count: 94,
        percent: 92.2,
        color: '#8B5CF6',
        accentClass: 'from-purple-500 via-pink-500 to-rose-500 shadow-purple-500/40',
      },
      {
        label: 'Công cụ ghi chép (Goodnotes, OneNote...)',
        count: 50,
        percent: 49.0,
        color: '#06B6D4',
        accentClass: 'from-cyan-500 to-blue-600 shadow-cyan-500/30',
      },
      {
        label: 'Công cụ hỗ trợ ôn tập ( Anki, Quizlet...)',
        count: 42,
        percent: 41.2,
        color: '#10B981',
        accentClass: 'from-emerald-400 to-teal-600 shadow-emerald-500/30',
      },
      {
        label: 'Công cụ quản lý thời gian ( Google Calendar...)',
        count: 38,
        percent: 37.3,
        color: '#F59E0B',
        accentClass: 'from-amber-400 to-orange-500 shadow-amber-500/30',
      },
    ],
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tv-1',
    code: 'TV1',
    name: 'Đỗ Anh Kiệt',
    studentId: '26162063',
    role: 'Trưởng nhóm + báo cáo Word',
    detailedTasks: [
      'Điều phối tiến độ tổng thể của toàn dự án',
      'Xây dựng đề cương nghiên cứu và tổng hợp báo cáo Word hoàn chỉnh',
      'Đảm bảo tính chính xác và nhất quán trong toàn bộ nội dung học thuật',
    ],
    avatarColor: 'from-[#6C4DFF] to-indigo-600',
    initials: 'AK',
    highlight: true,
  },
  {
    id: 'tv-2',
    code: 'TV2',
    name: 'Võ Văn Việt',
    studentId: '26162148',
    role: 'Nghiên cứu nội dung + viết trang phương pháp',
    detailedTasks: [
      'Nghiên cứu cơ sở lý luận khoa học nhận thức và phương pháp học tập',
      'Biên soạn chi tiết các trang phương pháp (Pomodoro, Feynman, Active Recall...)',
      'Đánh giá tính khả thi và tài liệu tham khảo quốc tế',
    ],
    avatarColor: 'from-emerald-500 to-teal-700',
    initials: 'VV',
  },
  {
    id: 'tv-3',
    code: 'TV3',
    name: 'Lê Vĩnh Hùng',
    studentId: '26162046',
    role: 'Khảo sát, số liệu + viết trang thực trạng, kết luận',
    detailedTasks: [
      'Thiết kế và triển khai bảng câu hỏi khảo sát thực tiễn 102 sinh viên',
      'Thu thập, xử lý và trực quan hóa số liệu thống kê',
      'Phân tích thực trạng học tập và viết kết luận giải pháp',
    ],
    avatarColor: 'from-amber-500 to-orange-600',
    initials: 'VH',
  },
  {
    id: 'tv-4',
    code: 'TV4',
    name: 'Nguyễn Hiệp Bảo Thy',
    studentId: '26162126',
    role: 'Biên tập nội dung',
    detailedTasks: [
      'Biên tập và chuẩn hóa toàn bộ văn phong, thuật ngữ trong hệ thống',
      'Kiểm duyệt độ chính xác, logic và tính hấp dẫn của từng đề mục',
      'Tối ưu hóa cấu trúc nội dung hướng đến người học',
    ],
    avatarColor: 'from-pink-500 to-rose-600',
    initials: 'BT',
  },
  {
    id: 'tv-5',
    code: 'TV5',
    name: 'Nguyễn Chiến Thắng',
    studentId: '26162115',
    role: 'Dựng website (chính) + giao diện',
    detailedTasks: [
      'Phát triển kiến trúc giao diện người dùng chính (Frontend Architecture)',
      'Lập trình các tính năng tương tác, bảng điều khiển và hệ thống công cụ',
      'Tối ưu trải nghiệm mượt mà, hiệu năng và responsive trên mọi thiết bị',
    ],
    avatarColor: 'from-blue-600 to-cyan-500',
    initials: 'CT',
    highlight: true,
  },
  {
    id: 'tv-6',
    code: 'TV6',
    name: 'Nguyễn Nhật Ánh',
    studentId: '26162008',
    role: 'Dựng website (cùng TV6) + hình minh họa',
    detailedTasks: [
      'Phối hợp dựng website và cấu trúc trang web',
      'Thiết kế và tối ưu hệ thống hình ảnh minh họa, visual graphics phong cách Lofi/Chill',
      'Hoàn thiện đồ họa các biểu đồ và card học tập trực quan',
    ],
    avatarColor: 'from-purple-600 to-fuchsia-600',
    initials: 'NA',
  },
  {
    id: 'tv-7',
    code: 'TV7',
    name: 'Phạm Doãn Gia Bảo',
    studentId: '26162013',
    role: 'PowerPoint',
    detailedTasks: [
      'Thiết kế bộ slide thuyết trình PowerPoint chuyên nghiệp, trực quan',
      'Tóm lược các số liệu khảo sát và mô hình giải pháp ấn tượng',
      'Chuẩn bị visual trình chiếu cho buổi báo cáo dự án',
    ],
    avatarColor: 'from-teal-500 to-emerald-600',
    initials: 'GB',
  },
];
