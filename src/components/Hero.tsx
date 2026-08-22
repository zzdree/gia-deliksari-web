'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Calendar, ArrowRight, HeartHandshake, Clock } from 'lucide-react';
import { YouTubeIcon } from './Icons';

export default function Hero() {
  const gmapsShareUrl =
    process.env.NEXT_PUBLIC_GMAPS_SHARE_URL || 'https://share.google/O7HqL1J615kgxt66v';

  // Dynamic countdown to next Sunday 09:00 WIB
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      // Target: Next Sunday at 09:00:00 (local time)
      const target = new Date(now);
      const currentDay = now.getDay(); // 0 = Sunday
      let daysUntilSunday = (7 - currentDay) % 7;
      
      // If today is Sunday and past 11:00, target next Sunday
      if (currentDay === 0 && (now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() > 0))) {
        daysUntilSunday = 7;
      }

      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(9, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="beranda" className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Next Service Countdown Floating Pill */}
        <div className="mb-8 flex justify-center lg:justify-start">
          <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-amber-500/30 shadow-md text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span>Ibadah Raya Minggu:</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono font-black text-slate-900 dark:text-white">
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">{timeLeft.days}h</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">{timeLeft.hours}j</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">{timeLeft.minutes}m</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">{timeLeft.seconds}d</span>
            </div>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull; Pkl 09.00 WIB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>GIA DELIKSARI SEMARANG &bull; GROWING CHURCH! 🔥</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Gereja yang <span className="text-amber-600 dark:text-amber-400">Bertumbuh</span> & Memberkati Kota Semarang
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Selamat datang di rumah Tuhan! Wadah persekutuan yang hangat, hidup, dan melayani generasi dari anak-anak, pemuda, kaum wanita, hingga seluruh keluarga jemaat.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#kunjungan"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Rencanakan Kunjungan</span>
              </a>

              <a
                href="#warta"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-all duration-200"
              >
                <span>Lihat Warta</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://www.youtube.com/@GIADeliksariSemarang"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-sm font-semibold transition-colors"
                title="Tonton Live / Rekaman Ibadah di YouTube"
              >
                <YouTubeIcon className="w-5 h-5" />
                <span>YouTube Live</span>
              </a>
            </div>

            {/* Micro Stats Strip */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-slate-800 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">4+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kategori Ibadah</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kasih & Firman</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Semarang</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Deliksari Gunungpati</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Background gradient decorative frame */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-amber-500/30 to-indigo-500/20 blur-xl opacity-70 dark:opacity-40" />

              {/* Main Church Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200/80 dark:border-slate-700 bg-slate-900 shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/hero-church.jpg"
                  alt="Gedung & Ibadah GIA Deliksari Semarang"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top-Right Badge: Live Onsite */}
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300">Live Onsite</span>
                </div>

                {/* Bottom-Right Badge: Ibadah Raya */}
                <div className="absolute bottom-4 right-4 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white text-right shadow-lg">
                  <p className="text-[11px] font-semibold text-amber-400">Ibadah Raya Minggu</p>
                  <p className="text-xs sm:text-sm font-bold text-white">09.00 - 11.00 WIB</p>
                </div>
              </div>

              {/* Decorative floating card positioned at bottom-left without overlapping */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl items-center gap-3.5 z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xl shadow-inner">
                  ✝
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">4 Komunitas Ibadah</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">General • Youth • Kidz • Hana</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
