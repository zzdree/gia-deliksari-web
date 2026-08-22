import React from 'react';
import Image from 'next/image';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function GallerySection() {
  const galleryItems = [
    {
      src: '/images/gallery-1.jpg',
      alt: 'Pelayanan Pujian & Penyembahan DS Worship',
      tag: 'Ibadah Raya',
      title: 'Pujian & Penyembahan',
    },
    {
      src: '/images/gallery-2.jpg',
      alt: 'Persekutuan Kaum Muda Grow Generation',
      tag: 'Youth Fellowship',
      title: 'Grow Generation PRBK',
    },
    {
      src: '/images/gallery-3.jpg',
      alt: 'Sekolah Minggu Ceria COC Kidz GIA Deliksari',
      tag: 'Sekolah Minggu',
      title: 'Keceriaan COC Kidz',
    },
    {
      src: '/images/gallery-4.jpg',
      alt: 'Persekutuan & Doa Bersama Jemaat',
      tag: 'Komunitas',
      title: 'Kehangatan Tubuh Kristus',
    },
  ];

  return (
    <section id="galeri" className="py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dokumentasi Pelayanan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Galeri Kegiatan & Momen Persekutuan
            </h2>
          </div>

          <a
            href="https://www.instagram.com/giadeliksari/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs sm:text-sm font-bold transition-colors w-fit"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Lihat Semua di Instagram @giadeliksari</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wide">
                  {item.tag}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
