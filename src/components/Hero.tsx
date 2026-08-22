'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, ArrowRight, HeartHandshake, Clock, Sparkles } from 'lucide-react';
import { YouTubeIcon } from './Icons';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      const target = new Date(now);
      const currentDay = now.getDay();
      let daysUntilSunday = (7 - currentDay) % 7;
      
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
    <section id="beranda" className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 transition-colors">
      {/* Organic Scandinavian Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#44634D]/8 dark:bg-[#44634D]/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-[#C27338]/8 dark:bg-[#C27338]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Next Sunday Service Countdown Pill */}
        <div className="mb-8 flex justify-center lg:justify-start">
          <div className="inline-flex flex-wrap items-center gap-2.5 sm:gap-3 px-4 py-2 rounded-2xl bg-white/90 dark:bg-[#1B201D]/90 backdrop-blur-md border border-[#E4DCD0] dark:border-[#2C332E] shadow-sm text-[#3D4741] dark:text-[#C5CDC7] text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 font-bold text-[#44634D] dark:text-[#7EA88A]">
              <Clock className="w-4 h-4" />
              <span>Ibadah Raya Minggu:</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-[#1E2320] dark:text-white">
              <span className="px-2 py-0.5 rounded-lg bg-[#EBF1EC] dark:bg-[#253128] text-[#334D3A] dark:text-[#8EB799]">{timeLeft.days}h</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded-lg bg-[#EBF1EC] dark:bg-[#253128] text-[#334D3A] dark:text-[#8EB799]">{timeLeft.hours}j</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded-lg bg-[#EBF1EC] dark:bg-[#253128] text-[#334D3A] dark:text-[#8EB799]">{timeLeft.minutes}m</span>
              <span>:</span>
              <span className="px-2 py-0.5 rounded-lg bg-[#EBF1EC] dark:bg-[#253128] text-[#334D3A] dark:text-[#8EB799]">{timeLeft.seconds}d</span>
            </div>
            <span className="text-[#7A877E] dark:text-[#86948B] text-xs hidden sm:inline">&bull; 09.00 WIB Onsite</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Hero Typography & Actions */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAEEE5] dark:bg-[#2A201A] border border-[#ECD1C0] dark:border-[#4A3427] text-[#9E5522] dark:text-[#E8A576] text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GIA DELIKSARI SEMARANG &bull; GROWING CHURCH! 🔥</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E2320] dark:text-[#EDEAE4] leading-[1.12]">
              Rumah Kasih, <br className="hidden sm:inline" />
              <span className="text-[#44634D] dark:text-[#7EA88A]">Pertumbuhan Rohani</span> & Pengharapan
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-[#5F6B63] dark:text-[#9DAAA0] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Selamat datang di persekutuan jemaat yang hangat dan inklusif. Wadah bertumbuh dalam kebenaran Firman Allah bagi seluruh keluarga generasi di Kota Semarang.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#kunjungan"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#44634D] hover:bg-[#36503E] text-white font-bold text-sm sm:text-base shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Rencanakan Kunjungan</span>
              </a>

              <a
                href="#warta"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#1B201D] hover:bg-[#F2ECE4] dark:hover:bg-[#252C27] text-[#2D3630] dark:text-[#EDEAE4] font-bold text-sm sm:text-base border border-[#DDD5C9] dark:border-[#323B35] transition-all duration-200"
              >
                <span>Warta Jemaat</span>
                <ArrowRight className="w-4 h-4 text-[#7A877E]" />
              </a>

              <a
                href="https://www.youtube.com/@GIADeliksariSemarang"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl text-[#C27338] dark:text-[#D9894E] hover:bg-[#FAEEE5] dark:hover:bg-[#2A201A] text-sm font-semibold transition-colors"
                title="Tonton Live / Rekaman Ibadah di YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
                <span>YouTube Live</span>
              </a>
            </div>

            {/* Minimalist Micro Stats Strip */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-[#EAE3D8] dark:border-[#262D28] max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1E2320] dark:text-white">4+</p>
                <p className="text-xs text-[#6B7870] dark:text-[#8E9B92] font-medium mt-0.5">Komunitas Ibadah</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#44634D] dark:text-[#7EA88A]">100%</p>
                <p className="text-xs text-[#6B7870] dark:text-[#8E9B92] font-medium mt-0.5">Kasih & Firman</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#C27338] dark:text-[#D9894E]">Semarang</p>
                <p className="text-xs text-[#6B7870] dark:text-[#8E9B92] font-medium mt-0.5">Deliksari Gunungpati</p>
              </div>
            </div>
          </div>

          {/* Right Column: Organic Sanctuary Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Soft Linen Shadow Backdrop */}
              <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-[#44634D]/15 to-[#C27338]/15 blur-xl opacity-60 dark:opacity-30" />

              {/* Main Church Image Container */}
              <div className="relative rounded-[2rem] overflow-hidden border border-[#E0D7C9] dark:border-[#2F3731] bg-[#1B201D] shadow-lg aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/hero-church.jpg"
                  alt="Gedung & Ibadah GIA Deliksari Semarang"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141715]/80 via-transparent to-transparent" />

                {/* Top-Right Badge: Live Onsite */}
                <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#141715]/85 backdrop-blur-md border border-white/15 text-white flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#44634D] animate-pulse" />
                  <span className="text-xs font-bold text-[#A8CEB3]">Live Onsite</span>
                </div>

                {/* Bottom-Right Badge: Schedule */}
                <div className="absolute bottom-4 right-4 p-3.5 rounded-2xl bg-[#141715]/90 backdrop-blur-md border border-white/15 text-white text-right shadow-sm">
                  <p className="text-[11px] font-semibold text-[#D9894E]">Ibadah Raya Minggu</p>
                  <p className="text-xs sm:text-sm font-bold text-white">09.00 - 11.00 WIB</p>
                </div>
              </div>

              {/* Floating Pill without overlap */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1B201D] border border-[#E0D7C9] dark:border-[#2F3731] shadow-md items-center gap-3.5 z-10">
                <div className="w-10 h-10 rounded-xl bg-[#EBF1EC] dark:bg-[#253128] text-[#44634D] dark:text-[#7EA88A] flex items-center justify-center font-bold text-lg">
                  ✝
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#1E2320] dark:text-white">4 Komunitas Ibadah</p>
                  <p className="text-[11px] text-[#6B7870] dark:text-[#8E9B92] font-medium">General • Youth • Kidz • Hana</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
