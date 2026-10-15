import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones,
  Maximize2,
  Minimize2,
  X,
  Flame,
  Moon,
  Sun,
  Radio,
  Sliders,
  GripVertical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface MusicTrack {
  id: string;
  category: 'chill' | 'focus' | 'healing';
  title: string;
  artist: string;
  tag: string;
  desc: string;
  url: string;
  durationText: string;
  synthType?: 'lofi' | 'alpha' | 'healing' | 'rain' | 'forest';
}

export const MUSIC_PLAYLIST: MusicTrack[] = [
  // --- NHẠC CHILL ---
  {
    id: 'chill-1',
    category: 'chill',
    title: 'Lofi Chill Sunset Beats',
    artist: 'UniLevelUp Lofi Studio',
    tag: 'Nhạc Chill Lofi',
    desc: 'Giai điệu Lofi êm dịu, nhịp trống nhẹ nhàng giúp thả lỏng tâm trí sau giờ học căng thẳng.',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    durationText: '02:30',
    synthType: 'lofi',
  },
  {
    id: 'chill-2',
    category: 'chill',
    title: 'Rainy Cafe Cozy Vibes',
    artist: 'Chillhop Beats',
    tag: 'Nhạc Chill Mưa Rơi',
    desc: 'Tiếng mưa rơi nhẹ bên khung cửa sổ quán cafe hoài niệm, ấm cúng và an yên.',
    url: 'https://actions.google.com/sounds/v1/weather/light_rain_wind_quiet.ogg',
    durationText: 'Vòng lặp êm dịu',
    synthType: 'rain',
  },
  {
    id: 'chill-3',
    category: 'chill',
    title: 'Midnight Starlight Lofi',
    artist: 'Astral Beats',
    tag: 'Nhạc Chill Đêm Sao',
    desc: 'Không gian lofi ngắm sao đêm, nhịp phách thư thái ru êm tâm hồn.',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    durationText: '02:00',
    synthType: 'lofi',
  },

  // --- NHẠC TẬP TRUNG HỌC BÀI ---
  {
    id: 'focus-1',
    category: 'focus',
    title: 'Deep Focus Alpha Waves 10Hz',
    artist: 'NeuroFlow Study',
    tag: 'Sóng Não Alpha 10Hz',
    desc: 'Sóng não Alpha tần số 10Hz kích hoạt trạng thái tập trung cao độ (Flow State) không xao nhãng.',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8bbf9304c.mp3?filename=deep-meditation-192828.mp3',
    durationText: '03:15',
    synthType: 'alpha',
  },
  {
    id: 'focus-2',
    category: 'focus',
    title: 'Gentle Piano Study Night',
    artist: 'Acoustic Focus',
    tag: 'Piano Tập Trung Sâu',
    desc: 'Tiếng đàn piano du dương, êm ái rèn luyện tư duy logic và ghi nhớ bài học lâu bền.',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77c30.mp3?filename=relaxing-piano-126207.mp3',
    durationText: '02:45',
    synthType: 'lofi',
  },
  {
    id: 'focus-3',
    category: 'focus',
    title: 'Binaural Focus Flow',
    artist: 'Cerebral Resonance',
    tag: 'Tần Số Não Bộ Flow State',
    desc: 'Âm thanh không lời đẳng cấp hỗ trợ giải bài tập Toán, Lập trình và viết luận văn.',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_349b291c94.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    durationText: '03:00',
    synthType: 'alpha',
  },

  // --- NHẠC HEALING ---
  {
    id: 'healing-1',
    category: 'healing',
    title: 'Healing 432Hz Golden Frequency',
    artist: 'Serenity Garden',
    tag: 'Tần Số Chữa Lành 432Hz',
    desc: 'Tần số tự nhiên 432Hz giải tỏa căng thẳng thần kinh, chữa lành và phục hồi năng lượng sống.',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c920f666b6.mp3?filename=meditation-bowl-singing-126226.mp3',
    durationText: '03:30',
    synthType: 'healing',
  },
  {
    id: 'healing-2',
    category: 'healing',
    title: 'Zen Forest River & Birds',
    artist: 'Earth Symphony',
    tag: 'Âm Thanh Rừng & Suối Nguồn',
    desc: 'Tiếng suối nguồn trong vắt róc rách giữa đại ngàn và tiếng chim hót bình yên.',
    url: 'https://actions.google.com/sounds/v1/water/water_stream_running.ogg',
    durationText: 'Âm thanh tự nhiên',
    synthType: 'forest',
  },
  {
    id: 'healing-3',
    category: 'healing',
    title: 'Tibetan Singing Bowls & Chimes',
    artist: 'Mindful Sanctuary',
    tag: 'Chuông Xoay Tây Tạng',
    desc: 'Chuông xoay Tây Tạng ngân vang thanh thoát, thanh lọc cảm xúc tiêu cực và âu lo thi cử.',
    url: 'https://actions.google.com/sounds/v1/weather/wind_chimes_light_breeze.ogg',
    durationText: 'Tĩnh tâm sâu',
    synthType: 'healing',
  },
];

export const GlobalMusicPlayer: React.FC = () => {
  const { theme, isGameFullscreen } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<'all' | 'chill' | 'focus' | 'healing'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  const filteredPlaylist = currentCategory === 'all'
    ? MUSIC_PLAYLIST
    : MUSIC_PLAYLIST.filter(t => t.category === currentCategory);

  const currentTrack = filteredPlaylist[currentIndex] || MUSIC_PLAYLIST[0];

  // Stop synthetic audio
  const stopSynth = () => {
    try {
      synthNodesRef.current.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {}
      });
      synthNodesRef.current = [];
    } catch {}
  };

  // Web Audio procedural synthesizer fallback / enhancement for seamless ambient sound
  const startSynth = (type: string, masterGainVal: number) => {
    try {
      stopSynth();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterGainVal * 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthNodesRef.current.push(masterGain);

      if (type === 'alpha' || type === 'focus') {
        // Binaural 10Hz Alpha beat (200Hz left, 210Hz right)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(200, ctx.currentTime);
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(210, ctx.currentTime);

        if (pannerL && pannerR) {
          pannerL.pan.setValueAtTime(-0.8, ctx.currentTime);
          pannerR.pan.setValueAtTime(0.8, ctx.currentTime);
          oscL.connect(pannerL);
          oscR.connect(pannerR);
          pannerL.connect(masterGain);
          pannerR.connect(masterGain);
        } else {
          oscL.connect(masterGain);
          oscR.connect(masterGain);
        }

        oscL.start();
        oscR.start();
        synthNodesRef.current.push(oscL, oscR);
      } else if (type === 'healing') {
        // 432Hz Pure Harmonic Chords
        [432, 216, 648].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.3 / (i + 1), ctx.currentTime);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          synthNodesRef.current.push(osc, gain);
        });
      } else {
        // Warm Lofi Chord Drone (Major 7th warm chord)
        [261.63, 329.63, 392.00, 493.88].forEach((freq) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
          synthNodesRef.current.push(osc, filter);
        });
      }
    } catch (e) {
      console.warn('Synth error:', e);
    }
  };

  // Play track
  const playTrack = async (track: MusicTrack) => {
    setAudioError(false);
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = track.url;
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;

    try {
      await audio.play();
      setIsPlaying(true);
      stopSynth();
    } catch (err) {
      console.warn('Audio stream failed, engaging ambient sound generator fallback:', err);
      // Fallback to high-quality ambient synth so the user always has continuous audio!
      startSynth(track.synthType || 'lofi', isMuted ? 0 : volume);
      setIsPlaying(true);
      setAudioError(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSynth();
      setIsPlaying(false);
    } else {
      playTrack(currentTrack);
    }
  };

  const nextTrack = () => {
    const nextIdx = (currentIndex + 1) % filteredPlaylist.length;
    setCurrentIndex(nextIdx);
    if (isPlaying) {
      playTrack(filteredPlaylist[nextIdx]);
    }
  };

  const prevTrack = () => {
    const prevIdx = (currentIndex - 1 + filteredPlaylist.length) % filteredPlaylist.length;
    setCurrentIndex(prevIdx);
    if (isPlaying) {
      playTrack(filteredPlaylist[prevIdx]);
    }
  };

  const handleSelectTrack = (track: MusicTrack, idx: number) => {
    setCurrentIndex(idx);
    playTrack(track);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (synthNodesRef.current.length > 0 && synthNodesRef.current[0].gain) {
      synthNodesRef.current[0].gain.setValueAtTime(newVol * 0.25, 0);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
    if (synthNodesRef.current.length > 0 && synthNodesRef.current[0].gain) {
      synthNodesRef.current[0].gain.setValueAtTime(nextMuted ? 0 : volume * 0.25, 0);
    }
  };

  // Draggable floating bar state
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem('unilevelup_music_bar_pos');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const isDraggingBarRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const barContainerRef = useRef<HTMLDivElement | null>(null);

  const handleBarPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const rect = barContainerRef.current?.getBoundingClientRect();
    const currentX = rect ? rect.left : 20;
    const currentY = rect ? rect.top : (window.innerHeight - 70);

    isDraggingBarRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = ev.clientX - dragStartRef.current.startX;
      const dy = ev.clientY - dragStartRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        isDraggingBarRef.current = true;
      }
      const elWidth = barContainerRef.current?.offsetWidth || 260;
      const elHeight = barContainerRef.current?.offsetHeight || 44;
      const newX = Math.max(10, Math.min(window.innerWidth - elWidth - 10, dragStartRef.current.initX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - elHeight - 10, dragStartRef.current.initY + dy));
      setPlayerPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (barContainerRef.current) {
        const rect = barContainerRef.current.getBoundingClientRect();
        try {
          localStorage.setItem('unilevelup_music_bar_pos', JSON.stringify({ x: rect.left, y: rect.top }));
        } catch {
          // ignore
        }
      }
      setTimeout(() => {
        isDraggingBarRef.current = false;
      }, 60);
      dragStartRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Clean up
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-music-player', handleOpen);
    return () => {
      window.removeEventListener('open-music-player', handleOpen);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopSynth();
    };
  }, []);

  // When game is in fullscreen, hide music overlay to avoid blocking gameplay
  if (isGameFullscreen) return null;

  return (
    <>
      {/* Floating Mini Music Bar Pill (Draggable anywhere on screen) */}
      <div
        ref={barContainerRef}
        style={playerPos ? { left: `${playerPos.x}px`, top: `${playerPos.y}px`, bottom: 'auto', right: 'auto' } : undefined}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 select-none touch-none"
      >
        {/* Drag handle button */}
        <div
          onPointerDown={handleBarPointerDown}
          className="p-2 rounded-full bg-slate-900/90 hover:bg-slate-900 backdrop-blur-xl border border-white/20 text-slate-300 hover:text-white cursor-grab active:cursor-grabbing transition-all shadow-xl"
          title="Nhấn giữ và kéo để di chuyển thanh phát nhạc"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <button
          onClick={() => {
            if (!isDraggingBarRef.current) {
              setIsOpen(!isOpen);
            }
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl border text-xs font-bold shadow-xl transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white border-pink-400/50 shadow-pink-500/25 animate-pulse'
              : theme === 'light'
              ? 'bg-white/90 hover:bg-white text-slate-800 border-slate-200 shadow-md'
              : 'bg-[#0E1B38]/90 hover:bg-[#0E1B38] text-slate-200 border-sky-400/30'
          }`}
          title="Mở bảng điều khiển Nhạc Chill & Healing"
        >
          <Headphones className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-amber-300' : 'text-sky-400'}`} />
          <span className="truncate max-w-[130px] sm:max-w-[190px]">
            {isPlaying ? currentTrack.title : 'Nhạc Chill & Healing'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
        </button>

        {/* Quick Play/Pause Button next to pill */}
        <button
          onClick={togglePlay}
          className={`p-2 rounded-full backdrop-blur-xl border text-xs shadow-xl transition-all cursor-pointer ${
            isPlaying
              ? 'bg-emerald-500/80 hover:bg-emerald-500 text-white border-emerald-300'
              : theme === 'light'
              ? 'bg-white/90 hover:bg-white text-slate-700 border-slate-200'
              : 'bg-[#0E1B38]/90 hover:bg-[#0E1B38] text-slate-300 border-white/15'
          }`}
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc ngay'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>
      </div>

      {/* Full Music Studio Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 relative overflow-hidden transition-all duration-300 ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#0F172A]/95 border-sky-400/30 text-white'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                    <span>UniLevelUp Sound Studio</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Nhạc Chill · Nhạc Tập Trung Học Bài · Nhạc Healing Phục Hồi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Đóng bảng nhạc (nhạc vẫn tiếp tục phát trong nền)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Playing Track Banner */}
            <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {currentTrack.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Radio className={`w-3 h-3 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                  {currentTrack.durationText}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black tracking-tight">{currentTrack.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{currentTrack.artist}</p>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed opacity-90">
                  {currentTrack.desc}
                </p>
              </div>

              {/* Player Controls (Back, Play, Next, Volume) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevTrack}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                    title="Bài trước"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-2xl bg-gradient-to-r from-[#6C4DFF] to-[#FF4D8D] text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
                    title={isPlaying ? 'Tạm dừng' : 'Phát'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                    title="Bài tiếp theo"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white transition-colors"
                    title={isMuted ? 'Bật âm' : 'Tắt âm'}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-24 accent-pink-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-400 w-8">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 mb-3 relative z-10 overflow-x-auto pb-1 scrollbar-none">
              {[
                { key: 'all' as const, label: 'Tất Cả (9)' },
                { key: 'chill' as const, label: 'Nhạc Chill Lofi' },
                { key: 'focus' as const, label: 'Tập Trung Học Bài' },
                { key: 'healing' as const, label: 'Healing Tĩnh Tâm' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setCurrentCategory(cat.key);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    currentCategory === cat.key
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Track List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 relative z-10">
              {filteredPlaylist.map((track, idx) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track, idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400/50 text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected && isPlaying ? 'bg-pink-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                        {isSelected && isPlaying ? <Play className="w-3 h-3 fill-current" /> : <Music className="w-3 h-3" />}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span>{track.title}</span>
                          {isSelected && isPlaying && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{track.artist}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">{track.durationText}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Âm nhạc hỗ trợ kích hoạt trạng thái tập trung sâu (Flow State) và học bài hiệu quả hơn.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
