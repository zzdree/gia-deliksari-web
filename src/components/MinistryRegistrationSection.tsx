'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Send, 
  CheckCircle2, 
  Users, 
  Waves, 
  Music, 
  Calendar,
  MessageSquareHeart,
  UserCheck
} from 'lucide-react';
import { WhatsAppIcon } from './Icons';

type FormTab = 'prayer' | 'sacrament' | 'komsel' | 'volunteer';

export default function MinistryRegistrationSection() {
  const [activeTab, setActiveTab] = useState<FormTab>('prayer');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [detail, setDetail] = useState('');
  
  // Specific states
  const [prayerType, setPrayerType] = useState('Doa Pemulihan / Sakit');
  const [needPastoralVisit, setNeedPastoralVisit] = useState(false);
  const [sacramentType, setSacramentType] = useState('Baptisan Selam');
  const [komselArea, setKomselArea] = useState('Deliksari & Sekaran (Unnes)');
  const [volunteerRole, setVolunteerRole] = useState('DS Worship (Pemusik / Singer)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let text = '';
    const phoneTarget = '6281234567890';

    if (activeTab === 'prayer') {
      text = `Syalom Tim Pastoral GIA Deliksari,%0A%0ASaya ingin mengajukan permohonan doa/konseling:%0A- Nama: ${name}%0A- No. HP: ${phone}%0A- Kategori Doa: ${prayerType}%0A- Permohonan Kunjungan Hari Selasa: ${needPastoralVisit ? 'Ya, Mohon Dikunjungi' : 'Tidak (Cukup Didoakan)'}%0A- Pokok Doa/Catatan: ${detail}`;
    } else if (activeTab === 'sacrament') {
      text = `Syalom Sekretariat GIA Deliksari,%0A%0ASaya ingin mendaftarkan sakramen gereja:%0A- Nama: ${name}%0A- No. HP: ${phone}%0A- Jenis Pelayanan: ${sacramentType}%0A- Keterangan Tambahan: ${detail}`;
    } else if (activeTab === 'komsel') {
      text = `Syalom Koordinator Komsel Ekklesia GIA Deliksari,%0A%0ASaya rindu bergabung dalam Komsel Ekklesia:%0A- Nama: ${name}%0A- No. HP: ${phone}%0A- Domisili / Wilayah: ${komselArea}%0A- Catatan: ${detail}`;
    } else if (activeTab === 'volunteer') {
      text = `Syalom Pengurus Pelayanan GIA Deliksari,%0A%0ASaya rindu melayani Tuhan sebagai pelayan ibadah:%0A- Nama: ${name}%0A- No. HP: ${phone}%0A- Bidang Pelayanan: ${volunteerRole}%0A- Pengalaman / Bakat: ${detail}`;
    }

    const waUrl = `https://api.whatsapp.com/send?phone=${phoneTarget}&text=${text}`;
    window.open(waUrl, '_blank');

    setSubmittedMessage('Permohonan Anda sedang diteruskan ke WhatsApp Sekretariat Pastoral GIA Deliksari. Terima kasih!');
    setTimeout(() => {
      setSubmittedMessage(null);
    }, 6000);
  };

  return (
    <section id="layanan" className="py-24 bg-[#F5F1E9]/40 dark:bg-[#181C19]/40 border-y border-[#EBE5DC] dark:border-[#2A302C] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#44634D] dark:text-[#7EA88A] text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Layanan Jemaat & Formulir Pelayanan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2320] dark:text-[#EDEAE4] tracking-tight">
            Pusat Pelayanan & Pendaftaran Jemaat
          </h2>
          <p className="text-[#5F6B63] dark:text-[#9DAAA0] text-base leading-relaxed">
            Kami siap mendoakan, melayani kebutuhan rohani Anda, serta menyambut Anda yang rindu melayani bersama di GIA Deliksari.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          <button
            onClick={() => setActiveTab('prayer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'prayer'
                ? 'bg-[#44634D] text-white shadow-sm scale-105'
                : 'bg-white dark:bg-[#1B201D] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#232A25] border border-[#E5DDD0] dark:border-[#2A312B]'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Doa & Konseling Pastoral</span>
          </button>

          <button
            onClick={() => setActiveTab('sacrament')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'sacrament'
                ? 'bg-[#44634D] text-white shadow-sm scale-105'
                : 'bg-white dark:bg-[#1B201D] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#232A25] border border-[#E5DDD0] dark:border-[#2A312B]'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>Baptisan & Penyerahan Anak</span>
          </button>

          <button
            onClick={() => setActiveTab('komsel')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'komsel'
                ? 'bg-[#44634D] text-white shadow-sm scale-105'
                : 'bg-white dark:bg-[#1B201D] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#232A25] border border-[#E5DDD0] dark:border-[#2A312B]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gabung Komsel Ekklesia</span>
          </button>

          <button
            onClick={() => setActiveTab('volunteer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'volunteer'
                ? 'bg-[#44634D] text-white shadow-sm scale-105'
                : 'bg-white dark:bg-[#1B201D] text-[#5F6B63] dark:text-[#C5CDC7] hover:bg-[#EFEAE2] dark:hover:bg-[#232A25] border border-[#E5DDD0] dark:border-[#2A312B]'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Daftar Pelayan Ibadah</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1B201D] rounded-[2.5rem] border border-[#E5DDD0] dark:border-[#2A312B] shadow-sm p-7 sm:p-12">
          
          {submittedMessage && (
            <div className="mb-8 p-4 rounded-2xl bg-[#EBF1EC] dark:bg-[#202923] border border-[#D1E0D5] dark:border-[#2C3B31] text-[#334D3A] dark:text-[#8EB799] text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#44634D] shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D4741] dark:text-[#C5CDC7]">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Yohanes Prasetyo"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#44634D]"
                />
              </div>

              {/* Phone input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D4741] dark:text-[#C5CDC7]">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#44634D]"
                />
              </div>
            </div>

            {/* Dynamic fields based on active tab */}
            {activeTab === 'prayer' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3D4741] dark:text-[#C5CDC7]">
                    Kategori Pokok Doa
                  </label>
                  <select
                    value={prayerType}
                    onChange={(e) => setPrayerType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#44634D]"
                  >
                    <option value="Doa Pemulihan / Sakit">Doa Kesembuhan & Pemulihan Sakit</option>
                    <option value="Keluarga & Pernikahan">Doa Kerukunan Keluarga & Pernikahan</option>
                    <option value="Pekerjaan & Studi">Doa Pekerjaan, Usaha & Studi</option>
                    <option value="Penguatan Rohani">Konseling & Penguatan Rohani</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EBF1EC]/60 dark:bg-[#202923]/60 border border-[#D1E0D5] dark:border-[#2C3B31]">
                  <input
                    type="checkbox"
                    id="visitCheck"
                    checked={needPastoralVisit}
                    onChange={(e) => setNeedPastoralVisit(e.target.checked)}
                    className="w-4 h-4 rounded text-[#44634D] focus:ring-[#44634D]"
                  />
                  <label htmlFor="visitCheck" className="text-xs sm:text-sm font-semibold text-[#334D3A] dark:text-[#C5CDC7] cursor-pointer">
                    Mohon Kunjungan Tim Pastoral pada Hari Selasa
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'sacrament' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D4741] dark:text-[#C5CDC7]">
                  Jenis Sakramen / Penyerahan
                </label>
                <select
                  value={sacramentType}
                  onChange={(e) => setSacramentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#44634D]"
                >
                  <option value="Baptisan Selam">Baptisan Kudus (Baptis Selam Dewasa)</option>
                  <option value="Penyerahan Anak">Penyerahan Anak Balita</option>
                  <option value="Pernikahan Kudus">Bimbingan Pranikah & Pemberkatan Nikah</option>
                </select>
              </div>
            )}

            {activeTab === 'komsel' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D4741] dark:text-[#C5CDC7]">
                  Wilayah Tempat Tinggal / Kampus
                </label>
                <select
                  value={komselArea}
                  onChange={(e) => setKomselArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#44634D]"
                >
                  <option value="Deliksari & Sekaran (Unnes)">Deliksari & Sekaran (Area Kampus Unnes)</option>
                  <option value="Gunungpati & Sekitarnya">Gunungpati & Sekitarnya</option>
                  <option value="Sampangan & Menoreh">Sampangan, Menoreh & Bendan</option>
                  <option value="Wilayah Semarang Lainnya">Wilayah Semarang Lainnya</option>
                </select>
              </div>
            )}

            {activeTab === 'volunteer' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D4741] dark:text-[#C5CDC7]">
                  Minat Bidang Pelayanan
                </label>
                <select
                  value={volunteerRole}
                  onChange={(e) => setVolunteerRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#44634D]"
                >
                  <option value="DS Worship (Pemusik / Singer)">DS Worship (Keyboard, Gitar, Bass, Drum, Singer, WL)</option>
                  <option value="Multimedia & Sound System">Multimedia, Livestreaming & Sound System</option>
                  <option value="Usher & Tim Penyambut">Usher, Kolektan & Tim Penyambutan Jemaat</option>
                  <option value="Guru Sekolah Minggu COC Kidz">Guru & Asisten Sekolah Minggu COC Kidz</option>
                  <option value="Pengurus Youth Grow Generation">Pengurus Fellowship Grow Generation Youth</option>
                </select>
              </div>
            )}

            {/* Detail input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3D4741] dark:text-[#C5CDC7]">
                Keterangan Tambahan / Pesan
              </label>
              <textarea
                rows={3}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Tuliskan pokok doa, catatan alamat domisili, atau pengalaman pelayanan Anda di sini..."
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#232924] border border-[#E0D7C9] dark:border-[#2F3731] text-[#1E2320] dark:text-[#EDEAE4] text-sm focus:outline-none focus:ring-2 focus:ring-[#44634D]"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#44634D] hover:bg-[#36503E] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2.5 transition-all"
              >
                <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
                <span>Kirimkan ke WhatsApp Sekretariat Pastoral</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </section>
  );
}
