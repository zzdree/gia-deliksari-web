'use client';

import React, { useEffect, useState } from 'react';
import { ServantRoster } from '@/types';
import { dataStore } from '@/lib/storage';
import { Clock, Calendar, Users, MapPin, CheckCircle2 } from 'lucide-react';

export default function ScheduleSection() {
  const [roster, setRoster] = useState<ServantRoster[]>([]);

  useEffect(() => {
    async function loadRoster() {
      const data = await dataStore.getRoster();
      setRoster(data);
    }
    loadRoster();
  }, []);

  const schedules = [
    {
      category: 'general',
      title: 'Ibadah Raya / General Service',
      day: 'Setiap Hari Minggu',
      time: '07.00 - 08.30 WIB',
      location: 'Ruang Utama Sanctuary GIA Deliksari',
      target: 'Seluruh Keluarga & Jemaat Umum',
      color: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
      badge: 'Ibadah Raya',
    },
    {
      category: 'kidz',
      title: 'COC Kidz (Sekolah Minggu)',
      day: 'Setiap Hari Minggu',
      time: '08.00 - 09.30 WIB',
      location: 'Ruang Kelas Anak KAA',
      target: 'Anak Usia 3 - 12 Tahun',
      color: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
      badge: 'Sekolah Minggu',
    },
    {
      category: 'youth',
      title: 'Grow Generation (Youth & Teen)',
      day: 'Setiap Hari Sabtu Sore',
      time: '17.00 - 18.30 WIB',
      location: 'Youth Hall GIA Deliksari',
      target: 'Remaja, Pemuda & Mahasiswa',
      color: 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20',
      badge: 'Youth & Teen',
    },
    {
      category: 'hana',
      title: 'Persekutuan Wanita Hana',
      day: 'Setiap Hari Selasa Sore',
      time: '16.30 - 18.00 WIB',
      location: 'Ruang Serbaguna GIA Deliksari',
      target: 'Kaum Ibu & Wanita Jemaat',
      color: 'border-pink-500 bg-pink-50/40 dark:bg-pink-950/20',
      badge: 'Kaum Wanita',
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
            Jadwal Ibadah Mingguan GIA Deliksari
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Bergabunglah bersama kami dalam persekutuan doa, pujian, penyembahan, dan pengajaran firman Tuhan.
          </p>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {schedules.map((item) => (
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
                  <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span className="font-semibold">{item.day}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span className="font-bold text-amber-600 dark:text-amber-400">{item.time}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview of Upcoming Servant Roster */}
        {roster.length > 0 && (
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>Petugas Pelayan Ibadah Minggu Ini</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Jadwal pelayanan yang telah terverifikasi oleh tim kordinator.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Roster Terbit</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roster.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                      {r.role}
                    </span>
                    <span className="text-slate-400">{r.serviceDate}</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {r.servantName}
                  </p>
                  {r.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      {r.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
