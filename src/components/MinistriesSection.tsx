'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function MinistriesSection() {
  const ministries = [
    {
      id: 'general',
      name: 'Ibadah Raya / General Service',
      categoryTag: 'Ibadah Umum Jemaat',
      description:
        'Ibadah raya mingguan untuk seluruh keluarga jemaat. Dilayani oleh DS Worship, penyampaian firman penggembalaan oleh Ps. Yohanes Sutono, dan perjamuan kudus.',
      schedule: 'Minggu, 09.00 - 11.00 WIB',
      igHandle: '@giadeliksari',
      igUrl: 'https://www.instagram.com/giadeliksari/',
      image: '/images/ministry-general.jpg',
      badgeColor:
        'bg-[#EBF1EC] text-[#44634D] border-[#D1E0D5] dark:bg-[#202923] dark:text-[#7EA88A] dark:border-[#2C3B31]',
      accentBg: 'hover:border-[#44634D]/40',
    },
    {
      id: 'youth',
      name: 'Grow Generation (PRBK Youth)',
      categoryTag: 'Youth & Teen Fellowship',
      description:
        'Wadah bagi kaum muda, remaja, dan mahasiswa untuk bertumbuh bersama. Diisi dengan pujian kontemporer, firman kontekstual, fellowship, dan pembinaan dipimpin oleh Kak Noel Yosan, S.Th.',
      schedule: 'Sabtu, 18.00 - 20.00 WIB',
      igHandle: '@growgeneration_',
      igUrl: 'https://www.instagram.com/growgeneration_/',
      image: '/images/ministry-youth.jpg',
      badgeColor:
        'bg-[#FAEEE5] text-[#C27338] border-[#ECD1C0] dark:bg-[#2A201A] dark:text-[#E8A576] dark:border-[#4A3427]',
      accentBg: 'hover:border-[#C27338]/40',
    },
    {
      id: 'kidz',
      name: 'COC Kidz (Children Of Christ)',
      categoryTag: 'Sekolah Minggu / KAA',
      description:
        'Pelayanan ibadah anak yang ceria dan edukatif. Dilengkapi aktivitas kreasi Alkitab, gerak & lagu pujian, serta pengajaran karakter Kristiani sejak usia dini.',
      schedule: 'Minggu, 09.30 - 10.30 WIB',
      igHandle: '@cockidz',
      igUrl: 'https://www.instagram.com/cockidz/',
      image: '/images/ministry-kidz.jpg',
      badgeColor:
        'bg-[#FBF4E7] text-[#C89434] border-[#F1DEC0] dark:bg-[#2B2317] dark:text-[#E2B35B] dark:border-[#423421]',
      accentBg: 'hover:border-[#C89434]/40',
    },
    {
      id: 'hana-komsel',
      name: 'Wanita Hana & Komsel Ekklesia',
      categoryTag: 'Persekutuan Komunitas',
      description:
        'Persekutuan selang-seling setiap minggu dalam 1 bulan (1 minggu Persekutuan Wanita Hana pukul 18.00-20.00 WIB, 1 minggu Komsel Ekklesia pukul 18.30-20.00 WIB) untuk membangun keakraban jemaat.',
      schedule: 'Selang-Seling Mingguan (18.00/18.30 WIB)',
      igHandle: '@giadeliksari',
      igUrl: 'https://www.instagram.com/giadeliksari/',
      image: '/images/ministry-hana.jpg',
      badgeColor:
        'bg-[#FAECF0] text-[#B35667] border-[#EFCAD2] dark:bg-[#2B1B20] dark:text-[#DF8596] dark:border-[#4A2631]',
      accentBg: 'hover:border-[#B35667]/40',
    },
  ];

  return (
    <section id="pelayanan" className="py-24 bg-[#F5F1E9]/40 dark:bg-[#181C19]/40 border-y border-[#EBE5DC] dark:border-[#2A302C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="font-serif text-sm">✝</span>
            <span>4 Komunitas Ibadah & Pelayanan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
            Pelayanan Berkelanjutan untuk Setiap Generasi
          </h2>
          <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base sm:text-lg leading-relaxed">
            Temukan wadah bertumbuh yang tepat untuk Anda dan seluruh keluarga di GIA Deliksari Semarang: Ibadah Raya, Grow Generation Youth, COC Kidz, serta Persekutuan Wanita Hana & Komsel Ekklesia.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministries.map((item) => (
            <div
              key={item.id}
              className={`group flex flex-col rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${item.accentBg}`}
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EBE5DC] dark:bg-[#202522]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141715]/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border shadow-xs ${item.badgeColor}`}>
                    {item.categoryTag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4] group-hover:text-[#44634D] dark:group-hover:text-[#7EA88A] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer: Schedule & Instagram */}
                <div className="pt-4 border-t border-[#EAE3D8] dark:border-[#262D28] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#4A544E] dark:text-[#C5CDC7]">
                    <Clock className="w-3.5 h-3.5 text-[#C27338] shrink-0" />
                    <span>{item.schedule}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={item.igUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6B63] dark:text-[#9DAAA0] hover:text-[#C27338] dark:hover:text-[#D9894E] transition-colors"
                    >
                      <InstagramIcon className="w-3.5 h-3.5 text-[#C27338]" />
                      <span>{item.igHandle}</span>
                    </a>

                    <a
                      href="#layanan"
                      className="p-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#232924] text-[#5F6B63] dark:text-[#9DAAA0] group-hover:text-[#44634D] dark:group-hover:text-[#7EA88A] group-hover:bg-[#EBF1EC] dark:group-hover:bg-[#202923] transition-colors"
                      title="Daftar Pelayanan"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
