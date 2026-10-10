import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { METHODS_DATA } from '../../data/learningData';
import {
  Compass,
  BookOpen,
  Wrench,
  Gamepad2,
  Heart,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  Award,
  Video,
  MessageSquare,
  Coffee,
  GraduationCap,
  School,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import heroStudentsAsset from '../../assets/images/hero_vietnam_students_study_1791430590021.jpg';
import mascotDeskAsset from '../../assets/images/mascot_level_up_desk_1791430605444.jpg';

export const HomeView: React.FC = () => {
  const { setActiveTab, setQuizOpen, addXP, user, loginWithGoogle } = useApp();
  const [heroSrc, setHeroSrc] = useState<string>(heroStudentsAsset);
  const [mascotSrc, setMascotSrc] = useState<string>(mascotDeskAsset);
  const [heroImgError, setHeroImgError] = useState(false);
  const [mascotImgError, setMascotImgError] = useState(false);

  // Dynamic rotating keywords in Hero
  const keywords = ['Thi cử', 'Deadline', 'GPA 4.0', 'Học bổng', 'Thuyết trình', 'Tiểu luận'];
  const [keywordIndex, setKeywordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setKeywordIndex(prev => (prev + 1) % keywords.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [keywords.length]);

  // Mini Pomodoro widget state directly on home
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomoActive && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds(s => s - 1);
      }, 1000);
    } else if (pomoActive && pomoSeconds === 0) {
      sound.playTing();
      setPomoActive(false);
      addXP(20, 'Hoàn thành mini phiên Pomodoro trên trang chủ');
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoSeconds, addXP]);

  const toggleMiniPomo = () => {
    sound.playClick();
    setPomoActive(!pomoActive);
  };

  const resetMiniPomo = () => {
    sound.playClick();
    setPomoActive(false);
    setPomoSeconds(25 * 60);
  };

  // Quick GPA mini calculator
  const [miniCredit1, setMiniCredit1] = useState(3);
  const [miniScore1, setMiniScore1] = useState(8.5);
  const [miniCredit2, setMiniCredit2] = useState(3);
  const [miniScore2, setMiniScore2] = useState(7.0);

  const miniGPA = (
    (miniCredit1 * (miniScore1 >= 8.5 ? 4.0 : miniScore1 >= 7.0 ? 3.0 : 2.0) +
      miniCredit2 * (miniScore2 >= 8.5 ? 4.0 : miniScore2 >= 7.0 ? 3.0 : 2.0)) /
    (miniCredit1 + miniCredit2)
  ).toFixed(2);

  // Video 60s script player modal / tab
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videoSeries = [
    {
      title: 'Tập 1: 60 Giây Active Recall',
      method: 'Active Recall',
      tagline: 'Gấp sách lại và giải cứu trí nhớ',
      scriptSteps: [
        { time: '0-5s', desc: 'Đọc đi đọc lại 5 lần mà vẫn quên trước phòng thi? Vấn đề không phải do bạn kém thông minh.' },
        { time: '5-15s', desc: 'Não chỉ củng cố trí nhớ khi bạn ÉP NÓ TRUY XUẤT THÔNG TIN — đó chính là Active Recall.' },
        { time: '15-40s', desc: 'Quy tắc 3 bước: 1. Đọc xong một mục kiến thức. 2. Gấp sách lại ngay. 3. Tự viết ra giấy trắng hoặc nói to, sau đó lấy bút đỏ đối chiếu.' },
        { time: '40-60s', desc: 'Chỉ học lại phần viết sai. Ôn lại sau 1, 3, 7 ngày. Thử ngay tính năng Flashcard tại UniLevelUp!' },
      ],
      views: '14.2k lượt xem',
    },
    {
      title: 'Tập 2: Đánh Bại Thói Trì Hoãn',
      method: 'Quy tắc 5 Phút & Pomodoro',
      tagline: 'Phá vỡ lực cản của sự trì trệ',
      scriptSteps: [
        { time: '0-8s', desc: 'Deadline 2 tuần nữa nhưng ngày nào bạn cũng bảo "để mai tính"? Đó là do não sợ việc lớn.' },
        { time: '8-25s', desc: 'Đừng tự nhủ "Hôm nay phải viết xong 15 trang tiểu luận". Hãy nói: "Tôi chỉ mở laptop và viết đúng 1 câu mở bài".' },
        { time: '25-45s', desc: 'Kích hoạt đồng hồ Pomodoro 25 phút. Đặt điện thoại ở phòng khác. Khi bắt đầu được 5 phút, đà quán tính sẽ đưa bạn đi tiếp.' },
        { time: '45-60s', desc: 'Sau 4 phiên, tự thưởng cho mình một cốc trà sữa. Đặt lịch cùng UniLevelUp ngay hôm nay!' },
      ],
      views: '22.8k lượt xem',
    },
    {
      title: 'Tập 3: Giải Mã Tín Chỉ & GPA 4.0',
      method: 'Chiến thuật Tín chỉ',
      tagline: 'Tối ưu trọng số điểm ngay từ đầu kỳ',
      scriptSteps: [
        { time: '0-10s', desc: 'Bạn có biết: Một môn 4 tín chỉ đạt điểm A có sức nặng kéo GPA bằng hai môn 2 tín chỉ cộng lại?' },
        { time: '10-30s', desc: 'Hãy mở Syllabus ngay tuần 1. Đánh dấu các cột điểm thành phần: Chuyên cần, Kiểm tra giữa kỳ, Bài tập lớn và Cuối kỳ.' },
        { time: '30-50s', desc: 'Đừng để mất điểm chuyên cần và bài tập nhóm dễ lấy. Dùng công cụ Tính GPA của UniLevelUp để dự báo điểm số mục tiêu.' },
        { time: '50-60s', desc: 'Học thông minh hơn, đừng cày bừa bãi. Lên level cùng đại học!' },
      ],
      views: '18.9k lượt xem',
    },
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#6C4DFF]/25 via-[#FF4D8D]/20 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-pink-300">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
                <span>Bản thiết kế website chuẩn đại học 2026</span>
                <span className="text-white/40">·</span>
                <span className="text-white font-mono">unilevelup.vn</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Học đại học không khó.
                <br />
                Chỉ là chưa ai chỉ bạn{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D8D] via-[#FFB703] to-[#12B886] animate-pulse">
                  cách chơi.
                </span>
              </h1>

              {/* Subtitle with dynamic rotating keyword */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Chinh phục{' '}
                <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/15 transition-all">
                  {keywords[keywordIndex]}
                </span>{' '}
                với 6 phương pháp cốt lõi hàng đầu &amp; phương pháp bổ trợ, 12 công cụ dùng ngay và 7 mini-game ôn bài tương tác cao.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('studyroom');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4D8D] to-[#6C4DFF] text-white font-bold text-sm shadow-xl shadow-[#FF4D8D]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <Coffee className="w-4 h-4 text-amber-300" />
                  <span>Vào Phòng Học Chill (Study With Me)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('forum');
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 group"
                >
                  <MessageSquare className="w-4 h-4 text-[#FFB703]" />
                  <span>Diễn Đàn Sinh Viên</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('discover');
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm border border-white/10 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Khám phá</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Microcopy note */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12B886]" /> Dữ liệu lưu an toàn
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#12B886]" /> Không ép buộc đăng nhập
                </span>
                <span>·</span>
                <button
                  onClick={loginWithGoogle}
                  className="text-pink-300 hover:text-white underline font-semibold transition-colors flex items-center gap-1"
                >
                  <span>{user.email ? `Đã đồng bộ Gmail (${user.email})` : 'Đăng nhập Gmail để lưu trữ đám mây →'}</span>
                </button>
              </div>
            </div>

            {/* Right Media Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#1E1A45]/80 backdrop-blur-xl group min-h-[300px]">
                {!heroImgError ? (
                  <img
                    src={heroSrc}
                    alt="Sinh viên Việt Nam học tập cùng nhau tại thư viện trường đại học"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      if (heroSrc !== heroStudentsAsset) {
                        setHeroSrc(heroStudentsAsset);
                      } else {
                        setHeroImgError(true);
                      }
                    }}
                    className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  /* Stylized CSS/SVG fallback container matching brand design */
                  <div className="w-full h-72 sm:h-80 bg-gradient-to-br from-[#2A164D] via-[#1E1A45] to-[#14112E] p-8 flex flex-col justify-center items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-white shadow-xl shadow-[#6C4DFF]/30">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Không Gian Học Tập Đại Học</h4>
                      <p className="text-xs text-slate-300 max-w-xs mt-1">
                        Cộng đồng sinh viên chia sẻ phương pháp học tập đỉnh cao và tự tin chinh phục giảng đường
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14112E] via-[#14112E]/40 to-transparent pointer-events-none" />

                {/* Floating 3D Study Desk badge */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-white/10 backdrop-blur-md p-1">
                  {!mascotImgError ? (
                    <img
                      src={mascotSrc}
                      alt="Study station mascot 3D"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        if (mascotSrc !== mascotDeskAsset) {
                          setMascotSrc(mascotDeskAsset);
                        } else {
                          setMascotImgError(true);
                        }
                      }}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-2xl shadow-inner">
                      🎓
                    </div>
                  )}
                </div>

                {/* Floating interactive stats on image */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                    <div className="text-xs font-mono font-bold text-pink-400">25:00</div>
                    <div className="text-[10px] text-slate-300">Pomodoro</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                    <div className="text-xs font-mono font-bold text-amber-400">x5 combo</div>
                    <div className="text-[10px] text-slate-300">Quiz Rush</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                    <div className="text-xs font-mono font-bold text-emerald-400">3.82</div>
                    <div className="text-[10px] text-slate-300">GPA Mục tiêu</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                    <div className="text-xs font-mono font-bold text-sky-400 flex items-center justify-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>12 ngày</span>
                    </div>
                    <div className="text-[10px] text-slate-300">Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Quick Stat Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10">
            {[
              { num: '10', label: 'Phương pháp khoa học', sub: 'Active Recall, Feynman, Cornell...', color: 'text-[#6C4DFF]' },
              { num: '7', label: 'Mini-game ôn bài', sub: 'Vừa chơi vừa nhớ, không áp lực', color: 'text-[#FF4D8D]' },
              { num: '12', label: 'Công cụ trực tuyến', sub: 'Chạy ngay trong trình duyệt máy bạn', color: 'text-[#12B886]' },
              { num: '4 Năm', label: 'Lộ trình phát triển', sub: 'Từ tân sinh viên đến ra trường bằng Giỏi', color: 'text-[#FFB703]' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className={`text-3xl font-black font-mono tracking-tight ${stat.color}`}>
                  {stat.num}
                </div>
                <div className="text-sm font-bold text-white mt-1">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: SPOTLIGHT STUDY WITH ME & DIỄN ĐÀN SINH VIÊN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Study With Me Chill Room */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('studyroom');
            }}
            className="rounded-3xl border border-[#FF4D8D]/30 bg-gradient-to-br from-[#29143B] via-[#1D1233] to-[#14112E] p-6 sm:p-8 cursor-pointer relative overflow-hidden group shadow-xl hover:shadow-2xl hover:border-[#FF4D8D]/60 transition-all"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D8D]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#FF4D8D]/20 border border-[#FF4D8D]/30 text-xs font-bold text-pink-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>🟢 Đang có 12+ bạn cùng học</span>
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">☕</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-pink-300 transition-colors">
                  Phòng Học Bài "Study With Me" Chill
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Trải nghiệm phòng họp ảo phong cách lofi: 5 bối cảnh thư giãn (Cafe Tokyo, Rừng thông Đà Lạt, Thư viện đêm), bộ trộn âm thanh mưa rơi, camera/avatar học tập và thả reaction bay bổng lơ lửng!
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                  <span>✨ Chống trì hoãn • Chuỗi Pomodoro chung</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4D8D] to-[#6C4DFF] text-white text-xs font-bold flex items-center gap-1.5 shadow-md group-hover:translate-x-1 transition-transform">
                  <span>Vào phòng học ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Student Forum */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('forum');
            }}
            className="rounded-3xl border border-[#6C4DFF]/30 bg-gradient-to-br from-[#1E1645] via-[#161233] to-[#14112E] p-6 sm:p-8 cursor-pointer relative overflow-hidden group shadow-xl hover:shadow-2xl hover:border-[#6C4DFF]/60 transition-all"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C4DFF]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#6C4DFF]/20 border border-[#6C4DFF]/30 text-xs font-bold text-[#D8B4FE] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FFB703]" />
                  <span>Cộng đồng sinh viên toàn quốc</span>
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
                  Diễn Đàn Sinh Viên — Chia Sẻ & Thảo Luận
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Hàng chục bài viết thực chiến từ các thủ khoa và tiền bối: Chiến thuật kéo GPA 3.6+, bí kíp học thuộc với Flashcard Leitner, review đề thi đại cương và tìm bạn cùng tiến làm đồ án!
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <span>🔥 Thảo luận sôi nổi • Tặng +50 XP khi đăng bài</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/10 group-hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all">
                  <span>Khám phá diễn đàn</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5 TRỤ CỘT ĐỂ SỐNG SÓT VÀ TỎA SÁNG Ở ĐẠI HỌC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4D8D]">
            Khung Nền Tảng Đại Học
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            5 Trụ Cột Để Sống Sót (Và Tỏa Sáng) Ở Đại Học
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Học đại học không chỉ là cắm đầu cày điểm, mà là xây dựng một hệ thống học tập bền vững và giữ gìn sức khỏe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              id: 1,
              title: '1 · Hiểu',
              desc: 'Biết luật chơi của đại học trước khi nhập cuộc: tín chỉ, đề cương, cố vấn.',
              tab: 'discover' as const,
              icon: <Compass className="w-5 h-5" />,
              color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
            },
            {
              id: 2,
              title: '2 · Học',
              desc: 'Học ít hơn nhưng hiểu sâu, nhớ lâu nhờ phương pháp đúng bằng chứng.',
              tab: 'methods' as const,
              icon: <BookOpen className="w-5 h-5" />,
              color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
            },
            {
              id: 3,
              title: '3 · Quản lý',
              desc: 'Biến deadline thành lịch trình, không còn thành thảm hoạ nước đến chân.',
              tab: 'tools' as const,
              icon: <Wrench className="w-5 h-5" />,
              color: 'from-rose-500/20 to-orange-500/10 border-rose-500/30 text-rose-400',
            },
            {
              id: 4,
              title: '4 · Luyện',
              desc: 'Ôn bài như chơi game: có điểm số, có combo, đánh boss và nhận huy hiệu.',
              tab: 'games' as const,
              icon: <Gamepad2 className="w-5 h-5" />,
              color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
            },
            {
              id: 5,
              title: '5 · Giữ lửa',
              desc: 'Ngủ đủ 7-8h, ăn uống, vận động — não bạn cũng là một cơ quan sinh học.',
              tab: 'skills' as const,
              icon: <Heart className="w-5 h-5" />,
              color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
            },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(p.tab);
              }}
              className={`text-left p-5 rounded-2xl bg-gradient-to-b ${p.color} border hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group shadow-lg`}
            >
              <div>
                <div className="p-2.5 rounded-xl bg-white/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-white/80 group-hover:text-white">
                <span>Khám phá</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. BENTO GRID: PHƯƠNG PHÁP NỔI BẬT THEO THỨ TỰ ƯU TIÊN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6C4DFF] flex items-center gap-1.5">
              <span>⭐ Thứ Tự Ưu Tiên Hàng Đầu</span>
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              6 Phương Pháp Học Tập Cốt Lõi
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Xếp theo thứ tự quan trọng: Mindmap ➔ Pomodoro ➔ Group Study ➔ Active recall ➔ Spaced Repetition ➔ Cornell Notes.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('methods');
            }}
            className="text-xs font-bold text-[#FF4D8D] hover:text-pink-300 flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>Xem đủ 11 phương pháp &amp; phương pháp phụ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid layout with exact order: 1. Mindmap, 2. Pomodoro, 3. Group Study, 4. Active recall, 5. Spaced Repetition, 6. Cornell Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Card 1: Mindmap (Large 2 Cols) - Phương pháp 1 */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('methods');
            }}
            className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-purple-600/25 via-white/5 to-transparent border-2 border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/30 text-purple-200 border border-purple-500/50 flex items-center gap-1">
                  ⭐ Phương pháp 1: Cốt Lõi #1
                </span>
                <span className="text-amber-400 text-xs font-bold font-mono">★★★★★ Hiệu quả</span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                Phương Pháp 1: Mindmap (Bản Đồ Tư Duy)
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Nhìn bức tranh toàn cảnh và mạng lưới liên kết tri thức. Kích hoạt đồng thời cả hai bán cầu não, dùng màu sắc và từ khóa ngắn để cấu trúc hóa những chương học đồ sộ, phức tạp.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Hợp với: Tổng kết chương, ôn thi cuối kỳ, tiểu luận, luật, y dược</span>
              <span className="text-white font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Chi tiết quy trình <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Pomodoro - Phương pháp 2 */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('tools');
            }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#12B886] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  PP 2 · Pomodoro
                </span>
                <span className="text-emerald-400 text-xs font-mono">Dễ làm ★★★★★</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#12B886] transition-colors">
                Phương Pháp 2: Pomodoro 25/5
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Làm sâu 25 phút – nghỉ trọn vẹn 5 phút. Chia nhỏ khối bài vở khổng lồ, bẻ gãy sức ì tâm lý và ngăn ngừa kiệt sức.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-400 group-hover:text-emerald-300 flex items-center gap-1">
              Bật đồng hồ ngay <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Group Study - Phương pháp 3 */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('studyroom');
            }}
            className="p-6 rounded-3xl bg-gradient-to-br from-cyan-600/20 via-white/5 to-transparent border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  PP 3 · Group Study
                </span>
                <span className="text-amber-400 text-xs font-mono">★★★★★ Tương hỗ</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Phương Pháp 3: Group Study
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Học cùng bạn bè qua Phòng học nhóm trực tuyến – phản biện chéo, giải thích cho nhau và nhân đôi kỷ luật (Peer Accountability).
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-400 group-hover:text-cyan-300 flex items-center gap-1">
              Vào Phòng Học Nhóm Live <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Active Recall (Large 2 Cols) - Phương pháp 4 */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('methods');
            }}
            className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#6C4DFF]/25 via-white/5 to-transparent border border-white/15 hover:border-[#6C4DFF] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6C4DFF]/30 text-white border border-[#6C4DFF]/40">
                  PP 4 · Dunlosky 2013
                </span>
                <span className="text-amber-400 text-xs font-bold font-mono">★★★★★ Hiệu quả</span>
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-[#FF4D8D] transition-colors">
                Phương Pháp 4: Active Recall (Truy Xuất Chủ Động)
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Gấp sách lại và tự nhớ. Ép não bộ hoạt động để kéo thông tin ra khỏi tế bào thần kinh, củng cố liên kết trí nhớ bền vững hơn 50% so với đọc lặp lại thụ động.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Hợp với: Định nghĩa, công thức, từ vựng, câu hỏi thi trắc nghiệm &amp; tự luận</span>
              <span className="text-white font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Chi tiết <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 5: Spaced Repetition - Phương pháp 5 */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('methods');
            }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FF4D8D] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                  PP 5 · Spaced Rep.
                </span>
                <span className="text-amber-400 text-xs font-mono">★★★★★</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#FF4D8D] transition-colors">
                Phương Pháp 5: Spaced Repetition
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Ôn vào thời điểm não sắp quên theo chu kỳ 1 - 3 - 7 - 14 - 30 ngày. Đánh bại đường cong quên lãng Ebbinghaus bằng bộ thẻ Leitner.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-400 group-hover:text-pink-300 flex items-center gap-1">
              Xem chu kỳ ôn <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Cornell Notes - Phương pháp 6 */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('tools');
            }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                  PP 6 · Cornell Notes
                </span>
                <span className="text-sky-300 text-xs font-mono">★★★★☆</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                Phương Pháp 6: Cornell Notes
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Chia trang vở thành 3 vùng: Ghi chép (70%), Gợi nhớ (30%) và Tóm tắt. Biến tập vở ghi chép thành tài liệu tự kiểm tra trước kỳ thi.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-400 group-hover:text-sky-300 flex items-center gap-1">
              Mở mẫu ghi chép Cornell <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Supplementary Methods Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-sm shrink-0">
              💡
            </span>
            <div className="text-slate-300">
              <strong className="text-white">Phương pháp bổ trợ mở rộng:</strong> Ngoài 6 phương pháp cốt lõi trên, hệ thống gợi ý thêm cho bạn:{' '}
              <span className="text-slate-200">Kỹ thuật Feynman, Hệ thống SQ3R, Học đan xen Interleaving, Phương pháp Blurting, Ma trận Eisenhower.</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('methods');
            }}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all shrink-0 self-start sm:self-auto flex items-center gap-1"
          >
            <span>Khám phá phương pháp phụ</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* 4. KHO TÀI LIỆU & GIÁO TRÌNH CHUẨN CÁC TRƯỜNG ĐẠI HỌC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#1E1A45] to-[#14112E] border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Kho Học Liệu Đại Học Chuẩn Quốc Gia</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Tra Cứu Giáo Trình &amp; Tài Liệu Các Trường
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Tổng hợp đề cương chi tiết, giáo trình chính thống chuẩn Bộ GD&amp;ĐT, slide bài giảng &amp; bộ đề thi mẫu có lời giải từ ĐH Bách Khoa Hà Nội, ĐHQG-HCM, NEU, FTU, UEH, ĐH Y Dược, ĐH Luật.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('library');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <BookOpen className="w-4 h-4" />
              <span>Vào Thư Viện Tra Cứu Đầy Đủ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Triết Học Mác – Lênin',
                uni: 'Bộ GD&ĐT / Chuẩn Quốc Gia',
                code: 'MLN111 / TRIET01',
                type: 'Giáo trình chuẩn',
                badge: '🏛️ Lý luận chính trị',
                color: 'border-red-500/30 bg-red-500/10 text-red-300',
              },
              {
                title: 'Giải Tích 1 (Tập 1)',
                uni: 'Đại học Bách Khoa Hà Nội (HUST)',
                code: 'MI1111 (GS. Nguyễn Đình Trí)',
                type: 'Giáo trình trường',
                badge: '📐 Toán cao cấp',
                color: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
              },
              {
                title: 'Kinh Tế Vi Mô (Microeconomics)',
                uni: 'ĐH Kinh Tế Quốc Dân (NEU) & FTU',
                code: 'KTQD102 (Gregory Mankiw)',
                type: 'Chuẩn quốc tế',
                badge: '📈 Kinh tế & Quản trị',
                color: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
              },
              {
                title: 'Cấu Trúc Dữ Liệu & Giải Thuật',
                uni: 'ĐH Công Nghệ Thông Tin (UIT - VNU)',
                code: 'IT003 / CS162 (C++)',
                type: 'Slide & Đề cương Lab',
                badge: '💻 CNTT & Lập trình',
                color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
              },
            ].map((mat, mIdx) => (
              <button
                key={mIdx}
                onClick={() => {
                  sound.playClick();
                  setActiveTab('library');
                }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all text-left group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-2">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold border ${mat.color}`}>
                      {mat.badge}
                    </span>
                    <span className="text-slate-400 font-mono">{mat.type}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {mat.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{mat.code}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{mat.uni}</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-300 font-semibold">
                  <span>Xem chi tiết &amp; Tải về</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CÔNG CỤ DÙNG NGAY (INTERACTIVE MINI DASHBOARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1E1A45] to-[#14112E] border border-white/15 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#12B886]">
                Thực Dụng & Trực Quan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Công Cụ Dùng Ngay — Không Cần Cài Đặt
              </h2>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('tools');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-colors flex items-center gap-2 self-start md:self-auto"
            >
              <span>Mở trọn bộ 12 công cụ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Widget A: Pomodoro Live Mini */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#12B886] animate-ping" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Đồng Hồ Pomodoro Mini
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {pomoActive ? 'Đang tập trung (+20 XP)' : 'Sẵn sàng'}
                </span>
              </div>

              <div className="text-center py-4">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                  {String(Math.floor(pomoSeconds / 60)).padStart(2, '0')}:
                  {String(pomoSeconds % 60).padStart(2, '0')}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Tập trung sâu 25 phút · Nghỉ ngơi tích cực 5 phút
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleMiniPomo}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    pomoActive
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-lg shadow-[#6C4DFF]/30'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{pomoActive ? 'Tạm dừng' : 'Bắt đầu ngay'}</span>
                </button>
                <button
                  onClick={resetMiniPomo}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                  title="Đặt lại 25 phút"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Widget B: GPA Quick Forecaster */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Dự Báo Điểm GPA Nhanh
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  GPA: {miniGPA} / 4.0
                </span>
              </div>

              <div className="space-y-3 py-1">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-300 w-28 truncate">Môn 1 (vd: Toán)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{miniCredit1} tín</span>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      step="0.5"
                      value={miniScore1}
                      onChange={e => setMiniScore1(parseFloat(e.target.value))}
                      className="w-24 sm:w-32 accent-[#FF4D8D]"
                    />
                    <span className="font-mono text-white w-8">{miniScore1}đ</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-300 w-28 truncate">Môn 2 (vd: Tiếng Anh)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{miniCredit2} tín</span>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      step="0.5"
                      value={miniScore2}
                      onChange={e => setMiniScore2(parseFloat(e.target.value))}
                      className="w-24 sm:w-32 accent-[#6C4DFF]"
                    />
                    <span className="font-mono text-white w-8">{miniScore2}đ</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                  <span>Xếp loại kỳ thi:</span>
                  <span className="font-bold text-white">
                    {parseFloat(miniGPA) >= 3.6
                      ? 'Xuất Sắc (Học bổng loại A)'
                      : parseFloat(miniGPA) >= 3.2
                      ? 'Giỏi (Học bổng loại B)'
                      : 'Khá'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Công thức Σ(Hệ 4 × Tín) ÷ Σ(Tín)
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('tools');
                  }}
                  className="text-xs font-semibold text-pink-300 hover:text-white flex items-center gap-1"
                >
                  Bảng điểm đầy đủ <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GAME ZONE BANNER PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/15 bg-gradient-to-r from-[#1E1A45] via-[#2A164D] to-[#14112E] shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB703]/20 border border-[#FFB703]/30 text-amber-300 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>7 Mini-Games Ôn Bài Tương Tác</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              GAME ZONE — Vừa Chơi Vừa Nhớ Bài
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mỗi game dưới 3 phút để bạn giải trí lúc nghỉ Pomodoro. Đánh bại &quot;Boss Ông Kẹ Cuối Kỳ&quot;, giải đố Wordle Học Thuật, vượt ải Deadline Survivor và nhận hàng trăm điểm XP mỗi ngày!
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Quiz Rush', 'Memory Match', 'Deadline Survivor', 'Wordle Học Thuật', 'Pomodoro Garden', 'Boss Fight'].map(g => (
                <span key={g} className="px-2.5 py-1 text-xs rounded-lg bg-white/10 text-slate-200 border border-white/10 font-mono">
                  🎮 {g}
                </span>
              ))}
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('games');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFB703] to-[#FF4D8D] text-slate-900 font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span>Vào Game Zone ngay (+50 XP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUIZ CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#FF4D8D]/20 via-[#6C4DFF]/20 to-transparent border border-[#FF4D8D]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-300">
              Đánh Giá Thói Quen Học Tập
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bạn Đang Học Theo Kiểu Nào?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Chỉ 8 câu trắc nghiệm nhanh để khám phá bạn là: Người Lập Kế Hoạch, Chiến Thần Nước Rút, Thợ Highlight hay Chiến Binh Hiểu Sâu!
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setQuizOpen(true);
            }}
            className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm shadow-xl hover:scale-105 transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FF4D8D]" />
            <span>Làm quiz 2 phút</span>
          </button>
        </div>
      </section>

      {/* 7. VIDEO SERIES 60 GIÂY & GÓC CHIA SẺ TỪ SINH VIÊN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2F9BFF]">
            Series 60 Giây Đột Phá
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Góc Chia Sẻ & Video 60 Giây
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Các mẹo học thực chiến, súc tích, mô phỏng video dạng ngắn TikTok/Reels giúp bạn áp dụng ngay sau 1 phút.
          </p>
        </div>

        {/* Video selector tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {videoSeries.map((vid, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                setActiveVideoIndex(idx);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeVideoIndex === idx
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{vid.title}</span>
            </button>
          ))}
        </div>

        {/* Interactive Video Script Player Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#FF4D8D]">
                {videoSeries[activeVideoIndex].method}
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {videoSeries[activeVideoIndex].title}: {videoSeries[activeVideoIndex].tagline}
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {videoSeries[activeVideoIndex].views}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videoSeries[activeVideoIndex].scriptSteps.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5"
              >
                <div className="text-[11px] font-mono font-bold text-[#FFB703]">
                  ⏱️ Khung thời gian {step.time}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-[#6C4DFF]/15 to-[#FF4D8D]/15 border border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Bạn muốn thực hành ngay phương pháp này?</span>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('methods');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Xem bài viết chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
