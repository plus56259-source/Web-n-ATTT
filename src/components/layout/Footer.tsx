import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import { Download, Upload, ShieldCheck, Heart, Sparkles, BookMarked } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const Footer: React.FC = () => {
  const { setActiveTab, exportDataJSON, importDataJSON, addXP, theme } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    sound.playClick();
    const data = exportDataJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unilevelup_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addXP(10, 'Sao lưu dữ liệu cá nhân');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          alert('Khôi phục dữ liệu UniLevelUp thành công!');
        } else {
          alert('Tệp dữ liệu không hợp lệ!');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <footer className={`border-t text-sm mt-24 pb-20 lg:pb-12 transition-colors duration-300 ${
      theme === 'light'
        ? 'border-slate-200/80 bg-slate-100/90 text-slate-600'
        : 'border-white/10 bg-[#0E0C22] text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-white font-black text-base shadow-md">
                U
              </div>
              <span className={`text-xl font-bold tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                UniLevelUp
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Nơi sinh viên Việt Nam học cách học: hiểu quy chế đại học, ứng dụng 6 phương pháp cốt lõi hàng đầu cùng các phương pháp bổ trợ, dùng 12 công cụ thông minh và ôn thi qua 7 mini-game hấp dẫn.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Lưu trữ an toàn trên thiết bị của bạn</span>
            </div>
          </div>

          {/* Links 1: Trụ cột học tập */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-200">
              Trụ Cột Học Tập
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('discover'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Đại học khác cấp 3 ở đâu?
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('discover'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Từ điển sinh tồn & 7 hiểu lầm
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('discover'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Lộ trình phát triển 4 năm
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('methods'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Thư viện phương pháp học tập
                </button>
              </li>
            </ul>
          </div>

          {/* Links 2: Công cụ & Game */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-200">
              Không Gian & Công Cụ
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('studyroom'); }}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5 text-pink-300"
                >
                  <span>☕ Study With Me Chill Room</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('forum'); }}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5 text-amber-300"
                >
                  <span>💬 Diễn đàn Sinh viên</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('tools'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Đồng hồ Pomodoro & Vườn cây
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('tools'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Tính GPA & Dự báo điểm thi
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick(); setActiveTab('games'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Game Zone & Boss Cuối Kỳ
                </button>
              </li>
            </ul>
          </div>

          {/* Data Backup & Restore */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-200">
              Quản Trị Dữ Liệu
            </h4>
            <p className="text-xs text-slate-400">
              Sao lưu tiến trình học tập, XP và thẻ nhớ để mang sang máy tính khác:
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất file JSON sao lưu</span>
              </button>
              <a
                href="/unilevelup-source.tar.gz"
                download="unilevelup-source.tar.gz"
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 rounded-lg border border-pink-500/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải toàn bộ Source Code (.tar.gz)</span>
              </a>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nhập file khôi phục</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© 2026 UniLevelUp · Thiết kế vì cộng đồng sinh viên Việt Nam</span>
            <span>·</span>
            <span className="text-slate-400">Học thông minh, sống trọn vẹn</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" /> Dựa trên nghiên cứu nhận thức (Science, Karpicke 2008, Ebbinghaus)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
