'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Heart, 
  Users, 
  Sparkles,
  Play
} from 'lucide-react';
import { YouTubeIcon } from './Icons';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const nextSunday = new Date();
      
      const currentDay = now.getDay();
      const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;
      
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(9, 0, 0, 0);

      if (currentDay === 0 && now.getTime() > nextSunday.getTime()) {
        nextSunday.setDate(nextSunday.getDate() + 7);
      }

      const diff = nextSunday.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="beranda" className="relative pt-8 pb-20 sm:pt-14 sm:pb-28 overflow-hidden bg-[#FDFBF7] dark:bg-[#150B0D] transition-colors">
      {/* Subtle Warm Crimson Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5222E]/8 dark:bg-[#C5222E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#80141C]/6 dark:bg-[#80141C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Countdown Pill Banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm text-xs font-semibold text-[#5A4D4E] dark:text-[#D5C2C4]">
            <span className="flex items-center gap-1.5 text-[#C5222E] dark:text-[#E03643] font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ibadah Raya Berikutnya (Minggu 09.00 WIB):</span>
            </span>
            <span className="font-mono font-extrabold text-[#1F1617] dark:text-white bg-[#FDF0F0] dark:bg-[#331418] px-2.5 py-0.5 rounded-lg border border-[#F5CDD0] dark:border-[#521E25]">
              {timeLeft.days}h {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}d
            </span>
          </div>
        </div>

        {/* Hero Grid: Editorial Asymmetric Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Vision & Action */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gereja Isa Almasih Deliksari Semarang</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] leading-[1.12] tracking-tight">
              Rumah Kasih, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5222E] via-[#A81722] to-[#80141C]">
                Pertumbuhan Rohani
              </span>{' '}
              & Pengharapan
            </h1>

            {/* Subtitle / Church Spirit */}
            <p className="text-base sm:text-lg text-[#5A4D4E] dark:text-[#D5C2C4] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Selamat datang di persekutuan jemaat yang berakar kuat dalam firman Tuhan, saling mengasihi, dan membimbing setiap generasi untuk bertumbuh dan berdampak nyata bagi sesama.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#kunjungan"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#C5222E] via-[#A81722] to-[#80141C] hover:opacity-95 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-md shadow-red-950/20 flex items-center justify-center gap-2.5 transition-all"
              >
                <span>Rencanakan Kunjungan & Hadir Onsite</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#jadwal"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-[#221215] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] font-bold text-sm sm:text-base border border-[#EBDDCF] dark:border-[#3A1C20] flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Calendar className="w-4 h-4 text-[#C5222E] dark:text-[#E03643]" />
                <span>Lihat Jadwal Ibadah</span>
              </a>

              <a
                href="https://www.youtube.com/@GIADeliksariSemarang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-4 rounded-2xl text-xs font-bold text-[#5A4D4E] dark:text-[#D5C2C4] hover:text-[#C5222E] dark:hover:text-[#E03643] flex items-center justify-center gap-2 transition-colors"
              >
                <YouTubeIcon className="w-4 h-4 text-[#C5222E]" />
                <span>Streaming YouTube</span>
              </a>
            </div>

            {/* 3 Quick Micro Stats */}
            <div className="pt-6 border-t border-[#EBDDCF]/80 dark:border-[#3A1C20]/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-extrabold text-[#1F1617] dark:text-white font-mono">4</span>
                <p className="text-[11px] sm:text-xs font-semibold text-[#6E5D5F] dark:text-[#B5A1A3]">Komunitas Ibadah</p>
              </div>
              <div className="space-y-1 border-x border-[#EBDDCF] dark:border-[#3A1C20] px-2 sm:px-4">
                <span className="text-xl sm:text-2xl font-extrabold text-[#C5222E] dark:text-[#E03643] font-mono">09.00</span>
                <p className="text-[11px] sm:text-xs font-semibold text-[#6E5D5F] dark:text-[#B5A1A3]">WIB Ibadah Minggu</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-extrabold text-[#1F1617] dark:text-white font-mono">100%</span>
                <p className="text-[11px] sm:text-xs font-semibold text-[#6E5D5F] dark:text-[#B5A1A3]">Kasih & Sambutan</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Container */}
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-white dark:border-[#3A1C20] shadow-xl bg-[#F7F2E8] dark:bg-[#221215]">
                <Image
                  src="/images/hero-church.jpg"
                  alt="Gereja Isa Almasih Deliksari Semarang"
                  fill
                  priority
                  className="object-cover"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#150B0D]/80 via-transparent to-transparent" />

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5222E]/80 backdrop-blur-md text-[11px] font-bold border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ibadah Onsite & Persekutuan</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    Jl. Kolonel Hadijanto, Deliksari, Gunungpati, Semarang
                  </h3>
                </div>
              </div>

              {/* Floating Cross Pastoral Card */}
              <div className="absolute -bottom-5 -left-5 sm:-bottom-6 sm:-left-6 p-4 sm:p-5 rounded-[1.75rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-lg flex items-center gap-3.5 max-w-[260px]">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C5222E] to-[#80141C] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                  ✝
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#1F1617] dark:text-[#F5EFEB] block">
                    GIA Deliksari
                  </span>
                  <span className="text-[11px] font-medium text-[#6E5D5F] dark:text-[#B5A1A3]">
                    Growing Church! 🔥
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
