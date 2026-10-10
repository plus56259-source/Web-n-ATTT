import { ForumPost, ForumComment } from '../types';

export interface ForumCategoryMeta {
  key: ForumPost['category'];
  label: string;
  icon: string;
  color: string;
  badgeBg: string;
  description: string;
}

export const FORUM_CATEGORIES: ForumCategoryMeta[] = [
  {
    key: 'tips',
    label: 'Mẹo & Sinh Tồn',
    icon: '💡',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description: 'Bí kíp thích nghi giảng đường, học tập thông minh và sinh tồn qua các mùa thi',
  },
  {
    key: 'gpa',
    label: 'Cứu Vớt GPA',
    icon: '📈',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    description: 'Chiến thuật kéo điểm, tính toán tín chỉ chiến lược và săn học bổng',
  },
  {
    key: 'methods',
    label: 'Phương Pháp Học',
    icon: '🧠',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    description: 'Trải nghiệm áp dụng Active Recall, Cornell Notes, Feynman, Spaced Repetition',
  },
  {
    key: 'review',
    label: 'Review Môn Học',
    icon: '📚',
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    description: 'Kinh nghiệm học môn đại cương, chuyên ngành, thầy cô và đề thi các khóa',
  },
  {
    key: 'wellbeing',
    label: 'Chữa Lành & Cân Bằng',
    icon: '🌱',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    description: 'Giải tỏa áp lực đồng trang lứa (Peer Pressure), vượt qua burnout và giữ tinh thần tích cực',
  },
  {
    key: 'teamup',
    label: 'Tìm Bạn Cùng Tiến',
    icon: '🤝',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    description: 'Tìm bạn cùng cày bài tập lớn, luyện chứng chỉ tiếng Anh, thi nghiên cứu khoa học',
  },
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorId: 'u-senior-gpa',
    authorName: 'Hoàng Nam (Thủ khoa K62 NEU)',
    authorAvatar: '👨‍🎓',
    title: 'Hành trình từ nguy cơ rớt môn năm nhất đến tấm bằng Xuất sắc 3.78/4.0: 3 sai lầm chí mạng cần tránh',
    content: `Chào các bạn sinh viên UniLevelUp! 

Năm nhất đại học, mình từng shock văn hóa học đường khủng khiếp. Từ một học sinh chuyên cấp 3, kỳ đầu tiên mình nhận ngay 2 con C+ môn Kinh tế chính trị và Xác suất thống kê, GPA rơi xuống 2.45.

Sau đó, mình nhận ra 3 sai lầm chí tử mà 90% tân sinh viên mắc phải:
1. **Lầm tưởng đọc nhiều là hiểu sâu:** Mình ngồi highlight kín cả cuốn sách nhưng lúc vào phòng thi thì não hoàn toàn trống rỗng (Ảo tưởng thấu hiểu). Mình đã đổi sang phương pháp Active Recall: đọc 1 trang, gấp sách lại và tự viết lại dàn ý lên giấy nháp trắng (Blurting).
2. **Bỏ qua Syllabus (Đề cương môn học):** Đề cương môn học chính là "kim chỉ nam". Hãy xem thành phần điểm: nếu chuyên cần 10%, bài tập 30%, cuối kỳ 60%, bạn tuyệt đối không được để mất bất kỳ điểm lẻ nào ở phần bài tập nhóm và quá trình.
3. **Chiến thuật "Bỏ túi điểm A ở các môn đại cương":** Những môn 3-4 tín chỉ sẽ kéo GPA rất mạnh. Đầu tư nghiêm túc ngay từ tuần đầu tiên thay vì dồn vào 2 tuần cuối.

Hiện tại mình đã ra trường với GPA 3.78 và học bổng khuyến khích 5 kỳ liên tiếp. Nếu bạn đang cảm thấy bế tắc, hãy nhớ rằng đại học là đường chạy marathon chứ không phải chạy nước rút 100m!`,
    category: 'gpa',
    tags: ['Kéo GPA', 'Sinh viên năm nhất', 'Active Recall', 'Kinh nghiệm học'],
    likes: 142,
    likedBy: [],
    commentCount: 18,
    createdAt: 'Hôm qua lúc 19:30',
    pinned: true,
  },
  {
    id: 'post-2',
    authorId: 'u-med-student',
    authorName: 'Bác sĩ tương lai Đăng Khoa',
    authorAvatar: '🩺',
    title: 'Cách mình học thuộc hơn 3.000 thuật ngữ Giải phẫu & Dược lý mà không bị loạn não nhờ Leitner Box',
    content: `Học Y Dược lượng kiến thức ghi nhớ là khổng lồ. Nếu bạn đang chật vật với các môn học thuộc lòng như Triết học, Pháp luật hay Sinh học tế bào, hãy thử công thức này:

- **Bước 1:** Đừng tạo flashcard quá dài. Mỗi thẻ chỉ chứa ĐÚNG 1 thông tin (Single Fact Rule).
- **Bước 2:** Áp dụng hệ thống 5 hộp Leitner: Thẻ sai ôn lại hằng ngày (Hộp 1), thẻ đúng chuyển sang Hộp 2 (ôn sau 3 ngày), Hộp 3 (ôn sau 7 ngày)...
- **Bước 3:** Sử dụng công cụ Flashcard thông minh ngay trên trang web UniLevelUp này (vào mục 12 Công cụ). Nó tự động phân loại thẻ theo thuật toán Spaced Repetition cực kỳ tiện.

Kết quả là điểm thi hết môn của mình kỳ vừa rồi đều từ 8.5 trở lên mà không cần phải thức trắng đêm trước ngày thi!`,
    category: 'methods',
    tags: ['Leitner Box', 'Flashcard', 'Spaced Repetition', 'Học thuộc lòng'],
    likes: 98,
    likedBy: [],
    commentCount: 12,
    createdAt: '2 ngày trước',
    pinned: true,
  },
  {
    id: 'post-3',
    authorId: 'u-bk-student',
    authorName: 'Tuấn Anh (Bách Khoa K65)',
    authorAvatar: '💻',
    title: 'Review chân thực môn Giải tích 1 & Đại số tuyến tính: Đề thi thường "bẫy" ở phần nào?',
    content: `Gửi các anh em tân sinh viên khối ngành Kỹ thuật và Công nghệ thông tin:

Giải tích 1 và Đại số là hai "ác mộng" năm nhất nếu chủ quan. Kinh nghiệm xương máu của mình:
- **Giải tích 1:** 40% điểm nằm ở phần Khảo sát tính hội tụ của chuỗi và Tích phân suy rộng. Giảng viên rất thích cho các bài bẫy điều kiện Dirichlet hoặc tích phân kỳ dị ở biên. Hãy luyện nhuần nhuyễn các tiêu chuẩn D'Alembert, Cauchy và so sánh tương đương.
- **Đại số:** Đừng chỉ bấm máy tính ma trận! Đề thi tự luận hỏi rất sâu về Không gian vector con, Cơ sở & Số chiều, và Ma trận chuyển cơ sở. Vẽ sơ đồ biến đổi trực giao để hiểu bản chất hình học.
- **Tip:** Làm đề thi mẫu 5 năm gần nhất tại thư viện trường, 70% dạng bài sẽ lặp lại cấu trúc tư duy!`,
    category: 'review',
    tags: ['Giải tích', 'Đại số', 'Bách Khoa', 'Đề thi'],
    likes: 87,
    likedBy: [],
    commentCount: 9,
    createdAt: '3 ngày trước',
  },
  {
    id: 'post-4',
    authorId: 'u-healing-student',
    authorName: 'Mai Phương (ĐH Khoa Học Xã Hội & Nhân Văn)',
    authorAvatar: '🌸',
    title: 'Khi bạn bè ai cũng đi làm thêm, học IELTS 8.0, tham gia 3 CLB: Làm sao để không bị ngộp thở bởi Peer Pressure?',
    content: `Mỗi lần mở Facebook hoặc LinkedIn lên, thấy bạn cùng lớp được nhận thực tập sinh tập đoàn đa quốc gia, bạn khác khoe bảng điểm 4.0, bạn khác làm chủ nhiệm CLB... Mình từng có cảm giác mình là kẻ vô dụng nhất trần đời.

Nếu bạn cũng đang có cảm giác đó:
1. **Mạng xã hội là Highlight Reel của người khác:** Không ai đăng lên mạng những đêm khóc một mình vì áp lực hay bài thi bị điểm F cả.
2. **Mỗi người có một múi giờ phát triển riêng:** Có người nở hoa ở tuổi 20, có người vững vàng ở tuổi 25. Đại học là nơi bạn tìm ra BẢN THÂN MÌNH thực sự thích gì, chứ không phải bản sao của người khác.
3. **Mỗi ngày tiến bộ 1% so với chính bạn hôm qua:** Hôm nay học thêm được 1 chương sách, làm xong 1 bài tập, uống đủ 2 lít nước và ngủ đủ 7 tiếng — bạn đã rất cừ khôi rồi!`,
    category: 'wellbeing',
    tags: ['Peer Pressure', 'Tâm lý học', 'Cân bằng cuộc sống', 'Động lực'],
    likes: 176,
    likedBy: [],
    commentCount: 24,
    createdAt: '4 ngày trước',
  },
  {
    id: 'post-5',
    authorId: 'u-teamup-lead',
    authorName: 'Quốc Huy (Học Viện Tài Chính)',
    authorAvatar: '📊',
    title: '[Tìm Đội Nhóm] Cần 2 bạn cùng lập team tham gia Nghiên cứu khoa học cấp Trường đề tài FinTech & AI',
    content: `Chào mọi người! Nhóm mình hiện có 2 thành viên (1 bạn phụ trách tìm tài liệu & tổng quan lý thuyết, 1 bạn phụ trách định dạng dữ liệu).

Tụi mình đang cần thêm:
- 1 bạn thích phân tích số liệu SPSS / Stata / Python cơ bản
- 1 bạn hỗ trợ dịch tài liệu tiếng Anh và làm slide báo cáo
Quyền lợi: Được giảng viên hướng dẫn nhiệt tình, cộng điểm rèn luyện và kinh nghiệm viết bài báo khoa học cực tốt cho hồ sơ xin học bổng hoặc việc làm sau này!

Bạn nào quan tâm comment bên dưới hoặc để lại liên hệ nhé!`,
    category: 'teamup',
    tags: ['Nghiên cứu khoa học', 'Tìm nhóm', 'FinTech', 'Cộng điểm'],
    likes: 45,
    likedBy: [],
    commentCount: 11,
    createdAt: '5 ngày trước',
  },
  {
    id: 'post-6',
    authorId: 'u-ftu-time',
    authorName: 'Minh Thảo (ĐH Ngoại Thương)',
    authorAvatar: '⏰',
    title: 'Kỹ thuật Time-Boxing của Elon Musk áp dụng cho sinh viên Việt Nam: Vừa học bổng vừa làm thêm 15h/tuần',
    content: `Rất nhiều bạn hỏi mình làm sao vừa duy trì GPA 3.6+ vừa đi trợ giảng tiếng Anh và tham gia ban tổ chức sự kiện. Bí quyết duy nhất của mình là **Time-Boxing**.

Thay vì viết to-do list dài vô tận khiến bạn trì hoãn, Time-Boxing chia ngày thành các khối thời gian bất khả xâm phạm:
- 06:30 - 07:30: Ôn bài bằng Flashcard + Chuẩn bị đồ
- 08:00 - 11:30: Lên lớp (tập trung 100%, ghi chép kiểu Cornell)
- 13:30 - 15:30: Làm bài tập lớn (bật chế độ Focus Mode Pomodoro)
- 16:00 - 19:00: Đi làm thêm
- 20:30 - 22:30: Đọc tài liệu / Học kỹ năng mới
- Sau 22:30: Dành trọn vẹn cho bản thân, không động đến bài vở!

Khi biết chính xác giờ nào làm việc gì, bạn sẽ không bao giờ có cảm giác "lúc nào cũng phải học" nhưng thực tế chẳng làm được bao nhiêu.`,
    category: 'tips',
    tags: ['Quản lý thời gian', 'Time Blocking', 'Làm thêm', 'Học bổng'],
    likes: 115,
    likedBy: [],
    commentCount: 14,
    createdAt: '6 ngày trước',
  },
];

export const INITIAL_FORUM_COMMENTS: Record<string, ForumComment[]> = {
  'post-1': [
    {
      id: 'c-1',
      postId: 'post-1',
      authorId: 'u-cmt-1',
      authorName: 'Bảo Trâm (K63)',
      authorAvatar: '👩‍🦰',
      content: 'Bài viết đúng tim đen của em luôn anh ơi! Kỳ trước em cũng highlight xanh đỏ cả quyển mà thi được có 6.0, kỳ này áp dụng Blurting thấy nhớ sâu hơn hẳn!',
      createdAt: 'Hôm qua lúc 20:10',
      likes: 14,
    },
    {
      id: 'c-2',
      postId: 'post-1',
      authorId: 'u-cmt-2',
      authorName: 'Đức Minh (ĐHQG)',
      authorAvatar: '🧑‍💻',
      content: 'Chuẩn luôn anh, cái Syllabus là quan trọng nhất. Em toàn lấy Syllabus in ra dán trước bàn học để canh tỷ lệ điểm bài tập.',
      createdAt: 'Hôm qua lúc 21:05',
      likes: 8,
    },
    {
      id: 'c-3',
      postId: 'post-1',
      authorId: 'u-cmt-3',
      authorName: 'Hà My',
      authorAvatar: '👧',
      content: 'Cảm ơn anh nhiều ạ, đọc xong có thêm động lực cày cuốc kỳ 2 này rất nhiều!',
      createdAt: 'Hôm qua lúc 22:40',
      likes: 5,
    },
  ],
  'post-2': [
    {
      id: 'c-4',
      postId: 'post-2',
      authorId: 'u-cmt-4',
      authorName: 'Thanh Thảo',
      authorAvatar: '👩‍⚕️',
      content: 'Công nhận Leitner kết hợp Spaced Repetition cứu rỗi sinh viên ngành Y thật sự!',
      createdAt: '2 ngày trước',
      likes: 9,
    },
    {
      id: 'c-5',
      postId: 'post-2',
      authorId: 'u-cmt-5',
      authorName: 'Tuấn Khang',
      authorAvatar: '🧑',
      content: 'Công cụ flashcard trên web này dùng mượt lắm, có cả thuật toán Leitner sẵn luôn!',
      createdAt: '2 ngày trước',
      likes: 11,
    },
  ],
  'post-4': [
    {
      id: 'c-6',
      postId: 'post-4',
      authorId: 'u-cmt-6',
      authorName: 'Kim Ngân',
      authorAvatar: '🌻',
      content: 'Đọc bài này của bạn mà mình rơm rớm nước mắt. Cảm ơn bạn vì đã nhắc nhở mình về giá trị của bản thân ❤️',
      createdAt: '3 ngày trước',
      likes: 22,
    },
    {
      id: 'c-7',
      postId: 'post-4',
      authorId: 'u-cmt-7',
      authorName: 'Nhật Quang',
      authorAvatar: '🙋‍♂️',
      content: 'Mỗi người một múi giờ. Thấm câu này ghê, chúc các bạn sinh viên luôn bình an và kiên trì!',
      createdAt: '3 ngày trước',
      likes: 16,
    },
  ],
};
