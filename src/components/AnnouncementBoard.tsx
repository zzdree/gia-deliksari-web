'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Announcement, MinistryCategory } from '@/types';
import { dataStore } from '@/lib/storage';
import { Bell, Calendar, Pin, Filter, Printer, Download, X, CheckCircle, Sparkles } from 'lucide-react';

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
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        };
      case 'youth':
        return {
          label: 'Grow Generation',
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        };
      case 'hana':
        return {
          label: 'Hana Fellowship',
          color: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border-pink-300 dark:border-pink-800',
        };
      case 'general':
      default:
        return {
          label: 'Umum & Ibadah Raya',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
    }
  };

  const handlePrintBulletin = () => {
    window.print();
  };

  return (
    <section id="warta" className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" />
              <span>Papan Warta Jemaat</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Papan Informasi & Pengumuman Terkini
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Informasi agenda kegiatan, warta jemaat untuk minggu depan dan bulan ini.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowBulletinModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Lihat & Cetak Buletin Warta</span>
            </button>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Time Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                timeFilter === 'all'
                  ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Semua Warta
            </button>
            <button
              onClick={() => setTimeFilter('nextWeek')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                timeFilter === 'nextWeek'
                  ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              📅 Minggu Depan
            </button>
            <button
              onClick={() => setTimeFilter('thisMonth')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                timeFilter === 'thisMonth'
                  ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              🗓️ Bulan Ini
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MinistryCategory)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">Semua Kategori Pelayanan</option>
              <option value="general">Ibadah Raya / Umum</option>
              <option value="youth">Grow Generation (Youth)</option>
              <option value="kidz">COC Kidz (Sekolah Minggu)</option>
              <option value="hana">Hana Fellowship (Wanita)</option>
            </select>
          </div>
        </div>

        {/* Announcements List Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3" />
            <p className="text-sm font-medium">Memuat warta jemaat terkini...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              Belum Ada Pengumuman pada Filter Ini
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
                  className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-800 border p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${
                    item.isPinned
                      ? 'border-amber-400 dark:border-amber-600/80 ring-2 ring-amber-400/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Metadata Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                          <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Penting</span>
                        </span>
                      )}
                    </div>

                    {/* Announcement Title & Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  {/* Footer Event Date & Author */}
                  <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-10 space-y-8">
            
            {/* Modal Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-base sm:text-lg">Pratinjau Buletin Warta Mingguan</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintBulletin}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Print PDF</span>
                </button>
                <button
                  onClick={() => setShowBulletinModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bulletin Printable Area */}
            <div className="space-y-6 text-left">
              {/* Bulletin Header */}
              <div className="text-center pb-6 border-b-2 border-amber-500 space-y-2">
                <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden mb-2">
                  <Image src="/images/logo.png" alt="GIA Deliksari" fill className="object-cover" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">GEREJA ISA ALMASIH DELIKSARI SEMARANG</h2>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  &ldquo;GROWING CHURCH IN FAITH, LOVE, AND HOPE&rdquo;
                </p>
                <p className="text-xs text-slate-500">
                  Jl. Kolonel Hadijanto, Deliksari, Gunung Pati, Kota Semarang, Jawa Tengah
                </p>
              </div>

              {/* Weekly Verse & Pastoral Note */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-sm space-y-1">
                <div className="font-bold text-amber-700 dark:text-amber-400">Pesan Penggembalaan:</div>
                <p className="italic text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  &ldquo;Karena itu, saudara-saudaraku yang kekasih, berdirilah teguh, jangan goyah, dan giatlah selalu dalam pekerjaan Tuhan!&rdquo; (1 Korintus 15:58)
                </p>
                <div className="text-xs text-right font-semibold text-slate-600 dark:text-slate-400">
                  — Ps. Yohanes Sutono & Ibu Santini
                </div>
              </div>

              {/* Announcements Section */}
              <div className="space-y-4">
                <h4 className="text-base font-bold uppercase tracking-wider border-b pb-2">
                  Warta & Pengumuman Jemaat
                </h4>
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-600 dark:text-amber-400">{ann.title}</span>
                        <span className="text-slate-500 font-mono">{ann.eventDate}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Schedule Summary */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Jadwal Ibadah Mingguan:</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
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
