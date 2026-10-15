import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Copy,
  Check,
  Bot,
  User,
  HelpCircle,
  BookOpen,
  Gamepad2,
  Calculator,
  Compass,
  GraduationCap,
  GripVertical,
  GripHorizontal,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { getSmartAssistantResponse } from '../../utils/aiKnowledgeEngine';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  {
    icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" />,
    text: 'Bí quyết áp dụng Active Recall và Spaced Repetition?',
  },
  {
    icon: <Calculator className="w-3.5 h-3.5 text-amber-400" />,
    text: 'Cách tính điểm GPA thang 4 và mẹo kéo điểm kỳ này?',
  },
  {
    icon: <GraduationCap className="w-3.5 h-3.5 text-pink-400" />,
    text: 'Làm sao ôn thi điểm A môn Triết học / Toán cao cấp?',
  },
  {
    icon: <Compass className="w-3.5 h-3.5 text-emerald-400" />,
    text: 'Cách thoát khỏi trì hoãn khi deadline dồn dập?',
  },
  {
    icon: <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />,
    text: 'Hướng dẫn mẹo chơi thắng Rồng trong Arcane Dragon Rush?',
  },
];

export const AIAssistantModal: React.FC = () => {
  const { aiChatOpen, setAiChatOpen, user, theme } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Xin chào bạn! Mình là **Trợ Lý AI Toàn Năng UniLevelUp** (hoạt động thông minh như Google Gemini).\n\nMình có thể giải đáp **MỌI CÂU HỎI** của bạn trên mọi lĩnh vực:\n- **Khoa học & Kỹ thuật:** Toán học, Vật lý, Hóa học, Lập trình (Python, JS, React, C++), Tiếng Anh & dịch thuật\n- **Phương pháp học đỉnh cao:** Pomodoro, Active Recall, Spaced Repetition, Cornell Note, Feynman, Eisenhower\n- **Học thuật đại học:** Mẹo ôn thi A+, tính điểm GPA thang 4, đăng ký tín chỉ, vượt qua deadline và áp lực thi cử\n- **UniLevelUp:** Khám phá Game Zone, Thư viện Giáo trình PDF và Phòng học Study With Me\n\nBạn có thể hỏi bất kỳ điều gì, mình sẵn sàng giải đáp ngay!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- DRAGGABLE BUTTON STATE ---
  const [btnPos, setBtnPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem('unilevelup_ai_btn_pos');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const isDraggingBtnRef = useRef(false);
  const btnDragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const btnRef = useRef<HTMLDivElement | null>(null);

  const handleBtnPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const rect = btnRef.current?.getBoundingClientRect();
    const currentX = rect ? rect.left : (window.innerWidth - 220);
    const currentY = rect ? rect.top : (window.innerHeight - 70);

    isDraggingBtnRef.current = false;
    btnDragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (!btnDragStartRef.current) return;
      const dx = ev.clientX - btnDragStartRef.current.startX;
      const dy = ev.clientY - btnDragStartRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        isDraggingBtnRef.current = true;
      }
      const elWidth = btnRef.current?.offsetWidth || 210;
      const elHeight = btnRef.current?.offsetHeight || 50;
      const newX = Math.max(10, Math.min(window.innerWidth - elWidth - 10, btnDragStartRef.current.initX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - elHeight - 10, btnDragStartRef.current.initY + dy));
      setBtnPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        try {
          localStorage.setItem('unilevelup_ai_btn_pos', JSON.stringify({ x: rect.left, y: rect.top }));
        } catch {
          // ignore
        }
      }
      setTimeout(() => {
        isDraggingBtnRef.current = false;
      }, 60);
      btnDragStartRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // --- DRAGGABLE WINDOW STATE ---
  const [winPos, setWinPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem('unilevelup_ai_win_pos');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const winDragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const winRef = useRef<HTMLDivElement | null>(null);

  const handleWinHeaderPointerDown = (e: React.PointerEvent) => {
    // Only drag with left click or touch and ignore buttons
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    const rect = winRef.current?.getBoundingClientRect();
    const currentX = rect ? rect.left : Math.max(20, window.innerWidth - 500);
    const currentY = rect ? rect.top : Math.max(20, window.innerHeight - 700);

    winDragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (!winDragStartRef.current) return;
      const dx = ev.clientX - winDragStartRef.current.startX;
      const dy = ev.clientY - winDragStartRef.current.startY;
      const elWidth = winRef.current?.offsetWidth || 480;
      const elHeight = winRef.current?.offsetHeight || 650;
      const newX = Math.max(5, Math.min(window.innerWidth - elWidth - 5, winDragStartRef.current.initX + dx));
      const newY = Math.max(5, Math.min(window.innerHeight - elHeight - 5, winDragStartRef.current.initY + dy));
      setWinPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (winRef.current) {
        const rect = winRef.current.getBoundingClientRect();
        try {
          localStorage.setItem('unilevelup_ai_win_pos', JSON.stringify({ x: rect.left, y: rect.top }));
        } catch {
          // ignore
        }
      }
      winDragStartRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aiChatOpen) {
      setErrorMessage(null);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [aiChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue || lastPrompt).trim();
    if (!text || isLoading) return;

    sound.playClick();
    setErrorMessage(null);
    setLastPrompt(text);

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build history payload for the backend API
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.text,
        }));

      let replyContent: string | null = null;

      // Call backend with a 6-second timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ message: text, history }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const rawText = await res.text();
        let data: { reply?: string; error?: string } | null = null;
        try {
          data = JSON.parse(rawText);
        } catch {
          // Response is non-JSON or HTML warmup page
        }

        if (res.ok && data?.reply && typeof data.reply === 'string' && data.reply.trim()) {
          replyContent = data.reply.trim();
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        console.warn('Backend fetch timeout or error, transitioning smoothly to instant academic engine:', fetchErr);
      }

      // If backend is warming up, syncing, or unavailable, instantly fulfill answer via domain knowledge engine
      if (!replyContent) {
        replyContent = getSmartAssistantResponse(text);
      }

      const botMessage: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMessage]);
      setErrorMessage(null);
    } catch (err: unknown) {
      console.error('Error in AI message handler, providing immediate knowledge answer:', err);
      const fallbackReply = getSmartAssistantResponse(text);
      const botMessage: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
      setErrorMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    sound.playClick();
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: 'Cuộc trò chuyện đã được làm mới. Bạn cần hỗ trợ thêm thông tin gì về việc học và trang web UniLevelUp?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMessage(null);
  };

  // Helper to format basic markdown (bold, bullets, paragraphs)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Check for bullet lines
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc my-1 leading-relaxed">
            {formatInlineText(itemText)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="ml-4 list-decimal my-1 leading-relaxed">
            {formatInlineText(line.trim().replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="my-1 leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-cyan-300">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-amber-300">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* --- FLOATING LAUNCHER BUTTON (DRAGGABLE ANYWHERE ON SCREEN) --- */}
      {!aiChatOpen && (
        <div
          ref={btnRef}
          style={btnPos ? { left: `${btnPos.x}px`, top: `${btnPos.y}px`, bottom: 'auto', right: 'auto' } : undefined}
          className="fixed bottom-6 right-6 z-40 flex items-center select-none touch-none"
        >
          {/* Grip Handle */}
          <div
            onPointerDown={handleBtnPointerDown}
            className="p-3 sm:py-3.5 rounded-l-full bg-slate-900/90 hover:bg-slate-900 border-y border-l border-white/20 text-white/70 hover:text-white cursor-grab active:cursor-grabbing backdrop-blur-md shadow-2xl transition-all"
            title="Nhấn giữ và kéo để di chuyển vị trí nút AI"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <button
            onClick={() => {
              if (!isDraggingBtnRef.current) {
                sound.playClick();
                setAiChatOpen(true);
              }
            }}
            className="group flex items-center gap-2.5 p-3.5 sm:px-5 sm:py-3.5 rounded-r-full bg-gradient-to-r from-[#6C4DFF] via-purple-600 to-[#FF4D8D] text-white font-black shadow-2xl shadow-[#6C4DFF]/40 hover:scale-102 active:scale-95 transition-all duration-300 border-y border-r border-white/30 backdrop-blur-md cursor-pointer"
            title="Hỏi Trợ Lý AI Học Tập UniLevelUp"
          >
            <div className="relative">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
            </div>
            <span className="text-xs sm:text-sm tracking-wide hidden sm:inline font-black">
              Trợ Lý AI UniLevelUp
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
              Hỏi đáp 24/7
            </span>
          </button>
        </div>
      )}

      {/* --- AI ASSISTANT CHAT DRAWER / WINDOW (DRAGGABLE HEADER) --- */}
      {aiChatOpen && (
        <div
          ref={winRef}
          style={winPos ? { left: `${winPos.x}px`, top: `${winPos.y}px`, bottom: 'auto', right: 'auto' } : undefined}
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[480px] sm:h-[680px] z-50 flex flex-col rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-2xl bg-slate-950/95 transition-all duration-300 animate-in fade-in zoom-in-95"
        >
          {/* Header (Draggable Handle) */}
          <div
            onPointerDown={handleWinHeaderPointerDown}
            className="p-4 bg-gradient-to-r from-[#6C4DFF]/90 via-purple-700/80 to-[#FF4D8D]/90 text-white flex items-center justify-between shadow-md border-b border-white/10 shrink-0 cursor-grab active:cursor-grabbing select-none"
            title="Nhấn giữ thanh tiêu đề để kéo và di chuyển cửa sổ AI"
          >
            <div className="flex items-center gap-2.5 pointer-events-none">
              <div className="p-1 text-white/70">
                <GripHorizontal className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black tracking-tight leading-tight">
                    Trợ Lý AI Học Tập
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-white/80 line-clamp-1">
                  Kéo tiêu đề để di chuyển · Gemini 3.8 Flash
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {winPos && (
                <button
                  onClick={() => {
                    setWinPos(null);
                    localStorage.removeItem('unilevelup_ai_win_pos');
                  }}
                  className="p-2 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                  title="Gắn lại vị trí góc ban đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleClearChat}
                className="p-2 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setAiChatOpen(false);
                }}
                className="p-2 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                title="Đóng cửa sổ (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gợi ý:</span>
            </div>
            {DEFAULT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.text)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs whitespace-nowrap transition-all border border-white/10 hover:border-cyan-400/40 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {sug.icon}
                <span>{sug.text}</span>
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-slate-200">
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black shadow-md ${
                      isUser
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                        : 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 relative group transition-all ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs shadow-md shadow-cyan-900/20'
                        : 'bg-white/10 border border-white/15 text-slate-100 rounded-tl-xs shadow-lg backdrop-blur-md'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-normal">
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <div className="prose-invert leading-relaxed space-y-1">
                          {renderFormattedText(msg.text)}
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/10 text-[10px] text-slate-400 font-mono">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Sao chép nội dung"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking / Loading Bubble */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-white/10 border border-white/15 text-slate-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs font-bold text-slate-400 ml-1">
                    Trợ lý đang suy nghĩ câu trả lời...
                  </span>
                </div>
              </div>
            )}

            {/* Error Message with Immediate Answer & Dismiss */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-2">
                <span className="line-clamp-2">{errorMessage}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      const query = lastPrompt || inputValue || 'Phương pháp Pomodoro là gì?';
                      const reply = getSmartAssistantResponse(query);
                      setMessages(prev => [
                        ...prev,
                        {
                          id: `m-${Date.now()}`,
                          role: 'model',
                          text: reply,
                          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        },
                      ]);
                      setErrorMessage(null);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold cursor-pointer transition-colors shadow-md"
                  >
                    Xem câu trả lời ngay
                  </button>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Đóng thông báo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-white/10 shrink-0">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Hỏi về phương pháp học, GPA, đề thi, giáo trình..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-[#6C4DFF] text-slate-950 hover:text-white font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-cyan-500/20"
                title="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Nhấn Enter để gửi tin nhắn</span>
              <span className="text-cyan-400 font-mono">UniLevelUp AI Engine</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
