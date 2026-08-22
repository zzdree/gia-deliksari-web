import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Church Branding */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 bg-white">
                <Image
                  src="/images/logo.png"
                  alt="GIA Deliksari"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">
                  GIA DELIKSARI SEMARANG
                </h4>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  GROWING CHURCH! 🔥
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Gereja Isa Almasih Deliksari adalah persekutuan keluarga Allah yang berkomitmen membangun generasi yang beriman teguh, bertumbuh, dan berdampak bagi sesama.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Navigasi Cepat</h5>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><a href="#tentang" className="hover:text-amber-600 dark:hover:text-amber-400">Tentang & Gembala</a></li>
              <li><a href="#pelayanan" className="hover:text-amber-600 dark:hover:text-amber-400">Pilar Pelayanan</a></li>
              <li><a href="#khotbah" className="hover:text-amber-600 dark:hover:text-amber-400">Arsip Khotbah</a></li>
              <li><a href="#warta" className="hover:text-amber-600 dark:hover:text-amber-400">Papan Warta</a></li>
              <li><a href="#jadwal" className="hover:text-amber-600 dark:hover:text-amber-400">Jadwal Ibadah</a></li>
              <li><a href="#layanan" className="hover:text-amber-600 dark:hover:text-amber-400">Layanan & Doa</a></li>
              <li><a href="#persembahan" className="hover:text-amber-600 dark:hover:text-amber-400">Persembahan & Perpuluhan</a></li>
              <li><a href="#galeri" className="hover:text-amber-600 dark:hover:text-amber-400">Galeri Foto</a></li>
            </ul>
          </div>

          {/* Admin & Management */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Operasional Gereja</h5>
            <p className="text-xs leading-relaxed">
              Dikelola oleh GIA Deliksari Creative Media Team & Tim Kordinator Pelayanan.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Masuk Admin Portal</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} GIA Deliksari Semarang. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Melayani dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Kemuliaan Nama Tuhan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
