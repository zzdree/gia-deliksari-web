'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { YouTubeIcon, InstagramIcon } from './Icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FDFBF7] dark:bg-[#110809] border-t border-[#EBDDCF] dark:border-[#3A1C20] text-[#5A4D4E] dark:text-[#D5C2C4] transition-colors">
      
      {/* Top Strip: Service Times & Location */}
      <div className="border-b border-[#EBDDCF] dark:border-[#3A1C20] py-8 bg-[#F7F2E8]/70 dark:bg-[#1A0E10]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] flex items-center justify-center text-[#C5222E] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#1F1617] dark:text-[#F5EFEB] block">
                  Ibadah Raya Minggu: 09.00 - 11.00 WIB
                </span>
                <span className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                  Sanctuary GIA Deliksari & Live Streaming
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF2EE] dark:bg-[#331812] flex items-center justify-center text-[#C83E20] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#1F1617] dark:text-[#F5EFEB] block">
                  Grow Generation Youth: Sabtu 18.00 WIB
                </span>
                <span className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                  Persekutuan Pemuda & Remaja (PRBK)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF9EC] dark:bg-[#332612] flex items-center justify-center text-[#B87A14] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#1F1617] dark:text-[#F5EFEB] block">
                  Deliksari, Gunungpati, Semarang
                </span>
                <span className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                  Jl. Kolonel Hadijanto (Kawasan UNNES)
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Col 1: Church Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-[#C5222E]/30 bg-white p-0.5 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="GIA Deliksari Logo"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div>
                <span className="font-extrabold text-base text-[#1F1617] dark:text-[#F5EFEB] block">
                  GIA DELIKSARI SEMARANG
                </span>
                <span className="text-xs font-bold text-[#C5222E] dark:text-[#E03643]">
                  GROWING CHURCH! 🔥
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-[#5A4D4E] dark:text-[#D5C2C4]">
              Gereja Isa Almasih Deliksari adalah persekutuan keluarga Allah yang setia berakar dalam firman, bertumbuh dalam kasih, dan melayani sesama di Kota Semarang.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/giadeliksari/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram GIA Deliksari"
                className="w-9 h-9 rounded-xl bg-[#F7F2E8] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] flex items-center justify-center text-[#5A4D4E] hover:text-[#C5222E] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/growgeneration_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Grow Generation Youth"
                className="w-9 h-9 rounded-xl bg-[#F7F2E8] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] flex items-center justify-center text-[#5A4D4E] hover:text-[#C5222E] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/cockidz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram COC Kidz"
                className="w-9 h-9 rounded-xl bg-[#F7F2E8] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] flex items-center justify-center text-[#5A4D4E] hover:text-[#C5222E] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@GIADeliksariSemarang"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube GIA Deliksari"
                className="w-9 h-9 rounded-xl bg-[#F7F2E8] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] flex items-center justify-center text-[#5A4D4E] hover:text-[#C5222E] transition-colors"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F1617] dark:text-[#F5EFEB]">
              Navigasi Halaman
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a href="#kunjungan" className="hover:text-[#C5222E] transition-colors">Panduan Tamu</a>
              <a href="#tentang" className="hover:text-[#C5222E] transition-colors">Tentang Gereja</a>
              <a href="#pelayanan" className="hover:text-[#C5222E] transition-colors">Komunitas</a>
              <a href="#khotbah" className="hover:text-[#C5222E] transition-colors">Arsip Khotbah</a>
              <a href="#warta" className="hover:text-[#C5222E] transition-colors">Warta Jemaat</a>
              <a href="#jadwal" className="hover:text-[#C5222E] transition-colors">Jadwal Ibadah</a>
              <a href="#layanan" className="hover:text-[#C5222E] transition-colors">Layanan Doa</a>
              <a href="#persembahan" className="hover:text-[#C5222E] transition-colors">Persembahan</a>
              <a href="#galeri" className="hover:text-[#C5222E] transition-colors">Galeri Momen</a>
              <a href="#kontak" className="hover:text-[#C5222E] transition-colors">Peta & Kontak</a>
            </div>
          </div>

          {/* Col 3: Portal Admin Card */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F1617] dark:text-[#F5EFEB]">
              Administrasi Gereja
            </h4>
            <div className="p-5 rounded-2xl bg-[#F7F2E8] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] space-y-3">
              <span className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4] block">
                Khusus majelis, pengurus warta, dan tim media.
              </span>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Masuk Portal Admin</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#EBDDCF]/60 dark:border-[#3A1C20]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
          <p>© {currentYear} Gereja Isa Almasih (GIA) Deliksari Semarang. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            <span>Dirancang dengan</span>
            <Heart className="w-3.5 h-3.5 fill-[#C5222E] text-[#C5222E]" />
            <span>untuk Kemuliaan Kristus</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
