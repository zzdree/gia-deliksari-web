'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  LogOut,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  X
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

  // Helper category badges
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'general':
        return 'bg-[#FDF0F0] text-[#9A1620] border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]';
      case 'youth':
        return 'bg-[#FFF2EE] text-[#C83E20] border-[#FCD2C7] dark:bg-[#331812] dark:text-[#F88B72] dark:border-[#57241A]';
      case 'kidz':
        return 'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]';
      case 'hana':
        return 'bg-[#FDF0F4] text-[#A6264A] border-[#F7C6D5] dark:bg-[#33121E] dark:text-[#EA7FA0] dark:border-[#541D30]';
      default:
        return 'bg-[#F7F2E8] text-[#5A4D4E] border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#D5C2C4] dark:border-[#3A1C20]';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general':
        return 'Ibadah Raya';
      case 'youth':
        return 'Grow Youth';
      case 'kidz':
        return 'COC Kidz';
      case 'hana':
        return 'Wanita Hana & Komsel';
      default:
        return category;
    }
  };

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
  // INVENTORY ACTIONS & CHECKLIST
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
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#150B0D] text-[#1F1617] dark:text-[#F5EFEB] transition-colors">
      <Navbar />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-[#221215] dark:bg-[#FDFBF7] text-white dark:text-[#1F1617] border border-[#C5222E]/40 dark:border-[#EBDDCF] font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LOGIN GATE SCREEN IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
          <div className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-xl space-y-6">
            <div className="text-center space-y-3">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#C5222E]/30 mx-auto shadow-sm bg-white p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="Logo GIA Deliksari"
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF0F0] dark:bg-[#331418] text-[#9A1620] dark:text-[#F2828C] border border-[#F5CDD0] dark:border-[#521E25] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5222E]" />
                <span>Portal Pengurus Gereja</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F1617] dark:text-[#F5EFEB]">
                Admin Authentication
              </h1>
              <p className="text-xs sm:text-sm text-[#5A4D4E] dark:text-[#D5C2C4] leading-relaxed">
                Masukkan password admin untuk mengelola warta jemaat, plotting pelayan ibadah, dan inventaris gereja.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-xs font-semibold text-[#9A1620] dark:text-[#F2828C] text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5D5F] dark:text-[#B5A1A3]">
                  Password Admin
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E5D5F] dark:text-[#B5A1A3]" />
                  <input
                    type="password"
                    required
                    autoFocus
                    autoComplete="current-password"
                    placeholder="Masukkan password (Default: 9900)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-[#F7F2E8]/60 dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] rounded-2xl focus:ring-2 focus:ring-[#C5222E]/40 focus:border-[#C5222E] focus:outline-none text-[#1F1617] dark:text-[#F5EFEB]"
                  />
                </div>
                <p className="text-[11px] text-[#6E5D5F] dark:text-[#B5A1A3] text-right">
                  Default password: <span className="font-mono font-bold text-[#C5222E] dark:text-[#E03643]">9900</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Portal Admin</span>
              </button>
            </form>

            <div className="pt-4 border-t border-[#EBDDCF] dark:border-[#3A1C20] text-center">
              <Link
                href="/home"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A4D4E] dark:text-[#D5C2C4] hover:text-[#C5222E] dark:hover:text-[#E03643] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Utama (/home)</span>
              </Link>
            </div>
          </div>
        </main>
      ) : (
        /* MAIN AUTHENTICATED ADMIN CONTENT */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          
          {/* Top Header & DB Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FDF0F0] text-[#9A1620] border border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]">
                  GIA DELIKSARI ADMIN PORTAL
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                  ✓ Sesi Aktif
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F1617] dark:text-[#F5EFEB]">
                Pusat Manajemen Operasional & Pelayanan
              </h1>
              <p className="text-xs sm:text-sm text-[#5A4D4E] dark:text-[#D5C2C4]">
                Kelola warta jemaat, plotting pelayan di 4 kategori komunitas ibadah, dan checklist inventaris gereja.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] flex items-center gap-2 text-xs">
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="text-[#6E5D5F] dark:text-[#B5A1A3]">Penyimpanan: </span>
                  <span className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                    {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Sync (Aktif)'}
                  </span>
                </div>
              </div>

              <button
                onClick={loadAllData}
                title="Refresh Data"
                className="p-2.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] hover:bg-[#EFE6D5] dark:hover:bg-[#33181E] text-[#1F1617] dark:text-[#F5EFEB] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                title="Logout dari Admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] hover:bg-[#FBE4E6] text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#EBDDCF] dark:border-[#3A1C20] pb-3">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'announcements'
                  ? 'bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-md'
                  : 'bg-white dark:bg-[#221215] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Warta Jemaat ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'roster'
                  ? 'bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-md'
                  : 'bg-white dark:bg-[#221215] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Roster Pelayanan ({roster.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white shadow-md'
                  : 'bg-white dark:bg-[#221215] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20]'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Inventaris Gereja ({inventory.length})</span>
            </button>
          </div>

          {/* TAB 1: ANNOUNCEMENTS MANAGER */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                    Daftar Warta & Papan Informasi Jemaat
                  </h2>
                  <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                    Warta dengan status <strong>Publikasikan</strong> akan otomatis tampil pada halaman publik (/home).
                  </p>
                </div>

                <button
                  onClick={() => handleOpenAnnModal()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Warta Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-6 sm:p-7 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getCategoryBadgeClass(item.category)}`}>
                          {getCategoryLabel(item.category)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePinAnnouncement(item.id)}
                            title={item.isPinned ? 'Lepas Pin' : 'Sematkan ke Atas'}
                            className={`p-1.5 rounded-xl border text-xs transition-colors ${
                              item.isPinned
                                ? 'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E]'
                                : 'text-[#6E5D5F] border-[#EBDDCF] dark:border-[#3A1C20] hover:bg-[#F7F2E8]'
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenAnnModal(item)}
                            title="Edit Warta"
                            className="p-1.5 rounded-xl border border-[#EBDDCF] dark:border-[#3A1C20] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(item.id)}
                            title="Hapus Warta"
                            className="p-1.5 rounded-xl border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] hover:bg-[#FDF0F0] dark:hover:bg-[#331418] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {item.isPinned && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#FEF9EC] text-[#B87A14] border border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E]">
                              📌 Tersemat
                            </span>
                          )}
                          {!item.isPublished && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F7F2E8] text-[#6E5D5F] border border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#B5A1A3] dark:border-[#3A1C20]">
                              Draft (Tidak Tayang)
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-[#1F1617] dark:text-[#F5EFEB] leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4] line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EBDDCF]/60 dark:border-[#3A1C20]/60 flex items-center justify-between text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-[#C5222E]" />
                        {item.eventDate}
                      </span>
                      <span className="font-semibold text-[11px]">{item.author}</span>
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
                  <h2 className="text-xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                    Plotting & Jadwal Tugas Pelayan Ibadah
                  </h2>
                  <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                    Pengaturan jadwal pelayan ibadah terbagi dalam 4 kategori komunitas gereja.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenRosterModal()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Jadwalkan Pelayan Baru</span>
                </button>
              </div>

              {/* 4 Category Filter Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-1.5 bg-[#F7F2E8] dark:bg-[#1A0E10] rounded-2xl border border-[#EBDDCF] dark:border-[#3A1C20]">
                <button
                  onClick={() => setRosterCategoryTab('general')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    rosterCategoryTab === 'general'
                      ? 'bg-[#C5222E] text-white shadow-xs'
                      : 'text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-white/60 dark:hover:bg-[#221215]'
                  }`}
                >
                  1. Ibadah Raya
                </button>
                <button
                  onClick={() => setRosterCategoryTab('youth')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    rosterCategoryTab === 'youth'
                      ? 'bg-[#C83E20] text-white shadow-xs'
                      : 'text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-white/60 dark:hover:bg-[#221215]'
                  }`}
                >
                  2. Grow Youth
                </button>
                <button
                  onClick={() => setRosterCategoryTab('kidz')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    rosterCategoryTab === 'kidz'
                      ? 'bg-[#B87A14] text-white shadow-xs'
                      : 'text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-white/60 dark:hover:bg-[#221215]'
                  }`}
                >
                  3. COC Kidz
                </button>
                <button
                  onClick={() => setRosterCategoryTab('hana')}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    rosterCategoryTab === 'hana'
                      ? 'bg-[#A6264A] text-white shadow-xs'
                      : 'text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-white/60 dark:hover:bg-[#221215]'
                  }`}
                >
                  4. Wanita Hana & Komsel
                </button>
              </div>

              {/* Roster Table / Card List */}
              <div className="bg-white dark:bg-[#221215] rounded-[2.5rem] border border-[#EBDDCF] dark:border-[#3A1C20] overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 border-b border-[#EBDDCF] dark:border-[#3A1C20] flex items-center justify-between text-xs font-bold text-[#6E5D5F] dark:text-[#B5A1A3] uppercase">
                  <span>Daftar Petugas Pelayanan</span>
                  <span>Kategori: {getCategoryLabel(rosterCategoryTab)}</span>
                </div>

                <div className="divide-y divide-[#EBDDCF]/60 dark:divide-[#3A1C20]/60">
                  {roster
                    .filter((r) => r.serviceCategory === rosterCategoryTab)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFBF7] dark:hover:bg-[#2A161A] transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#FDF0F0] text-[#9A1620] border border-[#F5CDD0] dark:bg-[#331418] dark:text-[#F2828C] dark:border-[#521E25]">
                              {r.role}
                            </span>
                            <span className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3] flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-[#C5222E]" />
                              {r.serviceDate}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                r.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                  : r.status === 'replacement'
                                  ? 'bg-[#FEF9EC] text-[#B87A14] border-[#F8E3B5] dark:bg-[#332612] dark:text-[#F0BE5E] dark:border-[#543E19]'
                                  : 'bg-[#F7F2E8] text-[#6E5D5F] border-[#EBDDCF] dark:bg-[#2A161A] dark:text-[#B5A1A3] dark:border-[#3A1C20]'
                              }`}
                            >
                              {r.status === 'confirmed'
                                ? 'Siap Melayani'
                                : r.status === 'replacement'
                                ? 'Perlu Pengganti'
                                : 'Menunggu Konfirmasi'}
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                            {r.servantName}
                          </h4>
                          {r.notes && (
                            <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
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
                              className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Hubungi WhatsApp"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenRosterModal(r)}
                            className="p-2 rounded-xl border border-[#EBDDCF] dark:border-[#3A1C20] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] transition-colors"
                            title="Edit Roster"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoster(r.id)}
                            className="p-2 rounded-xl border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] hover:bg-[#FDF0F0] dark:hover:bg-[#331418] transition-colors"
                            title="Hapus Roster"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                  {roster.filter((r) => r.serviceCategory === rosterCategoryTab).length === 0 && (
                    <div className="py-12 text-center text-[#6E5D5F] dark:text-[#B5A1A3] text-sm">
                      Belum ada jadwal pelayan untuk kategori ini. Klik "Jadwalkan Pelayan Baru" untuk menambahkan.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY & CHECKLIST */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                    Inventaris & Checklist Kesiapan Ibadah
                  </h2>
                  <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                    Centang setiap item untuk memastikan peralatan telah dicek dan siap sebelum ibadah dimulai.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetChecklist}
                    className="px-4 py-2.5 rounded-2xl text-xs font-bold border border-[#EBDDCF] dark:border-[#3A1C20] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] transition-colors"
                  >
                    Reset Checklist Ibadah
                  </button>
                  <button
                    onClick={() => handleOpenInvModal()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Barang</span>
                  </button>
                </div>
              </div>

              {/* Inventory Controls Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#221215] p-4 rounded-2xl border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E5D5F] dark:text-[#B5A1A3]" />
                  <input
                    type="text"
                    placeholder="Cari nama alat, kode, atau lokasi rak..."
                    value={invSearchQuery}
                    onChange={(e) => setInvSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F7F2E8]/60 dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] rounded-xl focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none text-[#1F1617] dark:text-[#F5EFEB]"
                  />
                </div>

                <select
                  value={invCategoryFilter}
                  onChange={(e) => setInvCategoryFilter(e.target.value)}
                  className="bg-[#F7F2E8]/60 dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none text-[#1F1617] dark:text-[#F5EFEB]"
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
                    className={`p-5 rounded-[2rem] border transition-all duration-200 flex items-start justify-between gap-4 ${
                      item.isChecked
                        ? 'bg-[#FEF9EC]/40 dark:bg-[#2A1E14]/30 border-[#F8E3B5] dark:border-[#543E19] shadow-xs'
                        : 'bg-white dark:bg-[#221215] border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm'
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
                          <CheckSquare className="w-6 h-6 text-[#B87A14] dark:text-[#F0BE5E] transition-transform active:scale-90" />
                        ) : (
                          <Square className="w-6 h-6 text-[#6E5D5F] hover:text-[#C5222E] transition-transform active:scale-90" />
                        )}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#F7F2E8] dark:bg-[#2A161A] text-[#5A4D4E] dark:text-[#D5C2C4] border border-[#EBDDCF] dark:border-[#3A1C20]">
                            {item.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#C5222E] dark:text-[#E03643]">
                            {item.code}
                          </span>
                          <span className="text-xs font-bold text-[#6E5D5F] dark:text-[#B5A1A3]">
                            Qty: {item.quantity} Unit
                          </span>
                        </div>

                        <h4
                          onClick={() => handleToggleCheckInventory(item.id)}
                          className={`text-base font-extrabold cursor-pointer transition-colors ${
                            item.isChecked
                              ? 'text-[#6E5D5F] dark:text-[#B5A1A3] line-through opacity-85'
                              : 'text-[#1F1617] dark:text-[#F5EFEB]'
                          }`}
                        >
                          {item.name}
                        </h4>

                        <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                          📍 Lokasi: {item.location}
                        </p>

                        {item.notes && (
                          <p className="text-xs text-[#8B121B] dark:text-[#F2828C] bg-[#FDF0F0] dark:bg-[#331418] p-2 rounded-xl border border-[#F5CDD0] dark:border-[#521E25]">
                            ℹ️ {item.notes}
                          </p>
                        )}

                        {item.isChecked && item.lastCheckedAt && (
                          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                            ✓ Dicek: {item.lastCheckedAt} ({item.checkedBy || 'Admin'})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenInvModal(item)}
                        className="p-2 rounded-xl border border-[#EBDDCF] dark:border-[#3A1C20] text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] transition-colors"
                        title="Edit Barang"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteInventory(item.id)}
                        className="p-2 rounded-xl border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] hover:bg-[#FDF0F0] dark:hover:bg-[#331418] transition-colors"
                        title="Hapus Barang"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[2.5rem] bg-[#FDFBF7] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EBDDCF] dark:border-[#3A1C20] pb-3">
              <h3 className="text-lg font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                {editingAnnId ? 'Edit Warta Pengumuman' : 'Tambah Warta Pengumuman Baru'}
              </h3>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="p-1.5 rounded-xl text-[#6E5D5F] hover:text-[#1F1617] dark:text-[#B5A1A3] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="Contoh: Ibadah Padang & Fellowship Pemuda"
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Kategori</label>
                  <select
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as MinistryCategory })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  >
                    <option value="general">Umum & Ibadah Raya</option>
                    <option value="youth">Grow Generation (Youth)</option>
                    <option value="kidz">COC Kidz (Sekolah Minggu)</option>
                    <option value="hana">Wanita Hana & Komsel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Tanggal Acara</label>
                  <input
                    type="date"
                    required
                    value={annForm.eventDate}
                    onChange={(e) => setAnnForm({ ...annForm, eventDate: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Isi Pengumuman / Detail</label>
                <textarea
                  rows={4}
                  required
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Tuliskan warta, jam, dan petunjuk untuk jemaat..."
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                  <input
                    type="checkbox"
                    checked={annForm.isPinned}
                    onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })}
                    className="w-4 h-4 text-[#C5222E] rounded accent-[#C5222E]"
                  />
                  <span>Sematkan ke Atas (Pin)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                  <input
                    type="checkbox"
                    checked={annForm.isPublished}
                    onChange={(e) => setAnnForm({ ...annForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#C5222E] rounded accent-[#C5222E]"
                  />
                  <span>Publikasikan Segera</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBDDCF] dark:border-[#3A1C20]">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white font-bold shadow-md"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[2.5rem] bg-[#FDFBF7] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EBDDCF] dark:border-[#3A1C20] pb-3">
              <h3 className="text-lg font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                {editingRosterId ? 'Edit Jadwal Pelayan' : 'Jadwalkan Pelayan Baru'}
              </h3>
              <button
                onClick={() => setIsRosterModalOpen(false)}
                className="p-1.5 rounded-xl text-[#6E5D5F] hover:text-[#1F1617] dark:text-[#B5A1A3] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoster} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Kategori Ibadah</label>
                  <select
                    value={rosterForm.serviceCategory}
                    onChange={(e) => setRosterForm({ ...rosterForm, serviceCategory: e.target.value as any })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  >
                    <option value="general">Ibadah Raya</option>
                    <option value="youth">Grow Youth</option>
                    <option value="kidz">COC Kidz</option>
                    <option value="hana">Wanita Hana & Komsel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Tanggal Pelayanan</label>
                  <input
                    type="date"
                    required
                    value={rosterForm.serviceDate}
                    onChange={(e) => setRosterForm({ ...rosterForm, serviceDate: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Tugas / Role Pelayanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Worship Leader, Singer, Pemain Bass, Multimedia, Usher"
                  value={rosterForm.role}
                  onChange={(e) => setRosterForm({ ...rosterForm, role: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Nama Pelayan / Petugas</label>
                <input
                  type="text"
                  required
                  placeholder="Nama pelayan yang bertugas"
                  value={rosterForm.servantName}
                  onChange={(e) => setRosterForm({ ...rosterForm, servantName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="0812xxxx (opsional)"
                    value={rosterForm.phone}
                    onChange={(e) => setRosterForm({ ...rosterForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Status Konfirmasi</label>
                  <select
                    value={rosterForm.status}
                    onChange={(e) => setRosterForm({ ...rosterForm, status: e.target.value as any })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  >
                    <option value="confirmed">Confirmed (Siap)</option>
                    <option value="pending">Pending (Menunggu)</option>
                    <option value="replacement">Perlu Pengganti</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Catatan Khusus</label>
                <input
                  type="text"
                  placeholder="Contoh: Latihan hari Sabtu jam 18.00"
                  value={rosterForm.notes}
                  onChange={(e) => setRosterForm({ ...rosterForm, notes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBDDCF] dark:border-[#3A1C20]">
                <button
                  type="button"
                  onClick={() => setIsRosterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white font-bold shadow-md"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[2.5rem] bg-[#FDFBF7] dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EBDDCF] dark:border-[#3A1C20] pb-3">
              <h3 className="text-lg font-extrabold text-[#1F1617] dark:text-[#F5EFEB]">
                {editingInvId ? 'Edit Data Inventaris' : 'Tambah Barang Inventaris Baru'}
              </h3>
              <button
                onClick={() => setIsInvModalOpen(false)}
                className="p-1.5 rounded-xl text-[#6E5D5F] hover:text-[#1F1617] dark:text-[#B5A1A3] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInventory} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Nama Peralatan / Barang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Wireless Microphone Shure Beta 58A"
                  value={invForm.name}
                  onChange={(e) => setInvForm({ ...invForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Kategori</label>
                  <select
                    value={invForm.category}
                    onChange={(e) => setInvForm({ ...invForm, category: e.target.value as InventoryCategory })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  >
                    <option value="Sound System">Sound System</option>
                    <option value="Multimedia & Kamera">Multimedia & Kamera</option>
                    <option value="Alat Musik">Alat Musik</option>
                    <option value="Ibadah & Ruangan">Ibadah & Ruangan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Kode Barang</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: MIC-01"
                    value={invForm.code}
                    onChange={(e) => setInvForm({ ...invForm, code: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Jumlah (Unit)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={invForm.quantity}
                    onChange={(e) => setInvForm({ ...invForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Kondisi</label>
                  <select
                    value={invForm.condition}
                    onChange={(e) => setInvForm({ ...invForm, condition: e.target.value as any })}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                  >
                    <option value="good">Baik / Normal (Siap Pakai)</option>
                    <option value="maintenance">Perlu Pengecekan</option>
                    <option value="broken">Rusak / Perlu Servis</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Lokasi Penyimpanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Meja Sound Operator / Lemari Pastori"
                  value={invForm.location}
                  onChange={(e) => setInvForm({ ...invForm, location: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">Catatan Teknis</label>
                <input
                  type="text"
                  placeholder="Keterangan tambahan baterai, kabel, dll."
                  value={invForm.notes}
                  onChange={(e) => setInvForm({ ...invForm, notes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#1A0E10] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBDDCF] dark:border-[#3A1C20]">
                <button
                  type="button"
                  onClick={() => setIsInvModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-[#5A4D4E] dark:text-[#D5C2C4] hover:bg-[#F7F2E8] dark:hover:bg-[#2A161A] font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:from-[#B01D28] hover:to-[#6F1017] text-white font-bold shadow-md"
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
