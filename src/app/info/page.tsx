'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Bell,
  Calendar,
  Clock,
  MapPin,
  Users,
  Flame,
  Baby,
  HeartHandshake,
  ChevronRight,
  Hourglass,
  CheckCircle2,
  Sparkles,
  Printer,
  Filter,
} from 'lucide-react';
import { dataStore } from '@/lib/storage';
import { INITIAL_ANNOUNCEMENTS, INITIAL_ROSTER } from '@/lib/seedData';
import { Announcement, ServantRoster, MinistryCategory } from '@/types';

/**
 * Halaman /info — publik, fokus ke:
 *   1. Papan Warta (upcoming + count-down, past collapsed)
 *   2. Jadwal Pelayanan (Roster Ibadah)
 *
 * Tidak menampilkan Hero, About, Galeri, Kontak (ada di /home).
 * Styling konsisten dengan design system utama (Sacred Crimson + Warm Cream).
 */

type TimeFilter = 'all' | 'upcoming' | 'past';

function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function MiniCountdown({ targetDate }: { targetDate: string }) {
  const compute = () => {
    const target = new Date(`${targetDate}T00:00:00`).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return { days, hours, minutes };
  };
  const [cd, setCd] = useState(compute);
  useEffect(() => {
    setCd(compute());
    const id = setInterval(() => setCd(compute()), 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);
  if (!cd) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FEF9EC] dark:bg-[#332612] text-[#B87A14] dark:text-[#F0BE5E] text-[11px] font-bold border border-[#F8E3B5] dark:border-[#543E19]">
      <Hourglass className="w-3 h-3" />
      {cd.days > 0 ? `${cd.days} hari ` : ''}
      {cd.hours}j {cd.minutes}m lagi
    </span>
  );
}

function CategoryBadge({ category }: { category: MinistryCategory }) {
  const config: Record<MinistryCategory, { label: string; color: string }> = {
    general: {
      label: 'Ibadah Raya',
      color: 'bg-[#FDF0F0] dark:bg-[#331418] text-[#9A1620] dark:text-[#F2828C] border-[#F5CDD0] dark:border-[#521E25]',
    },
    youth: {
      label: 'Grow Youth',
      color: 'bg-[#FFF2EE] dark:bg-[#331812] text-[#C83E20] dark:text-[#F88B72] border-[#FCD2C7] dark:border-[#57241A]',
    },
    kidz: {
      label: 'COC Kidz',
      color: 'bg-[#FEF9EC] dark:bg-[#332612] text-[#B87A14] dark:text-[#F0BE5E] border-[#F8E3B5] dark:border-[#543E19]',
    },
    hana: {
      label: 'Wanita Hana',
      color: 'bg-[#FDF0F4] dark:bg-[#33121E] text-[#A6264A] dark:text-[#EA7FA0] border-[#F7C6D5] dark:border-[#541D30]',
    },
    all: {
      label: 'Umum',
      color: 'bg-[#F7F2E8] dark:bg-[#2A161A] text-[#5A4D4E] dark:text-[#D5C2C4] border-[#EBDDCF] dark:border-[#3A1C20]',
    },
  };
  const c = config[category];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${c.color}`}>
      {c.label}
    </span>
  );
}

function RosterCategoryLabel({ category }: { category: 'general' | 'youth' | 'kidz' | 'hana' }) {
  const labels = {
    general: 'Ibadah Raya',
    youth: 'Grow Youth',
    kidz: 'COC Kidz',
    hana: 'Wanita Hana',
  };
  return <span className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">{labels[category]}</span>;
}

export default function InfoPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [roster, setRoster] = useState<ServantRoster[]>(INITIAL_ROSTER);
  const [loading, setLoading] = useState(true);
  const [annCategory, setAnnCategory] = useState<MinistryCategory>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming');
  const [rosterCat, setRosterCat] = useState<'all' | 'general' | 'youth' | 'kidz' | 'hana'>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [annData, rosData] = await Promise.all([
          dataStore.getAnnouncements(),
          dataStore.getRoster(),
        ]);
        if (annData?.length) setAnnouncements(annData);
        if (rosData?.length) setRoster(rosData);
      } catch (err) {
        console.warn('Using initial fallback data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const today = todayStart();

  // Group announcements: upcoming vs past
  const upcomingAnn = announcements
    .filter((a) => {
      if (a.isPublished === false) return false;
      if (annCategory !== 'all' && a.category !== annCategory) return false;
      const d = new Date(a.eventDate);
      d.setHours(0, 0, 0, 0);
      return timeFilter === 'past' ? d < today : d >= today;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (timeFilter === 'past') {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      }
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    });

  const filteredRoster = roster
    .filter((r) => rosterCat === 'all' || r.serviceCategory === rosterCat)
    .sort((a, b) => new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime());

  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#150B0D] text-[#1F1617] dark:text-[#F5EFEB] transition-colors">
      <Navbar />

      {/* Page Header */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#FDFBF7] via-[#FDFBF7] to-[#F7F2E8]/40 dark:from-[#150B0D] dark:via-[#150B0D] dark:to-[#1A0E10] border-b border-[#EBDDCF] dark:border-[#3A1C20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C5222E]" />
            <span>Informasi Pelayanan Gereja</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] tracking-tight mb-3">
            Warta Jemaat & Jadwal Pelayanan
          </h1>
          <p className="text-base sm:text-lg text-[#5A4D4E] dark:text-[#D5C2C4] max-w-3xl leading-relaxed">
            Informasi terbaru seputar kegiatan ibadah, pelayanan, dan susunan
            petugas gereja GIA Deliksari Semarang. Dikontrol langsung oleh
            pengurus gereja melalui Portal Admin.
          </p>
        </div>
      </section>

      {/* ============== SECTION 1: PAPAN WARTA ============== */}
      <section id="warta" className="py-16 bg-[#FDFBF7] dark:bg-[#150B0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] flex items-center gap-3">
                <Bell className="w-7 h-7 text-[#C5222E]" />
                Papan Pengumuman & Warta
              </h2>
              <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                Warta jemaat, pengumuman kegiatan, dan info terkini.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-6 border-b border-[#EBDDCF] dark:border-[#3A1C20]">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Semua Kategori' },
                { id: 'general', label: 'Ibadah Raya' },
                { id: 'youth', label: 'Grow Youth' },
                { id: 'kidz', label: 'COC Kidz' },
                { id: 'hana', label: 'Wanita Hana' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setAnnCategory(c.id as MinistryCategory)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    annCategory === c.id
                      ? 'bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-sm'
                      : 'bg-white dark:bg-[#221215] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#F7F2E8] dark:bg-[#221215] p-1 rounded-xl border border-[#EBDDCF] dark:border-[#3A1C20]">
              <button
                onClick={() => setTimeFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  timeFilter === 'upcoming'
                    ? 'bg-white dark:bg-[#2A161A] text-[#1F1617] dark:text-white shadow-xs'
                    : 'text-[#6E5D5F] dark:text-[#B5A1A3] hover:text-[#1F1617]'
                }`}
              >
                <Hourglass className="w-3.5 h-3.5" />
                <span>Akan Datang</span>
              </button>
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeFilter === 'all'
                    ? 'bg-white dark:bg-[#2A161A] text-[#1F1617] dark:text-white shadow-xs'
                    : 'text-[#6E5D5F] dark:text-[#B5A1A3] hover:text-[#1F1617]'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setTimeFilter('past')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  timeFilter === 'past'
                    ? 'bg-white dark:bg-[#2A161A] text-[#1F1617] dark:text-white shadow-xs'
                    : 'text-[#6E5D5F] dark:text-[#B5A1A3] hover:text-[#1F1617]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sudah Berlalu</span>
              </button>
            </div>
          </div>

          {/* Announcements list */}
          {upcomingAnn.length === 0 ? (
            <div className="p-12 text-center rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] space-y-3">
              <Bell className="w-10 h-10 text-[#C5222E] mx-auto opacity-40" />
              <h3 className="font-bold text-base text-[#1F1617] dark:text-[#F5EFEB]">
                {timeFilter === 'past' ? 'Belum ada warta yang sudah berlalu.' : 'Belum ada warta untuk filter ini.'}
              </h3>
              <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                Warta diinput oleh pengurus gereja melalui Portal Admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingAnn.map((item) => (
                <div
                  key={item.id}
                  className={`p-7 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 ${
                    item.isPinned ? 'ring-2 ring-[#C5222E]/40' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CategoryBadge category={item.category} />
                      {item.isPinned && (
                        <span className="text-[11px] font-bold text-[#C5222E] dark:text-[#E03643]">
                          📌 Penting
                        </span>
                      )}
                    </div>

                    {timeFilter !== 'past' && <MiniCountdown targetDate={item.eventDate} />}

                    <h3 className="font-extrabold text-lg text-[#1F1617] dark:text-[#F5EFEB] leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5A4D4E] dark:text-[#D5C2C4] leading-relaxed line-clamp-4">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EBDDCF]/60 dark:border-[#3A1C20]/60 flex items-center justify-between text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#C5222E]" />
                      <span>{item.eventDate}</span>
                    </div>
                    {item.author && (
                      <span className="text-[10px] uppercase tracking-wider opacity-60">
                        {item.author}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============== SECTION 2: JADWAL PELAYANAN ============== */}
      <section id="jadwal" className="py-16 bg-[#F7F2E8]/40 dark:bg-[#1A0E10] border-y border-[#EBDDCF] dark:border-[#3A1C20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] flex items-center gap-3">
                <Clock className="w-7 h-7 text-[#C5222E]" />
                Jadwal Petugas Pelayanan (Roster)
              </h2>
              <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                Susunan pelayan firman, worship leader, band, multimedia, dan
                usher untuk ibadah mendatang.
              </p>
            </div>
          </div>

          {/* Roster Category Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { id: 'all', label: 'Semua Komunitas' },
              { id: 'general', label: '1. Ibadah Raya' },
              { id: 'youth', label: '2. Grow Youth' },
              { id: 'kidz', label: '3. COC Kidz' },
              { id: 'hana', label: '4. Wanita Hana' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setRosterCat(c.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  rosterCat === c.id
                    ? 'bg-[#C5222E] text-white shadow-sm'
                    : 'bg-white dark:bg-[#221215] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm">
            {filteredRoster.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                Belum ada jadwal petugas pelayanan untuk kategori ini.
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] border-b border-[#EBDDCF] dark:border-[#3A1C20]">
                  <tr>
                    <th className="p-4 font-bold">Kategori</th>
                    <th className="p-4 font-bold">Tanggal</th>
                    <th className="p-4 font-bold">Tugas / Peran</th>
                    <th className="p-4 font-bold">Nama Pelayan</th>
                    <th className="p-4 font-bold">Catatan</th>
                    <th className="p-4 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBDDCF]/60 dark:divide-[#3A1C20]/60">
                  {filteredRoster.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FDFBF7] dark:hover:bg-[#2A161A] transition-colors"
                    >
                      <td className="p-4">
                        <RosterCategoryLabel category={item.serviceCategory} />
                      </td>
                      <td className="p-4 text-[#5A4D4E] dark:text-[#D5C2C4] font-mono">
                        {item.serviceDate}
                      </td>
                      <td className="p-4 font-semibold text-[#C5222E] dark:text-[#E03643]">
                        {item.role}
                      </td>
                      <td className="p-4 text-[#1F1617] dark:text-[#F5EFEB] font-medium">
                        {item.servantName}
                      </td>
                      <td className="p-4 text-xs text-[#5A4D4E] dark:text-[#D5C2C4] max-w-xs">
                        {item.notes || <span className="italic opacity-60">—</span>}
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                              : item.status === 'replacement'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800/60'
                          }`}
                        >
                          {item.status === 'confirmed'
                            ? 'Siap Melayani'
                            : item.status === 'replacement'
                              ? 'Pengganti'
                              : 'Menunggu'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#FDFBF7] dark:bg-[#150B0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-[#FDF0F0] to-[#FFF2EE] dark:from-[#331418] dark:to-[#331812] border border-[#F5CDD0] dark:border-[#521E25] text-center space-y-4">
            <h3 className="text-2xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
              Ingin Melayani atau Punya Pertanyaan?
            </h3>
            <p className="text-sm text-[#5A4D4E] dark:text-[#D5C2C4] max-w-2xl mx-auto">
              Hubungi WhatsApp pastoral atau gunakan formulir pendaftaran di
              halaman beranda untuk terlibat dalam pelayanan GIA Deliksari.
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=6289620961103"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white font-bold text-sm shadow-md"
            >
              Hubungi WhatsApp Pastoral
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}