'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowUpRight, Maximize2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { InstagramIcon } from './Icons';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  tag: string;
  category: 'all' | 'ibadah' | 'worship' | 'youth' | 'komunitas';
  title: string;
  desc: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: '/images/gallery-1.jpg',
    alt: 'Pelayanan Pujian & Penyembahan DS Worship',
    tag: 'Praise & Worship',
    category: 'worship',
    title: 'Pelayanan Musik & DS Worship',
    desc: 'Tim musik dan puji-pujian yang melayani di hadirat Tuhan dalam setiap ibadah raya.'
  },
  {
    id: 2,
    src: '/images/gallery-2.jpg',
    alt: 'Ibadah Raya & Sakramen Perjamuan Kudus',
    tag: 'Ibadah Raya',
    category: 'ibadah',
    title: 'Ibadah Raya Minggu',
    desc: 'Suasana khidmat ibadah raya Minggu bersama seluruh jemaat GIA Deliksari.'
  },
  {
    id: 3,
    src: '/images/gallery-3.jpg',
    alt: 'Tampak Gedung & Plang GIA Deliksari',
    tag: 'Fasilitas & Gedung',
    category: 'komunitas',
    title: 'Gedung Gereja GIA Deliksari',
    desc: 'Rumah doa dan persekutuan jemaat di Jl. Kolonel Hadijanto, Deliksari Semarang.'
  },
  {
    id: 4,
    src: '/images/gallery-4.jpg',
    alt: 'Perayaan & Ibadah Spesial GIA Deliksari',
    tag: 'Ibadah Spesial',
    category: 'ibadah',
    title: 'Perayaan & Kebersamaan',
    desc: 'Momen ucapan syukur dan perayaan hari-hari besar gerejawi jemaat.'
  },
  {
    id: 5,
    src: '/images/gallery-5.jpg',
    alt: 'Pelayanan Firman & Mimbar',
    tag: 'Pelayanan Mimbar',
    category: 'ibadah',
    title: 'Khotbah & Firman Kebenaran',
    desc: 'Pemberitaan Firman Tuhan yang murni dan mengubahkan hidup setiap pekan.'
  },
  {
    id: 6,
    src: '/images/gallery-6.jpg',
    alt: 'Grow Generation Youth Fellowship',
    tag: 'Youth Fellowship',
    category: 'youth',
    title: 'Grow Generation PRBK',
    desc: 'Komunitas pemuda & remaja yang dinamis, bertumbuh dalam iman dan kasih Kristus.'
  },
  {
    id: 7,
    src: '/images/gallery-7.jpg',
    alt: 'Persekutuan Doa & Saling Mendoakan',
    tag: 'Persekutuan Doa',
    category: 'komunitas',
    title: 'Menara Doa Jemaat',
    desc: 'Membawa setiap pergumulan dan keluarga dalam doa syafaat bersama.'
  },
  {
    id: 8,
    src: '/images/gallery-8.jpg',
    alt: 'Keceriaan Anak & Komunitas Hana',
    tag: 'Komunitas & Hana',
    category: 'komunitas',
    title: 'Kehangatan Kasih Jemaat',
    desc: 'Komunitas yang saling mendukung dari anak-anak, pemuda, hingga kaum lansia.'
  }
];

export default function GallerySection() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ibadah' | 'worship' | 'youth' | 'komunitas'>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filteredItems = selectedFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedFilter);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredItems.findIndex(item => item.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActivePhoto(filteredItems[nextIndex]);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredItems.findIndex(item => item.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActivePhoto(filteredItems[prevIndex]);
  };

  return (
    <section id="galeri" className="py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dokumentasi Pelayanan & Momen</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Galeri Dokumentasi Foto Asli
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Foto-foto riil dokumentasi pelayanan, persekutuan, ibadah raya, dan kebersamaan keluarga Allah di GIA Deliksari Semarang.
            </p>
          </div>

          <a
            href="https://www.instagram.com/giadeliksari/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs sm:text-sm font-bold transition-colors w-fit"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Kunjungi @giadeliksari</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {[
            { id: 'all', label: 'Semua Foto (8)' },
            { id: 'ibadah', label: 'Ibadah Raya & Firman' },
            { id: 'worship', label: 'Praise & Worship' },
            { id: 'youth', label: 'Youth (Grow Generation)' },
            { id: 'komunitas', label: 'Komunitas & Gedung' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 8 Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wide">
                  {item.tag}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 uppercase">
                    {activePhoto.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {activePhoto.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Area */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fill
                  className="object-contain"
                />

                {/* Left/Right Navigation */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white transition-all backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white transition-all backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-slate-300">
                  {activePhoto.desc}
                </p>
                <a
                  href="https://www.instagram.com/giadeliksari/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold whitespace-nowrap transition-colors"
                >
                  <span>Lihat Dokumentasi Instagram</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
