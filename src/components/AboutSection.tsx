'use client';

import React from 'react';
import Image from 'next/image';
import { BookOpen, Heart, Users2, Sparkles, UserCheck } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function AboutSection() {
  const pastoralFamily = [
    {
      role: 'Gembala Sidang',
      name: 'Ps. Yohanes Sutono',
      desc: 'Melayani dan memimpin jemaat dengan keteladanan firman dan dedikasi penggembalaan.',
      tag: 'Senior Pastor',
      badgeColor: 'bg-[#EBF1EC] text-[#44634D] dark:bg-[#202923] dark:text-[#7EA88A] border-[#D1E0D5] dark:border-[#2C3B31]',
    },
    {
      role: 'Ibu Gembala',
      name: 'Ibu Santini',
      desc: 'Mendampingi pelayanan penggembalaan dan memimpin persekutuan kaum wanita & doa jemaat.',
      tag: 'Pastoral Care',
      badgeColor: 'bg-[#FAECF0] text-[#B35667] dark:bg-[#2B1B20] dark:text-[#DF8596] border-[#EFCAD2] dark:border-[#4A2631]',
    },
    {
      role: 'Pelayanan Pemuda & Pengajaran',
      name: 'Kak Noel Yosan, S.Th.',
      desc: 'Melayani pembinaan generasi muda, firman kontekstual, dan pengajaran teologi praktis.',
      tag: 'Youth & Teaching',
      badgeColor: 'bg-[#FAEEE5] text-[#C27338] dark:bg-[#2A201A] dark:text-[#E8A576] border-[#ECD1C0] dark:border-[#4A3427]',
    },
    {
      role: 'Generasi Muda & Kreatif',
      name: 'Vellin',
      desc: 'Mendukung pelayanan generasi, praise & worship, dan kebersamaan persekutuan jemaat.',
      tag: 'Youth & Worship',
      badgeColor: 'bg-[#FBF4E7] text-[#C89434] dark:bg-[#2B2317] dark:text-[#E2B35B] border-[#F1DEC0] dark:border-[#423421]',
    },
  ];

  return (
    <section id="tentang" className="py-24 bg-[#FAF8F5] dark:bg-[#141715] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mengenal Kami &bull; Visi & Kepemimpinan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
            Tentang GIA Deliksari & Keluarga Gembala
          </h2>
          <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base sm:text-lg leading-relaxed">
            Sebuah komunitas iman yang rindu menjadi garam dan terang di Kota Semarang, membimbing setiap generasi bertumbuh secara utuh di dalam Kristus.
          </p>
        </div>

        {/* Pastor Main Highlight & Church Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Senior Pastor Profile Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[2rem] overflow-hidden bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="relative w-full aspect-square max-w-[260px] mx-auto rounded-2xl overflow-hidden shadow-sm bg-[#F5F1E9] dark:bg-[#222824] border border-[#EBE5DC] dark:border-[#2C342E]">
                <Image
                  src="/images/pastor-yohanes.jpg"
                  alt="Ps. Yohanes Sutono - Gembala Sidang GIA Deliksari"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center space-y-2.5">
                <div className="inline-block px-3 py-1 rounded-full bg-[#EBF1EC] dark:bg-[#202923] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wide border border-[#D1E0D5] dark:border-[#2C3B31]">
                  Senior Pastor / Gembala Sidang
                </div>
                <h3 className="text-2xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4]">
                  Ps. Yohanes Sutono
                </h3>
                <p className="text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed max-w-sm mx-auto">
                  Melayani dengan ketulusan hati dan kesetiaan firman untuk penggembalaan seluruh jemaat GIA Deliksari Semarang.
                </p>

                <div className="pt-2 flex justify-center">
                  <a
                    href="https://www.instagram.com/ps.yohanessutono/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] dark:bg-[#222824] border border-[#E5DDD0] dark:border-[#2A312B] text-[#5F6B63] dark:text-[#C5CDC7] hover:text-[#C27338] dark:hover:text-[#D9894E] transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4 text-[#C27338]" />
                    <span>@ps.yohanessutono</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Church Vision & Core Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-7 sm:p-9 rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#EBF1EC] dark:bg-[#202923] flex items-center justify-center text-[#44634D] dark:text-[#7EA88A] font-bold border border-[#D1E0D5] dark:border-[#2C3B31]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-[#1E2320] dark:text-[#EDEAE4]">Visi & Misi Gereja</h4>
              </div>
              <p className="text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed text-base">
                Menjadi jemaat yang berakar kuat dalam kebenaran Firman Allah, bertumbuh dalam persekutuan kasih persaudaraan yang erat (<span className="font-semibold text-[#44634D] dark:text-[#7EA88A]">&ldquo;GROWING CHURCH!&rdquo;</span>), dan berbuah nyata memberkati lingkungan sekitar dengan kuasa Injil Kristus.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-[1.75rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAECF0] dark:bg-[#2B1B20] flex items-center justify-center text-[#B35667] dark:text-[#DF8596] border border-[#EFCAD2] dark:border-[#4A2631]">
                  <Heart className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-[#1E2320] dark:text-[#EDEAE4]">Kasih & Penerimaan</h5>
                <p className="text-xs sm:text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                  Menyambut setiap jiwa apa adanya dengan ketulusan, kehangatan, dan kepedulian keluarga Allah.
                </p>
              </div>

              <div className="p-6 rounded-[1.75rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAEEE5] dark:bg-[#2A201A] flex items-center justify-center text-[#C27338] dark:text-[#E8A576] border border-[#ECD1C0] dark:border-[#4A3427]">
                  <Users2 className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-[#1E2320] dark:text-[#EDEAE4]">Pemuridan Generasi</h5>
                <p className="text-xs sm:text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                  Membina anak-anak (COC Kidz), pemuda (Grow Generation), dan keluarga untuk aktif bertumbuh melayani Tuhan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pastoral Family Grid */}
        <div className="mt-14">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#1E2320] dark:text-[#EDEAE4]">
              Keluarga Penggembalaan
            </h3>
            <p className="text-sm text-[#5F6B63] dark:text-[#9DAAA0] mt-1">
              Bersama-sama melayani dan memelihara pertumbuhan rohani seluruh jemaat GIA Deliksari
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pastoralFamily.map((member) => (
              <div
                key={member.name}
                className="p-6 rounded-[1.75rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm hover:shadow-md transition-all space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF1EC] dark:bg-[#202923] flex items-center justify-center text-[#44634D] dark:text-[#7EA88A] border border-[#D1E0D5] dark:border-[#2C3B31]">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${member.badgeColor}`}>
                    {member.tag}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#C27338] dark:text-[#D9894E] uppercase tracking-wide">
                    {member.role}
                  </div>
                  <h4 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4]">
                    {member.name}
                  </h4>
                </div>
                <p className="text-xs text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
