'use client';

import React, { useEffect, useState } from 'react';
import { Announcement, MinistryCategory } from '@/types';
import { dataStore } from '@/lib/storage';
import { Bell, Calendar, Pin, Filter } from 'lucide-react';

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'nextWeek' | 'thisMonth'>('all');
  const [categoryFilter, setCategoryFilter] = useState<MinistryCategory>('all');
  const [loading, setLoading] = useState(true);

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

  return (
    <section id="warta" className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
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

        {/* Announcements Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Memuat papan informasi...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              Tidak ada warta untuk filter yang dipilih saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-800 border transition-all duration-300 hover:shadow-lg ${
                    item.isPinned
                      ? 'border-amber-300 dark:border-amber-700/80 shadow-md ring-1 ring-amber-400/30'
                      : 'border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          <Pin className="w-3 h-3" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  {/* Footer Metadata */}
                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {item.eventDate}
                    </span>
                    {item.author && (
                      <span className="truncate max-w-[130px] font-semibold text-slate-700 dark:text-slate-300">
                        {item.author}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
