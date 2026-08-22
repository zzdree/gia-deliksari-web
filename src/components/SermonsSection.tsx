'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Sparkles, ExternalLink, BookOpen, User, Calendar } from 'lucide-react';
import { YouTubeIcon } from './Icons';

interface SermonItem {
  id: string;
  title: string;
  speaker: string;
  role: string;
  passage: string;
  date: string;
  youtubeUrl: string;
  thumbnail: string;
  badge: string;
  desc: string;
}

export default function SermonsSection() {
  const [selectedVideo, setSelectedVideo] = useState<SermonItem | null>(null);

  const sermons: SermonItem[] = [
    {
      id: 'sermon-1',
      title: 'Bertumbuh Dalam Iman, Kasih & Pengharapan',
      speaker: 'Ps. Yohanes Sutono',
      role: 'Gembala Sidang',
      passage: '1 Korintus 13:13 & Kolose 2:6-7',
      date: 'Minggu, 16 Agustus 2026',
      youtubeUrl: 'https://www.youtube.com/@GIADeliksariSemarang',
      thumbnail: '/images/gallery-1.jpg',
      badge: 'Ibadah Raya',
      desc: 'Membangun pondasi rohani yang kokoh di tengah pergumulan hidup agar hidup kita berakar kuat di dalam Kristus.',
    },
    {
      id: 'sermon-2',
      title: 'Generasi Yang Berkobar Bagi Kerajaan Allah',
      speaker: 'Kak Noel Yosan, S.Th.',
      role: 'Pelayanan Pemuda',
      passage: '1 Timotius 4:12 & Yeremia 29:11',
      date: 'Sabtu, 15 Agustus 2026',
      youtubeUrl: 'https://www.youtube.com/@GIADeliksariSemarang',
      thumbnail: '/images/gallery-2.jpg',
      badge: 'Grow Generation',
      desc: 'Menjadi teladan bagi sesama dalam perkataan, tingkah laku, kasih, kesetiaan, dan kesucian hidup di era digital.',
    },
    {
      id: 'sermon-3',
      title: 'Keluarga Yang Mengandalkan Hadirat Tuhan',
      speaker: 'Ps. Yohanes Sutono',
      role: 'Gembala Sidang',
      passage: 'Yosua 24:15 & Mazmur 127:1-2',
      date: 'Minggu, 09 Agustus 2026',
      youtubeUrl: 'https://www.youtube.com/@GIADeliksariSemarang',
      thumbnail: '/images/gallery-3.jpg',
      badge: 'Ibadah Raya',
      desc: 'Rahasia keluarga bahagia dan diberkati ketika mezbah doa keluarga senantiasa didirikan setiap hari.',
    },
  ];

  return (
    <section id="khotbah" className="py-20 bg-slate-900 text-white border-y border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider">
              <YouTubeIcon className="w-3.5 h-3.5" />
              <span>Arsip Khotbah & Streaming</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pemberitaan Firman & Khotbah Mingguan
            </h2>
            <p className="text-slate-400 text-base">
              Dengarkan kembali pesan penggembalaan dan pengajaran Alkitabiah yang mengubahkan hidup, kapan pun dan di mana pun.
            </p>
          </div>

          <div>
            <a
              href="https://www.youtube.com/@GIADeliksariSemarang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <YouTubeIcon className="w-5 h-5" />
              <span>Kunjungi Channel YouTube Resmi</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sermons.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-3xl bg-slate-800/90 border border-slate-700 hover:border-amber-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail Container with Play overlay */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 opacity-80 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                    {item.badge}
                  </span>
                </div>

                {/* Play Button Trigger */}
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                </a>
              </div>

              {/* Sermon Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.speaker}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{item.role}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{item.passage}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-3 border-t border-slate-700/60">
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-700/80 hover:bg-red-600 text-slate-200 hover:text-white text-xs font-bold transition-colors"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                    <span>Tonton Khotbah Penuh</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
