'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Menu, X, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Beranda', href: '/#beranda' },
    { name: 'Tentang & Gembala', href: '/#tentang' },
    { name: 'Pelayanan', href: '/#pelayanan' },
    { name: 'Warta & Pengumuman', href: '/#warta' },
    { name: 'Jadwal Ibadah', href: '/#jadwal' },
    { name: 'Galeri', href: '/#galeri' },
    { name: 'Lokasi & Kontak', href: '/#kontak' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200 bg-white">
              <Image
                src="/images/logo.png"
                alt="Logo GIA Deliksari"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  GIA DELIKSARI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hidden sm:inline-block">
                  Semarang
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 tracking-wide">
                GROWING CHURCH! 🔥
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!isAdmin ? (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Portal Manajemen Gereja
              </span>
              <Link
                href="/public"
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1"
              >
                <span>Lihat Web Publik</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Right Action Items: Theme Toggle & Admin Shortcut */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {!isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Portal Admin</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            {!isAdmin && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {!isAdmin && isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-b-2xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 px-4">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk Portal Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
