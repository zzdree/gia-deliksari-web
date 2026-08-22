'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Kunjungan', href: '#kunjungan' },
    { name: 'Tentang', href: '#tentang' },
    { name: 'Pelayanan', href: '#pelayanan' },
    { name: 'Khotbah', href: '#khotbah' },
    { name: 'Warta', href: '#warta' },
    { name: 'Jadwal', href: '#jadwal' },
    { name: 'Layanan', href: '#layanan' },
    { name: 'Persembahan', href: '#persembahan' },
    { name: 'Galeri', href: '#galeri' },
    { name: 'Kontak', href: '#kontak' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FDFBF7]/95 dark:bg-[#150B0D]/95 backdrop-blur-md shadow-sm border-b border-[#EBDDCF] dark:border-[#3A1C20]'
          : 'bg-[#FDFBF7]/85 dark:bg-[#150B0D]/85 backdrop-blur-sm border-b border-[#EBDDCF]/60 dark:border-[#3A1C20]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Church Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-[#C5222E]/30 bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/logo.png"
                alt="GIA Deliksari Logo"
                fill
                priority
                className="object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1F1617] dark:text-[#F5EFEB] group-hover:text-[#C5222E] dark:group-hover:text-[#E03643] transition-colors">
                  GIA DELIKSARI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF0F0] text-[#9A1620] border border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]">
                  Semarang
                </span>
              </div>
              <span className="text-[11px] font-bold tracking-wide text-[#C5222E] dark:text-[#E03643]">
                GROWING CHURCH! 🔥
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#5A4D4E] dark:text-[#D5C2C4] hover:text-[#C5222E] dark:hover:text-[#E03643] hover:bg-[#F7F2E8] dark:hover:bg-[#251317] transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Theme Toggle & Admin Shortcut */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C5222E] via-[#A81722] to-[#80141C] hover:opacity-95 text-white shadow-sm shadow-red-950/20 active:scale-95 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Buka Menu"
              className="p-2 rounded-xl text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#251317] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-[#FDFBF7] dark:bg-[#150B0D] border-b border-[#EBDDCF] dark:border-[#3A1C20] px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#251317] hover:text-[#C5222E] dark:hover:text-[#E03643] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-[#EBDDCF] dark:border-[#3A1C20]">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk Admin Portal Gereja</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
