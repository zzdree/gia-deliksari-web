'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { WhatsAppIcon } from './Icons';

export default function GivingSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bankAccounts = [
    {
      bank: 'BCA (Bank Central Asia)',
      number: '246-098-7711',
      rawNumber: '2460987711',
      holder: 'GIA Deliksari Semarang',
      badge: 'Persembahan & Persepuluhan',
      badgeColor: 'bg-[#FDF0F0] text-[#9A1620] border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]',
      accentColor: 'border-t-4 border-t-[#C5222E]',
    },
    {
      bank: 'Bank Mandiri',
      number: '136-00-1928374-1',
      rawNumber: '1360019283741',
      holder: 'Gereja Isa Almasih Deliksari',
      badge: 'Pembangunan & Misi',
      badgeColor: 'bg-[#FFF2EE] text-[#C83E20] border-[#FCD2C7] dark:bg-[#331812] dark:text-[#F88B72] dark:border-[#57241A]',
      accentColor: 'border-t-4 border-t-[#C83E20]',
    },
    {
      bank: 'BRI (Bank Rakyat Indonesia)',
      number: '0341-01-002938-53-0',
      rawNumber: '034101002938530',
      holder: 'GIA Deliksari',
      badge: 'Diakonia & Sosial Jemaat',
      badgeColor: 'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]',
      accentColor: 'border-t-4 border-t-[#C59B27]',
    },
  ];

  const handleCopy = (rawNumber: string, index: number) => {
    navigator.clipboard.writeText(rawNumber);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const whatsappConfirmUrl =
    'https://api.whatsapp.com/send?phone=6281234567890&text=Syalom%20GIA%20Deliksari,%20saya%20telah%20mentransfer%20persembahan%20kasih.%20Berikut%20bukti%20transfernya:';

  return (
    <section id="persembahan" className="py-24 bg-[#F7F2E8]/60 dark:bg-[#1A0E10]/60 border-y border-[#EBDDCF] dark:border-[#3A1C20] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-[#C5222E] text-[#C5222E]" />
            <span>Persembahan Kasih & Persepuluhan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] tracking-tight">
            Mendukung Pekerjaan Rumah Tuhan
          </h2>
          <p className="text-[#5A4D4E] dark:text-[#D5C2C4] text-base sm:text-lg leading-relaxed">
            &ldquo;Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.&rdquo; <span className="font-semibold">(2 Korintus 9:7)</span>
          </p>
        </div>

        {/* 3 Bank Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {bankAccounts.map((acc, idx) => (
            <div
              key={acc.bank}
              className={`p-7 rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 ${acc.accentColor}`}
            >
              <div className="space-y-4">
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold border ${acc.badgeColor}`}>
                  {acc.badge}
                </span>

                <div>
                  <h3 className="font-extrabold text-lg text-[#1F1617] dark:text-[#F5EFEB]">
                    {acc.bank}
                  </h3>
                  <p className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3] mt-0.5">
                    a.n. {acc.holder}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20]">
                  <span className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3] block mb-1">Nomor Rekening:</span>
                  <span className="font-mono text-lg font-black text-[#1F1617] dark:text-white tracking-wide block">
                    {acc.number}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(acc.rawNumber, idx)}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  copiedIndex === idx
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#FDF0F0] dark:hover:bg-[#331418] hover:text-[#C5222E]'
                }`}
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Nomor Rekening Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C5222E] dark:text-[#E03643]" />
                    <span>Salin Nomor Rekening</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Strip */}
        <div className="p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] flex items-center justify-center text-[#C5222E] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                Konfirmasi Persembahan Kasih
              </h4>
              <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                Kirimkan bukti transfer untuk pencatatan warta jemaat dan tanda terima gereja.
              </p>
            </div>
          </div>

          <a
            href={whatsappConfirmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
            <span>Konfirmasi via WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
