import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Sparkles, Wind, Moon } from 'lucide-react';
import starryMeadowImage from '../../assets/images/starry_meadow_night_1791709466553.jpg';
import { useApp } from '../../context/AppContext';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayDist: number;
  swayOffset: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  active: boolean;
}

interface TwinkleStar {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
}

export const ChillStarryBackground: React.FC = () => {
  const { isGameFullscreen } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [soundPlaying, setSoundPlaying] = useState(false);
  const [bgVisible, setBgVisible] = useState(true);
  const [dimLevel, setDimLevel] = useState<'normal' | 'soft' | 'deep'>('normal');
  const [showControls, setShowControls] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Setup animated canvas for floating dandelion petals, twinkling stars, and shooting stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // Dandelion petals / glowing seeds
    const petals: Petal[] = [];
    const petalCount = 38;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3.5 + 2,
        speedY: -(Math.random() * 0.45 + 0.25), // floating upward
        speedX: Math.random() * 0.4 + 0.1, // drifting slightly right with breeze
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayDist: Math.random() * 25 + 10,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.6 + 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Twinkling stars
    const stars: TwinkleStar[] = [];
    const initStars = () => {
      stars.length = 0;
      const count = Math.floor((width * height) / 12000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.6), // mostly in upper sky
          radius: Math.random() * 1.5 + 0.5,
          baseAlpha: Math.random() * 0.5 + 0.3,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };
    initStars();

    // Occasional shooting star
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      opacity: 0,
      angle: Math.PI / 4,
      active: false,
    };

    let shootingTimer = 0;

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Render twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.alpha += s.twinkleSpeed;
        const currentAlpha = s.baseAlpha + Math.sin(s.alpha) * 0.35;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, Math.min(0.9, currentAlpha))})`;
        ctx.shadowColor = 'rgba(186, 230, 253, 0.8)';
        ctx.shadowBlur = s.radius * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Shooting star trigger
      shootingTimer++;
      if (shootingTimer > 280 && !shootingStar.active && Math.random() < 0.02) {
        shootingStar = {
          x: Math.random() * (width * 0.7),
          y: Math.random() * (height * 0.35),
          length: Math.random() * 90 + 70,
          speed: Math.random() * 10 + 14,
          opacity: 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          active: true,
        };
        shootingTimer = 0;
      }

      // Draw active shooting star
      if (shootingStar.active) {
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(224, 242, 254, ${shootingStar.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(shootingStar.x, shootingStar.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        }
      }

      // Render dandelion petals & floating luminous seeds
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.swayOffset += p.swaySpeed;
        const currentX = p.x + Math.sin(p.swayOffset) * p.swayDist + p.speedX;
        p.rotation += p.rotSpeed;

        // Reset if went above screen
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(currentX, p.y);
        ctx.rotate(p.rotation);

        // Draw soft glowing dandelion seed / petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.9, p.size * 2.2, Math.PI / 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.85})`;
        ctx.shadowColor = 'rgba(224, 242, 254, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fill();

        // Small bright core
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${p.opacity * 0.9})`;
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Audio tone generator for ambient chill meadow night sound (soft natural white noise / meadow breeze)
  const toggleSound = () => {
    if (soundPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setSoundPlaying(false);
    } else {
      try {
        if (!audioRef.current) {
          // Relaxing ambient lofi night meadow sound
          const audio = new Audio(
            'https://actions.google.com/sounds/v1/weather/light_rain_wind_quiet.ogg'
          );
          audio.loop = true;
          audio.volume = 0.25;
          audioRef.current = audio;
        }
        audioRef.current.play().then(() => {
          setSoundPlaying(true);
        }).catch(() => {
          setSoundPlaying(false);
        });
      } catch {
        setSoundPlaying(false);
      }
    }
  };

  const getOverlayOpacity = () => {
    switch (dimLevel) {
      case 'soft':
        return 'bg-[#0B132B]/60';
      case 'deep':
        return 'bg-[#0B132B]/85';
      case 'normal':
      default:
        return 'bg-[#0B132B]/45';
    }
  };

  return (
    <>
      {/* Background Container (Video + Fallback Artwork + Animated Canvas) */}
      <div
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 overflow-hidden ${
          bgVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Looping Ambient Video */}
        <video
          ref={videoRef}
          src="/videos/starry-night-meadow.mp4"
          poster={starryMeadowImage}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover select-none scale-100 sm:scale-105 filter brightness-95 contrast-105 transition-transform duration-1000"
        />

        {/* High-res Image Fallback if video takes a moment */}
        {!videoLoaded && (
          <img
            src={starryMeadowImage}
            alt="Đêm Thảo Nguyên Sao Băng"
            className="absolute inset-0 w-full h-full object-cover select-none"
          />
        )}

        {/* Ambient Dark Gradient & Soft Vignette so content stays crisp and legible and spreads evenly across all edges */}
        <div
          className={`absolute inset-0 backdrop-blur-[1.5px] transition-colors duration-500 ${getOverlayOpacity()}`}
        />
        {/* Vertical gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/95 via-transparent to-[#0B132B]/65" />
        {/* Horizontal gradient to spread evenly on ultra-wide / desktop displays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/40 via-transparent to-[#0B132B]/40" />

        {/* Canvas for dynamic animated stars, floating petals & meteors */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Subtle page border highlight framing */}
        <div className="absolute inset-0 border border-sky-400/10 pointer-events-none" />
      </div>

      {/* Floating Chill Mood Pill (Bottom-Right, unobtrusive & aesthetic) */}
      {!isGameFullscreen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 select-none">
          {showControls && (
            <div className="flex items-center gap-2 bg-[#0e1b38]/85 backdrop-blur-xl border border-sky-400/20 px-3 py-1.5 rounded-full shadow-2xl text-xs text-slate-200 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Dim toggle */}
              <button
                onClick={() => {
                  setDimLevel((prev) =>
                    prev === 'normal' ? 'soft' : prev === 'soft' ? 'deep' : 'normal'
                  );
                }}
                title="Độ tối nền"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-sky-200 transition-colors"
              >
                <Moon className="w-3 h-3 text-sky-300" />
                <span>
                  {dimLevel === 'normal' ? 'Tự nhiên' : dimLevel === 'soft' ? 'Dịu mắt' : 'Đêm sâu'}
                </span>
              </button>

              {/* Ambient sound toggle */}
              <button
                onClick={toggleSound}
                title={soundPlaying ? 'Tắt âm gió đêm' : 'Bật âm gió đêm chill'}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  soundPlaying
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {soundPlaying ? (
                  <>
                    <Volume2 className="w-3 h-3 animate-pulse text-emerald-400" />
                    <span>Gió đêm 🍃</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>Âm thanh</span>
                  </>
                )}
              </button>

              {/* Visibility toggle */}
              <button
                onClick={() => setBgVisible(!bgVisible)}
                title={bgVisible ? 'Ẩn video nền' : 'Hiện video nền'}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                {bgVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          )}

          <button
            onClick={() => setShowControls(!showControls)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border text-xs font-semibold shadow-xl transition-all duration-300 ${
              showControls
                ? 'bg-sky-500/30 border-sky-400/50 text-sky-200 shadow-sky-500/20'
                : 'bg-[#0E1B38]/80 hover:bg-[#0E1B38] border-white/15 text-slate-300 hover:text-white hover:border-sky-400/40'
            }`}
            title="Tùy chỉnh không gian nền video chill"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin-slow" />
            <span className="hidden sm:inline">Không Gian Chill</span>
            <Wind className="w-3 h-3 text-emerald-300" />
          </button>
        </div>
      )}
    </>
  );
};
