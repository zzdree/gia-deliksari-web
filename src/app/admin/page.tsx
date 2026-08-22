'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Announcement, ServantRoster, InventoryItem, MinistryCategory, InventoryCategory } from '@/types';
import { dataStore } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Bell,
  Users,
  PackageCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Pin,
  Calendar,
  Search,
  CheckSquare,
  Square,
  Database,
  RefreshCw,
  Phone,
  Lock,
  LogOut,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

const ADMIN_PASSWORD_DEFAULT = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '9900';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab & Data State
  const [activeTab, setActiveTab] = useState<'announcements' | 'roster' | 'inventory'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [roster, setRoster] = useState<ServantRoster[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Announcement Form State
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annForm, setAnnForm] = useState<{
    title: string;
    category: MinistryCategory;
    content: string;
    eventDate: string;
    isPinned: boolean;
    isPublished: boolean;
    badgeText: string;
    author: string;
  }>({
    title: '',
    category: 'general',
    content: '',
    eventDate: new Date().toISOString().split('T')[0],
    isPinned: false,
    isPublished: true,
    badgeText: 'Warta Baru',
    author: 'Sekretariat GIA Deliksari',
  });

  // Roster Category & Form State
  const [rosterCategoryTab, setRosterCategoryTab] = useState<'general' | 'youth' | 'kidz' | 'hana'>('general');
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [editingRosterId, setEditingRosterId] = useState<string | null>(null);
  const [rosterForm, setRosterForm] = useState<{
    serviceCategory: 'general' | 'youth' | 'kidz' | 'hana';
    serviceDate: string;
    role: string;
    servantName: string;
    phone: string;
    status: 'confirmed' | 'pending' | 'replacement';
    notes: string;
  }>({
    serviceCategory: 'general',
    serviceDate: new Date().toISOString().split('T')[0],
    role: 'Worship Leader (WL)',
    servantName: '',
    phone: '',
    status: 'confirmed',
    notes: '',
  });

  // Inventory Form & Filter State
  const [invCategoryFilter, setInvCategoryFilter] = useState<string>('all');
  const [invSearchQuery, setInvSearchQuery] = useState('');
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [editingInvId, setEditingInvId] = useState<string | null>(null);
  const [invForm, setInvForm] = useState<{
    name: string;
    category: InventoryCategory;
    code: string;
    quantity: number;
    isChecked: boolean;
    condition: 'good' | 'maintenance' | 'broken';
    location: string;
    notes: string;
  }>({
    name: '',
    category: 'Sound System',
    code: '',
    quantity: 1,
    isChecked: true,
    condition: 'good',
    location: 'Meja Sound Operator',
    notes: '',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check login session on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('gia_admin_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD_DEFAULT) {
      setIsAuthenticated(true);
      setAuthError(null);
      sessionStorage.setItem('gia_admin_authenticated', 'true');
      showToast('Login berhasil! Selamat datang di Portal Admin.');
      loadAllData();
    } else {
      setAuthError('Password salah. Silakan masukkan password admin yang benar (Default: 9900).');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    sessionStorage.removeItem('gia_admin_authenticated');
    showToast('Anda telah logout dari Portal Admin.');
  };

  async function loadAllData() {
    setLoading(true);
    try {
      const [annData, rosterData, invData] = await Promise.all([
        dataStore.getAnnouncements(),
        dataStore.getRoster(),
        dataStore.getInventory(),
      ]);
      setAnnouncements(annData);
      setRoster(rosterData);
      setInventory(invData);
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // ANNOUNCEMENT ACTIONS
  // ==========================
  const handleOpenAnnModal = (ann?: Announcement) => {
    if (ann) {
      setEditingAnnId(ann.id);
      setAnnForm({
        title: ann.title,
        category: ann.category,
        content: ann.content,
        eventDate: ann.eventDate,
        isPinned: ann.isPinned,
        isPublished: ann.isPublished,
        badgeText: ann.badgeText || '',
        author: ann.author || 'Sekretariat GIA Deliksari',
      });
    } else {
      setEditingAnnId(null);
      setAnnForm({
        title: '',
        category: 'general',
        content: '',
        eventDate: new Date().toISOString().split('T')[0],
        isPinned: false,
        isPublished: true,
        badgeText: 'Warta Baru',
        author: 'Sekretariat GIA Deliksari',
      });
    }
    setIsAnnModalOpen(true);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title.trim()) return;

    let updated: Announcement[];
    if (editingAnnId) {
      updated = announcements.map((item) =>
        item.id === editingAnnId
          ? { ...item, ...annForm }
          : item
      );
      showToast('Warta pengumuman berhasil diperbarui!');
    } else {
      const newItem: Announcement = {
        id: 'ann-' + Date.now(),
        ...annForm,
        createdAt: new Date().toISOString(),
      };
      updated = [newItem, ...announcements];
      showToast('Warta pengumuman baru berhasil ditambahkan!');
    }

    setAnnouncements(updated);
    await dataStore.saveAnnouncements(updated);
    setIsAnnModalOpen(false);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm('Yakin ingin menghapus warta pengumuman ini?')) {
      const updated = announcements.filter((item) => item.id !== id);
      setAnnouncements(updated);
      await dataStore.saveAnnouncements(updated);
      showToast('Warta berhasil dihapus.');
    }
  };

  const handleTogglePinAnnouncement = async (id: string) => {
    const updated = announcements.map((item) =>
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    );
    setAnnouncements(updated);
    await dataStore.saveAnnouncements(updated);
  };

  // ==========================
  // ROSTER ACTIONS (4 KATEGORI)
  // ==========================
  const handleOpenRosterModal = (rost?: ServantRoster) => {
    if (rost) {
      setEditingRosterId(rost.id);
      setRosterForm({
        serviceCategory: rost.serviceCategory,
        serviceDate: rost.serviceDate,
        role: rost.role,
        servantName: rost.servantName,
        phone: rost.phone || '',
        status: rost.status,
        notes: rost.notes || '',
      });
    } else {
      setEditingRosterId(null);
      setRosterForm({
        serviceCategory: rosterCategoryTab,
        serviceDate: new Date().toISOString().split('T')[0],
        role: 'Worship Leader (WL)',
        servantName: '',
        phone: '',
        status: 'confirmed',
        notes: '',
      });
    }
    setIsRosterModalOpen(true);
  };

  const handleSaveRoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rosterForm.servantName.trim() || !rosterForm.role.trim()) return;

    let updated: ServantRoster[];
    if (editingRosterId) {
      updated = roster.map((item) =>
        item.id === editingRosterId
          ? { ...item, ...rosterForm }
          : item
      );
      showToast('Jadwal pelayan berhasil diperbarui!');
    } else {
      const newItem: ServantRoster = {
        id: 'rst-' + Date.now(),
        ...rosterForm,
        createdAt: new Date().toISOString(),
      };
      updated = [...roster, newItem];
      showToast('Pelayan baru berhasil dijadwalkan!');
    }

    setRoster(updated);
    await dataStore.saveRoster(updated);
    setIsRosterModalOpen(false);
  };

  const handleDeleteRoster = async (id: string) => {
    if (confirm('Yakin ingin menghapus jadwal pelayan ini?')) {
      const updated = roster.filter((item) => item.id !== id);
      setRoster(updated);
      await dataStore.saveRoster(updated);
      showToast('Jadwal pelayan dihapus.');
    }
  };

  // ==========================
  // INVENTORY ACTIONS & CENTANG / UNCENTANG
  // ==========================
  const handleToggleCheckInventory = async (id: string) => {
    const updated = inventory.map((item) => {
      if (item.id === id) {
        const nextChecked = !item.isChecked;
        return {
          ...item,
          isChecked: nextChecked,
          lastCheckedAt: nextChecked
            ? new Date().toISOString().replace('T', ' ').slice(0, 16)
            : item.lastCheckedAt,
          checkedBy: nextChecked ? 'Petugas Admin' : item.checkedBy,
        };
      }
      return item;
    });

    setInventory(updated);
    await dataStore.saveInventory(updated);
  };

  const handleOpenInvModal = (item?: InventoryItem) => {
    if (item) {
      setEditingInvId(item.id);
      setInvForm({
        name: item.name,
        category: item.category,
        code: item.code,
        quantity: item.quantity,
        isChecked: item.isChecked,
        condition: item.condition,
        location: item.location,
        notes: item.notes || '',
      });
    } else {
      setEditingInvId(null);
      setInvForm({
        name: '',
        category: 'Sound System',
        code: 'INV-' + Date.now().toString().slice(-4),
        quantity: 1,
        isChecked: true,
        condition: 'good',
        location: 'Ruang Operasional',
        notes: '',
      });
    }
    setIsInvModalOpen(true);
  };

  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invForm.name.trim()) return;

    let updated: InventoryItem[];
    if (editingInvId) {
      updated = inventory.map((item) =>
        item.id === editingInvId
          ? { ...item, ...invForm }
          : item
      );
      showToast('Barang inventaris berhasil diperbarui!');
    } else {
      const newItem: InventoryItem = {
        id: 'inv-' + Date.now(),
        ...invForm,
        createdAt: new Date().toISOString(),
      };
      updated = [...inventory, newItem];
      showToast('Barang inventaris baru berhasil ditambahkan!');
    }

    setInventory(updated);
    await dataStore.saveInventory(updated);
    setIsInvModalOpen(false);
  };

  const handleDeleteInventory = async (id: string) => {
    if (confirm('Yakin ingin menghapus barang inventaris ini?')) {
      const updated = inventory.filter((item) => item.id !== id);
      setInventory(updated);
      await dataStore.saveInventory(updated);
      showToast('Barang berhasil dihapus.');
    }
  };

  const handleResetChecklist = async () => {
    if (confirm('Reset semua checklist inventaris menjadi belum dicentang?')) {
      const updated = inventory.map((item) => ({ ...item, isChecked: false }));
      setInventory(updated);
      await dataStore.saveInventory(updated);
      showToast('Semua checklist berhasil di-reset!');
    }
  };

  // Filtered inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesCat = invCategoryFilter === 'all' || item.category === invCategoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(invSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LOGIN GATE SCREEN IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
          <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50 mx-auto shadow-md bg-white">
                <Image
                  src="/images/logo.png"
                  alt="Logo GIA Deliksari"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Admin Authentication
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Masukkan password admin untuk mengelola warta, jadwal pelayan, dan inventaris GIA Deliksari.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Password Admin
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    autoFocus
                    autoComplete="current-password"
                    placeholder="Masukkan password (Default: 9900)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-right">
                  Default password: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">9900</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Portal Admin</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <a
                href="/public"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                &larr; Kembali ke Web Publik (/public)
              </a>
            </div>
          </div>
        </main>
      ) : (
        /* MAIN AUTHENTICATED ADMIN CONTENT */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          
          {/* Top Header & DB Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  GIA DELIKSARI ADMIN PORTAL
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ Logged In
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Pusat Manajemen Operasional & Pelayanan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Kelola papan informasi jemaat, plotting pelayan di 4 kategori ibadah, dan checklist inventaris gereja.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs">
                <Database className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="text-slate-400">DB: </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Sync (Active)'}
                  </span>
                </div>
              </div>

              <button
                onClick={loadAllData}
                title="Refresh Data"
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                title="Logout dari Admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'announcements'
                  ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Papan Informasi ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'roster'
                  ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Plotting Pelayan ({roster.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Inventaris & Checklist ({inventory.length})</span>
            </button>
          </div>

          {/* TAB 1: ANNOUNCEMENTS MANAGER */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Daftar Warta & Papan Informasi
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Warta yang diterbitkan akan otomatis tampil di halaman utama web publik (/public).
                  </p>
                </div>

                <button
                  onClick={() => handleOpenAnnModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengumuman Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          {item.category.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePinAnnouncement(item.id)}
                            title={item.isPinned ? 'Unpin' : 'Pin to Top'}
                            className={`p-1.5 rounded-lg border text-xs ${
                              item.isPinned
                                ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                : 'text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenAnnModal(item)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(item.id)}
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {item.eventDate}
                      </span>
                      <span className="font-semibold">{item.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ROSTER PELAYAN (4 KATEGORI) */}
          {activeTab === 'roster' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Plotting & Jadwal Tugas Pelayan
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pengaturan jadwal pelayan terbagi ke dalam 4 kategori ibadah utama.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenRosterModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Jadwalkan Pelayan Baru</span>
                </button>
              </div>

              {/* 4 Category Filter Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-1.5 bg-slate-200/70 dark:bg-slate-900 rounded-2xl">
                <button
                  onClick={() => setRosterCategoryTab('general')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    rosterCategoryTab === 'general'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  1. Ibadah Raya (General)
                </button>
                <button
                  onClick={() => setRosterCategoryTab('youth')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    rosterCategoryTab === 'youth'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  2. Grow Generation (Youth)
                </button>
                <button
                  onClick={() => setRosterCategoryTab('kidz')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    rosterCategoryTab === 'kidz'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  3. COC Kidz (Sekolah Minggu)
                </button>
                <button
                  onClick={() => setRosterCategoryTab('hana')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    rosterCategoryTab === 'hana'
                      ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  4. Hana & Komsel (Komunitas)
                </button>
              </div>

              {/* Roster Table / Card List */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>Daftar Petugas Pelayanan</span>
                  <span>Kategori: {rosterCategoryTab.toUpperCase()}</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {roster
                    .filter((r) => r.serviceCategory === rosterCategoryTab)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              {r.role}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-500" />
                              {r.serviceDate}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {r.servantName}
                          </h4>
                          {r.notes && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Catatan: {r.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {r.phone && (
                            <a
                              href={`https://wa.me/${r.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              title="Hubungi WhatsApp"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenRosterModal(r)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoster(r.id)}
                            className="p-2 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {roster.filter((r) => r.serviceCategory === rosterCategoryTab).length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      Belum ada jadwal pelayan untuk kategori ini. Klik "Jadwalkan Pelayan Baru" untuk menambahkan.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY & CHECKLIST (CENTANG / UNCENTANG) */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Inventaris & Checklist Kesiapan Ibadah
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Centang setiap item untuk memastikan peralatan telah siap dan dicek sebelum ibadah dimulai.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetChecklist}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset Checklist Ibadah
                  </button>
                  <button
                    onClick={() => handleOpenInvModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Barang</span>
                  </button>
                </div>
              </div>

              {/* Inventory Controls Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama alat, kode, atau lokasi rak..."
                    value={invSearchQuery}
                    onChange={(e) => setInvSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <select
                  value={invCategoryFilter}
                  onChange={(e) => setInvCategoryFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="all">Semua Kategori Inventaris</option>
                  <option value="Sound System">Sound System</option>
                  <option value="Multimedia & Kamera">Multimedia & Kamera</option>
                  <option value="Alat Musik">Alat Musik</option>
                  <option value="Ibadah & Ruangan">Ibadah & Ruangan</option>
                </select>
              </div>

              {/* Inventory Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-3xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                      item.isChecked
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <button
                        onClick={() => handleToggleCheckInventory(item.id)}
                        type="button"
                        aria-label="Toggle Check"
                        className="mt-0.5 flex-shrink-0"
                      >
                        {item.isChecked ? (
                          <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-transform active:scale-90" />
                        ) : (
                          <Square className="w-6 h-6 text-slate-400 hover:text-amber-500 transition-transform active:scale-90" />
                        )}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {item.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                            {item.code}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            Qty: {item.quantity} Unit
                          </span>
                        </div>

                        <h4
                          onClick={() => handleToggleCheckInventory(item.id)}
                          className={`text-base font-bold cursor-pointer transition-colors ${
                            item.isChecked
                              ? 'text-slate-900 dark:text-white line-through opacity-80'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.name}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          📍 Lokasi: {item.location}
                        </p>

                        {item.notes && (
                          <p className="text-xs text-amber-700 dark:text-amber-300/80 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-900/60">
                            ℹ️ {item.notes}
                          </p>
                        )}

                        {item.isChecked && item.lastCheckedAt && (
                          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Dicek: {item.lastCheckedAt} ({item.checkedBy || 'Admin'})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenInvModal(item)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteInventory(item.id)}
                        className="p-2 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      )}

      {/* MODAL 1: FORM WARTA PENGUMUMAN */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingAnnId ? 'Edit Warta Pengumuman' : 'Tambah Warta Pengumuman Baru'}
              </h3>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="Contoh: Ibadah Padang Pemuda"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kategori</label>
                  <select
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as MinistryCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="general">Umum & Ibadah Raya</option>
                    <option value="youth">Grow Generation (Youth)</option>
                    <option value="kidz">COC Kidz (Sekolah Minggu)</option>
                    <option value="hana">Hana Fellowship (Wanita)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Tanggal Acara</label>
                  <input
                    type="date"
                    required
                    value={annForm.eventDate}
                    onChange={(e) => setAnnForm({ ...annForm, eventDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Isi Pengumuman / Detail</label>
                <textarea
                  rows={4}
                  required
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Tuliskan warta, jam, dan petunjuk untuk jemaat..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={annForm.isPinned}
                    onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Sematkan ke Atas (Pin)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={annForm.isPublished}
                    onChange={(e) => setAnnForm({ ...annForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Publikasikan Segera</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500 shadow-md"
                >
                  Simpan Warta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM ROSTER PELAYAN */}
      {isRosterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingRosterId ? 'Edit Jadwal Pelayan' : 'Jadwalkan Pelayan Baru'}
              </h3>
              <button
                onClick={() => setIsRosterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoster} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kategori Ibadah</label>
                  <select
                    value={rosterForm.serviceCategory}
                    onChange={(e) => setRosterForm({ ...rosterForm, serviceCategory: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="general">Ibadah Raya (General)</option>
                    <option value="youth">Grow Generation (Youth)</option>
                    <option value="kidz">COC Kidz (Sekolah Minggu)</option>
                    <option value="hana">Hana Fellowship (Wanita)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Tanggal Pelayanan</label>
                  <input
                    type="date"
                    required
                    value={rosterForm.serviceDate}
                    onChange={(e) => setRosterForm({ ...rosterForm, serviceDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Tugas / Role Pelayanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Worship Leader, Singer, Pemain Bass, Multimedia, Usher"
                  value={rosterForm.role}
                  onChange={(e) => setRosterForm({ ...rosterForm, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Nama Pelayan / Petugas</label>
                <input
                  type="text"
                  required
                  placeholder="Nama pelayan yang bertugas"
                  value={rosterForm.servantName}
                  onChange={(e) => setRosterForm({ ...rosterForm, servantName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="0812xxxx (opsional)"
                    value={rosterForm.phone}
                    onChange={(e) => setRosterForm({ ...rosterForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Status Konfirmasi</label>
                  <select
                    value={rosterForm.status}
                    onChange={(e) => setRosterForm({ ...rosterForm, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="confirmed">Confirmed (Siap)</option>
                    <option value="pending">Pending (Menunggu)</option>
                    <option value="replacement">Perlu Pengganti</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Catatan Khusus</label>
                <input
                  type="text"
                  placeholder="Contoh: Latihan hari Sabtu jam 18.00"
                  value={rosterForm.notes}
                  onChange={(e) => setRosterForm({ ...rosterForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRosterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500 shadow-md"
                >
                  Simpan Jadwal Pelayan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FORM INVENTARIS */}
      {isInvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingInvId ? 'Edit Data Inventaris' : 'Tambah Barang Inventaris Baru'}
              </h3>
              <button
                onClick={() => setIsInvModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInventory} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Nama Peralatan / Barang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Wireless Microphone Shure Beta 58A"
                  value={invForm.name}
                  onChange={(e) => setInvForm({ ...invForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kategori</label>
                  <select
                    value={invForm.category}
                    onChange={(e) => setInvForm({ ...invForm, category: e.target.value as InventoryCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Sound System">Sound System</option>
                    <option value="Multimedia & Kamera">Multimedia & Kamera</option>
                    <option value="Alat Musik">Alat Musik</option>
                    <option value="Ibadah & Ruangan">Ibadah & Ruangan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kode Barang</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: MIC-01"
                    value={invForm.code}
                    onChange={(e) => setInvForm({ ...invForm, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Jumlah (Unit)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={invForm.quantity}
                    onChange={(e) => setInvForm({ ...invForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kondisi</label>
                  <select
                    value={invForm.condition}
                    onChange={(e) => setInvForm({ ...invForm, condition: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="good">Baik / Normal (Ready)</option>
                    <option value="maintenance">Perlu Pengecekan</option>
                    <option value="broken">Rusak / Servis</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Lokasi Penyimpanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Meja Sound Operator / Lemari Pastori"
                  value={invForm.location}
                  onChange={(e) => setInvForm({ ...invForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Catatan Teknis</label>
                <input
                  type="text"
                  placeholder="Keterangan tambahan baterai, kabel, dll."
                  value={invForm.notes}
                  onChange={(e) => setInvForm({ ...invForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInvModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500 shadow-md"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
