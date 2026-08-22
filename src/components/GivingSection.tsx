'use client';

import React, { useState } from 'react';
import { Heart, Copy, Check, ShieldCheck, Landmark } from 'lucide-react';
import { WhatsAppIcon } from './Icons';

export default function GivingSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bankAccounts = [
    {
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '246-098-7711',
      accountName: 'GIA DELIKSARI SEMARANG',
      purpose: 'Persembahan Umum, Perpuluhan & Pembangunan',
      badge: 'Rekening Utama',
      badgeColor: 'bg-[#EBF1EC] text-[#44634D] border-[#D1E0D5] dark:bg-[#202923] dark:text-[#7EA88A] dark:border-[#2C3B31]',
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '136-00-1928374-1',
      accountName: 'GEREJA ISA ALMASIH DELIKSARI',
      purpose: 'Diakonia Kasih, Misi & Operasional Gereja',
      badge: 'Diakonia & Misi',
      badgeColor: 'bg-[#FAEEE5] text-[#C27338] border-[#ECD1C0] dark:bg-[#2A201A] dark:text-[#E8A576] dark:border-[#4A3427]',
    },
    {
      bankName: 'BRI (Bank Rakyat Indonesia)',
      accountNumber: '0341-01-002938-53-0',
      accountName: 'GIA DELIKSARI',
      purpose: 'Pelayanan Remaja, Pemuda & Sekolah Minggu',
      badge: 'Generasi Muda',
      badgeColor: 'bg-[#FBF4E7] text-[#C89434] border-[#F1DEC0] dark:bg-[#2B2317] dark:text-[#E2B35B] dark:border-[#423421]',
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text.replace(/-/g, ''));
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2500);
  };

  const whatsappConfirmUrl =
    'https://api.whatsapp.com/send?phone=6281234567890&text=Syalom%20Sekretariat%20GIA%20Deliksari,%20saya%20ingin%20mengonfirmasi%20transfer%20persembahan/perpuluhan.';

  return (
    <section id="persembahan" className="py-24 bg-[#FAF8F5] dark:bg-[#141715] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-[#44634D] text-[#44634D]" />
            <span>Persembahan & Perpuluhan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
            Mendukung Pekerjaan & Pelayanan Tuhan
          </h2>
          <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base sm:text-lg leading-relaxed">
            &ldquo;Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.&rdquo; (2 Korintus 9:7)
          </p>
        </div>

        {/* Bank Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {bankAccounts.map((account, index) => (
            <div
              key={account.bankName}
              className="p-7 rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] dark:bg-[#232924] flex items-center justify-center text-[#44634D] dark:text-[#7EA88A] border border-[#EAE4DB] dark:border-[#303832]">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${account.badgeColor}`}>
                    {account.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#1E2320] dark:text-[#EDEAE4]">
                    {account.bankName}
                  </h3>
                  <p className="text-xs text-[#5F6B63] dark:text-[#9DAAA0] mt-1 leading-relaxed">
                    {account.purpose}
                  </p>
                </div>

                {/* Account Number Box */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#EBE5DC] dark:border-[#2C342E] space-y-1">
                  <span className="text-[11px] font-semibold text-[#6B7870] dark:text-[#9DAAA0] uppercase tracking-wider block">
                    Nomor Rekening
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-[#1E2320] dark:text-white tracking-wider">
                    {account.accountNumber}
                  </div>
                  <div className="text-xs font-bold text-[#44634D] dark:text-[#7EA88A]">
                    a.n. {account.accountName}
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(account.accountNumber, index)}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  copiedIndex === index
                    ? 'bg-[#44634D] text-white'
                    : 'bg-[#FAF8F5] dark:bg-[#232924] hover:bg-[#EFEAE2] dark:hover:bg-[#2C342E] text-[#3D4741] dark:text-[#EDEAE4] border border-[#E0D7C9] dark:border-[#2F3731]'
                }`}
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Nomor Rekening Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#7A877E]" />
                    <span>Salin Nomor Rekening</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Strip */}
        <div className="p-6 sm:p-8 rounded-[2rem] bg-[#F5F1E9]/60 dark:bg-[#181C19]/60 border border-[#E5DDD0] dark:border-[#2A312B] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1EC] dark:bg-[#202923] flex items-center justify-center text-[#44634D] dark:text-[#7EA88A] shrink-0 border border-[#D1E0D5] dark:border-[#2C3B31]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E2320] dark:text-[#EDEAE4]">
                Konfirmasi Persembahan (Opsional)
              </p>
              <p className="text-xs text-[#5F6B63] dark:text-[#9DAAA0]">
                Anda dapat mengirimkan bukti transfer untuk pencatatan persembahan perpuluhan atau pembangunan.
              </p>
            </div>
          </div>

          <a
            href={whatsappConfirmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#44634D] hover:bg-[#36503E] text-white text-xs sm:text-sm font-bold shadow-sm shrink-0 transition-all"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
            <span>Konfirmasi ke WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
