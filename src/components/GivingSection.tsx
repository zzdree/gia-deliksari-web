'use client';

import React, { useState } from 'react';
import { Heart, Copy, Check, QrCode, ShieldCheck, MessageCircle, Landmark, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './Icons';

export default function GivingSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bankAccounts = [
    {
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '246-098-7711',
      accountName: 'GIA DELIKSARI SEMARANG',
      purpose: 'Persembahan Umum, Perpuluhan & Pembangunan',
      color: 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20',
      badge: 'Rekening Utama',
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '136-00-1928374-1',
      accountName: 'GEREJA ISA ALMASIH DELIKSARI',
      purpose: 'Diakonia Kasih, Misi & Operasional Gereja',
      color: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
      badge: 'Diakonia & Misi',
    },
    {
      bankName: 'BRI (Bank Rakyat Indonesia)',
      accountNumber: '0341-01-002938-53-0',
      accountName: 'GIA DELIKSARI',
      purpose: 'Pelayanan Remaja, Pemuda & Sekolah Minggu',
      color: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20',
      badge: 'Generasi Muda',
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
    <section id="persembahan" className="py-20 bg-slate-50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Persembahan & Perpuluhan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Mendukung Pekerjaan & Pelayanan Tuhan
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Terima kasih atas kesetiaan dan kemurahan hati Anda dalam menabur bagi kemuliaan nama Tuhan melalui GIA Deliksari.
          </p>
        </div>

        {/* Bible Verse Banner */}
        <div className="max-w-4xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center space-y-2">
          <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
            &ldquo;Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.&rdquo;
          </p>
          <div className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            — 2 Korintus 9:7
          </div>
        </div>

        {/* Bank Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {bankAccounts.map((acc, idx) => (
            <div
              key={acc.bankName}
              className={`p-6 sm:p-8 rounded-3xl border-2 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${acc.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-200">
                    {acc.badge}
                  </span>
                  <Landmark className="w-5 h-5 text-slate-400" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {acc.bankName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {acc.purpose}
                  </p>
                </div>

                {/* Account Number Box */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Nomor Rekening
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-amber-400 tracking-wider">
                    {acc.accountNumber}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    a.n. {acc.accountName}
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <div className="pt-6">
                <button
                  onClick={() => handleCopy(acc.accountNumber, idx)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    copiedIndex === idx
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 hover:opacity-90 active:scale-[0.98]'
                  }`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Nomor Rekening Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation CTA Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparansi & Akuntabilitas</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              Konfirmasi Bukti Transfer Persembahan
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Kirimkan bukti transfer untuk pencatatan diakonia atau warta persembahan ke sekretariat gereja.
            </p>
          </div>

          <a
            href={whatsappConfirmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>Konfirmasi via WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
