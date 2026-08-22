import React from 'react';
import Image from 'next/image';
import { Sparkles, Clock, ArrowUpRight, Users } from 'lucide-react';
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
        'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
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
        'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800',
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
        'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
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
        'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950/80 dark:text-pink-300 dark:border-pink-800',
    },
  ];

  return (
    <section id="pelayanan" className="py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <span className="text-amber-600 dark:text-amber-400 font-serif text-sm">✝</span>
            <span>4 Komunitas Ibadah & Pelayanan (General • Youth • Kidz • Hana)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pelayanan Berkelanjutan untuk Setiap Generasi
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Temukan wadah bertumbuh yang tepat untuk Anda dan seluruh keluarga di GIA Deliksari Semarang: Ibadah Raya, Grow Generation Youth, COC Kidz, serta Persekutuan Wanita Hana & Komsel Ekklesia.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministries.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${item.badgeColor}`}>
                    {item.categoryTag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.schedule}</span>
                  </div>

                  <a
                    href={item.igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 font-medium transition-colors"
                  >
                    <span>{item.igHandle}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
