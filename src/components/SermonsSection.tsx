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
    <section id="khotbah" className="py-24 bg-[#141715] text-[#EDEAE4] border-y border-[#262D28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#202923] border border-[#2C3B31] text-[#7EA88A] text-xs font-bold uppercase tracking-wider">
              <YouTubeIcon className="w-3.5 h-3.5" />
              <span>Arsip Khotbah & Streaming</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pemberitaan Firman & Khotbah Mingguan
            </h2>
            <p className="text-[#9DAAA0] text-base leading-relaxed">
              Dengarkan kembali pesan penggembalaan dan pengajaran Alkitabiah yang mengubahkan hidup, kapan pun dan di mana pun.
            </p>
          </div>

          <div>
            <a
              href="https://www.youtube.com/@GIADeliksariSemarang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#C27338] hover:bg-[#A9602A] text-white font-bold text-sm shadow-sm transition-all"
            >
              <YouTubeIcon className="w-4 h-4" />
              <span>Channel YouTube Resmi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sermons.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-[2rem] bg-[#1B201D] border border-[#2A312B] overflow-hidden shadow-sm hover:border-[#44634D]/60 transition-all duration-300"
            >
              {/* Thumbnail with Play Trigger */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#242A26]">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141715]/90 via-[#141715]/20 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-[#141715]/80 backdrop-blur-md border border-white/15 text-[#D1E5D7]">
                    {item.badge}
                  </span>
                </div>

                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center group/btn"
                  title="Tonton di YouTube"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#44634D]/90 group-hover/btn:bg-[#C27338] backdrop-blur-md flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover/btn:scale-110">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </a>
              </div>

              {/* Sermon Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#8E9B92]">
                    <Calendar className="w-3.5 h-3.5 text-[#C27338]" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#7EA88A] transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9DAAA0] leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#262D28] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#C5CDC7]">
                    <User className="w-3.5 h-3.5 text-[#7EA88A]" />
                    <span className="font-semibold">{item.speaker}</span>
                    <span className="text-[#6B7870]">({item.role})</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#9DAAA0]">
                    <BookOpen className="w-3.5 h-3.5 text-[#C27338]" />
                    <span className="font-mono text-[11px]">{item.passage}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
