'use client';

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
      color: 'bg-[#EBF1EC] text-[#44634D] dark:bg-[#202923] dark:text-[#7EA88A] border-[#D1E0D5] dark:border-[#2C3B31]',
      desc: 'Terletak di Deliksari Gunungpati dengan area parkir aman untuk kendaraan roda 2 dan 4 serta diarahkan oleh tim usher.',
    },
    {
      icon: Smile,
      title: 'Ibadah Anak (COC Kidz)',
      tag: 'Sekolah Minggu',
      color: 'bg-[#FBF4E7] text-[#C89434] dark:bg-[#2B2317] dark:text-[#E2B35B] border-[#F1DEC0] dark:border-[#423421]',
      desc: 'Kelas Sekolah Minggu (Pukul 09.30 WIB) dengan puji-pujian ceria, cerita Alkitab interaktif, dan kreasi edukatif.',
    },
    {
      icon: Music,
      title: 'Pujian & Firman Praktis',
      tag: 'DS Worship',
      color: 'bg-[#FAEEE5] text-[#C27338] dark:bg-[#2A201A] dark:text-[#E8A576] border-[#ECD1C0] dark:border-[#4A3427]',
      desc: 'Wadah praise & worship kontemporer yang hidup dan penyampaian kebenaran Alkitab kontekstual untuk kehidupan sehari-hari.',
    },
    {
      icon: Users,
      title: 'Penyambutan Hangat',
      tag: 'Keluarga Allah',
      color: 'bg-[#FAECF0] text-[#B35667] dark:bg-[#2B1B20] dark:text-[#DF8596] border-[#EFCAD2] dark:border-[#4A2631]',
      desc: 'Tim pastoral dan keluarga jemaat siap menyambut Anda dengan sukacita dan mendampingi bila ada pertanyaan.',
    },
  ];

  return (
    <section id="kunjungan" className="py-24 bg-[#F5F1E9]/50 dark:bg-[#181C19]/50 border-y border-[#EBE5DC] dark:border-[#2A302C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>Digital Hospitality &bull; Selamat Datang Jemaat Baru</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
            Baru Pertama Kali ke GIA Deliksari?
          </h2>
          <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base sm:text-lg leading-relaxed">
            Kami sangat bersukacita menyambut kehadiran Anda. Berikut beberapa hal penting untuk membantu kunjungan ibadah perdana Anda terasa nyaman seperti di rumah sendiri.
          </p>
        </div>

        {/* 4 Clean Hospitality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {hospitalityGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.title}
                className="p-7 rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${guide.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#232924] border border-[#EAE4DB] dark:border-[#303832] text-[#6B7870] dark:text-[#9DAAA0]">
                      {guide.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4]">
                    {guide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warm Personal Pastoral Greeting Banner */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-[#44634D] to-[#36503E] p-8 sm:p-10 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#B8D8C0]">
              Hubungi Tim Penyambutan Kami
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ingin Mengetahui Info Ibadah Lebih Lanjut?
            </h3>
            <p className="text-sm text-[#D1E5D7] leading-relaxed">
              Tim pastoral kami siap menjawab pertanyaan seputar lokasi, jadwal persekutuan, maupun permohonan doa jemaat.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="https://wa.me/6281234567890?text=Halo%20GIA%20Deliksari,%20saya%20jemaat%20baru%20dan%20ingin%20info%20ibadah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-[#334D3A] font-bold text-sm hover:bg-[#F2F7F4] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
              <span>Sapa Tim Pastoral (WA)</span>
            </a>

            <a
              href={gmapsShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#5A8267] hover:bg-[#4A6E55] text-white font-bold text-sm border border-white/20 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>Buka Google Maps</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
