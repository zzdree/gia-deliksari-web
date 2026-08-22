'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Church, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Church className="w-6 h-6" />
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
            <nav className="hidden md:flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Portal Manajemen Gereja
              </span>
            </nav>
          )}

          {/* Right Action Icons & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {!isAdmin ? (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Admin Portal</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat Web Publik</span>
              </Link>
            )}

            {/* Mobile menu button */}
            {!isAdmin && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open Navigation Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && !isAdmin && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
