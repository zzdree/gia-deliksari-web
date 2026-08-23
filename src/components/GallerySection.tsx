'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Maximize2,
  Upload,
  HardDrive,
  ExternalLink,
  FolderOpen
} from 'lucide-react';
import { dataStore } from '@/lib/storage';
import { GalleryItem } from '@/types';
import { INITIAL_GALLERY } from '@/lib/seedData';
import UploadPhotoModal from './UploadPhotoModal';

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ibadah' | 'worship' | 'youth' | 'komunitas'>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const googleDriveFolderUrl = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_GALLERY_URL || 'https://drive.google.com/drive/folders/1GIADeliksariSemarangArchive';

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await dataStore.getGallery();
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn('Error loading gallery from dataStore:', err);
      }
    }
    loadGallery();
  }, []);

  const handleUploadSuccess = (newItem: GalleryItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter((item) => item.category === activeFilter);

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
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

          {/* Action Buttons: Upload + Google Drive */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-900/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Foto Momen</span>
            </button>

            <a
              href={googleDriveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#221215] hover:bg-[#EBDDCF] dark:hover:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] border border-[#EBDDCF] dark:border-[#3A1C20] text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4 text-[#C59B27]" />
              <span>Arsip Google Drive</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            { id: 'all', label: 'Semua Momen' },
            { id: 'ibadah', label: 'Ibadah Raya' },
            { id: 'worship', label: 'Praise & Worship' },
            { id: 'youth', label: 'Grow Youth' },
            { id: 'komunitas', label: 'Komunitas & Komsel' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-sm'
                  : 'bg-white dark:bg-[#221215] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]'
              }`}
            >
              {filter.label}
            </button>
          ))}
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
                src={item.image || '/images/gallery-1.jpg'}
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

        {/* Bottom Archive Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-[#F7F2E8] to-[#FDFBF7] dark:from-[#221215] dark:to-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#C5222E]">
              <HardDrive className="w-4 h-4" />
              <span>Arsip Master Dokumentasi Cloud Gereja</span>
            </div>
            <h4 className="text-base font-extrabold text-[#1F1617] dark:text-white">
              Mencari foto kegiatan tahun lalu atau album beresolusi penuh?
            </h4>
            <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
              Semua arsip master dokumentasi pelayanan disimpan secara abadi di Google Drive GIA Deliksari.
            </p>
          </div>

          <a
            href={googleDriveFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#2A161A] hover:bg-[#FDFBF7] dark:hover:bg-[#331418] text-[#1F1617] dark:text-[#F5EFEB] border border-[#EBDDCF] dark:border-[#3A1C20] text-xs font-bold flex items-center gap-2 shadow-sm shrink-0"
          >
            <FolderOpen className="w-4 h-4 text-[#C59B27]" />
            <span>Buka Folder Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
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
                src={filteredItems[selectedPhotoIndex].image || '/images/gallery-1.jpg'}
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

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

    </section>
  );
}
