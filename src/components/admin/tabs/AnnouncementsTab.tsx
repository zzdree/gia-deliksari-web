'use client';

import { useState } from 'react';
import { Plus, Pin, Edit2, Trash2, X, Calendar, User, Tag, FileText, CheckSquare, Square } from 'lucide-react';
import type { Announcement } from '@/types';

interface AnnouncementsTabProps {
  announcements: Announcement[];
  onRefresh: () => Promise<void>;
}

export function AnnouncementsTab({ announcements, onRefresh }: AnnouncementsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    category: 'general',
    content: '',
    eventDate: '',
    isPinned: false,
    isPublished: true,
    badgeText: '',
    author: 'Sekretariat GIA Deliksari',
  });

  const openModal = (item?: Announcement) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        title: item.title,
        category: item.category,
        content: item.content,
        eventDate: item.eventDate || '',
        isPinned: item.isPinned,
        isPublished: item.isPublished,
        badgeText: item.badgeText || '',
        author: item.author || 'Sekretariat GIA Deliksari',
      });
    } else {
      setEditingId(null);
      setForm({
        title: '',
        category: 'general',
        content: '',
        eventDate: '',
        isPinned: false,
        isPublished: true,
        badgeText: '',
        author: 'Sekretariat GIA Deliksari',
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
        method: editingId ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'announcements',
          items: [{
            ...(editingId ? { id: editingId } : {}),
            title: form.title,
            category: form.category,
            content: form.content,
            event_date: form.eventDate || null,
            is_pinned: form.isPinned,
            is_published: form.isPublished,
            badge_text: form.badgeText || null,
            author: form.author,
          }],
        }),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      closeModal();
      await onRefresh();
    } catch (err) {
      console.error('Gagal simpan warta:', err);
      alert('Gagal menyimpan warta');
    }
  };

  const handleTogglePin = async (item: Announcement) => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'announcements',
          items: [{
            id: item.id,
            is_pinned: !item.isPinned,
          }],
        }),
      });
      if (!res.ok) throw new Error('Gagal toggle pin');
      await onRefresh();
    } catch (err) {
      console.error('Gagal toggle pin:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus warta ini?')) return;
    try {
      const res = await fetch(`/api/admin/data?table=announcements&id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus');
      await onRefresh();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const categoryLabels: Record<string, string> = {
    general: 'Ibadah Raya / Umum',
    youth: 'Grow Generation (Youth)',
    kidz: 'COC Kidz (Sekolah Minggu)',
    hana: 'Wanita Hana & Komsel',
    all: 'Semua Komunitas',
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1F1617] dark:text-white">
            Warta Jemaat & Pengumuman
          </h2>
          <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
            Kelola pengumuman ibadah, acara khusus, dan informasi penting untuk jemaat.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-900/10 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Warta</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="p-12 text-center rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] space-y-2">
            <FileText className="w-10 h-10 text-[#C5222E] mx-auto opacity-60" />
            <h3 className="font-bold text-base text-[#1F1617] dark:text-white">Belum Ada Warta</h3>
            <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">Klik "Tambah Warta" untuk membuat pengumuman pertama.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <div key={item.id} className="p-6 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm flex flex-col md:flex-row md:items-start gap-4 hover:border-[#C5222E]/40 transition-colors">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    item.category === 'general' ? 'bg-[#FDF0F0] text-[#9A1620] border-[#F5CDD0]' :
                    item.category === 'youth' ? 'bg-[#FFF2EE] text-[#C83E20] border-[#FCD2C7]' :
                    item.category === 'kidz' ? 'bg-[#FDF0F4] text-[#A6264A] border-[#F7C6D5]' :
                    'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5]'
                  }`}>
                    {categoryLabels[item.category] || item.category}
                  </span>
                  {item.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF9EC] text-[#B87A14] border border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19] flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" /> Sematkan
                    </span>
                  )}
                  {item.isPublished && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                      Dipublikasikan
                    </span>
                  )}
                  {!item.isPublished && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F2E8] text-[#6E5D5F] border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#B5A1A3] dark:border-[#3A1C20]">
                      Draf
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-[#1F1617] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4] line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleTogglePin(item)}
                  title={item.isPinned ? 'Lepas Pin' : 'Sematkan Warta'}
                  className={`p-3 rounded-2xl border transition-colors ${
                    item.isPinned
                      ? 'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]'
                      : 'bg-[#F7F2E8] dark:bg-[#2A161A] text-[#5A4D4E] dark:text-[#D5C2C4] border-[#EBDDCF] dark:border-[#3A1C20]'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openModal(item)}
                  className="p-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors"
                  title="Edit Warta"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-3 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] hover:bg-[#FBE2E4] dark:hover:bg-[#451B21] text-[#9A1620] dark:text-[#F2828C] border border-[#F5CDD0] dark:border-[#521E25] transition-colors"
                  title="Hapus Warta"
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
                {editingId ? 'Edit Warta Jemaat' : 'Tambah Warta Jemaat Baru'}
              </h3>
              <button onClick={closeModal} className="p-2 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Judul Warta *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Ibadah Padang Pemuda & Remaja"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Kategori Komunitas *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none"
                  >
                    <option value="general">Ibadah Raya / Umum</option>
                    <option value="youth">Grow Generation (Youth)</option>
                    <option value="kidz">COC Kidz (Sekolah Minggu)</option>
                    <option value="hana">Wanita Hana & Komsel</option>
                    <option value="all">Semua Komunitas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Tanggal Acara (Opsional)</label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Isi Warta *</label>
                <textarea
                  required
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tuliskan isi pengumuman di sini..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Penulis</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB]">Badge Text (Opsional)</label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                    placeholder="Contoh: BARU, PENTING, PENGINGAT"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                    className="w-4 h-4 rounded border-[#EBDDCF] text-[#C5222E] focus:ring-[#C5222E] dark:border-[#3A1C20]"
                  />
                  <span className="text-xs text-[#1F1617] dark:text-[#F5EFEB]">Sematkan di atas (pinned)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-[#EBDDCF] text-[#C5222E] focus:ring-[#C5222E] dark:border-[#3A1C20]"
                  />
                  <span className="text-xs text-[#1F1617] dark:text-[#F5EFEB]">Publikasikan sekarang</span>
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
