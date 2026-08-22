'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Maximize2, X, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
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
    desc: 'Tim musik dan puji-pujian yang melayani di hadirat Tuhan dalam setiap ibadah raya.',
  },
  {
    id: 2,
    src: '/images/gallery-2.jpg',
    alt: 'Ibadah Raya & Sakramen Perjamuan Kudus',
    tag: 'Ibadah Raya',
    category: 'ibadah',
    title: 'Ibadah Raya Minggu',
    desc: 'Suasana khidmat ibadah raya Minggu bersama seluruh jemaat GIA Deliksari.',
  },
  {
    id: 3,
    src: '/images/gallery-3.jpg',
    alt: 'Tampak Gedung & Plang GIA Deliksari',
    tag: 'Fasilitas & Gedung',
    category: 'komunitas',
    title: 'Gedung Gereja GIA Deliksari',
    desc: 'Rumah doa dan persekutuan jemaat di Jl. Kolonel Hadijanto, Deliksari Semarang.',
  },
  {
    id: 4,
    src: '/images/gallery-4.jpg',
    alt: 'Perayaan & Ibadah Spesial GIA Deliksari',
    tag: 'Ibadah Spesial',
    category: 'ibadah',
    title: 'Perayaan & Kebersamaan',
    desc: 'Momen ucapan syukur dan perayaan hari-hari besar gerejawi jemaat.',
  },
  {
    id: 5,
    src: '/images/gallery-5.jpg',
    alt: 'Pelayanan Firman & Mimbar',
    tag: 'Pelayanan Mimbar',
    category: 'ibadah',
    title: 'Pemberitaan Firman Tuhan',
    desc: 'Pengajaran firman penggembalaan yang membangun dan memulihkan kehidupan jemaat.',
  },
  {
    id: 6,
    src: '/images/gallery-6.jpg',
    alt: 'Persekutuan & Fellowship Pemuda',
    tag: 'Grow Generation',
    category: 'youth',
    title: 'Fellowship Pemuda & Remaja',
    desc: 'Kebersamaan generasi muda dalam kehangatan komunitas iman dan saling mendoakan.',
  },
];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ibadah' | 'worship' | 'youth' | 'komunitas'>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredItems.length);
  };

  return (
    <section id="galeri" className="py-24 bg-[#F5F1E9]/40 dark:bg-[#181C19]/40 border-y border-[#EBE5DC] dark:border-[#2A302C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Dokumentasi Pelayanan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
              Galeri Kegiatan & Momen Kebersamaan
            </h2>
            <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base leading-relaxed">
              Merekam jejak kasih dan penyertaan Tuhan dalam berbagai kegiatan ibadah dan persekutuan jemaat.
            </p>
          </div>

          <div>
            <a
              href="https://www.instagram.com/giadeliksari/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#1B201D] border border-[#E0D7C9] dark:border-[#2F3731] hover:bg-[#EFEAE2] dark:hover:bg-[#232A25] text-[#1E2320] dark:text-[#EDEAE4] text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <InstagramIcon className="w-4 h-4 text-[#C27338]" />
              <span>Lihat Instagram @giadeliksari</span>
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {[
            { id: 'all', label: 'Semua Momen' },
            { id: 'ibadah', label: 'Ibadah Raya' },
            { id: 'worship', label: 'DS Worship' },
            { id: 'youth', label: 'Grow Generation' },
            { id: 'komunitas', label: 'Gedung & Fasilitas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                setSelectedPhotoIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeCategory === tab.id
                  ? 'bg-[#44634D] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1B201D] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#232A25] border border-[#E5DDD0] dark:border-[#2A312B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group cursor-pointer rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE4DB] dark:bg-[#222824]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141715]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-[#141715]/80 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Lihat Foto Penuh</span>
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 dark:bg-[#141715]/90 backdrop-blur-sm border border-[#E0D7C9] dark:border-[#2F3731] text-[#3D4741] dark:text-[#C5CDC7]">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-1.5">
                <h3 className="font-bold text-base text-[#1E2320] dark:text-[#EDEAE4] group-hover:text-[#44634D] dark:group-hover:text-[#7EA88A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#1B201D] text-white rounded-[2.5rem] border border-[#2A312B] overflow-hidden shadow-2xl p-6 space-y-4">
            
            {/* Modal Topbar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262D28]">
              <div>
                <span className="text-xs font-bold text-[#7EA88A] uppercase tracking-wider">
                  {filteredItems[selectedPhotoIndex].tag}
                </span>
                <h4 className="text-lg font-bold text-white">
                  {filteredItems[selectedPhotoIndex].title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-2 rounded-xl bg-[#232924] hover:bg-[#2C342E] text-[#9DAAA0] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black">
              <Image
                src={filteredItems[selectedPhotoIndex].src}
                alt={filteredItems[selectedPhotoIndex].alt}
                fill
                className="object-contain"
              />
            </div>

            {/* Description & Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs sm:text-sm text-[#9DAAA0] text-center sm:text-left">
                {filteredItems[selectedPhotoIndex].desc}
              </p>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-[#232924] hover:bg-[#2C342E] text-white transition-colors"
                  title="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs text-[#7A877E] font-mono px-2">
                  {selectedPhotoIndex + 1} / {filteredItems.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-[#232924] hover:bg-[#2C342E] text-white transition-colors"
                  title="Foto Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
