import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ROOM_BACKGROUNDS,
  INITIAL_STUDY_PARTICIPANTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_STICKY_NOTES,
  QUICK_CHEERS,
  RoomBackground,
  SharedStickyNote,
} from '../../data/studyRoomData';
import { StudyParticipant, StudyChatMessage } from '../../types';
import { sound, studyMixer } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  CheckCircle2,
  Trophy,
  Coffee,
  Heart,
  Flame,
  Lightbulb,
  BookOpen,
  MessageSquare,
  StickyNote,
  Sliders,
  Maximize2,
  Minimize2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ThumbsUp,
  Smile,
  ShieldCheck,
  UserCheck,
  Settings,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Palette,
  FlipHorizontal,
  Lock,
  Check,
  Info,
  X,
  Camera,
  Users,
  LayoutGrid,
  Radio,
  Zap,
} from 'lucide-react';
import chillCafeImg from '../../assets/images/chill_study_lofi_cafe_1791456328422.jpg';
import chillNightImg from '../../assets/images/chill_study_night_balcony_1791456342106.jpg';
import {
  updateMyPresence,
  removeMyPresence,
  subscribeToRealUsers,
  sendCheerToUser,
  subscribeToMyCheers,
  getSessionPresenceId,
} from '../../utils/studyRoomPresence';

export interface VirtualCamTheme {
  id: string;
  name: string;
  icon: string;
  bgGradient: string;
  ambientVibe: string;
  badge: string;
  bgImage?: string;
}

export const VIRTUAL_CAM_THEMES: VirtualCamTheme[] = [
  {
    id: 'lofi-girl',
    name: '🌸 Nữ sinh Lofi Chill',
    icon: '🌸',
    bgGradient: 'from-purple-950/90 via-indigo-900/80 to-pink-950/90',
    ambientVibe: 'Đang lật tài liệu ôn thi & thưởng trà đào',
    badge: 'Study Aesthetic',
    bgImage: chillCafeImg,
  },
  {
    id: 'rainy-cafe',
    name: '☕ Quán Cafe Đêm Mưa',
    icon: '☕',
    bgGradient: 'from-amber-950/90 via-stone-900/90 to-slate-950/90',
    ambientVibe: 'Mưa rơi tí tách bên ly cà phê thơm nồng',
    badge: 'Tokyo Cozy Vibe',
    bgImage: chillCafeImg,
  },
  {
    id: 'night-library',
    name: '📚 Thư Viện 2:00 AM',
    icon: '🕯️',
    bgGradient: 'from-slate-950/90 via-zinc-900/90 to-amber-950/80',
    ambientVibe: 'Ánh nến bập bùng giữa hàng ngàn cuốn sách',
    badge: 'Deep Focus',
    bgImage: chillNightImg,
  },
  {
    id: 'cyber-focus',
    name: '⚡ Cyberpunk Focus',
    icon: '💻',
    bgGradient: 'from-cyan-950/90 via-indigo-950/80 to-purple-950/90',
    ambientVibe: 'Màn hình rực sáng, dứt điểm deadline',
    badge: 'High Energy',
  },
];

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
}

export const StudyRoomView: React.FC = () => {
  const { user, firebaseUser, addXP } = useApp();

  // Background and Room Theme
  const [currentBg, setCurrentBg] = useState<RoomBackground>(ROOM_BACKGROUNDS[0]);

  // Participants & User state
  const [participants, setParticipants] = useState<StudyParticipant[]>(INITIAL_STUDY_PARTICIPANTS);
  const [realUsers, setRealUsers] = useState<StudyParticipant[]>([]);
  const [viewLayout, setViewLayout] = useState<'grid' | 'spotlight'>('grid');
  const [filterTab, setFilterTab] = useState<'all' | 'real' | 'cam' | 'done'>('all');
  const [receivedCheer, setReceivedCheer] = useState<{
    fromName: string;
    emoji: string;
    message: string;
  } | null>(null);

  const [myGoal, setMyGoal] = useState<string>('Tập trung giải quyết 1 chương sách & làm bài tập');
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [myGoalCompleted, setMyGoalCompleted] = useState<boolean>(false);
  const [userAvatarError, setUserAvatarError] = useState<boolean>(false);

  useEffect(() => {
    setUserAvatarError(false);
  }, [firebaseUser?.photoURL]);

  // Camera & Mic State
  const [isCamOn, setIsCamOn] = useState<boolean>(false);
  const [camMode, setCamMode] = useState<'webcam' | 'virtual'>('webcam');
  const [virtualTheme, setVirtualTheme] = useState<string>('lofi-girl');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Error & Troubleshooting Modal State
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [mediaErrorType, setMediaErrorType] = useState<'permission' | 'iframe' | 'not_found' | 'in_use' | null>(null);
  const [showDeviceModal, setShowDeviceModal] = useState<boolean>(false);

  // Time & Pomodoro State
  const [roomMinutes, setRoomMinutes] = useState<number>(0);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'break'>('focus');
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState<boolean>(true);

  // Chat & Right Panel
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'notes'>('chat');
  const [chatMessages, setChatMessages] = useState<StudyChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Sticky Notes
  const [stickyNotes, setStickyNotes] = useState<SharedStickyNote[]>(INITIAL_STICKY_NOTES);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteColor, setNewNoteColor] = useState<SharedStickyNote['color']>('yellow');
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);

  // Floating Reactions
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  // Ambient Mixer
  const [isMixerPlaying, setIsMixerPlaying] = useState<boolean>(false);
  const [showMixerModal, setShowMixerModal] = useState<boolean>(false);
  const [mixerVols, setMixerVols] = useState({
    rain: 40,
    cafe: 25,
    fire: 0,
    lofi: 35,
  });

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Toggle Camera with robust diagnostics and virtual fallback
  const toggleCamera = async (forceReal = false) => {
    sound.playClick();
    setMediaError(null);

    // If currently ON and in requested mode, toggle OFF
    if (isCamOn && !forceReal) {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      setIsCamOn(false);
      return;
    }

    // Check device support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMediaError(
        'Trình duyệt hoặc khung xem trước (iframe sandbox) đang hạn chế quyền truy cập Camera trực tiếp. Bạn có thể mở ở tab riêng hoặc dùng chế độ Cam Ảo Aesthetic!'
      );
      setMediaErrorType('iframe');
      setIsCamOn(true);
      setCamMode('virtual');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setCameraStream(stream);
      setIsCamOn(true);
      setCamMode('webcam');
      setMediaError(null);
      setMediaErrorType(null);
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      let errMsg = 'Không thể mở Camera.';
      let errType: 'permission' | 'iframe' | 'not_found' | 'in_use' = 'permission';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg =
          'Trình duyệt đã từ chối quyền truy cập Camera. Hãy nhấp vào biểu tượng 🔒 hoặc 📹 trên thanh địa chỉ URL để cấp quyền "Cho phép (Allow)".';
        errType = 'permission';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg = 'Không tìm thấy thiết bị Camera (Webcam) nào kết nối với máy tính/điện thoại.';
        errType = 'not_found';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errMsg = 'Webcam đang được sử dụng bởi ứng dụng khác (Zoom, Google Meet, Teams...).';
        errType = 'in_use';
      } else if (err.name === 'SecurityError') {
        errMsg =
          'Quyền truy cập Camera bị chặn bởi khung nhúng (iframe). Hãy mở trang trong tab mới độc lập để cấp quyền đầy đủ.';
        errType = 'iframe';
      } else {
        errMsg = `Lỗi truy cập Camera (${err.message || err.name}). Bạn có thể chuyển sang Cam Ảo Chill.`;
      }

      setMediaError(errMsg);
      setMediaErrorType(errType);

      // Auto fallback to virtual cam so user is never left with broken UI
      setIsCamOn(true);
      setCamMode('virtual');
    }
  };

  // Toggle Microphone with Web Audio API live meter
  const toggleMic = async () => {
    sound.playClick();
    setMediaError(null);

    if (isMicOn) {
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
        setMicStream(null);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
        audioContextRef.current = null;
      }
      setIsMicOn(false);
      setAudioLevel(0);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMediaError(
        'Trình duyệt không hỗ trợ truy cập Microphone trực tiếp trong môi trường này (iframe sandbox). Mở trang ở tab mới để cấp quyền.'
      );
      setMediaErrorType('iframe');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setMicStream(stream);
      setIsMicOn(true);
      setMediaError(null);
      setMediaErrorType(null);

      // Setup Web Audio Analyser
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.5;
          source.connect(analyser);

          audioContextRef.current = ctx;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setAudioLevel(normalized);
            animFrameRef.current = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        }
      } catch (audioErr) {
        console.warn('AudioContext analyser error:', audioErr);
      }
    } catch (err: any) {
      console.warn('Microphone access failed:', err);
      let errMsg = 'Không thể mở Microphone.';
      let errType: 'permission' | 'iframe' | 'not_found' | 'in_use' = 'permission';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg =
          'Trình duyệt đã từ chối quyền truy cập Micro. Hãy nhấp vào biểu tượng 🔒 hoặc 🎙️ trên thanh địa chỉ URL để cấp quyền "Cho phép (Allow)".';
        errType = 'permission';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg = 'Không tìm thấy Microphone trên thiết bị của bạn.';
        errType = 'not_found';
      } else if (err.name === 'SecurityError') {
        errMsg =
          'Microphone bị chặn bởi sandbox iframe. Hãy mở ứng dụng trong một tab mới độc lập để cho phép trình duyệt kích hoạt Micro.';
        errType = 'iframe';
      } else {
        errMsg = `Lỗi mở Micro (${err.message || err.name}). Kiểm tra cài đặt quyền micro.`;
      }

      setMediaError(errMsg);
      setMediaErrorType(errType);
      setIsMicOn(false);
    }
  };

  useEffect(() => {
    if (videoRef.current && cameraStream && isCamOn && camMode === 'webcam') {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((e) => console.log('Video play caught:', e));
    }
  }, [cameraStream, isCamOn, camMode]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
      studyMixer.stop();
    };
  }, [cameraStream, micStream]);

  // Firestore Real-time Presence & Cheers Integration
  const myPresenceId = getSessionPresenceId();

  useEffect(() => {
    // 1. Subscribe to real-time online users
    const unsubPresence = subscribeToRealUsers(myPresenceId, (activeRealUsers) => {
      setRealUsers(activeRealUsers);
      setParticipants([...activeRealUsers, ...INITIAL_STUDY_PARTICIPANTS]);
    });

    // 2. Subscribe to incoming cheers targeted to me
    const unsubCheers = subscribeToMyCheers(myPresenceId, (cheer) => {
      sound.playReaction();
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.5 },
      });
      setReceivedCheer(cheer);
      addXP(10, `Được ${cheer.fromName} cổ vũ`);
      setTimeout(() => setReceivedCheer(null), 4500);
    });

    return () => {
      unsubPresence();
      unsubCheers();
      removeMyPresence();
    };
  }, [myPresenceId, addXP]);

  // Sync my presence state to Firestore whenever changes occur
  useEffect(() => {
    const syncPresence = () => {
      updateMyPresence({
        name: user.name || firebaseUser?.displayName || 'Bạn',
        avatar: firebaseUser ? '🧑‍🎓' : '🌟',
        photoURL: firebaseUser?.photoURL || undefined,
        goal: myGoal,
        goalCompleted: myGoalCompleted,
        isCamOn,
        camMode,
        virtualTheme,
        isMicOn,
        isSpeaking: isMicOn && audioLevel > 18,
        minutesStudied: roomMinutes,
        streakDays: user.streak || 1,
      });
    };

    syncPresence();
    const interval = setInterval(syncPresence, 20000);

    const onUnload = () => {
      removeMyPresence();
    };
    window.addEventListener('beforeunload', onUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [
    user.name,
    user.streak,
    firebaseUser,
    myGoal,
    myGoalCompleted,
    isCamOn,
    camMode,
    virtualTheme,
    isMicOn,
    audioLevel,
    roomMinutes,
  ]);

  // Personal time counter in room & XP reward
  useEffect(() => {
    const timer = setInterval(() => {
      setRoomMinutes((prev) => {
        const next = prev + 1;
        if (next > 0 && next % 10 === 0) {
          addXP(25, `Học tập trung 10 phút tại Study With Me`);
        }
        return next;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [addXP]);

  // Pomodoro countdown
  useEffect(() => {
    if (!isPomoRunning) return;
    const interval = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          sound.playTing();
          if (pomodoroMode === 'focus') {
            setPomodoroMode('break');
            addXP(30, 'Hoàn thành phiên tập trung 25 phút');
            return 5 * 60;
          } else {
            setPomodoroMode('focus');
            return 25 * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPomoRunning, pomodoroMode, addXP]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle ambient mixer volume change
  const handleVolChange = (track: 'rain' | 'cafe' | 'fire' | 'lofi', val: number) => {
    setMixerVols((prev) => ({ ...prev, [track]: val }));
    studyMixer.setTrackVolume(track, val / 100);
    if (!isMixerPlaying && val > 0) {
      studyMixer.start();
      setIsMixerPlaying(true);
    }
  };

  const toggleMixerMaster = () => {
    sound.playClick();
    if (isMixerPlaying) {
      studyMixer.stop();
      setIsMixerPlaying(false);
    } else {
      studyMixer.start();
      studyMixer.setTrackVolume('rain', mixerVols.rain / 100);
      studyMixer.setTrackVolume('cafe', mixerVols.cafe / 100);
      studyMixer.setTrackVolume('fire', mixerVols.fire / 100);
      studyMixer.setTrackVolume('lofi', mixerVols.lofi / 100);
      setIsMixerPlaying(true);
    }
  };

  // Trigger floating reaction
  const triggerReaction = (emoji: string) => {
    sound.playReaction();
    const newId = 'r-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const xPos = 20 + Math.random() * 60; // percentage
    setReactions((prev) => [...prev, { id: newId, emoji, x: xPos }]);

    // Auto remove after 2.5s
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newId));
    }, 2500);
  };

  // Send Chat Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    sound.playClick();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: StudyChatMessage = {
      id: 'msg-' + Date.now(),
      senderId: 'me',
      senderName: user.name || 'Bạn',
      senderAvatar: firebaseUser ? '✨' : '🎓',
      text: inputMessage.trim(),
      timestamp: timeStr,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Occasional sweet bot reply to make the room alive!
    if (Math.random() > 0.4) {
      setTimeout(() => {
        const botReplies = [
          'Cố lên bạn ơi, cùng cố gắng nốt buổi tối nay nhé! ✨',
          'Tớ cũng đang chuẩn bị hoàn thành phần bài tập của mình nè! 💪',
          'Tuyệt vời quá, tập trung cao độ nhé cả nhà! ☕',
          'Đừng quên uống nước và chớp mắt thư giãn nha! 💧',
        ];
        const randomBot = participants[Math.floor(Math.random() * participants.length)];
        const replyMsg: StudyChatMessage = {
          id: 'bot-reply-' + Date.now(),
          senderId: randomBot.id,
          senderName: randomBot.name.split(' (')[0],
          senderAvatar: randomBot.avatar,
          text: botReplies[Math.floor(Math.random() * botReplies.length)],
          timestamp: timeStr,
        };
        setChatMessages((prev) => [...prev, replyMsg]);
      }, 1400);
    }
  };

  // Send quick cheer
  const sendQuickCheer = (cheerText: string) => {
    sound.playNudge();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: StudyChatMessage = {
      id: 'cheer-' + Date.now(),
      senderId: 'me',
      senderName: user.name || 'Bạn',
      senderAvatar: '📣',
      text: cheerText,
      timestamp: timeStr,
    };
    setChatMessages((prev) => [...prev, newMsg]);
    triggerReaction('☕');
  };

  // Complete User Goal
  const handleCompleteMyGoal = () => {
    if (myGoalCompleted) return;
    setMyGoalCompleted(true);
    sound.playGoalCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4D8D', '#6C4DFF', '#00F5D4', '#FFD166'],
    });
    addXP(50, 'Hoàn thành mục tiêu học tập trong phòng Study With Me');

    // Broadcast celebration to chat
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const celebMsg: StudyChatMessage = {
      id: 'goal-celeb-' + Date.now(),
      senderId: 'me',
      senderName: 'Hệ Thống Phòng Học 🎉',
      senderAvatar: '🏆',
      text: `${user.name || 'Bạn'} vừa hoàn thành xuất sắc mục tiêu: "${myGoal}"! Mọi người cùng thả tim chúc mừng nào!`,
      timestamp: timeStr,
      isGoalUpdate: true,
    };
    setChatMessages((prev) => [...prev, celebMsg]);
    triggerReaction('🎉');
    triggerReaction('🔥');
    triggerReaction('⭐');
  };

  // Cheer specific participant (interactive cheer)
  const handleCheerParticipant = (
    p: StudyParticipant,
    emoji = '☕',
    cheerTitle = 'Cố lên bạn ơi!'
  ) => {
    sound.playReaction();
    triggerReaction(emoji);

    // If real user, send through Firestore real-time cheers
    if (p.isRealUser) {
      sendCheerToUser(
        p.id,
        p.name,
        user.name || firebaseUser?.displayName || 'Bạn học UniLevelUp',
        emoji,
        `vừa gửi tặng bạn ${emoji} ${cheerTitle}`
      );
    }

    const cheer = `${emoji} Gửi lời cổ vũ ấm áp đến ${p.name.split(' (')[0]}: "${cheerTitle}"! Cố lên nhé! ⭐`;
    sendQuickCheer(cheer);
    addXP(5, `Gửi lời động viên tích cực cho bạn học`);
  };

  // Add Sticky Note
  const handleAddStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    sound.playSuccess();
    const note: SharedStickyNote = {
      id: 'sn-' + Date.now(),
      author: user.name || 'Ẩn danh',
      content: newNoteText.trim(),
      color: newNoteColor,
      createdAt: 'Vừa xong',
      likes: 1,
    };
    setStickyNotes((prev) => [note, ...prev]);
    setNewNoteText('');
    setShowNoteModal(false);
    addXP(20, 'Đóng góp mẹo hay lên bảng ghi chú chung');
  };

  const handleLikeStickyNote = (noteId: string) => {
    sound.playReaction();
    setStickyNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden bg-gradient-to-b ${currentBg.themeClass} text-[#F5F3FF] transition-all duration-700 pb-12`}
    >
      {/* Background visual ambience layer */}
      <div
        className={`absolute inset-0 bg-radial ${currentBg.gradient} pointer-events-none opacity-80`}
      />

      {/* Subtle animated floating rain / particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-[#6C4DFF]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#FF4D8D]/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating Reactions Canvas */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {reactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.x}%` }}
            className="absolute bottom-16 text-3xl sm:text-4xl animate-bounce transition-all duration-1000 opacity-90 transform -translate-x-1/2"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Received Cheer Floating Toast Notification */}
      {receivedCheer && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600/95 via-purple-600/95 to-indigo-600/95 border-2 border-white/30 backdrop-blur-xl shadow-2xl flex items-center gap-3.5 animate-bounce">
          <span className="text-3xl animate-pulse">{receivedCheer.emoji}</span>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{receivedCheer.fromName}</span>
              <span className="text-pink-200">cổ vũ bạn!</span>
            </div>
            <div className="text-[11px] text-pink-100 font-medium">
              "{receivedCheer.message}" • <span className="text-amber-300 font-bold">+10 XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="relative z-20 border-b border-white/10 backdrop-blur-md bg-black/20 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Room Status & Background Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-4.5" />
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 flex-wrap">
                  <span>Phòng Học Bài Chill</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 font-normal border border-emerald-400/20">
                    🟢 {participants.length + 1} bạn đang học
                  </span>
                  {realUsers.length > 0 && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      🌟 {realUsers.length + 1} người thật đang online
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-300 hidden sm:block">
                  Không gian học tập ảo kết nối sinh viên — Yên tĩnh & Tập trung cao độ
                </p>
              </div>
            </div>

            {/* Background Selector */}
            <div className="relative group ml-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-200 transition-colors">
                <span>{currentBg.icon}</span>
                <span className="hidden md:inline">{currentBg.name}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>
              <div className="absolute left-0 mt-1 w-64 bg-[#1E1938] border border-white/15 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 backdrop-blur-xl">
                <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1">
                  Chọn không gian Chill
                </div>
                {ROOM_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      sound.playClick();
                      setCurrentBg(bg);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start gap-2.5 transition-colors ${
                      currentBg.id === bg.id
                        ? 'bg-[#6C4DFF]/30 text-white font-medium border border-[#6C4DFF]/40'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{bg.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{bg.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{bg.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center/Right: Pomodoro Room Sync Timer & Ambient Mixer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pomodoro Timer Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 shadow-inner">
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  pomodoroMode === 'focus' ? 'bg-[#FF4D8D]/20 text-[#FF4D8D]' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {pomodoroMode === 'focus' ? 'Tập trung' : 'Xả hơi'}
              </span>
              <span className="font-mono font-bold text-sm text-white tracking-widest">
                {formatTimer(pomodoroSeconds)}
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPomoRunning(!isPomoRunning);
                }}
                className="p-1 hover:text-white text-slate-300 transition-colors"
                title={isPomoRunning ? 'Tạm dừng' : 'Bắt đầu'}
              >
                {isPomoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setPomodoroSeconds(pomodoroMode === 'focus' ? 25 * 60 : 5 * 60);
                }}
                className="p-1 hover:text-white text-slate-300 transition-colors"
                title="Đặt lại"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ambient Sound Mixer Button */}
            <div className="relative">
              <button
                onClick={() => setShowMixerModal(!showMixerModal)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isMixerPlaying
                    ? 'bg-[#6C4DFF] text-white border-[#6C4DFF] shadow-lg shadow-[#6C4DFF]/30'
                    : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/15'
                }`}
              >
                {isMixerPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Âm Thanh Lofi</span>
                <Sliders className="w-3 h-3 text-slate-300" />
              </button>

              {/* Mixer Dropdown Panel */}
              {showMixerModal && (
                <div className="absolute right-0 mt-2 w-72 bg-[#1A1535] border border-white/15 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#FF4D8D]" /> Bộ Trộn Âm Thanh
                    </span>
                    <button
                      onClick={toggleMixerMaster}
                      className="text-xs px-2 py-0.5 rounded-md font-medium transition-colors bg-white/10 hover:bg-white/20 text-white"
                    >
                      {isMixerPlaying ? 'Tắt hết' : 'Bật nhạc'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Rain */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>🌧️ Tiếng mưa rơi</span>
                        <span className="font-mono text-[11px] text-slate-400">{mixerVols.rain}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mixerVols.rain}
                        onChange={(e) => handleVolChange('rain', Number(e.target.value))}
                        className="w-full accent-[#6C4DFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Cafe */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>☕ Quán cafe rì rào</span>
                        <span className="font-mono text-[11px] text-slate-400">{mixerVols.cafe}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mixerVols.cafe}
                        onChange={(e) => handleVolChange('cafe', Number(e.target.value))}
                        className="w-full accent-[#FF4D8D] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Fireplace */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>🔥 Lò sưởi bập bùng</span>
                        <span className="font-mono text-[11px] text-slate-400">{mixerVols.fire}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mixerVols.fire}
                        onChange={(e) => handleVolChange('fire', Number(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Lofi Drone Chord */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>🎹 Hợp âm Lofi ấm áp</span>
                        <span className="font-mono text-[11px] text-slate-400">{mixerVols.lofi}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mixerVols.lofi}
                        onChange={(e) => handleVolChange('lofi', Number(e.target.value))}
                        className="w-full accent-emerald-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        {/* Left Column: Virtual Study Desks / Participant Grid (Google Meet style collaborative chill) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Room Mode Toolbar & Interactive Filters */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
            {/* Left: Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mr-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#FF4D8D]" /> Hiển thị:
              </span>
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterTab === 'all'
                    ? 'bg-[#6C4DFF] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                Tất cả ({participants.length + 1})
              </button>
              <button
                onClick={() => setFilterTab('real')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filterTab === 'real'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-emerald-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Người thật ({realUsers.length + 1})
              </button>
              <button
                onClick={() => setFilterTab('cam')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterTab === 'cam'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Video className="w-3 h-3 text-pink-400" />
                Bật Cam ({participants.filter((p) => p.isCamOn).length + (isCamOn ? 1 : 0)})
              </button>
              <button
                onClick={() => setFilterTab('done')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterTab === 'done'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-amber-300" />
                Xong mục tiêu ({participants.filter((p) => p.goalCompleted).length + (myGoalCompleted ? 1 : 0)})
              </button>
            </div>

            {/* Right: Layout Switcher */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  sound.playClick();
                  setViewLayout('grid');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewLayout === 'grid'
                    ? 'bg-[#6C4DFF] text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Chế độ Lưới Meet - Hiển thị tất cả bàn học ngang hàng nhau"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Lưới Meet ({participants.length + 1})</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setViewLayout('spotlight');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewLayout === 'spotlight'
                    ? 'bg-[#6C4DFF] text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Chế độ Bàn của tôi làm trung tâm"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Bàn Của Tôi</span>
              </button>
            </div>
          </div>

          {/* DESKS CONTAINER */}
          {(() => {
            const filteredParticipants = participants.filter((p) => {
              if (filterTab === 'real') return !!p.isRealUser;
              if (filterTab === 'cam') return !!p.isCamOn;
              if (filterTab === 'done') return !!p.goalCompleted;
              return true;
            });

            // Master desk card of current user
            const myDeskCard = (
              <div
                key="my-desk"
                className={`rounded-2xl border-2 transition-all duration-300 ${
                  isMicOn && audioLevel > 18
                    ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-2xl shadow-emerald-500/20'
                    : 'border-[#6C4DFF]/40'
                } bg-gradient-to-br from-[#1C1635]/90 to-[#2A1D45]/90 p-4 sm:p-5 backdrop-blur-xl shadow-xl relative overflow-hidden group flex flex-col justify-between`}
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {firebaseUser?.photoURL && !userAvatarError ? (
                        <img
                          src={firebaseUser.photoURL}
                          alt="Avatar"
                          referrerPolicy="no-referrer"
                          onError={() => setUserAvatarError(true)}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-xl text-white font-bold shadow-md">
                          {firebaseUser ? '🧑‍🎓' : '🌟'}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1C1635] ${
                          isMicOn && audioLevel > 18
                            ? 'bg-emerald-400 animate-ping'
                            : isCamOn
                            ? 'bg-emerald-400'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1C1635] ${
                          isMicOn && audioLevel > 18
                            ? 'bg-emerald-400'
                            : isCamOn
                            ? 'bg-emerald-400'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-white">
                          {user.name || firebaseUser?.displayName || 'Bàn Học Của Bạn'}
                        </h2>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6C4DFF]/20 text-[#D8B4FE] border border-[#6C4DFF]/30 font-bold">
                          🌟 BÀN CỦA BẠN (YOU)
                        </span>
                        {isMicOn && audioLevel > 18 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse font-semibold">
                            Đang nói 🎙️
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF4D8D]" /> Đã học: <strong>{roomMinutes} phút</strong>
                        </span>
                        <span>•</span>
                        <span className="text-amber-300">🔥 Chuỗi: {user.streak} ngày</span>
                      </div>
                    </div>
                  </div>

                  {/* Cam & Mic Controls for User */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleCamera(false)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isCamOn
                          ? camMode === 'webcam'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-purple-500/20 text-pink-300 border-purple-500/40 hover:bg-purple-500/30'
                          : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/15'
                      }`}
                      title={isCamOn ? (camMode === 'webcam' ? 'Tắt Webcam' : 'Tắt Cam Ảo') : 'Bật Camera'}
                    >
                      {isCamOn ? (
                        camMode === 'webcam' ? (
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Palette className="w-3.5 h-3.5 text-pink-300" />
                        )
                      ) : (
                        <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>
                        {isCamOn ? (camMode === 'webcam' ? 'Webcam Bật' : 'Cam Ảo Lofi') : 'Bật Cam'}
                      </span>
                    </button>

                    <button
                      onClick={toggleMic}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isMicOn
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-sm shadow-emerald-500/20'
                          : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/15'
                      }`}
                      title={isMicOn ? 'Tắt Microphone' : 'Bật Microphone'}
                    >
                      {isMicOn ? (
                        <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>{isMicOn ? 'Mic Mở' : 'Mic Tắt'}</span>

                      {/* Live Audio Equalizer Bars */}
                      {isMicOn && (
                        <div className="flex items-end gap-0.5 h-3.5 ml-0.5">
                          <span
                            className="w-0.5 bg-emerald-400 rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(20, Math.min(100, audioLevel * 1.5))}%` }}
                          />
                          <span
                            className="w-0.5 bg-emerald-400 rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(30, Math.min(100, audioLevel * 2.2))}%` }}
                          />
                          <span
                            className="w-0.5 bg-emerald-400 rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(15, Math.min(100, audioLevel * 1.2))}%` }}
                          />
                          <span
                            className="w-0.5 bg-emerald-400 rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(25, Math.min(100, audioLevel * 1.8))}%` }}
                          />
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => setShowDeviceModal(true)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-colors"
                      title="Kiểm tra & Cài đặt Thiết bị (Camera / Mic)"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Media Error Alert Banner */}
                {mediaError && (
                  <div className="mb-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 animate-fadeIn">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Chưa kích hoạt được Camera / Microphone</div>
                        <div className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">{mediaError}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto flex-wrap">
                      <button
                        onClick={() => {
                          setCamMode('virtual');
                          setIsCamOn(true);
                          setMediaError(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#6C4DFF] hover:bg-[#5a38ea] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Palette className="w-3 h-3" /> Bật Cam Ảo Chill
                      </button>
                      <button
                        onClick={() => setShowDeviceModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <HelpCircle className="w-3 h-3" /> Hướng dẫn
                      </button>
                      <a
                        href={window.location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                        title="Mở trong tab mới"
                      >
                        <ExternalLink className="w-3 h-3" /> Mở tab riêng
                      </a>
                      <button
                        onClick={() => setMediaError(null)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Video Preview Box */}
                <div className="w-full h-44 sm:h-52 rounded-xl bg-black/40 border border-white/10 overflow-hidden relative flex items-center justify-center mb-3">
                  {isCamOn && camMode === 'webcam' && cameraStream ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${isMirrored ? 'transform scale-x-[-1]' : ''}`}
                      />
                      <div className="absolute top-2.5 left-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          LIVE WEBCAM
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-black/50 text-[10px] text-slate-300 border border-white/10">
                          720p HD
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => setIsMirrored(!isMirrored)}
                          className="px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-[10px] text-slate-200 border border-white/15 flex items-center gap-1 transition-colors"
                        >
                          <FlipHorizontal className="w-3 h-3" />
                          <span className="hidden sm:inline">{isMirrored ? 'Lật gương' : 'Chuẩn'}</span>
                        </button>
                        <button
                          onClick={() => setCamMode('virtual')}
                          className="px-2 py-1 rounded-lg bg-[#6C4DFF]/80 hover:bg-[#6C4DFF] backdrop-blur-md text-[10px] text-white border border-white/20 flex items-center gap-1 transition-colors shadow-md"
                        >
                          <Palette className="w-3 h-3" />
                          <span className="hidden sm:inline">Đổi Cam Ảo</span>
                        </button>
                      </div>
                    </>
                  ) : isCamOn && camMode === 'virtual' ? (
                    (() => {
                      const currentVirtual =
                        VIRTUAL_CAM_THEMES.find((t) => t.id === virtualTheme) || VIRTUAL_CAM_THEMES[0];
                      return (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${currentVirtual.bgGradient} flex flex-col items-center justify-center p-3 relative select-none overflow-hidden`}
                        >
                          {currentVirtual.bgImage && (
                            <img
                              src={currentVirtual.bgImage}
                              alt={currentVirtual.name}
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none"
                            />
                          )}
                          <div className="absolute top-2.5 left-3 flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold text-pink-300 border border-pink-400/30 flex items-center gap-1.5 shadow-md">
                              <span>{currentVirtual.icon}</span>
                              <span>CAM ẢO AESTHETIC</span>
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-3 flex items-center gap-1">
                            {VIRTUAL_CAM_THEMES.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  sound.playClick();
                                  setVirtualTheme(t.id);
                                }}
                                className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center border transition-all ${
                                  virtualTheme === t.id
                                    ? 'bg-white/25 border-white/40 scale-110 shadow-md'
                                    : 'bg-black/40 border-white/10 hover:bg-white/10 text-slate-300'
                                }`}
                                title={t.name}
                              >
                                {t.icon}
                              </button>
                            ))}
                            <button
                              onClick={() => toggleCamera(true)}
                              className="ml-1 px-2 py-0.5 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-white text-[10px] font-medium flex items-center gap-1 shadow-md transition-colors"
                            >
                              <Camera className="w-3 h-3" />
                              <span className="hidden sm:inline">Bật Cam Thật</span>
                            </button>
                          </div>
                          <div className="text-center my-auto">
                            <div className="relative inline-block mb-1.5">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl shadow-purple-500/20">
                                {currentVirtual.icon}
                              </div>
                              <div className="absolute -top-1.5 -right-1.5 text-xs animate-bounce">✨</div>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                              {currentVirtual.name}
                            </h4>
                            <p className="text-[10px] text-slate-300/90 max-w-xs mt-0.5 px-2 italic line-clamp-1">
                              "{currentVirtual.ambientVibe}"
                            </p>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center p-3">
                      <div className="relative inline-block mb-1.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6C4DFF] to-[#FF4D8D] flex items-center justify-center text-3xl shadow-lg">
                          ☕
                        </div>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs animate-bounce text-slate-300">
                          ☁️
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-white">Chế độ học tập tĩnh lặng</p>
                      <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
                        <button
                          onClick={() => toggleCamera(true)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] hover:opacity-90 text-white text-[11px] font-bold flex items-center gap-1 shadow transition-transform active:scale-95"
                        >
                          <Video className="w-3 h-3" /> Bật Cam Thật
                        </button>
                        <button
                          onClick={() => {
                            setCamMode('virtual');
                            setIsCamOn(true);
                            sound.playClick();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <Palette className="w-3 h-3 text-pink-300" /> Bật Cam Ảo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status overlay at bottom */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCamOn || isMicOn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      <span>
                        {isMicOn && audioLevel > 18
                          ? 'Đang phát biểu 🎙️'
                          : isCamOn
                          ? 'Đang cùng học bài 🎯'
                          : 'Tập trung cao độ 🎯'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Session Goal Banner & Checkbox */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex-1 min-w-[180px]">
                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      🎯 Mục tiêu hôm nay:
                    </div>
                    {isEditingGoal ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="text"
                          value={myGoal}
                          onChange={(e) => setMyGoal(e.target.value)}
                          className="flex-1 bg-black/40 border border-[#6C4DFF] rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => setIsEditingGoal(false)}
                          className="px-2 py-0.5 rounded-lg bg-[#6C4DFF] text-white text-[11px] font-semibold"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsEditingGoal(true)}
                        className="text-xs font-medium text-white hover:text-pink-300 cursor-pointer flex items-center gap-1.5 mt-0.5"
                        title="Nhấn để sửa mục tiêu"
                      >
                        <span className="line-clamp-1">{myGoal}</span>
                        <span className="text-[9px] text-slate-400 italic">(Sửa)</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCompleteMyGoal}
                    disabled={myGoalCompleted}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                      myGoalCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-[#FF4D8D] to-[#6C4DFF] text-white hover:opacity-95 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{myGoalCompleted ? 'Đã xong bài! 🎉' : 'Xong Bài! (+50 XP)'}</span>
                  </button>
                </div>
              </div>
            );

            // Reusable card renderer for other participants (Google Meet tile style)
            const renderOtherParticipantTile = (p: StudyParticipant) => (
              <div
                key={p.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  p.isSpeaking
                    ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-xl shadow-emerald-500/20'
                    : p.isRealUser
                    ? 'border-emerald-500/40 bg-gradient-to-br from-[#121E2E]/90 to-[#19273C]/90'
                    : 'border-white/10 bg-gradient-to-br from-[#16122E]/90 to-[#221A3D]/90'
                } p-4 sm:p-5 backdrop-blur-xl shadow-xl relative overflow-hidden group flex flex-col justify-between`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      {p.photoURL ? (
                        <>
                          <img
                            src={p.photoURL}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                            className="w-10 h-10 rounded-xl object-cover border border-emerald-400 shadow-md"
                          />
                          <div
                            style={{ display: 'none' }}
                            className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform"
                          >
                            {p.avatar || '🧑‍🎓'}
                          </div>
                        </>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                          {p.avatar}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#16122E] ${
                          p.isSpeaking
                            ? 'bg-emerald-400 animate-ping'
                            : p.isRealUser
                            ? 'bg-emerald-400'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white line-clamp-1">{p.name}</span>
                        {p.isRealUser ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                            Người thật (Live)
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[9px]">
                            Bạn cùng học
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#FF4D8D]" /> {p.minutesStudied} phút • 🔥 {p.streakDays}d
                      </div>
                    </div>
                  </div>

                  {/* Cam / Mic status */}
                  <div className="flex items-center gap-1">
                    <div className="p-1 rounded-md bg-white/5 text-slate-400">
                      {p.isCamOn ? (
                        <Video className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <VideoOff className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                    <div className="p-1 rounded-md bg-white/5 text-slate-400">
                      {p.isMicOn ? (
                        <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                      ) : (
                        <MicOff className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Canvas */}
                <div className="w-full h-40 sm:h-44 rounded-xl bg-black/40 border border-white/10 overflow-hidden relative flex items-center justify-center mb-3">
                  {p.isCamOn ? (
                    p.id === 'bot-1' ? (
                      /* Minh Trí - Terminal IDE Matrix Rain */
                      <div className="w-full h-full bg-[#0D1117] font-mono text-[10px] text-emerald-400 p-2.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-slate-400 text-[9px] mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="ml-1">~/projects/thesis-ai $</span>
                          </div>
                          <div className="text-emerald-300 animate-pulse">&gt; Running training model v2...</div>
                          <div className="text-slate-400 mt-0.5">Epoch 42/50 [=======&gt;--] 84% - loss: 0.012</div>
                          <div className="text-emerald-400 font-bold mt-0.5">✓ Accuracy: 98.2% validated</div>
                        </div>
                        <div className="text-[9px] text-slate-500 flex justify-between">
                          <span>VS Code • Node.js</span>
                          <span className="text-emerald-400 font-bold">● ACTIVE</span>
                        </div>
                      </div>
                    ) : p.id === 'bot-2' ? (
                      /* Thảo Nhi - Marketing Case Study Slide */
                      <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-2.5 flex flex-col justify-between">
                        <div className="flex justify-between text-[9px] text-pink-300">
                          <span>📑 Slide 18: Marketing Strategy</span>
                          <span className="bg-pink-500/20 px-1 rounded text-pink-200">FTU 2026</span>
                        </div>
                        <div className="my-auto text-center">
                          <div className="inline-block p-1.5 rounded-xl bg-white/10 text-xl mb-0.5 shadow">📊</div>
                          <div className="text-xs font-bold text-white">Chiến Lược Tăng Trưởng Toàn Cầu</div>
                          <div className="text-[9px] text-slate-300 mt-0.5">Đã phân tích 4 P & Insight khách hàng</div>
                        </div>
                        <div className="text-[9px] text-emerald-300 font-semibold flex justify-between">
                          <span>Canva Pro • Đã lưu</span>
                          <span className="text-emerald-400 font-bold">✓ Đã nộp bài</span>
                        </div>
                      </div>
                    ) : p.id === 'bot-3' ? (
                      /* Bảo Long - Medical Anatomy Flashcard */
                      <div className="w-full h-full bg-gradient-to-br from-teal-950 via-slate-900 to-cyan-950 p-2.5 flex flex-col justify-between">
                        <div className="flex justify-between text-[9px] text-teal-300">
                          <span>🩺 Flashcard Anki: Dược Lý</span>
                          <span className="font-mono">#68/80</span>
                        </div>
                        <div className="my-auto p-2 rounded-xl bg-white/10 border border-teal-400/30 text-center">
                          <div className="text-xs font-bold text-white">Chất đồng vận thụ thể GABA-A</div>
                          <div className="text-[9px] text-teal-200 mt-0.5 italic">Cơ chế mở kênh Clo- gây ức chế TKTW</div>
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between">
                          <span>Ôn ngắt quãng (SRS)</span>
                          <span className="text-teal-300 font-bold">Good (3.2d)</span>
                        </div>
                      </div>
                    ) : p.id === 'bot-4' ? (
                      /* Khánh Linh - Mindmap & Economics */
                      <div className="w-full h-full bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 p-2.5 flex flex-col justify-between">
                        <div className="flex justify-between text-[9px] text-amber-300">
                          <span>🎨 Mindmap: Mô hình IS-LM</span>
                          <span>Kinh tế Vĩ mô</span>
                        </div>
                        <div className="my-auto flex items-center justify-center gap-1.5">
                          <div className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold text-white">Hàng Hóa (IS)</div>
                          <div className="text-amber-400 text-xs">↔️</div>
                          <div className="px-2 py-1 rounded-lg bg-orange-500/20 border border-orange-400/40 text-[10px] font-bold text-white">Tiền Tệ (LM)</div>
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between">
                          <span>GoodNotes 6 • iPad</span>
                          <span className="text-amber-300 font-bold">Đang tóm tắt</span>
                        </div>
                      </div>
                    ) : p.id === 'bot-cat' ? (
                      /* Mèo Garfield Trợ Giảng */
                      <div className="w-full h-full bg-gradient-to-br from-amber-950/80 via-stone-900 to-amber-950/80 p-2.5 flex flex-col justify-between items-center text-center">
                        <div className="text-[9px] text-amber-300 w-full flex justify-between">
                          <span>🐱 Bàn Trợ Giảng Lofi</span>
                          <span>Nhiệm vụ: Lan tỏa bình yên</span>
                        </div>
                        <div className="my-auto relative">
                          <div className="text-4xl animate-bounce">🐱</div>
                          <div className="absolute -top-1 -right-3 text-[10px] font-mono text-amber-200 animate-pulse">zzz...💤</div>
                        </div>
                        <div className="text-[9px] text-slate-300 italic">"Ai học mệt thì xoa đầu mèo một cái nhé!"</div>
                      </div>
                    ) : (
                      /* Real user or generic virtual cam stream */
                      <div className="w-full h-full bg-gradient-to-br from-purple-950/90 via-indigo-900/80 to-pink-950/90 flex flex-col items-center justify-center p-3 text-center">
                        <div className="text-3xl mb-1 animate-pulse">🌸</div>
                        <div className="text-xs font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-pink-200 italic mt-0.5">Cam Ảo Lofi • Đang học tập trung</div>
                      </div>
                    )
                  ) : (
                    /* Cam off focus avatar */
                    <div className="text-center p-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-2xl shadow mb-1">
                        {p.avatar}
                      </div>
                      <div className="text-xs font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Chế độ học tập trung yên lặng</div>
                    </div>
                  )}

                  {/* Canvas Overlays */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-medium text-slate-200 border border-white/10">
                      {p.status}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 flex items-center gap-1 max-w-[85%]">
                    <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[9px] text-slate-300 border border-white/10 line-clamp-1">
                      🎯 {p.goal}
                    </span>
                  </div>

                  {p.isSpeaking && (
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/30 text-emerald-300 text-[9px] font-bold border border-emerald-400/40 animate-pulse">
                        🟢 Đang nói
                      </span>
                    </div>
                  )}
                </div>

                {/* Goal Completion Status */}
                {p.goalCompleted && (
                  <div className="mb-2 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">Đã hoàn thành xuất sắc mục tiêu! (+50 XP)</span>
                  </div>
                )}

                {/* 4-Item Interactive Fast Cheer Action Bar */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[9px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
                    <span>Gửi tương tác cổ vũ:</span>
                    <span className="text-pink-300 lowercase font-normal">+5 XP/lần</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => handleCheerParticipant(p, '☕', 'Tặng 1 ly cafe tỉnh táo')}
                      className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400/40 text-slate-200 flex flex-col sm:flex-row items-center justify-center gap-1 transition-all active:scale-95"
                      title="Tặng cafe"
                    >
                      <span className="text-sm">☕</span>
                      <span className="text-[9px] font-semibold">Cafe</span>
                    </button>
                    <button
                      onClick={() => handleCheerParticipant(p, '💖', 'Thả tim cổ vũ nhiệt tình')}
                      className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-pink-400/40 text-slate-200 flex flex-col sm:flex-row items-center justify-center gap-1 transition-all active:scale-95"
                      title="Thả tim"
                    >
                      <span className="text-sm">💖</span>
                      <span className="text-[9px] font-semibold">Tim</span>
                    </button>
                    <button
                      onClick={() => handleCheerParticipant(p, '👏', 'Đập tay cùng cố gắng')}
                      className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-emerald-400/40 text-slate-200 flex flex-col sm:flex-row items-center justify-center gap-1 transition-all active:scale-95"
                      title="Đập tay"
                    >
                      <span className="text-sm">👏</span>
                      <span className="text-[9px] font-semibold">Đập tay</span>
                    </button>
                    <button
                      onClick={() => handleCheerParticipant(p, '🔥', 'Cháy hết mình nốt tối nay')}
                      className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-orange-400/40 text-slate-200 flex flex-col sm:flex-row items-center justify-center gap-1 transition-all active:scale-95"
                      title="Tiếp sức"
                    >
                      <span className="text-sm">🔥</span>
                      <span className="text-[9px] font-semibold">Chiến</span>
                    </button>
                  </div>
                </div>
              </div>
            );

            // Conditional Layout Rendering
            if (viewLayout === 'grid') {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myDeskCard}
                  {filteredParticipants.map((p) => renderOtherParticipantTile(p))}
                </div>
              );
            }

            // Spotlight View: My desk full width + other participants subgrid
            return (
              <div className="flex flex-col gap-4">
                {myDeskCard}

                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#FF4D8D]" /> Bạn Học Cùng Phòng ({filteredParticipants.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {realUsers.length > 0
                        ? `🟢 Có ${realUsers.length} người thật đang online`
                        : 'Đang kết nối cùng các bạn'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {filteredParticipants.map((p) => renderOtherParticipantTile(p))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Column: Interactive Chat & Shared Sticky Notes Dock */}
        <div className="lg:col-span-4 flex flex-col h-[650px] rounded-2xl border border-white/15 bg-[#17132F]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Tabs: Live Chat vs Shared Notes */}
          <div className="flex border-b border-white/10 bg-black/20 p-1">
            <button
              onClick={() => setActiveSideTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeSideTab === 'chat'
                  ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Phòng Chat</span>
            </button>
            <button
              onClick={() => setActiveSideTab('notes')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeSideTab === 'notes'
                  ? 'bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>Bảng Ghi Chú ({stickyNotes.length})</span>
            </button>
          </div>

          {/* TAB 1: Chat Stream */}
          {activeSideTab === 'chat' ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-2.5 text-xs transition-all ${
                      msg.isGoalUpdate
                        ? 'bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/30'
                        : msg.senderId === 'me'
                        ? 'bg-[#6C4DFF]/25 border border-[#6C4DFF]/30 ml-4'
                        : 'bg-white/5 border border-white/10 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{msg.senderAvatar}</span>
                        <span className="text-[11px] text-pink-300">{msg.senderName}</span>
                      </div>
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Cheer Bar */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-[10px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Cổ vũ nhanh 1 chạm:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                  {QUICK_CHEERS.slice(0, 4).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQuickCheer(q)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-slate-300 whitespace-nowrap transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Gõ lời nhắn động viên phòng học..."
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#6C4DFF]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white hover:opacity-90 active:scale-95 transition-transform"
                    title="Gửi tin nhắn"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* TAB 2: Shared Sticky Notes Wall */
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
                <span className="text-xs font-semibold text-slate-300">Tường chia sẻ mẹo & lời chúc:</span>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#FF4D8D] text-white text-[11px] font-bold flex items-center gap-1 hover:opacity-95"
                >
                  <Plus className="w-3 h-3" /> Dán Note Mới
                </button>
              </div>

              {/* Sticky Notes Grid */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {stickyNotes.map((note) => {
                  const colorMap = {
                    yellow: 'bg-amber-400/20 border-amber-400/40 text-amber-200',
                    pink: 'bg-rose-400/20 border-rose-400/40 text-rose-200',
                    blue: 'bg-cyan-400/20 border-cyan-400/40 text-cyan-200',
                    green: 'bg-emerald-400/20 border-emerald-400/40 text-emerald-200',
                    purple: 'bg-purple-400/20 border-purple-400/40 text-purple-200',
                  };
                  return (
                    <div
                      key={note.id}
                      className={`p-3 rounded-xl border backdrop-blur-md transition-all ${colorMap[note.color]}`}
                    >
                      <p className="text-xs font-medium text-white mb-2 leading-relaxed">
                        "{note.content}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-300 border-t border-white/10 pt-1.5">
                        <span className="font-semibold">{note.author}</span>
                        <button
                          onClick={() => handleLikeStickyNote(note.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                        >
                          <Heart className="w-2.5 h-2.5 text-pink-400" />
                          <span>{note.likes}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Note Modal */}
              {showNoteModal && (
                <div className="mt-2 p-3 rounded-xl bg-black/60 border border-white/20">
                  <div className="text-xs font-bold text-white mb-1.5">Dán giấy nhớ lên tường phòng học:</div>
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Viết một mẹo học, một câu quote động lực hay lời chúc bạn bè..."
                    className="w-full bg-black/40 border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#FF4D8D]"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      {(['yellow', 'pink', 'blue', 'green', 'purple'] as SharedStickyNote['color'][]).map(
                        (col) => (
                          <button
                            key={col}
                            onClick={() => setNewNoteColor(col)}
                            className={`w-4 h-4 rounded-full border ${
                              newNoteColor === col ? 'ring-2 ring-white scale-110' : ''
                            } ${
                              col === 'yellow'
                                ? 'bg-amber-400'
                                : col === 'pink'
                                ? 'bg-rose-400'
                                : col === 'blue'
                                ? 'bg-cyan-400'
                                : col === 'green'
                                ? 'bg-emerald-400'
                                : 'bg-purple-400'
                            }`}
                          />
                        )
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setShowNoteModal(false)}
                        className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleAddStickyNote}
                        className="px-3 py-1 rounded bg-[#FF4D8D] text-white text-xs font-bold hover:opacity-95"
                      >
                        Dán ngay
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Reaction Dock at bottom */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline mr-1">
          Bắn cảm xúc:
        </span>
        {['☕', '🔥', '💡', '📚', '💖', '👏', '✨'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => triggerReaction(emoji)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-125 active:scale-95 text-lg flex items-center justify-center transition-transform"
            title={`Thả ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Device & Permission Diagnostics Modal */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#191433] border border-white/20 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#6C4DFF]/20 border border-[#6C4DFF]/40 flex items-center justify-center text-xl text-[#D8B4FE]">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Kiểm Tra & Cài Đặt Camera, Micro
                  </h3>
                  <p className="text-xs text-slate-300">
                    Chẩn đoán kết nối thiết bị & khắc phục khi không bật được Cam/Mic
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Live Hardware Status & Quick Test */}
            <div className="space-y-4 mb-5">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#FF4D8D]" /> Trạng Thái Camera (Webcam)
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    {isCamOn ? (
                      camMode === 'webcam' ? (
                        <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Webcam thật đang hoạt động
                        </span>
                      ) : (
                        <span className="text-pink-300 font-semibold flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5" />
                          Đang dùng Cam Ảo Aesthetic Lofi
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <VideoOff className="w-3.5 h-3.5" /> Đang tắt
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCamera(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Video className="w-3 h-3" /> Thử Bật Webcam
                    </button>
                    <button
                      onClick={() => {
                        setCamMode('virtual');
                        setIsCamOn(true);
                        setMediaError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#6C4DFF] hover:bg-[#5a38ea] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Palette className="w-3 h-3" /> Cam Ảo Lofi
                    </button>
                    {isCamOn && (
                      <button
                        onClick={() => toggleCamera(false)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs transition-colors"
                      >
                        Tắt
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Microphone Status & Real-time decibel meter */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-emerald-400" /> Trạng Thái Microphone & Âm Lượng
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    {isMicOn ? (
                      <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Micro đang mở (Thu âm trực tiếp)
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <MicOff className="w-3.5 h-3.5" /> Đang tắt
                      </span>
                    )}
                  </div>

                  <button
                    onClick={toggleMic}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isMicOn
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isMicOn ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isMicOn ? 'Tắt Micro' : 'Bật & Thử Micro'}</span>
                  </button>
                </div>

                {/* Live Mic Meter Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Đo tín hiệu giọng nói (Nói thử "Alo 1 2 3"):</span>
                    <span className="font-mono text-emerald-400 font-bold">{audioLevel}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/50 border border-white/10 overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-75 rounded-full ${
                        audioLevel > 50
                          ? 'bg-gradient-to-r from-emerald-400 to-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, audioLevel)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Step-by-Step Permission Troubleshooting */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#20183F] to-[#17132B] border border-white/10 space-y-3 mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Tại Sao Không Bật Được Cam / Mic?
              </h4>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Quyền trình duyệt bị chặn (Blocked):</strong> Hãy nhìn lên thanh địa chỉ (URL) trên cùng của trình duyệt, nhấp vào biểu tượng <strong>🔒 (ổ khóa)</strong> hoặc <strong>📹 / 🎙️</strong>, chuyển Camera và Micro sang <strong>"Cho phép (Allow)"</strong>, sau đó nhấn F5 tải lại trang.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <div>
                    <strong className="text-white">Đang xem trong khung nhúng (iframe preview):</strong> Trình duyệt chặn phần cứng camera/mic bên trong các khung nhúng sandbox để bảo mật. Hãy nhấn nút <strong>"Mở Tab Mới Độc Lập"</strong> bên dưới để mở toàn màn hình với 100% quyền truy cập.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <div>
                    <strong className="text-white">Không có Webcam hoặc đang dùng Zoom/Meet:</strong> Bạn có thể dùng <strong>Cam Ảo Aesthetic Lofi</strong> — tự động tạo avatar động thư thái với nhiều chủ đề (Cafe mưa, Nữ sinh Lofi, Thư viện) mà không cần webcam thật!
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mở Ở Tab Mới Độc Lập (Khuyên Dùng)</span>
              </a>

              <button
                onClick={() => setShowDeviceModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Đã Hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
