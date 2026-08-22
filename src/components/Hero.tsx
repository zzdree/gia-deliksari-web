import React from 'react';
import Image from 'next/image';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { YouTubeIcon } from './Icons';

export default function Hero() {
  const gmapsShareUrl =
    process.env.NEXT_PUBLIC_GMAPS_SHARE_URL || 'https://share.google/O7HqL1J615kgxt66v';

  return (
    <section id="beranda" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 transition-colors">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#warta"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Lihat Warta Terkini</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={gmapsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-all duration-200"
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Petunjuk Lokasi</span>
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

                {/* Floating pill badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-400">Ibadah Raya Minggu</p>
                    <p className="text-sm font-bold">Pkl 07.00 WIB &bull; DS Worship</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Onsite
                  </span>
                </div>
              </div>

              {/* Decorative floating card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                  ✝
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">4 Komunitas Ibadah</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">General, Youth, Kidz, Hana</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
