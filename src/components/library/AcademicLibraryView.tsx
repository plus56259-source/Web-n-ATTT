import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ACADEMIC_MATERIALS,
  UNIVERSITIES_LIST,
  MATERIAL_CATEGORIES,
} from '../../data/academicLibraryData';
import { AcademicMaterial } from '../../types';
import {
  BookOpen,
  Search,
  Download,
  Bookmark,
  BookmarkCheck,
  Star,
  FileText,
  School,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Filter,
  Eye,
  Share2,
  Clock,
  Layers,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const AcademicLibraryView: React.FC = () => {
  const { setActiveTab, addXP } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeMaterialModal, setActiveMaterialModal] = useState<AcademicMaterial | null>(null);
  const [savedMaterialIds, setSavedMaterialIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unilevelup_saved_materials');
      return saved ? JSON.parse(saved) : ['mat-triet-hoc-mac-lenin', 'mat-giai-tich-1-hust'];
    } catch {
      return ['mat-triet-hoc-mac-lenin', 'mat-giai-tich-1-hust'];
    }
  });
  const [viewSavedOnly, setViewSavedOnly] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('unilevelup_saved_materials', JSON.stringify(savedMaterialIds));
    } catch {}
  }, [savedMaterialIds]);

  const toggleSaveMaterial = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    if (savedMaterialIds.includes(id)) {
      setSavedMaterialIds(prev => prev.filter(item => item !== id));
    } else {
      setSavedMaterialIds(prev => [...prev, id]);
      addXP(10, 'Lưu tài liệu giáo trình vào tủ sách cá nhân');
    }
  };

  const handleDownload = (material: AcademicMaterial, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playSuccess();
    addXP(15, `Tải tài liệu: ${material.title}`);
    setDownloadSuccessToast(`Đã bắt đầu tải "${material.title}" (${material.fileSize || 'PDF'})`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  const filteredMaterials = ACADEMIC_MATERIALS.filter(item => {
    if (viewSavedOnly && !savedMaterialIds.includes(item.id)) return false;
    if (selectedUniversity !== 'all') {
      const uniObj = UNIVERSITIES_LIST.find(u => u.id === selectedUniversity);
      if (uniObj && !item.university.toLowerCase().includes(uniObj.short.toLowerCase())) {
        return false;
      }
    }
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.subjectCode.toLowerCase().includes(q);
      const matchUni = item.university.toLowerCase().includes(q);
      const matchAuthor = item.author.toLowerCase().includes(q);
      const matchTopics = item.keyTopics.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCode && !matchUni && !matchAuthor && !matchTopics) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Download Alert Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/90 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300 border border-emerald-400">
          <CheckCircle className="w-5 h-5 text-emerald-200 shrink-0" />
          <div className="text-xs font-semibold">{downloadSuccessToast}</div>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Kho Học Liệu Đại Học Chuẩn Quốc Gia</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Tra Cứu Giáo Trình &amp; Tài Liệu Các Trường
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tổng hợp đề cương chi tiết, giáo trình chính thống chuẩn Bộ GD&amp;ĐT và slide bài giảng thực tế từ{' '}
          <strong className="text-white">ĐHBK Hà Nội, ĐHQG-HCM, NEU, FTU, UEH, ĐH Y Dược, ĐH Luật</strong>.
        </p>

        {/* Quick Stats Pill */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-1">
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <School className="w-3.5 h-3.5 text-amber-400" />
            <span>12 Trường Đại học hàng đầu</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Giáo trình &amp; Slide chuẩn bản quyền</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Mẹo làm đề thi phân loại điểm A</span>
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-6 rounded-3xl bg-[#1E1A45] border border-white/15 shadow-xl space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên môn, mã học phần (vd: Triết học, Giải tích, MI1111, NEU, Y Dược, Luật)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Filter Row 1: Universities */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-amber-400" />
            <span>Trường Đại Học Ban Hành:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {UNIVERSITIES_LIST.map(uni => (
              <button
                key={uni.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedUniversity(uni.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedUniversity === uni.id
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {uni.short}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row 2: Categories */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>Khối Ngành / Lĩnh Vực:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {MATERIAL_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.key);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.key
                    ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold shadow-md'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row 3: Document Type & Bookmarked Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Dạng tài liệu:</span>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'textbook', label: 'Giáo trình chuẩn' },
              { key: 'syllabus', label: 'Đề cương chi tiết' },
              { key: 'slides', label: 'Slide bài giảng' },
              { key: 'exam_prep', label: 'Đề thi & Lời giải' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => {
                  sound.playClick();
                  setSelectedType(t.key);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedType === t.key
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setViewSavedOnly(!viewSavedOnly);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs ${
              viewSavedOnly
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-amber-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Tủ sách đã lưu ({savedMaterialIds.length})</span>
          </button>
        </div>
      </div>

      {/* Material Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Hiển thị <strong className="text-white">{filteredMaterials.length}</strong> đầu sách &amp; tài liệu giáo trình
          </span>
          {viewSavedOnly && (
            <span className="text-amber-300 font-semibold">Đang xem tủ sách đã lưu của bạn</span>
          )}
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#1E1A45] border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white">Không tìm thấy tài liệu phù hợp</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Thử tìm kiếm với từ khóa khác như &quot;Triết học&quot;, &quot;Giải tích&quot;, &quot;NEU&quot;, &quot;Bách Khoa&quot; hoặc xóa bớt bộ lọc.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUniversity('all');
                setSelectedCategory('all');
                setSelectedType('all');
                setViewSavedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all"
            >
              Đặt lại toàn bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(mat => {
              const isSaved = savedMaterialIds.includes(mat.id);
              return (
                <div
                  key={mat.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveMaterialModal(mat);
                  }}
                  className="p-6 rounded-3xl bg-[#1E1A45] border border-white/10 hover:border-cyan-400/50 transition-all shadow-xl flex flex-col justify-between space-y-4 group cursor-pointer relative overflow-hidden"
                >
                  <div>
                    {/* Top badging */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[11px] font-bold">
                          {mat.universityShort}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 font-mono text-[10px]">
                          {mat.subjectCode} · {mat.credits} TC
                        </span>
                      </div>

                      <button
                        onClick={e => toggleSaveMaterial(mat.id, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? 'text-amber-400 bg-amber-400/20'
                            : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                        }`}
                        title={isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                      {mat.title}
                    </h3>

                    {/* Author & Uni */}
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                      <span>✍️ {mat.author.split(',')[0]}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mt-2.5 line-clamp-2">
                      {mat.description}
                    </p>

                    {/* Key Topics preview */}
                    <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                      <div className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Trọng tâm đề thi:
                      </div>
                      <div className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed italic">
                        {mat.tipsForExam}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" /> {mat.rating}
                      </span>
                      <span>·</span>
                      <span>{mat.downloadsCount.toLocaleString()} lượt tải</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={e => handleDownload(mat, e)}
                        className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-all font-bold flex items-center gap-1 text-[11px]"
                        title="Tải tài liệu PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải</span>
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setActiveMaterialModal(mat);
                        }}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-1 text-[11px]"
                      >
                        <span>Chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Material Detailed Modal */}
      {activeMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/20 via-[#6C4DFF]/15 to-transparent flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs">
                    {activeMaterialModal.universityShort}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 font-mono text-xs">
                    Mã học phần: {activeMaterialModal.subjectCode} ({activeMaterialModal.credits} Tín chỉ)
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-pink-500/20 text-pink-300 text-xs font-semibold">
                    {activeMaterialModal.typeLabel}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                  {activeMaterialModal.title}
                </h3>
                <div className="text-xs text-slate-300">
                  🏛️ {activeMaterialModal.university} · ✍️ {activeMaterialModal.author}
                </div>
              </div>

              <button
                onClick={() => setActiveMaterialModal(null)}
                className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Material Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Nhà xuất bản</div>
                  <div className="font-bold text-white mt-0.5 truncate">{activeMaterialModal.publisher || 'NXB Giáo Dục'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Năm ban hành</div>
                  <div className="font-bold text-white mt-0.5">{activeMaterialModal.year || '2023'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Độ dài / Dung lượng</div>
                  <div className="font-bold text-white mt-0.5">{activeMaterialModal.pages} trang ({activeMaterialModal.fileSize})</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Đánh giá sinh viên</div>
                  <div className="font-bold text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300" /> {activeMaterialModal.rating}/5.0
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="font-bold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
                  Giới thiệu &amp; Mục tiêu học phần:
                </div>
                <p className="leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 text-slate-200">
                  {activeMaterialModal.description}
                </p>
              </div>

              {/* Syllabus / Key Topics */}
              <div className="space-y-2.5">
                <div className="font-bold uppercase tracking-wider text-cyan-300 font-mono text-[11px] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Đề Cương Chi Tiết &amp; Các Chương Cốt Lõi:</span>
                </div>
                <div className="space-y-2">
                  {activeMaterialModal.keyTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px] border border-cyan-500/30">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200 leading-relaxed font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Strategy & Tips */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4" /> Mẹo Thi Cử &amp; Bẫy Điểm Liệt Từ Thủ Khoa:
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {activeMaterialModal.tipsForExam}
                </p>
              </div>

              {/* Study Method Link */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#6C4DFF]/20 to-[#FF4D8D]/20 border border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white">Bạn muốn học ngay môn này?</div>
                  <div className="text-slate-300 text-[11px]">
                    Ứng dụng phương pháp Active Recall, sơ đồ Mindmap hoặc làm thẻ Flashcard Leitner cho học phần này.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveMaterialModal(null);
                      setActiveTab('methods');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                  >
                    Xem phương pháp
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveMaterialModal(null);
                      setActiveTab('tools');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white font-bold transition-all shadow-md"
                  >
                    Mở công cụ học
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
              <button
                onClick={() => toggleSaveMaterial(activeMaterialModal.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  savedMaterialIds.includes(activeMaterialModal.id)
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-white/10 text-slate-200 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {savedMaterialIds.includes(activeMaterialModal.id)
                    ? 'Đã lưu trong tủ sách'
                    : 'Lưu vào tủ sách'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMaterialModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl bg-white/5 hover:bg-white/10"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleDownload(activeMaterialModal)}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Bản PDF Đầy Đủ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
