'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'ibadah' | 'worship' | 'youth' | 'komunitas';
  image: string;
  date: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Gedung Sanctuary GIA Deliksari Semarang',
    category: 'ibadah',
    image: '/images/gallery-1.jpg',
    date: 'Agustus 2026',
  },
  {
    id: 'gal-2',
    title: 'Pemberitaan Firman & Penggembalaan Jemaat',
    category: 'ibadah',
    image: '/images/gallery-2.jpg',
    date: 'Agustus 2026',
  },
  {
    id: 'gal-3',
    title: 'Praise & Worship DS Worship Team',
    category: 'worship',
    image: '/images/gallery-3.jpg',
    date: 'Juli 2026',
  },
  {
    id: 'gal-4',
    title: 'Keceriaan Ibadah Anak Sekolah Minggu COC Kidz',
    category: 'komunitas',
    image: '/images/gallery-4.jpg',
    date: 'Juli 2026',
  },
  {
    id: 'gal-5',
    title: 'Persekutuan & Doa Bersama Jemaat',
    category: 'komunitas',
    image: '/images/gallery-5.jpg',
    date: 'Juni 2026',
  },
  {
    id: 'gal-6',
    title: 'Fellowship Pemuda Grow Generation PRBK',
    category: 'youth',
    image: '/images/gallery-6.jpg',
    date: 'Juni 2026',
  },
];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ibadah' | 'worship' | 'youth' | 'komunitas'>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredItems.length);
    }
  };

  return (
    <section id="galeri" className="py-24 bg-[#FDFBF7] dark:bg-[#150B0D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-[#C5222E]" />
              <span>Dokumentasi Pelayanan & Momen Kebersamaan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] tracking-tight">
              Galeri Sukacita Jemaat
            </h2>
            <p className="text-[#5A4D4E] dark:text-[#D5C2C4] text-base leading-relaxed">
              Momen-momen indah persekutuan, pujian penyembahan, dan kebersamaan keluarga Allah di GIA Deliksari.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Semua Momen' },
              { id: 'ibadah', label: 'Ibadah' },
              { id: 'worship', label: 'Worship' },
              { id: 'youth', label: 'Youth' },
              { id: 'komunitas', label: 'Komunitas' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-xs'
                    : 'bg-white dark:bg-[#221215] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#F7F2E8] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150B0D]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md text-[#1F1617] flex items-center justify-center shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#C5222E]/80 backdrop-blur-md inline-block border border-white/20">
                  {item.date}
                </span>
                <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div 
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute -top-12 right-0 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10">
              <Image
                src={filteredItems[selectedPhotoIndex].image}
                alt={filteredItems[selectedPhotoIndex].title}
                fill
                className="object-contain"
              />
            </div>

            {/* Bottom Caption & Controls */}
            <div className="w-full flex items-center justify-between mt-4 text-white px-2">
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {filteredItems[selectedPhotoIndex].title}
                </h4>
                <p className="text-xs text-white/60">
                  {filteredItems[selectedPhotoIndex].date}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-white/60 px-1">
                  {selectedPhotoIndex + 1} / {filteredItems.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
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
