import React from 'react';
import Image from 'next/image';
import { Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function MinistriesSection() {
  const ministries = [
    {
      id: 'kidz',
      name: 'COC Kidz (Children Of Christ)',
      categoryTag: 'Sekolah Minggu / KAA',
      description:
        'Pelayanan ibadah anak yang ceria dan penuh edukasi firman Tuhan. Dilengkapi aktivitas kreasi, gerak & lagu, serta pengajaran karakter Kristiani yang relevan bagi anak.',
      schedule: 'Minggu, 08.00 WIB',
      igHandle: '@cockidz',
      igUrl: 'https://www.instagram.com/cockidz/',
      image: '/images/ministry-kidz.jpg',
      badgeColor:
        'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
    },
    {
      id: 'youth',
      name: 'Grow Generation (PRBK Youth)',
      categoryTag: 'Youth & Teen Fellowship',
      description:
        'Wadah bagi kaum muda, remaja, dan mahasiswa untuk bertumbuh bersama. Diisi dengan pujian kontemporer, firman kontekstual, fellowship, dan kegiatan seru.',
      schedule: 'Sabtu, 17.00 WIB',
      igHandle: '@growgeneration_',
      igUrl: 'https://www.instagram.com/growgeneration_/',
      image: '/images/ministry-youth.jpg',
      badgeColor:
        'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800',
    },
    {
      id: 'hana',
      name: 'Hana Fellowship',
      categoryTag: 'Kaum Wanita & Ibu-Ibu',
      description:
        'Persekutuan doa dan saling menguatkan bagi kaum wanita dan ibu-ibu jemaat. Menjadi tiang doa keluarga yang penuh kasih dan hikmat Tuhan.',
      schedule: 'Selasa, 16.30 WIB',
      igHandle: '@giadeliksari',
      igUrl: 'https://www.instagram.com/giadeliksari/',
      image: '/images/ministry-hana.jpg',
      badgeColor:
        'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950/80 dark:text-pink-300 dark:border-pink-800',
    },
    {
      id: 'general',
      name: 'Ibadah Raya / General Service',
      categoryTag: 'Ibadah Umum Jemaat',
      description:
        'Ibadah raya mingguan untuk seluruh keluarga jemaat. Dilayani oleh DS Worship, penyampaian firman penggembalaan, dan sakramen perjamuan kudus.',
      schedule: 'Minggu, 07.00 WIB',
      igHandle: '@giadeliksari',
      igUrl: 'https://www.instagram.com/giadeliksari/',
      image: '/images/ministry-general.jpg',
      badgeColor:
        'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
    },
  ];

  return (
    <section id="pelayanan" className="py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Kategori Ibadah & Komunitas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pelayanan Berkelanjutan untuk Setiap Usia
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Temukan wadah persekutuan yang tepat untuk Anda dan seluruh anggota keluarga di GIA Deliksari.
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

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{item.schedule}</span>
                  </div>

                  <a
                    href={item.igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-700/60 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                      {item.igHandle}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
