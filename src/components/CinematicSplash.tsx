import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Sparkles } from 'lucide-react';

interface CinematicSplashProps {
  onComplete: () => void;
  message?: string;
}

export const CinematicSplash: React.FC<CinematicSplashProps> = ({
  onComplete,
  message = "SOUTH AFRICA'S TOWNSHIP REWARDS NETWORK"
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 4-second total splash lifecycle
    const duration = 4000;
    const intervalTime = 40;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, intervalTime);

    // GSAP animations for logo and text
    gsap.fromTo(
      '#splash-logo',
      { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
    );

    gsap.fromTo(
      '#splash-title',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, delay: 0.4, ease: 'power2.out' }
    );

    // Fade out at 3.4s, finish at 4s
    const fadeTimeout = setTimeout(() => {
      gsap.to('#splash-screen-root', {
        opacity: 0,
        scale: 1.05,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        }
      });
    }, 3400);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimeout);
    };
  }, [onComplete]);

  return (
    <div
      id="splash-screen-root"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-70 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      {/* Center Cinematic Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Logo Container with glowing border */}
        <div
          id="splash-logo"
          className="relative p-2 rounded-2xl bg-gradient-to-tr from-cyan-500/40 via-purple-500/30 to-blue-600/40 shadow-[0_0_50px_rgba(14,165,233,0.35)] backdrop-blur-xl mb-6"
        >
          <img
            src="/pcg-rewards-logo.jpg"
            alt="PCG REWARDS Logo"
            className="w-28 h-28 object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Brand Headline */}
        <div id="splash-title" className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Official Member Network
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-300 via-white to-purple-300 bg-clip-text text-transparent">
            PCG REWARDS
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
            {message}
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="w-64 mt-8 space-y-2">
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span>Loading Experience</span>
            <span className="font-mono text-cyan-400">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Skip button for user control */}
        <button
          onClick={onComplete}
          className="mt-6 text-xs text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          Skip Intro
        </button>
      </div>

      {/* Reg footnote */}
      <div className="absolute bottom-4 text-[10px] text-slate-400 tracking-wider">
        K2023135962 (SOUTH AFRICA) • REG: 2023/135962/07
      </div>
    </div>
  );
};
