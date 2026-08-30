'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, User, Tag, FileText, CheckSquare, Square, Mail, Phone, Shield, Users } from 'lucide-react';
import type { ServantRoster } from '@/types';

interface RosterTabProps {
  roster: ServantRoster[];
  onRefresh: () => Promise<void>;
}

const roleLabels: Record<string, string> = {
  pastor: 'Pendeta',
  deacon: 'Diakon',
  elder: 'Presbiter',
  musician: 'Musisi',
  usher: 'Usher',
  media: 'Media & Teknis',
  hospitality: 'Hospitality',
  children: 'Sekolah Minggu',
  youth: 'Pemuda',
  other: 'Lainnya',
};

const roleColors: Record<string, string> = {
  pastor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
  deacon: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
  elder: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  musician: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  usher: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
  media: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
  hospitality: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/60',
  children: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800/60',
  youth: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
  other: 'bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-950/40 dark:text-stone-300 dark:border-stone-800/60',
};

export function RosterTab({ roster, onRefresh }: RosterTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    role: 'other',
    phone: '',
    email: '',
    serviceDay: 'sunday',
    isActive: true,
    photoUrl: '',
  });

  const openModal = (item?: ServantRoster) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        name: item.name,
        role: item.role,
        phone: item.phone || '',
        email: item.email || '',
        serviceDay: item.serviceDay,
        isActive: item.isActive,
        photoUrl: item.photoUrl || '',
      });
    } else {
      setEditingId(null);
      setForm({
        name: '',
        role: 'other',
        phone: '',
        email: '',
        serviceDay: 'sunday',
        isActive: true,
        photoUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'servant_rosters',
          items: [{
            ...(editingId ? { id: editingId } : {}),
            name: form.name,
            role: form.role,
            phone: form.phone || null,
            email: form.email || null,
            service_day: form.serviceDay,
            is_active: form.isActive,
            photo_url: form.photoUrl || null,
          }],
        }),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      closeModal();
      await onRefresh();
    } catch (err) {
      console.error('Gagal simpan pelayan:', err);
      alert('Gagal menyimpan data pelayan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data pelayan ini?')) return;
    try {
      const res = await fetch(`/api/admin/data?table=servant_rosters&id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus');
      await onRefresh();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1F1617] dark:text-white">
            Daftar Pelayan
          </h2>
          <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
            Kelola data pelayan jemaat, peran pelayanan, dan jadwal ibadah.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-900/10 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelayan</span>
        </button>
      </div>

      <div className="space-y-4">
        {roster.length === 0 ? (
          <div className="p-12 text-center rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] space-y-2">
            <Users className="w-10 h-10 text-[#C5222E] mx-auto opacity-60" />
            <h3 className="font-bold text-base text-[#1F1617] dark:text-white">Belum Ada Data Pelayan</h3>
            <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">Klik "Tambah Pelayan" untuk menambahkan data pertama.</p>
          </div>
        ) : (
          roster.map((item) => (
            <div key={item.id} className="p-6 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm flex flex-col md:flex-row md:items-center gap-4 hover:border-[#C5222E]/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C5222E]/10 to-[#80141C]/10 flex items-center justify-center flex-shrink-0">
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#C5222E]" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#1F1617] dark:text-white">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${roleColors[item.role] || roleColors.other}`}>
                      {roleLabels[item.role] || item.role}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F2E8] text-[#5A4D4E] border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#D5C2C4] dark:border-[#3A1C20] capitalize">
                      {item.serviceDay}
                    </span>
                    {item.isActive && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                        Aktif
                      </span>
                    )}
                    {!item.isActive && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F2E8] text-[#6E5D5F] border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#B5A1A3] dark:border-[#3A1C20]">
                        Nonaktif
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1 text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                {item.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{item.phone}</span>
                  </div>
                )}
                {item.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{item.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openModal(item)}
                  className="p-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors"
                  title="Edit Pelayan"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-3 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] hover:bg-[#FBE2E4] dark:hover:bg-[#451B21] text-[#9A1620] dark:text-[#F2828C] border border-[#F5CDD0] dark:border-[#521E25] transition-colors"
                  title="Hapus Pelayan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-[#1F1617] dark:text-white">
                {editingId ? 'Edit Data Pelayan' : 'Tambah Pelayan Baru'}
              </h3>
              <button onClick={closeModal} className="p-2 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Bapak Andi Wijaya"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Peran Pelayanan *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none"
                >
                  <option value="pastor">Pendeta</option>
                  <option value="deacon">Diakon</option>
                  <option value="elder">Presbiter</option>
                  <option value="musician">Musisi</option>
                  <option value="usher">Usher</option>
                  <option value="media">Media & Teknis</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="children">Sekolah Minggu</option>
                  <option value="youth">Pemuda</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="andi@email.com"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Hari Pelayanan *</label>
                <select
                  value={form.serviceDay}
                  onChange={(e) => setForm({ ...form, serviceDay: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none"
                >
                  <option value="sunday">Minggu</option>
                  <option value="saturday">Sabtu</option>
                  <option value="wednesday">Rabu</option>
                  <option value="friday">Jumat</option>
                  <option value="daily">Setiap Hari</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Foto Profil (URL)</label>
                <input
                  type="url"
                  value={form.photoUrl}
                  onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[#EBDDCF] text-[#C5222E] focus:ring-[#C5222E] dark:border-[#3A1C20]"
                  />
                  <span className="text-xs text-[#1F1617] dark:text-[#F5EFEB]">Pelayan Aktif</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBDDCF] dark:border-[#3A1C20]">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A4D4E] dark:text-[#D5C2C4] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Update' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
