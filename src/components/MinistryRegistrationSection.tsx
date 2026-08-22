'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Send, 
  CheckCircle2, 
  Droplet, 
  Users, 
  UserPlus, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { WhatsAppIcon } from './Icons';

type ServiceType = 'prayer' | 'sacrament' | 'komsel' | 'volunteer';

export default function MinistryRegistrationSection() {
  const [activeTab, setActiveTab] = useState<ServiceType>('prayer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [prayerType, setPrayerType] = useState('Doa Kesembuhan');
  const [sacramentType, setSacramentType] = useState('Baptisan Selam');
  const [komselArea, setKomselArea] = useState('Deliksari / Sekaran');
  const [volunteerRole, setVolunteerRole] = useState('Pujian & Penyembahan (Worship/Musisi)');
  const [message, setMessage] = useState('');
  const [needPastoralVisit, setNeedPastoralVisit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let details = '';
    let headerText = '';

    if (activeTab === 'prayer') {
      headerText = 'Permohonan Doa & Konseling Pastoral';
      details = `Jenis Pokok: ${prayerType}\nPesan/Pokok Doa: ${message || '-'}\nPermohonan Kunjungan Selasa: ${needPastoralVisit ? 'Ya, Mohon Dikunjungi' : 'Tidak'}`;
    } else if (activeTab === 'sacrament') {
      headerText = 'Pendaftaran Sakramen & Pelayanan Kudus';
      details = `Jenis Pelayanan: ${sacramentType}\nCatatan Tambahan: ${message || '-'}`;
    } else if (activeTab === 'komsel') {
      headerText = 'Pendaftaran Bergabung Komsel Ekklesia';
      details = `Area Tempat Tinggal: ${komselArea}\nCatatan: ${message || '-'}`;
    } else if (activeTab === 'volunteer') {
      headerText = 'Pendaftaran Pelayan Ibadah (Volunteer)';
      details = `Bidang Pelayanan: ${volunteerRole}\nPengalaman / Catatan: ${message || '-'}`;
    }

    const fullMessage = `*Syalom GIA Deliksari Semarang*\n\n*${headerText}*\n\nNama: ${name}\nNo. WhatsApp: ${phone}\n${details}\n\nTerima kasih, Tuhan Yesus Memberkati.`;

    const phoneTarget = '6281234567890';
    const waUrl = `https://api.whatsapp.com/send?phone=${phoneTarget}&text=${encodeURIComponent(fullMessage)}`;

    window.open(waUrl, '_blank');
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
      setNeedPastoralVisit(false);
    }, 4000);
  };

  return (
    <section id="layanan" className="py-24 bg-[#FDFBF7] dark:bg-[#150B0D] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-[#C5222E]" />
            <span>Layanan Jemaat & Formulir Digital</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB] tracking-tight">
            Bagaimana Kami Dapat Melayani Anda?
          </h2>
          <p className="text-[#5A4D4E] dark:text-[#D5C2C4] text-base sm:text-lg leading-relaxed">
            Sampaikan pokok doa, pendaftaran sakramen baptisan, gabung kelompok sel, atau kerinduan melayani pekerjaan Tuhan.
          </p>
        </div>

        {/* 4 Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-2 bg-[#F7F2E8] dark:bg-[#221215] rounded-2xl sm:rounded-3xl border border-[#EBDDCF] dark:border-[#3A1C20] mb-8">
          {[
            { id: 'prayer', label: 'Doa & Konseling', icon: HeartHandshake },
            { id: 'sacrament', label: 'Sakramen Kudus', icon: Droplet },
            { id: 'komsel', label: 'Komsel Ekklesia', icon: Users },
            { id: 'volunteer', label: 'Pelayan Ibadah', icon: UserPlus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ServiceType)}
                className={`py-3 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-sm'
                    : 'text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-white/60 dark:hover:bg-[#2A161A]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-[#FDF0F0] dark:bg-[#331418] text-[#C5222E] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                Formulir Telah Terkirim!
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4D4E] dark:text-[#D5C2C4] max-w-md mx-auto">
                Pesan Anda sedang diteruskan ke WhatsApp Tim Pastoral GIA Deliksari. Hamba Tuhan kami akan segera merespons Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                    Nama Lengkap <span className="text-[#C5222E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Andreas Handoko"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5222E]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                    Nomor WhatsApp <span className="text-[#C5222E]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5222E]"
                  />
                </div>
              </div>

              {/* Dynamic Field Per Active Tab */}
              {activeTab === 'prayer' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                      Kategori Pokok Doa
                    </label>
                    <select
                      value={prayerType}
                      onChange={(e) => setPrayerType(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5222E]"
                    >
                      <option value="Doa Kesembuhan">Doa Kesembuhan & Pemulihan Tubuh</option>
                      <option value="Doa Keluarga & Rumah Tangga">Doa Keluarga & Rumah Tangga</option>
                      <option value="Doa Pekerjaan & Usaha">Doa Pekerjaan, Studi & Usaha</option>
                      <option value="Konseling Pastoral">Permohonan Konseling Bersama Gembala</option>
                      <option value="Ucapan Syukur">Pokok Doa Ucapan Syukur</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25]">
                    <input
                      type="checkbox"
                      id="pastoralVisit"
                      checked={needPastoralVisit}
                      onChange={(e) => setNeedPastoralVisit(e.target.checked)}
                      className="w-4 h-4 rounded text-[#C5222E] focus:ring-[#C5222E] border-[#EBDDCF]"
                    />
                    <label htmlFor="pastoralVisit" className="text-xs font-semibold text-[#9A1620] dark:text-[#F2828C] cursor-pointer">
                      Saya rindu dikunjungi hamba Tuhan pada jadwal Kunjungan Hari Selasa.
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'sacrament' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                    Jenis Sakramen / Pelayanan Kudus
                  </label>
                  <select
                    value={sacramentType}
                    onChange={(e) => setSacramentType(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5222E]"
                  >
                    <option value="Baptisan Selam">Baptisan Air Kudus (Baptisan Selam)</option>
                    <option value="Penyerahan Anak">Penyerahan Bayi / Anak</option>
                    <option value="Pemberkatan Nikah">Konseling & Pemberkatan Nikah Kudus</option>
                    <option value="Perjamuan Kudus di Rumah (Sakit)">Pelayanan Perjamuan Kudus Khusus di Rumah/RS</option>
                  </select>
                </div>
              )}

              {activeTab === 'komsel' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                    Area Domisili / Tempat Tinggal
                  </label>
                  <select
                    value={komselArea}
                    onChange={(e) => setKomselArea(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5222E]"
                  >
                    <option value="Deliksari / Sekaran">Deliksari / Sekaran (Dekat Kampus UNNES)</option>
                    <option value="Gunungpati Umum">Gunungpati & Sekitarnya</option>
                    <option value="Sampangan / Manyaran">Sampangan / Manyaran</option>
                    <option value="Ungaran / Banyumanik">Ungaran / Banyumanik</option>
                  </select>
                </div>
              )}

              {activeTab === 'volunteer' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                    Bidang Pelayanan yang Dirindukan
                  </label>
                  <select
                    value={volunteerRole}
                    onChange={(e) => setVolunteerRole(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5222E]"
                  >
                    <option value="Pujian & Penyembahan (Worship/Musisi)">Praise & Worship (Singer, Musisi Keyboard/Gitar/Drum)</option>
                    <option value="Multimedia, LCD & Live Streaming">Multimedia, Operator Proyektor & Live Streaming</option>
                    <option value="Guru & Pendamping Sekolah Minggu COC Kidz">Guru Sekolah Minggu COC Kidz</option>
                    <option value="Usher, Penerima Tamu & Kolektan">Usher, Welcoming Team & Kolektan</option>
                    <option value="Tim Kreatif & Dokumentasi Sosial Media">Creative Media & Desain Konten Medsos</option>
                  </select>
                </div>
              )}

              {/* Message Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                  Tuliskan Rincian atau Pesan Anda
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pokok doa, pertanyaan, atau catatan untuk tim pastoral kami..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5222E]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5222E] via-[#A81722] to-[#80141C] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-red-950/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                <span>Kirim Formulir ke WhatsApp Pastoral</span>
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
