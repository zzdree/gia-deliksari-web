'use client';

import React, { useState } from 'react';
import { MapPin, ExternalLink, HelpCircle, ChevronDown, Compass } from 'lucide-react';
import { InstagramIcon, YouTubeIcon, WhatsAppIcon } from './Icons';

export default function LocationContactSection() {
  const gmapsShareUrl =
    process.env.NEXT_PUBLIC_GMAPS_SHARE_URL || 'https://share.google/O7HqL1J615kgxt66v';

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Jam berapa saja jadwal ibadah rutin di GIA Deliksari?',
      a: 'Ibadah Raya Umum diadakan setiap Minggu pukul 09.00 - 11.00 WIB. Ibadah Anak (COC Kidz) setiap Minggu pukul 09.30 - 10.30 WIB. Ibadah Pemuda (Grow Generation) setiap Sabtu pukul 18.00 - 20.00 WIB. Persekutuan Wanita Hana & Komsel Ekklesia diadakan selang-seling mingguan.',
    },
    {
      q: 'Bagaimana akses lokasi dan ketersediaan tempat parkir?',
      a: 'Gereja beralamat di Jl. Kolonel Hadijanto, Deliksari, Gunungpati, Semarang. Akses jalan sangat mudah dijangkau dari arah Sampangan maupun Unnes, dan tersedia area parkir mobil dan sepeda motor yang aman dengan panduan tim usher.',
    },
    {
      q: 'Bagaimana jika saya ingin mendaftar sakramen Baptisan atau Penyerahan Anak?',
      a: 'Anda dapat langsung mengisi formulir pendaftaran pada menu Layanan di website ini atau menghubungi sekretariat pastoral via WhatsApp untuk penjadwalan pembekalan dan tanggal pelaksanaan sakramen.',
    },
    {
      q: 'Bagaimana cara bergabung dalam Komsel Ekklesia atau Komunitas Hana?',
      a: 'Komsel dan persekutuan terbuka bagi seluruh jemaat dan keluarga. Silakan hubungi tim pastoral melalui tombol WhatsApp di web ini atau temui tim usher setelah ibadah hari Minggu.',
    },
  ];

  return (
    <section id="kontak" className="py-24 bg-[#FAF8F5] dark:bg-[#141715] border-t border-[#EBE5DC] dark:border-[#2A302C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Lokasi, Kontak & Tanya Jawab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
            Kunjungi & Terhubung Bersama Kami
          </h2>
          <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base sm:text-lg leading-relaxed">
            Kami menyambut kehadiran Anda dan keluarga dengan sukacita di rumah Tuhan.
          </p>
        </div>

        {/* 2 Column Layout: Interactive Map + Socials/Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Map Frame */}
          <div className="lg:col-span-7 rounded-[2.5rem] overflow-hidden border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm bg-white dark:bg-[#1B201D] flex flex-col">
            <div className="p-5 border-b border-[#EBE5DC] dark:border-[#2A302C] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#44634D]" />
                <span className="text-xs font-bold text-[#1E2320] dark:text-[#EDEAE4]">
                  Google Maps &bull; GIA Deliksari Semarang
                </span>
              </div>

              <a
                href={gmapsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#44634D] dark:text-[#7EA88A] hover:underline flex items-center gap-1"
              >
                <span>Buka di App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative flex-1 min-h-[360px] w-full">
              <iframe
                title="Peta Lokasi GIA Deliksari Semarang"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.038411032906!2d110.3872295!3d-7.0047535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b598b0ff57b%3A0x6b8aa7ec42a8b139!2sGIA%20Deliksari!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[360px]"
              />
            </div>
          </div>

          {/* Contact Details & Social Media Links */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address Box */}
            <div className="p-7 rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#44634D] dark:text-[#7EA88A] font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Alamat Lengkap</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4]">
                Gereja Isa Almasih Deliksari
              </h3>
              <p className="text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed">
                Jl. Kolonel Hadijanto, Deliksari, Kec. Gunungpati, Kota Semarang, Jawa Tengah 50229
              </p>
              <div className="pt-2">
                <a
                  href={gmapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-[#44634D] hover:bg-[#36503E] text-white shadow-sm transition-all"
                >
                  <span>Petunjuk Arah Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Social Channels List */}
            <div className="p-7 rounded-[2rem] bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#1E2320] dark:text-[#EDEAE4] uppercase tracking-wider">
                Kanal Komunikasi & Media Sosial
              </h4>

              <div className="space-y-2.5">
                <a
                  href="https://www.instagram.com/giadeliksari/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] hover:bg-[#FAEEE5] dark:hover:bg-[#2A201A] border border-[#EAE4DB] dark:border-[#303832] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-[#1B201D] text-[#C27338]">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E2320] dark:text-[#EDEAE4] group-hover:text-[#C27338]">
                        Instagram Resmi Gereja
                      </p>
                      <p className="text-[11px] text-[#6B7870] dark:text-[#9DAAA0]">@giadeliksari</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#7A877E] group-hover:text-[#C27338]" />
                </a>

                <a
                  href="https://www.youtube.com/@GIADeliksariSemarang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] hover:bg-[#FAEEE5] dark:hover:bg-[#2A201A] border border-[#EAE4DB] dark:border-[#303832] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-[#1B201D] text-red-600">
                      <YouTubeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E2320] dark:text-[#EDEAE4] group-hover:text-red-600">
                        YouTube Channel
                      </p>
                      <p className="text-[11px] text-[#6B7870] dark:text-[#9DAAA0]">@GIADeliksariSemarang</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#7A877E] group-hover:text-red-600" />
                </a>

                <a
                  href="https://www.instagram.com/growgeneration_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] hover:bg-[#FAEEE5] dark:hover:bg-[#2A201A] border border-[#EAE4DB] dark:border-[#303832] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-[#1B201D] text-[#C27338]">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E2320] dark:text-[#EDEAE4] group-hover:text-[#C27338]">
                        Youth PRBK (Grow Generation)
                      </p>
                      <p className="text-[11px] text-[#6B7870] dark:text-[#9DAAA0]">@growgeneration_</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#7A877E] group-hover:text-[#C27338]" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#F5F1E9]/50 dark:bg-[#181C19]/50 border border-[#E5DDD0] dark:border-[#2A312B]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#44634D] dark:text-[#7EA88A] uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Pertanyaan yang Sering Diajukan</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4]">
              Tanya Jawab Seputar Ibadah & Pelayanan
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white dark:bg-[#1B201D] border border-[#E5DDD0] dark:border-[#2A312B] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1E2320] dark:text-[#EDEAE4] hover:text-[#44634D] dark:hover:text-[#7EA88A] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#7A877E] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#44634D]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5F6B63] dark:text-[#9DAAA0] leading-relaxed border-t border-[#F0EAE1] dark:border-[#242C27]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
