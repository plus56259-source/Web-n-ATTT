import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HABIT_QUIZ_QUESTIONS, HABIT_PROFILES } from '../../data/learningData';
import { HabitProfile } from '../../types';
import { X, CheckCircle, ArrowRight, RotateCcw, Share2, Sparkles, Award } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const HabitQuizModal: React.FC = () => {
  const { quizOpen, setQuizOpen, setActiveTab, addXP } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [resultProfile, setResultProfile] = useState<HabitProfile | null>(null);
  const [copied, setCopied] = useState(false);

  if (!quizOpen) return null;

  const totalQuestions = HABIT_QUIZ_QUESTIONS.length;
  const currentQ = HABIT_QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (profileKey: string) => {
    sound.playClick();
    const updatedAnswers = { ...answers, [currentStep]: profileKey };
    setAnswers(updatedAnswers);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate dominant profile
      const counts: Record<string, number> = {};
      Object.values(updatedAnswers).forEach(p => {
        counts[p] = (counts[p] || 0) + 1;
      });

      let topKey = 'planner';
      let maxCount = -1;
      Object.entries(counts).forEach(([k, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topKey = k;
        }
      });

      const profile = HABIT_PROFILES[topKey] || HABIT_PROFILES.planner;
      setResultProfile(profile);
      addXP(30, 'Hoàn thành Quiz đánh giá thói quen học tập');
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCurrentStep(0);
    setAnswers({});
    setResultProfile(null);
  };

  const handleShare = () => {
    if (!resultProfile) return;
    sound.playClick();
    const shareText = `Thói quen học tập đại học của tôi là: ${resultProfile.title}! Kiểm tra ngay phương pháp học tối ưu tại UniLevelUp.vn 🎓`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    addXP(10, 'Chia sẻ kết quả Quiz thói quen');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1E1A45] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FF4D8D]/20 text-[#FF4D8D]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Quiz 2 Phút: Bạn Đang Học Theo Kiểu Nào?
              </h3>
              <p className="text-xs text-slate-400">
                Dựa trên thói quen thực tế, không dán nhãn cố định · Gợi ý phương pháp khoa học
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuizOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!resultProfile ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Câu hỏi {currentStep + 1} / {totalQuestions}</span>
                  <span>{Math.round(((currentStep + 1) / totalQuestions) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Statement */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid gap-3">
                {currentQ.options.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.profile)}
                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#6C4DFF]/60 transition-all flex items-start gap-3.5 group active:scale-[0.99]"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-[#6C4DFF] text-white flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                      {opt.key}
                    </span>
                    <span className="text-sm text-slate-200 group-hover:text-white leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] text-white shadow-lg shadow-[#6C4DFF]/30">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF4D8D]">
                  Kết quả phân tích thói quen
                </div>
                <h3 className="text-2xl font-black text-white">
                  {resultProfile.title}
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {resultProfile.subtitle}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-sm">
                <p className="text-slate-300 leading-relaxed">
                  {resultProfile.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Điểm mạnh nổi bật
                    </div>
                    <p className="text-xs text-slate-300">{resultProfile.strength}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="text-xs font-bold text-amber-400 mb-1">
                      ⚠️ Cạm bẫy thường gặp
                    </div>
                    <p className="text-xs text-slate-300">{resultProfile.trap}</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lộ trình cải tiến dành riêng cho bạn
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-slate-400 mb-1">Phương pháp nên thử</div>
                    <div className="text-xs font-bold text-white">
                      {resultProfile.recommendedMethods[0]}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-slate-400 mb-1">Công cụ phù hợp</div>
                    <div className="text-xs font-bold text-sky-400">
                      {resultProfile.recommendedTool}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[11px] text-slate-400 mb-1">Game luyện tập</div>
                    <div className="text-xs font-bold text-[#FFB703]">
                      {resultProfile.recommendedGame}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setQuizOpen(false);
                    setActiveTab('methods');
                  }}
                  className="flex-1 py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] hover:opacity-90 rounded-xl transition-all shadow-md shadow-[#6C4DFF]/30 flex items-center justify-center gap-2"
                >
                  <span>Khám phá phương pháp gợi ý</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="py-3 px-4 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Đã sao chép!' : 'Chia sẻ (+10 XP)'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-4 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  title="Làm lại bài kiểm tra"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
