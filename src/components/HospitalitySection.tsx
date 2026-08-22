import React from 'react';
import { MapPin, Smile, Music, Users, ArrowRight, HeartHandshake, Compass } from 'lucide-react';
import { WhatsAppIcon } from './Icons';

export default function HospitalitySection() {
  const gmapsShareUrl =
    process.env.NEXT_PUBLIC_GMAPS_SHARE_URL || 'https://share.google/O7HqL1J615kgxt66v';

  const hospitalityGuides = [
    {
      icon: MapPin,
      title: 'Lokasi & Parkir Nyaman',
      tag: 'Akses Mudah',
      color: 'amber',
      desc: 'Berlokasi di Jl. Kolonel Hadijanto, Deliksari, Gunungpati. Area parkir motor & mobil aman serta dipandu langsung oleh tim usher gereja.',
    },
    {
      icon: Smile,
      title: 'Ibadah Anak yang Aman',
      tag: 'COC Kidz',
      color: 'emerald',
      desc: 'Anak-anak batita hingga SD beribadah di ruang COC Kidz yang ramah anak, edukatif, dan didampingi guru sekolah minggu yang penuh kasih (09.30 - 10.30 WIB).',
    },
    {
      icon: Music,
      title: 'Pujian & Firman yang Hidup',
      tag: 'DS Worship',
      color: 'indigo',
      desc: 'Rasakan hadirat Tuhan melalui praise & worship kontemporer bersama DS Worship dan kebenaran firman Tuhan yang aplikatif untuk kehidupan sehari-hari.',
    },
    {
      icon: Users,
      title: 'Penyambutan Seperti Keluarga',
      tag: 'Warm Welcome',
      color: 'rose',
      desc: 'Anda tidak akan sendirian. Tim pastoral dan jemaat siap menyambut Anda dengan kehangatan, keramahan, dan doa persaudaraan.',
    },
  ];

  return (
    <section id="kunjungan" className="py-20 lg:py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Decorative subtle background ambient light */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Digital Hospitality &bull; Selamat Datang Jemaat Baru</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Baru Pertama Kali ke GIA Deliksari?
          </h2>
          
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Kami sangat bersukacita menyambut kehadiran Anda dan seluruh keluarga. Berikut panduan ringkas agar pengalaman ibadah perdana Anda terasa hangat, nyaman, dan memberkati.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalityGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.title}
                className="group relative p-7 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 dark:hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {guide.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {guide.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>Informasi Kunjungan</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Hospitality CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Ingin Didampingi Saat Pertama Datang?
            </h3>
            <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
              Kirimkan pesan ke tim pastoral kami agar kami dapat menyambut dan mempersiapkan tempat terbaik bagi Anda & keluarga.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Pastoral%20GIA%20Deliksari,%20saya%20berencana%20hadir%20pertama%20kali%20untuk%20Ibadah%20Minggu."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
              <span>Sapa Tim Pastoral</span>
            </a>

            <a
              href={gmapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-800/60 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Buka Google Maps</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
