import React, { useState, useEffect } from 'react';
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
  User,
  Video,
  MessageSquare,
  GraduationCap,
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
    loginWithGoogle,
  } = useApp();

  const [avatarError, setAvatarError] = useState(false);

  // Reset avatarError if user.photoURL changes
  useEffect(() => {
    setAvatarError(false);
  }, [user.photoURL]);

  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level + 1);
  const xpCurrentLevel = user.xp - currentLevelInfo.minXP;
  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXP - currentLevelInfo.minXP : 1000;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpCurrentLevel / xpNeeded) * 100)));

  const navLinks: { tab: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'home', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
    { tab: 'studyroom', label: 'Study With Me', icon: <Video className="w-4 h-4" />, badge: 'Chill' },
    { tab: 'library', label: 'Giáo trình', icon: <GraduationCap className="w-4 h-4" />, badge: 'Mới' },
    { tab: 'forum', label: 'Diễn đàn', icon: <MessageSquare className="w-4 h-4" /> },
    { tab: 'discover', label: 'Khám phá', icon: <Compass className="w-4 h-4" /> },
    { tab: 'methods', label: 'Phương pháp', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'skills', label: 'Kỹ năng', icon: <Award className="w-4 h-4" /> },
    { tab: 'tools', label: '12 Công cụ', icon: <Wrench className="w-4 h-4" /> },
    { tab: 'games', label: 'Game Zone', icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop Sticky Header */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 ${
        theme === 'light'
          ? 'border-slate-200/80 bg-white/85 shadow-sm'
          : 'border-white/10 bg-[#14112E]/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('home');
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#6C4DFF]/30 group-hover:scale-105 transition-transform duration-200">
                U
              </div>
              <div>
                <span className={`text-xl font-extrabold tracking-tight transition-colors ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                } group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6C4DFF] group-hover:to-[#FF4D8D]`}>
                  UniLevelUp
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = activeTab === link.tab;
              return (
                <button
                  key={link.tab}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(link.tab);
                  }}
                  className={`px-3 py-1.5 text-sm font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap rounded-lg relative ${
                    isActive
                      ? theme === 'light'
                        ? 'text-indigo-600 bg-indigo-50 shadow-sm border border-indigo-200 font-bold'
                        : 'text-white bg-white/10 shadow-sm border border-white/15'
                      : theme === 'light'
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? (theme === 'light' ? 'text-indigo-600' : 'text-[#FF4D8D]') : (theme === 'light' ? 'text-slate-500' : 'text-slate-400')}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-black leading-tight shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setSearchOpen(true);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-600 hover:text-slate-900'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Tìm kiếm nhanh (Ctrl+K)"
            >
              <Search className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Tìm kiếm</span>
              <kbd className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded ${
                theme === 'light' ? 'bg-white text-slate-600 border border-slate-200' : 'bg-white/10 text-slate-400'
              }`}>
                Ctrl K
              </kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors border ${
                theme === 'light'
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10'
              }`}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#12B886]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors border ${
                theme === 'light'
                  ? 'text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border-indigo-200'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10'
              }`}
              title={theme === 'dark' ? 'Chuyển sang giao diện Sáng (Light Mode)' : 'Chuyển sang giao diện Tối (Dark Mode)'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFB703]" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100" />
              )}
            </button>

            {/* Google Login or Account Pill */}
            {!user.email ? (
              <button
                onClick={loginWithGoogle}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    : 'bg-gradient-to-r from-white/10 to-white/15 hover:from-white/15 hover:to-white/20 border-white/15 text-white'
                }`}
                title="Đăng nhập tài khoản Gmail để lưu trữ đám mây"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span className="hidden sm:inline">Đăng nhập Gmail</span>
                <span className="sm:hidden">Gmail</span>
              </button>
            ) : null}

            {/* Streak & XP Profile Widget */}
            <button
              onClick={() => {
                sound.playClick();
                setProfileOpen(true);
              }}
              className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border transition-all group ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200'
                  : 'bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border-white/10'
              }`}
            >
              <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold text-amber-500 bg-amber-400/20 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span className="font-mono">{user.streak}d</span>
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold truncate max-w-[100px] ${
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  }`}>
                    {user.email ? user.name.split(' ')[0] : `Lv.${user.level}`}
                  </span>
                  <span className={`text-[11px] font-mono ${
                    theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {user.xp} XP
                  </span>
                </div>
                <div className={`w-16 h-1 rounded-full overflow-hidden mt-0.5 ${
                  theme === 'light' ? 'bg-slate-200' : 'bg-white/10'
                }`}>
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
                  className="w-7 h-7 rounded-full object-cover ml-0.5 border border-emerald-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-xs text-white font-bold ml-0.5 shadow-sm">
                  {currentLevelInfo.icon}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Navigation */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 overflow-x-auto scrollbar-none transition-colors duration-300 ${
        theme === 'light'
          ? 'border-slate-200/90 bg-white/95 shadow-lg'
          : 'border-white/10 bg-[#14112E]/95'
      }`}>
        <div className="flex items-center justify-around gap-1 min-w-full">
          {[
            { tab: 'home' as TabType, label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
            { tab: 'studyroom' as TabType, label: 'Study Room', icon: <Video className="w-4 h-4" /> },
            { tab: 'library' as TabType, label: 'Giáo trình', icon: <GraduationCap className="w-4 h-4" /> },
            { tab: 'forum' as TabType, label: 'Diễn đàn', icon: <MessageSquare className="w-4 h-4" /> },
            { tab: 'methods' as TabType, label: 'Phương pháp', icon: <BookOpen className="w-4 h-4" /> },
            { tab: 'tools' as TabType, label: 'Công cụ', icon: <Wrench className="w-4 h-4" /> },
            { tab: 'games' as TabType, label: 'Game Zone', icon: <Gamepad2 className="w-4 h-4" /> },
          ].map(btn => {
            const isActive = activeTab === btn.tab;
            return (
              <button
                key={btn.tab}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(btn.tab);
                }}
                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-colors shrink-0 ${
                  isActive
                    ? 'text-[#FF4D8D] font-bold'
                    : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#FF4D8D]/15' : ''}`}>
                  {btn.icon}
                </div>
                <span className="text-[9px] font-medium tracking-tight mt-0.5 truncate max-w-[65px]">
                  {btn.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
