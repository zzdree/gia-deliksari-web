'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Flame, 
  Baby, 
  HeartHandshake, 
  Sparkles, 
  Music, 
  Car,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { dataStore } from '@/lib/storage';
import { INITIAL_ROSTER } from '@/lib/seedData';
import { ServantRoster } from '@/types';

export default function ScheduleSection() {
  const [roster, setRoster] = useState<ServantRoster[]>(INITIAL_ROSTER);

  useEffect(() => {
    const loadRoster = async () => {
      try {
        const data = await dataStore.getRoster();
        if (data && data.length > 0) {
          setRoster(data);
        }
      } catch (err) {
        console.warn('Using initial roster fallback:', err);
      }
    };
    loadRoster();
  }, []);

  const primaryServices = [
    {
      name: 'Ibadah Raya Umum',
      day: 'Setiap Hari Minggu',
      time: '09.00 - 11.00 WIB',
      category: 'Ibadah Utama',
      desc: 'Pujian penyembahan bersama DS Worship, firman penggembalaan Ps. Yohanes Sutono, dan perjamuan kudus.',
      badgeColor: 'bg-[#FDF0F0] text-[#9A1620] border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]',
      accentColor: 'border-l-4 border-l-[#C5222E]',
    },
    {
      name: 'Grow Generation Youth',
      day: 'Setiap Hari Sabtu',
      time: '18.00 - 20.00 WIB',
      category: 'Pemuda & Remaja (PRBK)',
      desc: 'Fellowship pemuda & remaja bersama Kak Noel Yosan, S.Th. dengan praise & worship interaktif.',
      badgeColor: 'bg-[#FFF2EE] text-[#C83E20] border-[#FCD2C7] dark:bg-[#331812] dark:text-[#F88B72] dark:border-[#57241A]',
      accentColor: 'border-l-4 border-l-[#C83E20]',
    },
    {
      name: 'COC Kidz (Sekolah Minggu)',
      day: 'Setiap Hari Minggu',
      time: '09.30 - 10.30 WIB',
      category: 'Anak-Anak & Balita',
      desc: 'Ibadah anak dengan cerita Alkitab interaktif, aktivitas kreatif, dan puji-pujian penuh sukacita.',
      badgeColor: 'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]',
      accentColor: 'border-l-4 border-l-[#C59B27]',
    },
    {
      name: 'Persekutuan Hana & Komsel',
      day: 'Minggu Bergantian (4 Minggu)',
      time: '18.00 / 18.30 WIB',
      category: 'Wanita & Kelompok Sel',
      desc: 'Minggu 1 & 3: Persekutuan Wanita Hana (18.00 WIB). Minggu 2 & 4: Komsel Ekklesia di rumah jemaat (18.30 WIB).',
      badgeColor: 'bg-[#FDF0F4] text-[#A6264A] border-[#F7C6D5] dark:bg-[#33121E] dark:text-[#EA7FA0] dark:border-[#541D30]',
      accentColor: 'border-l-4 border-l-[#A6264A]',
    },
  ];

  const weeklyActivities = [
    {
      title: 'Kunjungan Penggembalaan Jemaat',
      day: 'Setiap Hari Selasa',
      time: 'Waktu Fleksibel (Sesuai Janji)',
      desc: 'Pelayanan pastoral door-to-door, doa berkat rumah tangga, dan konseling bersama Ps. Yohanes Sutono.',
      icon: Car,
      color: 'bg-[#FDF0F0] text-[#C5222E] border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C]',
    },
    {
      title: 'Latihan Musik & Pelayan Altar',
      day: 'Setiap Hari Sabtu',
      time: 'Waktu Fleksibel (Sore / Menjelang Youth)',
      desc: 'Persiapan rohani dan teknis para musisi, singer, worship leader, dan tim multimedia untuk ibadah raya.',
      icon: Music,
      color: 'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E]',
    },
  ];

  return (
    <section id="jadwal" className="py-24 bg-[#F7F2E8]/60 dark:bg-[#1A0E10]/60 border-y border-[#EBDDCF] dark:border-[#3A1C20] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#C5222E]" />
            <span>Agenda & Waktu Beribadah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] tracking-tight">
            Jadwal Ibadah & Pelayanan Mingguan
          </h2>
          <p className="text-[#5A4D4E] dark:text-[#D5C2C4] text-base sm:text-lg leading-relaxed">
            Mari hadir bersama keluarga untuk menyembah Tuhan dan bersekutu dalam hadirat-Nya yang kudus di GIA Deliksari.
          </p>
        </div>

        {/* 4 Primary Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {primaryServices.map((service) => (
            <div
              key={service.name}
              className={`p-7 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 ${service.accentColor}`}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${service.badgeColor}`}>
                    {service.category}
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5222E] dark:text-[#E03643]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.time}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                    {service.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#6E5D5F] dark:text-[#B5A1A3] mt-0.5">
                    {service.day}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#5A4D4E] dark:text-[#D5C2C4] leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EBDDCF]/60 dark:border-[#3A1C20]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#6E5D5F] dark:text-[#B5A1A3]">
                  <MapPin className="w-3.5 h-3.5 text-[#C5222E]" />
                  <span>Sanctuary GIA Deliksari</span>
                </div>
                <a
                  href="#layanan"
                  className="font-bold text-[#C5222E] dark:text-[#E03643] hover:underline flex items-center gap-0.5"
                >
                  <span>Daftar Pelayanan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Activities (Pastoral Visit & Music Rehearsal) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {weeklyActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.title}
                className="p-7 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm flex items-start gap-5"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${act.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#C5222E] dark:text-[#E03643] bg-[#FDF0F0] dark:bg-[#331418] px-2.5 py-0.5 rounded-lg border border-[#F5CDD0] dark:border-[#521E25]">
                      {act.day}
                    </span>
                    <span className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">{act.time}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                    {act.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5A4D4E] dark:text-[#D5C2C4] leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Servant Roster Table */}
        <div className="rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBDDCF] dark:border-[#3A1C20]">
            <div>
              <h3 className="text-xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                Jadwal Petugas Pelayanan (Roster Ibadah)
              </h3>
              <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                Susunan pelayan firman, musik, multimedia, dan usher untuk ibadah mendatang
              </p>
            </div>
            <a
              href="#layanan"
              className="px-4 py-2 rounded-xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#C5222E] dark:text-[#E03643] hover:bg-[#FDF0F0] text-xs font-bold transition-colors self-start sm:self-auto"
            >
              Ajukan Jadwal Pelayanan
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#EBDDCF] dark:border-[#3A1C20] text-[#6E5D5F] dark:text-[#B5A1A3]">
                  <th className="pb-3 font-bold">Kategori</th>
                  <th className="pb-3 font-bold">Tanggal</th>
                  <th className="pb-3 font-bold">Tugas / Peran</th>
                  <th className="pb-3 font-bold">Nama Pelayan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBDDCF]/60 dark:divide-[#3A1C20]/60">
                {roster.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDFBF7] dark:hover:bg-[#2A161A] transition-colors">
                    <td className="py-3.5 pr-3 font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                      {item.serviceCategory === 'general'
                        ? 'Ibadah Raya'
                        : item.serviceCategory === 'youth'
                        ? 'Grow Youth'
                        : item.serviceCategory === 'kidz'
                        ? 'COC Kidz'
                        : 'Hana & Komsel'}
                    </td>
                    <td className="py-3.5 pr-3 text-[#5A4D4E] dark:text-[#D5C2C4] font-mono">
                      {item.serviceDate}
                    </td>
                    <td className="py-3.5 pr-3 font-semibold text-[#C5222E] dark:text-[#E03643]">
                      {item.role}
                    </td>
                    <td className="py-3.5 text-[#1F1617] dark:text-[#F5EFEB]">
                      {item.servantName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
