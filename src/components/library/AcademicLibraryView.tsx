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
  ArrowRight,
  Filter,
  GraduationCap,
  ExternalLink,
  Landmark,
  Calculator,
  Code,
  TrendingUp,
  Scale,
  Stethoscope,
  Layers,
  HelpCircle,
  Check,
  ListOrdered,
  FileCheck2,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { downloadAcademicPDF } from '../../utils/pdfDownloader';
import cardLibraryImg from '../../assets/images/card_bg_library_1791709563048.jpg';

export const AcademicLibraryView: React.FC = () => {
  const { setActiveTab, addXP } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeMaterialModal, setActiveMaterialModal] = useState<AcademicMaterial | null>(null);
  const [modalTab, setModalTab] = useState<'syllabus' | 'toc' | 'exam'>('syllabus');
  const [savedMaterialIds, setSavedMaterialIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unilevelup_saved_materials');
      return saved ? JSON.parse(saved) : ['mat-vi-xuly-arm-hcmute', 'mat-giai-tich-1-hust'];
    } catch {
      return ['mat-vi-xuly-arm-hcmute', 'mat-giai-tich-1-hust'];
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
    const success = downloadAcademicPDF(material);
    addXP(20, `Tải tài liệu PDF: ${material.title}`);
    if (success) {
      setDownloadSuccessToast(`Đã xuất và tải thành công PDF: "${material.title}"`);
    } else {
      setDownloadSuccessToast(`Đã tải tài liệu: "${material.title}"`);
    }
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4500);
  };

  const handleOpenSource = (material: AcademicMaterial, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const url = material.viewOnlineUrl || material.downloadUrl;
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
      addXP(10, `Tra cứu thư viện gốc: ${material.title}`);
    }
  };

  const renderCategoryIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'Landmark':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'Calculator':
        return <Calculator className="w-3.5 h-3.5" />;
      case 'Code':
        return <Code className="w-3.5 h-3.5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'Scale':
        return <Scale className="w-3.5 h-3.5" />;
      case 'Stethoscope':
        return <Stethoscope className="w-3.5 h-3.5" />;
      case 'BookOpen':
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
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
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600/95 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300 border border-emerald-400">
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
          <strong className="text-cyan-300">ĐH Sư Phạm Kỹ Thuật TP.HCM (HCMUTE)</strong>,{' '}
          <strong className="text-white">ĐHBK Hà Nội, ĐHQG-HCM, NEU, FTU, UEH, ĐH Y Dược, ĐH Luật</strong>.
        </p>

        {/* Quick Stats Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300 pt-1">
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <School className="w-3.5 h-3.5 text-amber-400" />
            <span>HCMUTE &amp; 12 Trường Đại Học Hàng Đầu</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Giáo trình &amp; Tải PDF Trực Tiếp</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Đề thi &amp; Mẹo Điểm A+ Thực Chiến</span>
          </span>
        </div>
      </div>

      {/* Search & Multi-Filters Box */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên môn (Vi xử lý, Sức bền vật liệu, Giải tích...), mã học phần (MP302, MI1111...), tên trường hoặc giảng viên..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Filter Row 1: University Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-200">
              <School className="w-3.5 h-3.5 text-cyan-400" /> Chọn trường đại học đào tạo:
            </span>
            <span className="text-[11px] text-slate-400">
              {filteredMaterials.length} tài liệu phù hợp
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {UNIVERSITIES_LIST.map(uni => (
              <button
                key={uni.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedUniversity(uni.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedUniversity === uni.id
                    ? 'bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-400/20'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {uni.short}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row 2: Category Filter */}
        <div className="space-y-2">
          <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-pink-400" /> Khối ngành chuyên môn:
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
                {renderCategoryIcon(cat.iconKey)}
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

      {/* Materials Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Danh Sách Giáo Trình &amp; Đề Cương ({filteredMaterials.length})</span>
          </h2>
          {selectedUniversity !== 'all' && (
            <span className="text-xs text-cyan-300 font-mono">
              Trường:{' '}
              {UNIVERSITIES_LIST.find(u => u.id === selectedUniversity)?.name}
            </span>
          )}
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-slate-500 stroke-1" />
            <h3 className="text-base font-bold text-white">Không tìm thấy giáo trình phù hợp</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc trường đại học để xem toàn bộ danh mục tài liệu.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUniversity('all');
                setSelectedCategory('all');
                setSelectedType('all');
                setViewSavedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-bold transition-all"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(item => {
              const isSaved = savedMaterialIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveMaterialModal(item);
                    setModalTab('syllabus');
                  }}
                  className="group relative rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
                >
                  {/* Top Bar Accent */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-[11px] border border-cyan-500/30">
                          {item.universityShort}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 font-mono text-[10px]">
                          {item.subjectCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-pink-500/10 text-pink-300 font-mono text-[10px]">
                          {item.credits} Tín chỉ
                        </span>
                      </div>

                      <button
                        onClick={e => toggleSaveMaterial(item.id, e)}
                        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          isSaved
                            ? 'text-amber-400 bg-amber-400/20'
                            : 'text-slate-400 hover:text-white bg-white/5'
                        }`}
                        title={isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Author & University detail */}
                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{item.university}</span>
                    </div>

                    {/* Key Topics Tag preview */}
                    <div className="space-y-1 pt-1 border-t border-white/5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Trọng tâm thi cử:
                      </div>
                      <div className="text-xs text-slate-300 line-clamp-2 pl-3 border-l-2 border-cyan-400/40">
                        {item.keyTopics[0]}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-amber-300 font-bold">
                        <Star className="w-3 h-3 fill-amber-300" /> {item.rating}
                      </span>
                      <span>·</span>
                      <span>{item.fileSize || 'PDF'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={e => handleDownload(item, e)}
                        className="p-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-all shadow-md"
                        title="Tải File PDF Thật"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setActiveMaterialModal(item);
                          setModalTab('syllabus');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center gap-1 text-xs"
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
          <div className="w-full max-w-3xl bg-[#13192B] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/20 via-[#6C4DFF]/15 to-transparent flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-400 text-slate-950 font-black text-xs">
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
                <div className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-cyan-400" />
                    {activeMaterialModal.university}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    {activeMaterialModal.author}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveMaterialModal(null)}
                className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 text-xs font-bold bg-white/5">
              <button
                onClick={() => setModalTab('syllabus')}
                className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'syllabus'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Đề Cương &amp; Trọng Tâm</span>
              </button>
              <button
                onClick={() => setModalTab('toc')}
                className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'toc'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Mục Lục Các Chương</span>
              </button>
              <button
                onClick={() => setModalTab('exam')}
                className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  modalTab === 'exam'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mẹo Thi Cử &amp; Đề Thi Mẫu A+</span>
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

              {/* Tab 1: Syllabus & Description */}
              {modalTab === 'syllabus' && (
                <div className="space-y-5">
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="font-bold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
                      Giới thiệu &amp; Mục tiêu học phần:
                    </div>
                    <p className="leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 text-slate-200">
                      {activeMaterialModal.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold uppercase tracking-wider text-cyan-400 font-mono text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Các chuyên đề &amp; Chương trọng tâm:
                    </div>
                    <div className="space-y-2">
                      {activeMaterialModal.keyTopics.map((topic, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3 text-xs"
                        >
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                            {idx + 1}
                          </span>
                          <span className="text-slate-200 leading-relaxed font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Table of Contents */}
              {modalTab === 'toc' && (
                <div className="space-y-3">
                  <div className="font-bold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
                    Mục lục toàn văn giáo trình:
                  </div>
                  <div className="space-y-2">
                    {(activeMaterialModal.tableOfContents && activeMaterialModal.tableOfContents.length > 0
                      ? activeMaterialModal.tableOfContents
                      : activeMaterialModal.keyTopics
                    ).map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-cyan-400 font-mono font-bold">#{idx + 1}</span>
                          <span className="text-slate-200 font-medium">{ch}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">Đã biên mục</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Exam Tips & Sample Questions */}
              {modalTab === 'exam' && (
                <div className="space-y-5">
                  {/* Exam Strategy & Tips */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                      <Sparkles className="w-4 h-4" /> Mẹo Thi Cử &amp; Bẫy Điểm Liệt Từ Thủ Khoa:
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {activeMaterialModal.tipsForExam}
                    </p>
                  </div>

                  {/* Sample Questions if any */}
                  {activeMaterialModal.sampleExamQuestions && activeMaterialModal.sampleExamQuestions.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="font-bold uppercase tracking-wider text-cyan-400 font-mono text-[11px] flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5" /> Đề thi tự luận &amp; Vấn đáp tham khảo:
                      </div>
                      <div className="space-y-2">
                        {activeMaterialModal.sampleExamQuestions.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed"
                          >
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Official Source Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5" />
                    <span>Nguồn lưu trữ chính thức:</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    {activeMaterialModal.officialSource || activeMaterialModal.university}
                  </div>
                </div>
                <button
                  onClick={e => handleOpenSource(activeMaterialModal, e)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold transition-all border border-cyan-500/30 flex items-center gap-1.5 self-start sm:self-auto text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở liên kết gốc thư viện</span>
                </button>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-3">
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
                  <span>Tải File PDF Thật Về Máy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
