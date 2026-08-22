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
      badgeColor: 'bg-[#EBF1EC] text-[#44634D] border-[#D1E0D5] dark:bg-[#202923] dark:text-[#7EA88A] dark:border-[#2C3B31]',
      borderAccent: 'border-[#44634D]/30',
      badge: '1. Ibadah Raya (General)',
    },
    {
      category: 'youth',
      title: 'Grow Generation (PRBK Youth)',
      day: 'Setiap Hari Sabtu Sore',
      time: '18.00 - 20.00 WIB',
      location: 'Youth Hall GIA Deliksari',
      target: 'Remaja, Pemuda & Mahasiswa',
      badgeColor: 'bg-[#FAEEE5] text-[#C27338] border-[#ECD1C0] dark:bg-[#2A201A] dark:text-[#E8A576] dark:border-[#4A3427]',
      borderAccent: 'border-[#C27338]/30',
      badge: '2. Grow Generation (Youth)',
    },
    {
      category: 'kidz',
      title: 'COC Kidz (Sekolah Minggu)',
      day: 'Setiap Hari Minggu',
      time: '09.30 - 10.30 WIB',
      location: 'Ruang Kelas Anak KAA',
      target: 'Anak Usia Balita s/d Sekolah Dasar',
      badgeColor: 'bg-[#FBF4E7] text-[#C89434] border-[#F1DEC0] dark:bg-[#2B2317] dark:text-[#E2B35B] dark:border-[#423421]',
      borderAccent: 'border-[#C89434]/30',
      badge: '3. COC Kidz (Sekolah Minggu)',
    },
    {
      category: 'hana-komsel',
      title: 'Hana Fellowship & Komsel Ekklesia',
      day: 'Rotasi Mingguan (Selang-Seling)',
      time: 'Hana: 18.00 - 20.00 | Komsel: 18.30 - 20.00 WIB',
      location: 'Gedung Gereja & Rumah Jemaat',
      target: 'Kaum Wanita & Komunitas Sel Keluarga',
      badgeColor: 'bg-[#FAECF0] text-[#B35667] border-[#EFCAD2] dark:bg-[#2B1B20] dark:text-[#DF8596] dark:border-[#4A2631]',
      borderAccent: 'border-[#B35667]/30',
      badge: '4. Hana & Komsel Ekklesia',
    },
  ];

  const weeklyActivities = [
    {
      title: 'Kunjungan Jemaat & Pastoral Care',
      day: 'Setiap Hari Selasa',
      time: 'Sesuai Jadwal Kunjungan',
      desc: 'Pelayanan doa, penguatan, dan kunjungan kasih oleh Tim Pastoral ke kediaman jemaat.',
      icon: HeartHandshake,
      color: 'text-[#44634D] dark:text-[#7EA88A] bg-[#EBF1EC] dark:bg-[#202923] border-[#D1E0D5] dark:border-[#2C3B31]',
    },
    {
      title: 'Latihan Musik Umum & Pembekalan Pelayan',
      day: 'Setiap Hari Sabtu',
      time: 'Jam Fleksibel (Sebelum Youth)',
      desc: 'Persiapan rohani dan teknis bagi seluruh musisi, singer, WL, dan tim multimedia sebelum ibadah.',
      icon: Music,
      color: 'text-[#C27338] dark:text-[#E8A576] bg-[#FAEEE5] dark:bg-[#2A201A] border-[#ECD1C0] dark:border-[#4A3427]',
    },
    {
      title: 'Rotasi Komsel & Wanita Hana (4 Minggu/Bulan)',
      day: 'Jadwal Berkala',
      time: '1 Minggu Hana, 1 Minggu Komsel',
      desc: 'Membangun keintiman persekutuan selang-seling setiap minggu agar seluruh jemaat terayomi.',
      icon: RefreshCw,
      color: 'text-[#C89434] dark:text-[#E2B35B] bg-[#FBF4E7] dark:bg-[#2B2317] border-[#F1DEC0] dark:border-[#423421]',
    },
  ];

  return (
    <section id="jadwal" className="py-24 bg-[#FAF8F5] dark:bg-[#141715] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Jadwal & Agenda Ibadah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
            Jadwal Ibadah & Pelayanan Mingguan
          </h2>
          <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base sm:text-lg leading-relaxed">
            Mari bertumbuh bersama dalam persekutuan doa, pujian penyembahan, dan pengajaran firman Tuhan di GIA Deliksari Semarang.
          </p>
        </div>

        {/* Main Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {mainSchedules.map((item) => (
            <div
              key={item.title}
              className={`p-7 sm:p-9 rounded-[2rem] border bg-white dark:bg-[#1B201D] shadow-sm hover:shadow-md transition-all ${item.borderAccent}`}
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wide border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-xs font-semibold text-[#6B7870] dark:text-[#9DAAA0]">
                  {item.target}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] mb-4">
                {item.title}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-[#3D4741] dark:text-[#C5CDC7]">
                  <Calendar className="w-4 h-4 text-[#44634D] dark:text-[#7EA88A] shrink-0" />
                  <span className="font-semibold">{item.day}</span>
                </div>
                <div className="flex items-center gap-3 text-[#1E2320] dark:text-white">
                  <Clock className="w-4 h-4 text-[#C27338] shrink-0" />
                  <span className="font-bold text-[#C27338] dark:text-[#D9894E] text-base">{item.time}</span>
                </div>
                <div className="flex items-center gap-3 text-[#5F6B63] dark:text-[#9DAAA0]">
                  <MapPin className="w-4 h-4 text-[#7A877E] shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Activities Highlights */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#1E2320] dark:text-[#EDEAE4]">
              Aktivitas Pelayanan Sepekan
            </h3>
            <p className="text-sm text-[#5F6B63] dark:text-[#9DAAA0] mt-1">
              Komitmen pembinaan rohani dan penggembalaan jemaat setiap minggu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weeklyActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.title}
                  className="p-7 rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${act.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-[#6B7870] dark:text-[#9DAAA0]">
                      {act.day}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4]">
                      {act.title}
                    </h4>
                    <p className="text-xs font-semibold text-[#C27338] dark:text-[#D9894E] mt-1">
                      {act.time}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Servant Roster Highlight */}
        {roster.length > 0 && (
          <div className="mt-16 p-8 rounded-[2.5rem] bg-[#F5F1E9]/60 dark:bg-[#181C19]/60 border border-[#E5DDD0] dark:border-[#2A312B]">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-[#44634D] dark:text-[#7EA88A]" />
              <h4 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4]">
                Jadwal Pelayan Ibadah Minggu Ini
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {roster.slice(0, 4).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] space-y-1">
                  <span className="text-[11px] font-bold text-[#C27338] dark:text-[#D9894E] uppercase">
                    {item.role}
                  </span>
                  <p className="font-bold text-sm text-[#1E2320] dark:text-[#EDEAE4]">{item.servantName}</p>
                  <p className="text-xs text-[#6B7870] dark:text-[#8E9B92]">{item.serviceDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
