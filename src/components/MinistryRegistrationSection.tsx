'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Users, 
  Baby, 
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
    <section id="layanan" className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Layanan Jemaat & Formulir Pelayanan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pusat Pelayanan & Pendaftaran Jemaat
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Kami siap mendoakan, melayani kebutuhan rohani Anda, serta menyambut Anda yang rindu melayani bersama di GIA Deliksari.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('prayer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'prayer'
                ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Doa & Konseling Pastoral</span>
          </button>

          <button
            onClick={() => setActiveTab('sacrament')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'sacrament'
                ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>Baptisan & Penyerahan Anak</span>
          </button>

          <button
            onClick={() => setActiveTab('komsel')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'komsel'
                ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gabung Komsel Ekklesia</span>
          </button>

          <button
            onClick={() => setActiveTab('volunteer')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'volunteer'
                ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Daftar Pelayan Ibadah</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-10">
          
          {submittedMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header info based on active tab */}
            <div className="pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'prayer' && 'Formulir Permohonan Doa & Konseling Penggembalaan'}
                {activeTab === 'sacrament' && 'Pendaftaran Pelayanan Baptisan Selam / Penyerahan Anak'}
                {activeTab === 'komsel' && 'Pendaftaran Komunitas Sel (Komsel Ekklesia)'}
                {activeTab === 'volunteer' && 'Pendaftaran & Formulir Komitmen Pelayan Ibadah'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === 'prayer' && 'Keluarga Gembala (Ps. Yohanes Sutono & Ibu Santini) serta Tim Pendoa siap melayani dan mendoakan pokok pergumulan Anda.'}
                {activeTab === 'sacrament' && 'Mari mengambil langkah iman melalui sakramen baptisan kudus atau mempersembahkan buah hati Anda kepada Tuhan.'}
                {activeTab === 'komsel' && 'Bertumbuh bersama dalam kelompok kecil selang-seling setiap minggu di GIA Deliksari.'}
                {activeTab === 'volunteer' && 'Gunakan talenta Anda untuk memuliakan Tuhan dalam musik, multimedia, usher, sekolah minggu, atau doa.'}
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Yohanes Andreas"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Tab-Specific Select Options */}
            {activeTab === 'prayer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Kategori Permohonan Doa
                  </label>
                  <select
                    value={prayerType}
                    onChange={(e) => setPrayerType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Doa Pemulihan Kesehatan / Sakit">Doa Pemulihan Kesehatan / Sakit</option>
                    <option value="Doa Keluarga & Rumah Tangga">Doa Keluarga & Rumah Tangga</option>
                    <option value="Doa Pekerjaan & Usaha / Studi">Doa Pekerjaan & Usaha / Studi</option>
                    <option value="Konseling Pribadi dengan Gembala">Konseling Pribadi dengan Gembala</option>
                    <option value="Doa Ucapan Syukur">Doa Ucapan Syukur</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Permohonan Kunjungan Rumah (Hari Selasa)
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Tim Pastoral rutin mengadakan kunjungan jemaat setiap hari Selasa.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={needPastoralVisit}
                    onChange={(e) => setNeedPastoralVisit(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'sacrament' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Pilih Layanan Sakramen
                </label>
                <select
                  value={sacramentType}
                  onChange={(e) => setSacramentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Baptisan Selam (Baptisan Kudus)">Baptisan Selam (Baptisan Kudus)</option>
                  <option value="Penyerahan Anak (Child Dedication)">Penyerahan Anak (Child Dedication)</option>
                  <option value="Pernikahan Kudus / Konseling Pranikah">Pernikahan Kudus / Konseling Pranikah</option>
                </select>
              </div>
            )}

            {activeTab === 'komsel' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Pilih Domisili / Area Komsel Terdekat
                </label>
                <select
                  value={komselArea}
                  onChange={(e) => setKomselArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Deliksari & Sekaran (Sekitar Unnes)">Deliksari & Sekaran (Sekitar Unnes)</option>
                  <option value="Gunung Pati & Sekitarnya">Gunung Pati & Sekitarnya</option>
                  <option value="Sampangan & Menoreh">Sampangan & Menoreh</option>
                  <option value="Ngaliyan / Manyaran">Ngaliyan / Manyaran</option>
                  <option value="Area Lainnya di Semarang">Area Lainnya di Semarang</option>
                </select>
              </div>
            )}

            {activeTab === 'volunteer' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Pilih Bidang Pelayanan yang Diminati
                </label>
                <select
                  value={volunteerRole}
                  onChange={(e) => setVolunteerRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="DS Worship - Pemain Musik (Keyboard/Bass/Drum/Gitar)">DS Worship - Pemain Musik (Keyboard/Bass/Drum/Gitar)</option>
                  <option value="DS Worship - Worship Leader / Singers">DS Worship - Worship Leader / Singers</option>
                  <option value="Multimedia - Operator Slide / EasyWorship">Multimedia - Operator Slide / EasyWorship</option>
                  <option value="Multimedia - Sound Engineer / Audio Mixer">Multimedia - Sound Engineer / Audio Mixer</option>
                  <option value="Usher & Kolektan (Penyambut Jemaat)">Usher & Kolektan (Penyambut Jemaat)</option>
                  <option value="COC Kidz - Guru / Fasilitator Sekolah Minggu">COC Kidz - Guru / Fasilitator Sekolah Minggu</option>
                  <option value="Grow Generation - Tim Kreatif & Media Pemuda">Grow Generation - Tim Kreatif & Media Pemuda</option>
                </select>
              </div>
            )}

            {/* Detailed text message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {activeTab === 'prayer' ? 'Tuliskan Pokok Doa / Hal yang Ingin Dikonsultasikan' : 'Catatan / Keterangan Tambahan'}
              </label>
              <textarea
                rows={3}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Tuliskan pesan atau kebutuhan Anda secara jelas..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Kirim Formulir ke WhatsApp Pastoral GIA Deliksari</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
