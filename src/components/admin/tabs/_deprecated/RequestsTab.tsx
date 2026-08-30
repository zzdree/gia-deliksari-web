'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, User, Tag, FileText, CheckSquare, Square, Mail, Phone, Shield, Users, MessageSquare, XCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { MinistryRequest } from '@/types';

interface RequestsTabProps {
  requests: MinistryRequest[];
  onRefresh: () => Promise<void>;
}

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  contacted: 'Dihubungi',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  cancelled: 'bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-950/40 dark:text-stone-300 dark:border-stone-800/60',
};

const typeLabels: Record<string, string> = {
  prayer: 'Doa & Konseling',
  sacrament: 'Sakramen Baptis',
  komsel: 'Komsel Ekklesia',
  volunteer: 'Volunteer Pelayan',
};

export function RequestsTab({ requests, onRefresh }: RequestsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    requestType: 'other',
    message: '',
    status: 'pending',
    notes: '',
  });

  const openModal = (item?: MinistryRequest) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        name: item.name,
        phone: item.phone || '',
        email: item.email || '',
        requestType: item.requestType || 'other',
        message: item.message || '',
        status: item.status,
        notes: item.notes || '',
      });
    } else {
      setEditingId(null);
      setForm({
        name: '',
        phone: '',
        email: '',
        requestType: 'other',
        message: '',
        status: 'pending',
        notes: '',
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
          table: 'ministry_requests',
          items: [{
            ...(editingId ? { id: editingId } : {}),
            name: form.name,
            phone: form.phone || null,
            email: form.email || null,
            request_type: form.requestType,
            message: form.message,
            status: form.status,
            notes: form.notes || null,
          }],
        }),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      closeModal();
      await onRefresh();
    } catch (err) {
      console.error('Gagal simpan permintaan:', err);
      alert('Gagal menyimpan permintaan pelayanan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus permintaan ini?')) return;
    try {
      const res = await fetch('/api/admin/data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'ministry_requests', id }),
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
            Permintaan Pelayanan
          </h2>
          <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
            Kelola permintaan baptis, pernikahan, pemakaman, konseling, dan lainnya.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-900/10 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Permintaan</span>
        </button>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="p-12 text-center rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] space-y-2">
            <MessageSquare className="w-10 h-10 text-[#C5222E] mx-auto opacity-60" />
            <h3 className="font-bold text-base text-[#1F1617] dark:text-white">Belum Ada Permintaan</h3>
            <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">Permintaan pelayanan akan muncul di sini.</p>
          </div>
        ) : (
          requests.map((item) => (
            <div key={item.id} className="p-6 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm hover:border-[#C5222E]/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[item.status] || statusColors.pending}`}>
                      {statusLabels[item.status] || item.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F2E8] text-[#5A4D4E] border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#D5C2C4] dark:border-[#3A1C20] capitalize">
                      {typeLabels[item.requestType] || item.requestType}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#1F1617] dark:text-white">
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                    {item.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {item.phone}
                      </span>
                    )}
                    {item.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {item.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-[#1F1617] dark:text-[#F5EFEB] line-clamp-3 leading-relaxed">
                    {item.message}
                  </p>

                  {item.notes && (
                    <div className="p-3 rounded-xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]">
                      <p className="text-xs font-bold text-[#5A4D4E] dark:text-[#D5C2C4] mb-1">Catatan Admin:</p>
                      <p className="text-xs text-[#1F1617] dark:text-[#F5EFEB]">{item.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openModal(item)}
                    className="p-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors"
                    title="Edit Permintaan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] hover:bg-[#FBE2E4] dark:hover:bg-[#451B21] text-[#9A1620] dark:text-[#F2828C] border border-[#F5CDD0] dark:border-[#521E25] transition-colors"
                    title="Hapus Permintaan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                {editingId ? 'Edit Permintaan Pelayanan' : 'Tambah Permintaan Baru'}
              </h3>
              <button onClick={closeModal} className="p-2 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Jenis Pelayanan *</label>
                  <select
                    value={form.requestType}
                    onChange={(e) => setForm({ ...form, requestType: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none"
                  >
                    <option value="baptism">Baptis</option>
                    <option value="wedding">Pernikahan</option>
                    <option value="funeral">Pemakaman</option>
                    <option value="counseling">Konseling</option>
                    <option value="membership">Keanggotaan</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
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
                    placeholder="budi@email.com"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Pesan / Detail Permintaan *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tuliskan detail permintaan pelayanan..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none"
                >
                  <option value="pending">Menunggu</option>
                  <option value="contacted">Dihubungi</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Catatan Admin (Internal)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Catatan internal untuk tim pelayanan..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30 resize-none"
                />
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
