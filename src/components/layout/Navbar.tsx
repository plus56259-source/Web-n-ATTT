import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import { LEVEL_THRESHOLDS } from '../../data/learningData';
import {
  Compass,
  BookOpen,
  Award,
  Wrench,
  Gamepad2,
  Search,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Flame,
  Home,
  Video,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Headphones,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    setSearchOpen,
    setProfileOpen,
    setAiChatOpen,
    loginWithGoogle,
    isGameFullscreen,
  } = useApp();

  if (isGameFullscreen) return null;

  const [avatarError, setAvatarError] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Reset avatarError if user.photoURL changes
  useEffect(() => {
    setAvatarError(false);
  }, [user.photoURL]);

  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level + 1);
  const xpCurrentLevel = user.xp - currentLevelInfo.minXP;
  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXP - currentLevelInfo.minXP : 1000;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpCurrentLevel / xpNeeded) * 100)));

  // All 10 Navigation Links
  const navLinks: { tab: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'home', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
    { tab: 'survey', label: 'Khảo sát & Nhóm', icon: <BarChart3 className="w-4 h-4" /> },
    { tab: 'studyroom', label: 'Study With Me', icon: <Video className="w-4 h-4" /> },
    { tab: 'library', label: 'Giáo trình & Đề', icon: <GraduationCap className="w-4 h-4" /> },
    { tab: 'forum', label: 'Diễn đàn sinh viên', icon: <MessageSquare className="w-4 h-4" /> },
    { tab: 'discover', label: 'Khám phá trường', icon: <Compass className="w-4 h-4" /> },
    { tab: 'methods', label: 'Phương pháp học', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'skills', label: 'Kỹ năng sinh tồn', icon: <Award className="w-4 h-4" /> },
    { tab: 'tools', label: '12 Công cụ', icon: <Wrench className="w-4 h-4" /> },
    { tab: 'games', label: 'Game Zone', icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  // Update scroll buttons state
  const checkScrollButtons = () => {
    if (!tabsContainerRef.current) return;
    const { scrollLeft: sLeft, scrollWidth: sWidth, clientWidth: cWidth } = tabsContainerRef.current;
    setCanScrollLeft(sLeft > 5);
    setCanScrollRight(sLeft < sWidth - cWidth - 5);
  };

  useEffect(() => {
    checkScrollButtons();
    const el = tabsContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollButtons, { passive: true });
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      el.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  // Center active tab when it changes
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeEl = tabsContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  // Click scroll buttons
  const handleScrollClick = (direction: 'left' | 'right') => {
    sound.playClick();
    if (!tabsContainerRef.current) return;
    const scrollAmount = 260;
    tabsContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      {/* Sticky Header with 2 Tiers: Top Actions + Horizontal Navigation Scrollbar */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-2xl border-b transition-colors duration-300 ${
          theme === 'light'
            ? 'border-slate-200/90 bg-white/95 shadow-sm'
            : 'border-sky-400/20 bg-[#091124]/95 shadow-2xl shadow-sky-950/20'
        }`}
      >
        {/* ========================================================
            TIER 1: TOP BRAND & ESSENTIAL ACTION SUITE (Search, Login, AI, Theme, Music, Profile)
            Guaranteed to never push actions off the screen
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 w-full overflow-x-auto scrollbar-none">
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('home');
              }}
              className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none group shrink-0"
              title="Về Trang Chủ UniLevelUp"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#6C4DFF]/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
                U
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-lg sm:text-xl font-extrabold tracking-tight transition-colors ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    } group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6C4DFF] group-hover:to-[#FF4D8D]`}
                  >
                    UniLevelUp
                  </span>
                  <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-400/30">
                    Sinh Viên
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Right: Actions Suite (Search, AI, Music, Sound, Theme, Google Login, Profile Streak) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            {/* 1. Quick Search Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setSearchOpen(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border transition-all shadow-sm shrink-0 active:scale-95 ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white hover:border-sky-400/40'
              }`}
              title="Tìm kiếm thông minh (Phím tắt: Ctrl + K)"
            >
              <Search className={`w-3.5 h-3.5 shrink-0 ${theme === 'light' ? 'text-indigo-600' : 'text-sky-300'}`} />
              <span className="inline font-bold">Tìm kiếm</span>
              <kbd
                className={`hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded ${
                  theme === 'light' ? 'bg-white text-slate-600 border border-slate-300' : 'bg-black/30 text-slate-300'
                }`}
              >
                Ctrl K
              </kbd>
            </button>

            {/* 2. AI Assistant (Gemini) */}
            <button
              onClick={() => {
                sound.playClick();
                setAiChatOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all shadow-md bg-gradient-to-r from-purple-600/30 via-[#6C4DFF]/35 to-pink-500/30 hover:from-purple-600/45 hover:to-pink-500/45 border-purple-400/50 text-purple-100 hover:text-white hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Hỏi Trợ Lý AI Học Tập UniLevelUp"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Trợ Lý AI</span>
            </button>

            {/* 3. Chill Music Player Button */}
            <button
              onClick={() => {
                sound.playClick();
                window.dispatchEvent(new CustomEvent('open-music-player'));
              }}
              className={`p-2 sm:px-2.5 sm:py-2 rounded-xl transition-all border shrink-0 flex items-center gap-1.5 ${
                theme === 'light'
                  ? 'text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 border-pink-200'
                  : 'text-pink-300 hover:text-white bg-pink-500/15 hover:bg-pink-500/25 border-pink-500/30'
              }`}
              title="Bật/Tắt Nhạc Chill & Học Tập"
            >
              <Headphones className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="hidden xl:inline text-xs font-semibold">Nhạc Chill</span>
            </button>

            {/* 4. Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`hidden md:flex p-2 rounded-xl transition-colors border shrink-0 ${
                theme === 'light'
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
              }`}
              title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {/* 5. Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-colors border shrink-0 ${
                theme === 'light'
                  ? 'text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
              }`}
              title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100 shrink-0" />
              )}
            </button>

            {/* 6. Google / Gmail Login Button */}
            {!user.email ? (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border font-bold text-xs transition-all shadow-sm hover:scale-105 active:scale-95 shrink-0 bg-white hover:bg-slate-50 text-slate-900 border-slate-300 shadow-slate-200 dark:bg-white/15 dark:hover:bg-white/20 dark:border-white/20 dark:text-white cursor-pointer"
                title="Đăng nhập tài khoản Gmail / Google"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-extrabold text-xs">Đăng nhập</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  setProfileOpen(true);
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all shrink-0"
                title={`Đang đăng nhập: ${user.email} (Bấm để xem hồ sơ)`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="truncate max-w-[85px] font-bold">{user.name.split(' ')[0]}</span>
              </button>
            )}

            {/* 7. Streak & XP Profile Widget */}
            <button
              onClick={() => {
                sound.playClick();
                setProfileOpen(true);
              }}
              className={`flex items-center gap-1.5 p-1 sm:pl-2 sm:pr-2.5 sm:py-1 rounded-full border transition-all group shrink-0 ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300'
                  : 'bg-gradient-to-r from-white/10 to-white/15 hover:from-white/15 hover:to-white/20 border-white/15'
              }`}
              title="Hồ sơ cá nhân & Cấp độ"
            >
              <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold text-amber-500 bg-amber-400/20 rounded-full shrink-0">
                <Flame className="w-3.5 h-3.5 fill-amber-500 shrink-0" />
                <span className="font-mono">{user.streak}d</span>
              </div>
              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-semibold truncate max-w-[80px] ${
                      theme === 'light' ? 'text-slate-800' : 'text-white'
                    }`}
                  >
                    {user.email ? user.name.split(' ')[0] : `Lv.${user.level}`}
                  </span>
                  <span className={`text-[11px] font-mono ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {user.xp} XP
                  </span>
                </div>
                <div
                  className={`w-14 h-1 rounded-full overflow-hidden mt-0.5 ${
                    theme === 'light' ? 'bg-slate-200' : 'bg-white/10'
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              {user.photoURL && !avatarError ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-7 h-7 rounded-full object-cover ml-0.5 border border-emerald-400 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-xs text-white font-bold ml-0.5 shadow-sm shrink-0">
                  {currentLevelInfo.icon}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================
            TIER 2: DEDICATED HORIZONTAL DRAGGABLE NAVIGATION BAR
            "Thanh kéo ngang các mục học tập & tính năng"
           ======================================================== */}
        <div
          className={`border-t py-1.5 px-2 sm:px-6 lg:px-8 flex items-center gap-2 ${
            theme === 'light' ? 'border-slate-200/80 bg-slate-100/70' : 'border-sky-400/10 bg-[#070d1e]/80'
          }`}
        >
          {/* Left Scroll Button */}
          <button
            onClick={() => handleScrollClick('left')}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded-lg border transition-all shrink-0 ${
              canScrollLeft
                ? theme === 'light'
                  ? 'bg-white hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm cursor-pointer'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15 cursor-pointer shadow-sm'
                : 'opacity-30 cursor-not-allowed border-transparent text-slate-500'
            }`}
            title="Cuộn sang trái (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Draggable Navigation Strip */}
          <div
            ref={tabsContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 touch-pan-x select-none cursor-grab active:cursor-grabbing ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            style={{
              scrollbarWidth: 'thin',
            }}
          >
            {navLinks.map((link, idx) => {
              const isActive = activeTab === link.tab;
              return (
                <button
                  key={link.tab}
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(link.tab);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0 relative shadow-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6C4DFF] via-purple-600 to-[#FF4D8D] text-white shadow-md shadow-[#6C4DFF]/30 ring-2 ring-purple-400/40 scale-[1.02]'
                      : theme === 'light'
                      ? 'text-slate-700 bg-white/90 hover:bg-white hover:text-indigo-600 border border-slate-200/90'
                      : 'text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span className={isActive ? 'text-white' : theme === 'light' ? 'text-indigo-500' : 'text-sky-300'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 leading-tight shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => handleScrollClick('right')}
            disabled={!canScrollRight}
            className={`p-1.5 rounded-lg border transition-all shrink-0 ${
              canScrollRight
                ? theme === 'light'
                  ? 'bg-white hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm cursor-pointer'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15 cursor-pointer shadow-sm'
                : 'opacity-30 cursor-not-allowed border-transparent text-slate-500'
            }`}
            title="Cuộn sang phải (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Scroll instruction pill */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] font-medium text-sky-400 bg-sky-500/10 border border-sky-400/20 px-2 py-1 rounded-lg shrink-0">
            <SlidersHorizontal className="w-3 h-3 text-sky-400" />
            <span>Kéo ngang 10 mục</span>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Navigation for 1-hand thumb tap */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-2xl px-2 py-1.5 overflow-x-auto touch-pan-x transition-colors duration-300 ${
          theme === 'light'
            ? 'border-slate-200/90 bg-white/95 shadow-lg'
            : 'border-sky-400/20 bg-[#091124]/95 shadow-2xl'
        }`}
      >
        <div className="flex items-center justify-start gap-1 min-w-max">
          {navLinks.map(btn => {
            const isActive = activeTab === btn.tab;
            return (
              <button
                key={btn.tab}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(btn.tab);
                }}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors shrink-0 ${
                  isActive
                    ? 'text-sky-300 font-bold bg-sky-500/15'
                    : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-sky-400/20 text-sky-300' : ''}`}>{btn.icon}</div>
                <span className="text-[9px] font-medium tracking-tight mt-0.5 truncate max-w-[70px]">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
