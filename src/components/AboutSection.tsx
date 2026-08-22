import React from 'react';
import Image from 'next/image';
import { BookOpen, Heart, Users2, Sparkles } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function AboutSection() {
  return (
    <section id="tentang" className="py-20 bg-slate-100/60 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mengenal Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tentang GIA Deliksari & Gembala Sidang
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Sebuah komunitas iman yang rindu menjadi garam dan terang di tengah Kota Semarang, membimbing setiap jemaat bertumbuh secara utuh di dalam Kristus.
          </p>
        </div>

        {/* Pastor Card & Church Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Senior Pastor Profile Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-8 space-y-6">
              <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-900">
                <Image
                  src="/images/pastor-yohanes.jpg"
                  alt="Ps. Yohanes Sutono - Gembala Sidang GIA Deliksari"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wide">
                  Senior Pastor / Gembala Sidang
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Ps. Yohanes Sutono
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Melayani dengan kasih dan dedikasi untuk penggembalaan jemaat GIA Deliksari Semarang.
                </p>

                <div className="pt-3 flex justify-center">
                  <a
                    href="https://www.instagram.com/ps.yohanessutono/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-500" />
                    <span>@ps.yohanessutono</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Church Vision & Core Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">Visi Gereja</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                Menjadi jemaat yang berakar kuat dalam kebenaran Firman Allah, bertumbuh dalam persekutuan kasih persaudaraan yang erat, dan berbuah nyata memberkati lingkungan sekitar dengan kuasa Injil.
              </p>
            </div>

            {/* 3 Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white">Kasih & Penerimaan</h5>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Menyambut setiap jiwa apa adanya dengan ketulusan dan kehangatan keluarga Allah.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Users2 className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white">Pemuridan Generasi</h5>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Menjangkau anak-anak, pemuda, dan orang tua untuk bersama-sama melayani Tuhan.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
