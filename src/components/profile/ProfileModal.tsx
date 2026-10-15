import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LEVEL_THRESHOLDS } from '../../data/learningData';
import {
  X,
  Flame,
  Shield,
  Trophy,
  CheckCircle,
  Sparkles,
  Snowflake,
  LogOut,
  Edit3,
  Camera,
  Upload,
  Check,
  User,
  Image,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

const PRESET_AVATARS = [
  {
    id: 'hcmute-eng',
    label: 'Kỹ Sư HCMUTE',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'cyber-dev',
    label: 'Lập Trình Viên',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'chill-student',
    label: 'Nữ Sinh Chill',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'valedictorian',
    label: 'Thủ Khoa',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'creative',
    label: 'Sáng Tạo Art',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'lofi-cat',
    label: 'Mèo Học Lofi',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'researcher',
    label: 'Nghiên Cứu',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'cyber-pro',
    label: 'Cyber Scholar',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  },
];

export const ProfileModal: React.FC = () => {
  const {
    profileOpen,
    setProfileOpen,
    user,
    badges,
    quests,
    addXP,
    loginWithGoogle,
    logout,
    updateUserProfile,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhotoURL, setEditPhotoURL] = useState(user.photoURL || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!profileOpen) return null;

  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === user.level + 1);
  const xpCurrentLevel = user.xp - currentLevelInfo.minXP;
  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXP - currentLevelInfo.minXP : 1000;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpCurrentLevel / xpNeeded) * 100)));

  const handleShare = () => {
    sound.playClick();
    const shareText = `Tôi đang đạt Cấp độ ${user.level} (${currentLevelInfo.title}) với ${user.xp} XP trên UniLevelUp! Học đại học thông minh cùng tôi nhé!`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    addXP(10, 'Chia sẻ thành tích học tập');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Kích thước ảnh quá lớn', 'Vui lòng chọn ảnh có dung lượng dưới 2MB.', 'info');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setEditPhotoURL(dataUrl);
        setAvatarError(false);
        sound.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    sound.playSuccess();
    try {
      await updateUserProfile({
        name: editName.trim(),
        photoURL: editPhotoURL,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#13192B] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-[#6C4DFF]/30 via-cyan-500/15 to-transparent border-b border-white/10">
          <button
            onClick={() => setProfileOpen(false)}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar Display */}
            <div className="relative group">
              {user.photoURL && !avatarError ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl border-2 border-cyan-400"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6C4DFF] to-cyan-500 flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/20 border-2 border-white/20">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsEditing(prev => !prev);
                  setEditName(user.name);
                  setEditPhotoURL(user.photoURL || '');
                }}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-cyan-400 text-slate-950 shadow-md hover:scale-105 transition-all"
                title="Thay đổi tên & Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {user.name}
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Lv.{user.level} · {currentLevelInfo.title}
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEditing(prev => !prev);
                    setEditName(user.name);
                    setEditPhotoURL(user.photoURL || '');
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3 h-3 text-cyan-400" />
                  <span>{isEditing ? 'Đóng sửa' : 'Đổi tên & avatar'}</span>
                </button>
              </div>

              {user.email ? (
                <div className="text-xs text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user.email} (Đã đồng bộ Google)</span>
                </div>
              ) : (
                <p className="text-xs text-slate-300">
                  UniLevelUp · Đang dùng tài khoản khách cục bộ
                </p>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Chuỗi {user.streak} ngày</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400">
                  <Shield className="w-4 h-4" />
                  <span>{user.email ? 'Đồng bộ đám mây Firestore' : 'Lưu trữ cục bộ'}</span>
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
                className="h-full bg-gradient-to-r from-[#6C4DFF] via-cyan-400 to-amber-400 rounded-full transition-all duration-500"
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
          {/* EDIT PROFILE PANEL */}
          {isEditing && (
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh Sửa Tên &amp; Avatar Cá Nhân</span>
                </h4>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Đóng
                </button>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">Tên hiển thị của bạn:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Nhập họ và tên hoặc biệt danh sinh viên..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <div className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                  <span>Chọn Avatar có sẵn hoặc tải ảnh mới:</span>
                  <span className="text-[11px] text-cyan-300">8 Avatar sinh viên</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_AVATARS.map(avatar => {
                    const isSelected = editPhotoURL === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setEditPhotoURL(avatar.url);
                          setAvatarError(false);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                          isSelected
                            ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-400/30'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                        title={avatar.label}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.label}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-cyan-500/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Upload or Custom URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tải ảnh từ máy tính / điện thoại</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={e => setCustomUrlInput(e.target.value)}
                      placeholder="Dán link ảnh online..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          sound.playClick();
                          setEditPhotoURL(customUrlInput.trim());
                          setCustomUrlInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-300"
                    >
                      Dùng
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white bg-white/5"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-[#6C4DFF] text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Đã lưu thành công!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-slate-950" />
                      <span>Lưu Hồ Sơ Mới</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

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
                    Lưu Trữ Bằng Tài Khoản Google Cloud
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {user.email
                      ? 'Dữ liệu học tập của bạn được bảo lưu an toàn trên cơ sở dữ liệu Firestore.'
                      : 'Đăng nhập Google để đồng bộ tiến độ học, deadline và điểm XP trên mọi thiết bị.'}
                  </p>
                </div>
              </div>

              {user.email ? (
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-100 text-slate-900 shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Đăng nhập Gmail</span>
                </button>
              )}
            </div>
          </div>

          {/* Badges Gallery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bộ Sưu Tập Huy Hiệu ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                    b.unlocked
                      ? 'bg-white/5 border-white/15'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-white/5 shrink-0">
                    <Trophy className="w-6 h-6 text-amber-400" />
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
              <span>Nhiệm Vụ Tuần (Weekly Quests)</span>
            </h4>
            <div className="space-y-2.5">
              {quests.map(q => {
                const questPct = Math.min(100, Math.round((q.current / q.target) * 100));
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2"
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
                          className="h-full bg-gradient-to-r from-cyan-400 to-[#6C4DFF] rounded-full"
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
            className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-[#FF4D8D] hover:opacity-90 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
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
