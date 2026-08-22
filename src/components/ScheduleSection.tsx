'use client';

import React, { useEffect, useState } from 'react';
import { ServantRoster } from '@/types';
import { dataStore } from '@/lib/storage';
import { Clock, Calendar, Users, MapPin, CheckCircle2, Music, HeartHandshake, RefreshCw } from 'lucide-react';

export default function ScheduleSection() {
  const [roster, setRoster] = useState<ServantRoster[]>([]);

  useEffect(() => {
    async function loadRoster() {
      const data = await dataStore.getRoster();
      setRoster(data);
    }
    loadRoster();
  }, []);

  const mainSchedules = [
    {
      category: 'general',
      title: 'Ibadah Pagi / Ibadah Raya Umum',
      day: 'Setiap Hari Minggu',
      time: '09.00 - 11.00 WIB',
      location: 'Ruang Utama Sanctuary GIA Deliksari',
      target: 'Seluruh Keluarga & Jemaat Umum',
      color: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
      badge: 'Ibadah Raya',
    },
    {
      category: 'kidz',
      title: 'COC Kidz (Sekolah Minggu)',
      day: 'Setiap Hari Minggu',
      time: '09.30 - 10.30 WIB',
      location: 'Ruang Kelas Anak KAA',
      target: 'Anak Usia Balita s/d Sekolah Dasar',
      color: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
      badge: 'Sekolah Minggu',
    },
    {
      category: 'youth',
      title: 'Grow Generation (PRBK Youth)',
      day: 'Setiap Hari Sabtu Sore',
      time: '18.00 - 20.00 WIB',
      location: 'Youth Hall GIA Deliksari',
      target: 'Remaja, Pemuda & Mahasiswa',
      color: 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20',
      badge: 'Youth & Teen',
    },
    {
      category: 'hana-komsel',
      title: 'Hana Fellowship & Komsel Ekklesia',
      day: 'Rotasi Mingguan (Selang-Seling)',
      time: 'Hana: 18.00 - 20.00 | Komsel: 18.30 - 20.00 WIB',
      location: 'Gedung Gereja & Rumah Jemaat',
      target: 'Kaum Wanita & Komunitas Sel Keluarga',
      color: 'border-pink-500 bg-pink-50/40 dark:bg-pink-950/20',
      badge: 'Persekutuan Komunitas',
    },
  ];

  const weeklyActivities = [
    {
      title: 'Kunjungan Jemaat & Pastoral Care',
      day: 'Setiap Hari Selasa',
      time: 'Sesuai Jadwal Kunjungan',
      desc: 'Pelayanan doa, penguatan, dan kunjungan kasih oleh Tim Pastoral ke kediaman jemaat.',
      icon: HeartHandshake,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60',
    },
    {
      title: 'Latihan Musik Umum & Pembekalan Pelayan',
      day: 'Setiap Hari Sabtu',
      time: 'Jam Fleksibel (Sebelum Youth)',
      desc: 'Persiapan rohani dan teknis bagi seluruh musisi, singer, WL, dan tim multimedia sebelum ibadah.',
      icon: Music,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60',
    },
    {
      title: 'Rotasi Komsel & Wanita Hana (4 Minggu/Bulan)',
      day: 'Jadwal Berkala',
      time: '1 Minggu Hana, 1 Minggu Komsel',
      desc: 'Membangun keintiman persekutuan selang-seling setiap minggu agar seluruh jemaat terayomi.',
      icon: RefreshCw,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60',
    },
  ];

  return (
    <section id="jadwal" className="py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Jadwal & Agenda Ibadah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Jadwal Ibadah & Pelayanan Mingguan
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Mari bertumbuh bersama dalam persekutuan doa, pujian penyembahan, dan pengajaran firman Tuhan di GIA Deliksari Semarang.
          </p>
        </div>

        {/* Main Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {mainSchedules.map((item) => (
            <div
              key={item.title}
              className={`p-6 sm:p-8 rounded-3xl border-2 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all ${item.color}`}
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950">
                  {item.badge}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.target}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {item.title}
              </h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-semibold">{item.day}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-base">{item.time}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Regular Ministry Agenda */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Agenda Pelayanan & Pembinaan Rutin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weeklyActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.title}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                      {act.day} • {act.time}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {act.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Servant Roster Preview */}
        {roster.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white dark:bg-slate-800/90 border border-slate-800 dark:border-slate-700 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800 dark:border-slate-700">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Jadwal Pelayan Bertugas Minggu Ini</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold">
                  Petugas Pelayanan Ibadah Raya
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                ✓ Roster Terkonfirmasi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {roster.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700 space-y-1.5"
                >
                  <div className="text-xs font-semibold text-amber-400">
                    {item.role}
                  </div>
                  <div className="font-bold text-base text-white">
                    {item.servantName}
                  </div>
                  {item.notes && (
                    <div className="text-xs text-slate-400">
                      {item.notes}
                    </div>
                  )}
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tersedia & Siap Melayani</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
