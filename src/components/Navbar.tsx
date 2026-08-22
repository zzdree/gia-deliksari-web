'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Menu, X, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Beranda', href: '/#beranda' },
    { name: 'Kunjungan', href: '/#kunjungan' },
    { name: 'Tentang', href: '/#tentang' },
    { name: 'Pelayanan', href: '/#pelayanan' },
    { name: 'Khotbah', href: '/#khotbah' },
    { name: 'Warta', href: '/#warta' },
    { name: 'Jadwal', href: '/#jadwal' },
    { name: 'Layanan', href: '/#layanan' },
    { name: 'Persembahan', href: '/#persembahan' },
    { name: 'Galeri', href: '/#galeri' },
    { name: 'Kontak', href: '/#kontak' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF8F5]/90 dark:bg-[#141715]/90 border-b border-[#EBE5DC] dark:border-[#2A302C] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Editorial Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-[#D8D1C5] dark:border-[#3A423D] shadow-sm group-hover:scale-105 transition-transform duration-200 bg-white dark:bg-[#1B201D] p-0.5">
              <Image
                src="/images/logo.png"
                alt="Logo GIA Deliksari"
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1E2320] dark:text-[#EDEAE4]">
                  GIA DELIKSARI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] text-[#44634D] dark:text-[#7EA88A] border border-[#D1E0D5] dark:border-[#2C3B31] hidden sm:inline-block">
                  Semarang
                </span>
              </div>
              <p className="text-xs font-semibold text-[#C27338] dark:text-[#D9894E] tracking-wide flex items-center gap-1">
                <span>GROWING CHURCH!</span>
                <span className="text-[10px]">🔥</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!isAdmin ? (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-xl text-xs xl:text-sm font-medium text-[#4A544E] dark:text-[#B3BCB5] hover:text-[#44634D] dark:hover:text-[#8EB799] hover:bg-[#EFEAE2]/60 dark:hover:bg-[#1E2420] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Portal Manajemen Gereja
              </span>
              <Link
                href="/public"
                className="text-xs font-semibold text-[#5F6B63] dark:text-[#9DAAA0] hover:text-[#44634D] dark:hover:text-[#7EA88A] flex items-center gap-1"
              >
                <span>Lihat Web Publik</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Right Actions: Theme Toggle & Admin Shortcut */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {!isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#44634D] hover:bg-[#38523F] active:scale-95 text-white shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            {!isAdmin && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-[#333C36] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#1E2420] lg:hidden transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {!isAdmin && isOpen && (
          <div className="lg:hidden py-4 border-t border-[#EBE5DC] dark:border-[#2A302C] space-y-1 bg-[#FAF8F5]/98 dark:bg-[#141715]/98 backdrop-blur-md rounded-b-3xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm font-semibold text-[#3D4741] dark:text-[#C5CDC7] hover:text-[#44634D] dark:hover:text-[#7EA88A] hover:bg-[#EFEAE2]/70 dark:hover:bg-[#1E2420] rounded-xl transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 px-4">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#44634D] text-white shadow-sm"
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
