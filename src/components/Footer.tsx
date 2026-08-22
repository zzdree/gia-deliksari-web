import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FAF8F5] dark:bg-[#111412] border-t border-[#EBE5DC] dark:border-[#2A302C] text-[#5F6B63] dark:text-[#9DAAA0] transition-colors">
      
      {/* Top Banner: Service Times & Address Strip */}
      <div className="border-b border-[#EBE5DC] dark:border-[#2A302C] bg-[#F5F1E9]/80 dark:bg-[#161A17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EBF1EC] dark:bg-[#202923] flex items-center justify-center text-[#44634D] dark:text-[#7EA88A] shrink-0 border border-[#D1E0D5] dark:border-[#2C3B31]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#1E2320] dark:text-[#EDEAE4] block">Ibadah Raya Mingguan</span>
                <span className="text-xs text-[#6B7870] dark:text-[#8E9B92]">Minggu, 09.00 - 11.00 WIB Onsite</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FAEEE5] dark:bg-[#2A201A] flex items-center justify-center text-[#C27338] dark:text-[#E8A576] shrink-0 border border-[#ECD1C0] dark:border-[#4A3427]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#1E2320] dark:text-[#EDEAE4] block">Grow Generation Youth</span>
                <span className="text-xs text-[#6B7870] dark:text-[#8E9B92]">Sabtu, 18.00 - 20.00 WIB Onsite</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] dark:bg-[#232924] flex items-center justify-center text-[#44634D] dark:text-[#7EA88A] shrink-0 border border-[#EAE4DB] dark:border-[#303832]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#1E2320] dark:text-[#EDEAE4] block">Lokasi Sanctuary</span>
                <span className="text-xs text-[#6B7870] dark:text-[#8E9B92]">Deliksari Gunungpati, Kota Semarang</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Church Branding */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-[#D8D1C5] dark:border-[#3A423D] bg-white p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="GIA Deliksari"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1E2320] dark:text-[#EDEAE4] text-base sm:text-lg">
                  GIA DELIKSARI SEMARANG
                </h4>
                <p className="text-xs font-bold text-[#C27338] dark:text-[#D9894E] tracking-wide">
                  GROWING CHURCH! 🔥
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-md text-[#5F6B63] dark:text-[#9DAAA0]">
              Gereja Isa Almasih Deliksari adalah persekutuan keluarga Allah yang berkomitmen membangun generasi yang berakar dalam firman, bertumbuh dalam kasih, dan berbuah bagi sesama.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#1E2320] dark:text-[#EDEAE4] text-sm uppercase tracking-wider">
              Navigasi Halaman
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#kunjungan" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Panduan Jemaat Baru</a></li>
              <li><a href="#tentang" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Tentang & Gembala</a></li>
              <li><a href="#pelayanan" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">4 Komunitas Ibadah</a></li>
              <li><a href="#khotbah" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Khotbah & Firman</a></li>
              <li><a href="#warta" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Papan Warta</a></li>
              <li><a href="#jadwal" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Jadwal Ibadah</a></li>
              <li><a href="#layanan" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Layanan & Doa</a></li>
              <li><a href="#persembahan" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Persembahan Kasih</a></li>
              <li><a href="#kontak" className="hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors">Lokasi & FAQ</a></li>
            </ul>
          </div>

          {/* Admin & Management */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#1E2320] dark:text-[#EDEAE4] text-sm uppercase tracking-wider">
              Operasional Gereja
            </h5>
            <p className="text-xs leading-relaxed text-[#5F6B63] dark:text-[#9DAAA0]">
              Dikelola oleh Media Kreatif & Tim Pastoral GIA Deliksari Gunungpati, Kota Semarang.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#1B201D] text-[#3D4741] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#232A25] border border-[#E0D7C9] dark:border-[#2F3731] shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#44634D]" />
                <span>Portal Admin Gereja</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#EAE3D8] dark:border-[#262D28] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} GIA Deliksari Semarang. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5 text-[#6B7870] dark:text-[#8E9B92]">
            <span>Melayani dengan</span>
            <Heart className="w-3.5 h-3.5 text-[#B35667] fill-[#B35667]" />
            <span>untuk Kemuliaan Nama Tuhan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
