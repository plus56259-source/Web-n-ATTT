import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_THRESHOLDS } from '../../data/learningData';
import { X, Flame, Shield, Trophy, CheckCircle, Sparkles, Snowflake, CloudCheck, LogOut } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const ProfileModal: React.FC = () => {
  const { profileOpen, setProfileOpen, user, badges, quests, addXP, loginWithGoogle, logout } = useApp();
  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (!profileOpen) return null;

  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level + 1);
  const xpCurrentLevel = user.xp - currentLevelInfo.minXP;
  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXP - currentLevelInfo.minXP : 1000;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpCurrentLevel / xpNeeded) * 100)));

  const handleShare = () => {
    sound.playClick();
    const shareText = `Tôi đang đạt Cấp độ ${user.level} (${currentLevelInfo.title}) với ${user.xp} XP trên UniLevelUp! 🚀 Học đại học thông minh cùng tôi nhé!`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    addXP(10, 'Chia sẻ thành tích học tập');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-[#6C4DFF]/30 via-[#FF4D8D]/20 to-transparent border-b border-white/10">
          <button
            onClick={() => setProfileOpen(false)}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {user.photoURL && !avatarError ? (
              <img
                src={user.photoURL}
                alt={user.name}
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-20 h-20 rounded-2xl object-cover shadow-xl border-2 border-emerald-400"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-3xl shadow-xl shadow-[#6C4DFF]/30 border-2 border-white/20">
                {currentLevelInfo.icon}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {user.name}
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/10 text-pink-300 border border-white/15">
                  Lv.{user.level} · {currentLevelInfo.title}
                </span>
              </div>

              {user.email ? (
                <div className="text-xs text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user.email} (Đã đồng bộ Gmail)</span>
                </div>
              ) : (
                <p className="text-xs text-slate-300">
                  Lên level cùng đại học · Đang dùng tài khoản khách cục bộ
                </p>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Chuỗi {user.streak} ngày liên tiếp</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span>{user.email ? 'Cloud Firestore Đồng Bộ' : 'Lưu trữ cục bộ'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Tiến độ cấp độ hiện tại</span>
              <span className="text-amber-300 font-mono">
                {user.xp} / {nextLevelInfo ? nextLevelInfo.minXP : 'MAX'} XP
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#6C4DFF] via-[#FF4D8D] to-[#FFB703] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right">
              {nextLevelInfo
                ? `Cần thêm ${nextLevelInfo.minXP - user.xp} XP để chạm mốc ${nextLevelInfo.title}`
                : 'Bạn đã đạt cấp độ Huyền Thoại cao nhất!'}
            </div>
          </div>
        </div>

        {/* Content Tabs / Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Google Account Sync Section */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Lưu Trữ Tài Khoản Bằng Gmail (Google Cloud)
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {user.email
                      ? 'Dữ liệu học tập của bạn được lưu an toàn trên đám mây Firestore.'
                      : 'Đăng nhập để tự động lưu GPA, deadline, thẻ flashcard và điểm XP.'}
                  </p>
                </div>
              </div>

              {user.email ? (
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/30 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] hover:opacity-90 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <span>Đăng nhập Gmail</span>
                </button>
              )}
            </div>
          </div>

          {/* Level Ranks Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Hệ Thống 6 Cấp Độ Đại Học</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LEVEL_THRESHOLDS.map(lvl => {
                const isCurrent = lvl.level === user.level;
                const isUnlocked = user.level >= lvl.level;

                return (
                  <div
                    key={lvl.level}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-[#6C4DFF]/20 border-[#6C4DFF] shadow-lg shadow-[#6C4DFF]/20'
                        : isUnlocked
                        ? 'bg-white/5 border-white/10'
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{lvl.icon}</div>
                    <div className="text-xs font-bold text-white">
                      Lv.{lvl.level} {lvl.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {lvl.minXP} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Gallery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4D8D]" />
              <span>Bộ Sưu Tập Huy Hiệu ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    b.unlocked
                      ? 'bg-white/5 border-white/15'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-white/5 shrink-0">
                    {b.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span className="truncate">{b.name}</span>
                      {b.unlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {b.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Quests Progress */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              <span>Thử Thách Tuần (Weekly Quests)</span>
            </h4>
            <div className="space-y-2.5">
              {quests.map(q => {
                const questPct = Math.min(100, Math.round((q.current / q.target) * 100));
                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white">{q.title}</div>
                      <span className="text-[11px] font-mono font-bold text-amber-300">
                        +{q.rewardXP} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{q.condition}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                          style={{ width: `${questPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {q.current}/{q.target}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] hover:opacity-90 rounded-xl transition-all shadow-md shadow-[#6C4DFF]/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{copied ? 'Đã sao chép liên kết!' : 'Chia sẻ thành tích (+10 XP)'}</span>
          </button>
          <button
            onClick={() => setProfileOpen(false)}
            className="py-2.5 px-4 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
