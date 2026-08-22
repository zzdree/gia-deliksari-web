import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { InstagramIcon, YouTubeIcon } from './Icons';

export default function LocationContactSection() {
  const gmapsShareUrl =
    process.env.NEXT_PUBLIC_GMAPS_SHARE_URL || 'https://share.google/O7HqL1J615kgxt66v';

  return (
    <section id="lokasi" className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Lokasi & Kontak Gereja</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kunjungi & Terhubung Bersama Kami
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Kami menyambut kehadiran Anda dan keluarga dengan sukacita di rumah Tuhan.
          </p>
        </div>

        {/* 2 Column Layout: Interactive Map + Socials/Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map Frame */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800 flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  Google Maps — GIA Deliksari Semarang
                </span>
              </div>

              <a
                href={gmapsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Buka di App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative flex-1 min-h-[340px] w-full">
              <iframe
                title="Peta Lokasi GIA Deliksari Semarang"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.038411032906!2d110.3872295!3d-7.0047535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b598b0ff57b%3A0x6b8aa7ec42a8b139!2sGIA%20Deliksari!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[340px]"
              />
            </div>
          </div>

          {/* Contact Details & Social Media Links */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Address Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <MapPin className="w-4 h-4" />
                <span>Alamat Lengkap</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Gereja Isa Almasih Deliksari
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Jl. Kolonel Hadijanto, Deliksari, Kec. Gunungpati, Kota Semarang, Jawa Tengah 50229
              </p>
              <div className="pt-2">
                <a
                  href={gmapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-colors"
                >
                  <span>Petunjuk Arah Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Social Channels List */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Kanal Komunikasi & Media Sosial
              </h4>

              <div className="space-y-2.5">
                <a
                  href="https://www.instagram.com/giadeliksari/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-pink-50 dark:hover:bg-pink-950/40 border border-slate-200 dark:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                        Instagram Resmi Gereja
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">@giadeliksari</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-600" />
                </a>

                <a
                  href="https://www.youtube.com/@GIADeliksariSemarang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                      <YouTubeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                        YouTube Channel
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">@GIADeliksariSemarang</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                </a>

                <a
                  href="https://www.instagram.com/growgeneration_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        Youth PRBK
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">@growgeneration_</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </a>

                <a
                  href="https://www.instagram.com/cockidz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        Sekolah Minggu (KAA)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">@cockidz</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
