'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Announcement, MinistryCategory } from '@/types';
import { dataStore } from '@/lib/storage';
import { Bell, Calendar, Pin, Filter, Printer, X } from 'lucide-react';

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'nextWeek' | 'thisMonth'>('all');
  const [categoryFilter, setCategoryFilter] = useState<MinistryCategory>('all');
  const [loading, setLoading] = useState(true);
  const [showBulletinModal, setShowBulletinModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dataStore.getAnnouncements();
        setAnnouncements(data.filter((item) => item.isPublished));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const now = new Date('2026-08-23');
  const filtered = announcements.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    if (timeFilter === 'all') return true;

    const eventDate = new Date(item.eventDate);
    const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (timeFilter === 'nextWeek') {
      return diffDays >= 0 && diffDays <= 14;
    }

    if (timeFilter === 'thisMonth') {
      return eventDate.getMonth() === now.getMonth() || eventDate.getMonth() === (now.getMonth() + 1) % 12;
    }

    return true;
  });

  const getCategoryBadge = (cat: MinistryCategory) => {
    switch (cat) {
      case 'kidz':
        return {
          label: 'COC Kidz',
          color: 'bg-[#FBF4E7] text-[#C89434] border-[#F1DEC0] dark:bg-[#2B2317] dark:text-[#E2B35B] dark:border-[#423421]',
        };
      case 'youth':
        return {
          label: 'Grow Generation',
          color: 'bg-[#FAEEE5] text-[#C27338] border-[#ECD1C0] dark:bg-[#2A201A] dark:text-[#E8A576] dark:border-[#4A3427]',
        };
      case 'hana':
        return {
          label: 'Hana & Komsel Ekklesia',
          color: 'bg-[#FAECF0] text-[#B35667] border-[#EFCAD2] dark:bg-[#2B1B20] dark:text-[#DF8596] dark:border-[#4A2631]',
        };
      case 'general':
      default:
        return {
          label: 'Umum & Ibadah Raya',
          color: 'bg-[#EBF1EC] text-[#44634D] border-[#D1E0D5] dark:bg-[#202923] dark:text-[#7EA88A] dark:border-[#2C3B31]',
        };
    }
  };

  const handlePrintBulletin = () => {
    window.print();
  };

  return (
    <section id="warta" className="py-24 bg-[#FAF8F5] dark:bg-[#141715] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" />
              <span>Warta Jemaat & Informasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
              Papan Informasi & Pengumuman Terkini
            </h2>
            <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base leading-relaxed">
              Informasi agenda kegiatan, persekutuan, dan warta jemaat sepekan ke depan.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowBulletinModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#44634D] hover:bg-[#36503E] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Lihat & Cetak Buletin</span>
            </button>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1B201D] p-4 rounded-[1.5rem] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm">
          {/* Time Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                timeFilter === 'all'
                  ? 'bg-[#44634D] text-white shadow-xs'
                  : 'bg-[#FAF8F5] dark:bg-[#232924] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#2C342E]'
              }`}
            >
              Semua Warta
            </button>
            <button
              onClick={() => setTimeFilter('nextWeek')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                timeFilter === 'nextWeek'
                  ? 'bg-[#44634D] text-white shadow-xs'
                  : 'bg-[#FAF8F5] dark:bg-[#232924] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#2C342E]'
              }`}
            >
              📅 Minggu Depan
            </button>
            <button
              onClick={() => setTimeFilter('thisMonth')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                timeFilter === 'thisMonth'
                  ? 'bg-[#44634D] text-white shadow-xs'
                  : 'bg-[#FAF8F5] dark:bg-[#232924] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#2C342E]'
              }`}
            >
              🗓️ Bulan Ini
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#7A877E]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MinistryCategory)}
              className="bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#44634D] focus:outline-none"
            >
              <option value="all">Semua Kategori Pelayanan</option>
              <option value="general">1. Ibadah Raya (General)</option>
              <option value="youth">2. Grow Generation (Youth)</option>
              <option value="kidz">3. COC Kidz (Sekolah Minggu)</option>
              <option value="hana">4. Hana & Komsel Ekklesia</option>
            </select>
          </div>
        </div>

        {/* Announcements List Grid */}
        {loading ? (
          <div className="py-16 text-center text-[#7A877E]">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-[#44634D] border-t-transparent rounded-full mb-3" />
            <p className="text-sm font-medium">Memuat warta jemaat terkini...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#1B201D] rounded-[2rem] border border-[#E5DDD0] dark:border-[#2A312B] p-8">
            <Bell className="w-12 h-12 text-[#9DAAA0] dark:text-[#4A544E] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4]">
              Belum Ada Pengumuman pada Filter Ini
            </h3>
            <p className="text-sm text-[#5F6B63] dark:text-[#9DAAA0] mt-1">
              Silakan pilih kategori lain atau reset filter untuk melihat semua warta.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-[2rem] bg-white dark:bg-[#1B201D] border p-7 shadow-sm hover:shadow-md transition-all duration-300 ${
                    item.isPinned
                      ? 'border-[#C27338] dark:border-[#D9894E] ring-1 ring-[#C27338]/20'
                      : 'border-[#E5DDD0] dark:border-[#2A312B]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Metadata Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9E5522] dark:text-[#E8A576] bg-[#FAEEE5] dark:bg-[#2A201A] px-2 py-0.5 rounded-md border border-[#ECD1C0] dark:border-[#4A3427]">
                          <Pin className="w-3 h-3 fill-[#C27338] text-[#C27338]" />
                          <span>Penting</span>
                        </span>
                      )}
                    </div>

                    {/* Announcement Title & Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  {/* Footer Event Date & Author */}
                  <div className="pt-5 mt-6 border-t border-[#EAE3D8] dark:border-[#262D28] flex items-center justify-between text-xs text-[#6B7870] dark:text-[#9DAAA0]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1E2320] dark:text-[#EDEAE4]">
                      <Calendar className="w-3.5 h-3.5 text-[#44634D] dark:text-[#7EA88A]" />
                      <span>{item.eventDate}</span>
                    </div>
                    <span className="text-[11px] truncate max-w-[140px]">
                      {item.author || 'Sekretariat'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Printable Bulletin Modal */}
      {showBulletinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1B201D] text-[#1E2320] dark:text-[#EDEAE4] rounded-[2.5rem] border border-[#E5DDD0] dark:border-[#2A312B] shadow-2xl p-6 sm:p-10 space-y-8">
            
            {/* Modal Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5DC] dark:border-[#2A302C]">
              <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
                <Printer className="w-5 h-5 text-[#44634D]" />
                <span>Pratinjau Buletin Warta Mingguan</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintBulletin}
                  className="px-4 py-2 rounded-xl bg-[#44634D] hover:bg-[#36503E] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Print PDF</span>
                </button>
                <button
                  onClick={() => setShowBulletinModal(false)}
                  className="p-2 rounded-xl text-[#5F6B63] hover:text-[#1E2320] dark:text-[#9DAAA0] dark:hover:text-white bg-[#FAF8F5] dark:bg-[#232924]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bulletin Printable Area */}
            <div className="space-y-6 text-left">
              {/* Bulletin Header */}
              <div className="text-center pb-6 border-b-2 border-[#44634D] space-y-2">
                <div className="relative w-14 h-14 mx-auto rounded-xl overflow-hidden mb-2">
                  <Image src="/images/logo.png" alt="GIA Deliksari" fill className="object-cover" />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">GEREJA ISA ALMASIH DELIKSARI SEMARANG</h2>
                <p className="text-xs font-bold text-[#C27338] dark:text-[#D9894E] uppercase tracking-wider">
                  &ldquo;GROWING CHURCH IN FAITH, LOVE, AND HOPE&rdquo;
                </p>
                <p className="text-xs text-[#6B7870] dark:text-[#9DAAA0]">
                  Jl. Kolonel Hadijanto, Deliksari, Gunung Pati, Kota Semarang, Jawa Tengah
                </p>
              </div>

              {/* Weekly Verse & Pastoral Note */}
              <div className="p-4 rounded-2xl bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-sm space-y-1">
                <div className="font-bold text-[#44634D] dark:text-[#7EA88A]">Pesan Penggembalaan:</div>
                <p className="italic text-xs sm:text-sm text-[#334D3A] dark:text-[#D1E5D7]">
                  &ldquo;Karena itu, saudara-saudaraku yang kekasih, berdirilah teguh, jangan goyah, dan giatlah selalu dalam pekerjaan Tuhan!&rdquo; (1 Korintus 15:58)
                </p>
                <div className="text-xs text-right font-semibold text-[#5F6B63] dark:text-[#9DAAA0]">
                  — Ps. Yohanes Sutono & Ibu Santini
                </div>
              </div>

              {/* Announcements Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider border-b border-[#EBE5DC] dark:border-[#2A302C] pb-2">
                  Warta & Pengumuman Jemaat
                </h4>
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-3.5 rounded-xl border border-[#E5DDD0] dark:border-[#2A312B] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#44634D] dark:text-[#7EA88A]">{ann.title}</span>
                        <span className="text-[#6B7870] font-mono">{ann.eventDate}</span>
                      </div>
                      <p className="text-xs text-[#5F6B63] dark:text-[#9DAAA0]">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Schedule Summary */}
              <div className="space-y-2 pt-4 border-t border-[#EBE5DC] dark:border-[#2A302C] text-xs">
                <div className="font-bold text-[#1E2320] dark:text-[#EDEAE4]">Jadwal Ibadah Mingguan:</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#5F6B63] dark:text-[#9DAAA0]">
                  <li>• Ibadah Pagi: Minggu, 09.00 - 11.00 WIB</li>
                  <li>• COC Kidz: Minggu, 09.30 - 10.30 WIB</li>
                  <li>• Grow Generation: Sabtu, 18.00 - 20.00 WIB</li>
                  <li>• Wanita Hana & Komsel: Selang-seling (18.00/18.30 WIB)</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
