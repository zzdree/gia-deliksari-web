'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  X,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  LogOut,
  ExternalLink,
  Users,
  Power,
} from 'lucide-react';
import { useToast } from '@/components/admin/useToast';

type Role = 'super' | 'admin' | 'treasurer';

interface User {
  id: string;
  username: string;
  roles: Role[];
  display_name: string | null;
  active: boolean;
  last_login_at: string | null;
  created_at: string;
}

interface AuthUser {
  id: string;
  username: string;
  roles: Role[];
  display_name: string | null;
}

const ROLE_META: Record<Role, { label: string; color: string; badge: string; portal: string }> = {
  super: {
    label: 'Superuser',
    color: 'bg-[#FDF0F0] dark:bg-[#331418] text-[#9A1620] dark:text-[#F2828C] border-[#F5CDD0] dark:border-[#521E25]',
    badge: '🔑 Semua Akses',
    portal: '/super',
  },
  admin: {
    label: 'Admin / Operator',
    color: 'bg-[#FFF2EE] dark:bg-[#331812] text-[#C83E20] dark:text-[#F88B72] border-[#FCD2C7] dark:border-[#57241A]',
    badge: '📋 Warta + Roster + Inventaris',
    portal: '/admin',
  },
  treasurer: {
    label: 'Bendahara Youth',
    color: 'bg-[#FEF9EC] dark:bg-[#332612] text-[#B87A14] dark:text-[#F0BE5E] border-[#F8E3B5] dark:border-[#543E19]',
    badge: '💰 Manajemen Kas Youth',
    portal: '/kas',
  },
};

export default function SuperPage() {
  const router = useRouter();
  const { showToast, ToastView } = useToast();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    username: string;
    password: string;
    roles: Role[];
    display_name: string;
  }>({ username: '', password: '', roles: ['admin'], display_name: '' });

  // Check auth on mount
  useEffect(() => {
    fetch('/api/auth/check')
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) {
          router.replace('/super'); // stay — login screen renders
        } else if (d.user?.role !== 'super') {
          showToast('Akses ditolak. Halaman ini khusus superuser.');
          router.replace('/home');
        } else {
          setAuthUser(d.user);
        }
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, [router, showToast]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Gagal memuat daftar user');
        if (res.status === 401) router.replace('/super');
        return;
      }
      setUsers(data.items || []);
    } catch {
      showToast('Gagal memuat daftar user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) loadUsers();
  }, [authUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Login gagal');
        return;
      }
      if (data.user?.role !== 'super') {
        setAuthError('Akses ditolak. Halaman ini khusus superuser.');
        return;
      }
      setAuthUser(data.user);
      showToast('Login berhasil. Selamat datang, ' + (data.user.display_name || data.user.username));
    } catch {
      setAuthError('Terjadi kesalahan koneksi');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setAuthUser(null);
    setUsers([]);
    showToast('Berhasil logout');
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ username: '', password: '', roles: ['admin'], display_name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingId(u.id);
    setForm({ username: u.username, password: '', roles: u.roles, display_name: u.display_name || '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PATCH
        const patch: Record<string, unknown> = {
          roles: form.roles,
          display_name: form.display_name.trim() || null,
          active: true,
        };
        if (form.password) patch.password = form.password;
        const res = await fetch(`/api/users/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || 'Gagal update user');
          return;
        }
        showToast('User berhasil diupdate');
      } else {
        // POST
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
            roles: form.roles,
            display_name: form.display_name.trim() || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || 'Gagal membuat user');
          return;
        }
        showToast('User baru berhasil dibuat');
      }
      setIsModalOpen(false);
      setEditingId(null);
      loadUsers();
    } catch {
      showToast('Terjadi kesalahan koneksi');
    }
  };

  const handleDeactivate = async (u: User) => {
    if (!confirm(`Nonaktifkan user '${u.username}'? User akan diarsipkan dan tidak bisa login lagi.`)) return;
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Gagal menonaktifkan user');
        return;
      }
      showToast(`User '${u.username}' dinonaktifkan`);
      loadUsers();
    } catch {
      showToast('Terjadi kesalahan koneksi');
    }
  };

  // ---------------------- LOGIN SCREEN ----------------------
  if (authChecked && !authUser) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#150B0D] text-[#1F1617] dark:text-[#F5EFEB] flex flex-col justify-between selection:bg-[#C5222E] selection:text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-20 relative overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#C5222E]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#80141C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-md bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] rounded-[2.5rem] shadow-xl p-8 sm:p-10 relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#C5222E] to-[#80141C] text-white flex items-center justify-center mx-auto shadow-lg shadow-red-900/20">
                <KeyRound className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1617] dark:text-white tracking-tight">
                Superuser Portal
              </h1>
              <p className="text-xs sm:text-sm text-[#5A4D4E] dark:text-[#D5C2C4] leading-relaxed">
                Kelola akun pengurus gereja: superuser, admin/operator, dan bendahara youth.
                <br />
                <span className="text-[#C5222E] dark:text-[#E03643] font-bold">
                  Akses khusus role = super.
                </span>
              </p>
            </div>

            {authError && (
              <div className="p-4 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] border border-[#F5CDD0] dark:border-[#521E25] text-[#9A1620] dark:text-[#F2828C] text-xs font-bold leading-snug animate-shake">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] uppercase tracking-wider">
                  Username Superuser
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="andreas"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] text-sm focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] outline-none transition-all placeholder:text-stone-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] uppercase tracking-wider">
                  PIN / Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-[#1F1617] dark:text-[#F5EFEB] text-sm focus:ring-2 focus:ring-[#C5222E]/30 focus:border-[#C5222E] outline-none transition-all placeholder:text-stone-400 tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk Superuser Portal</span>
              </button>
            </form>

            <div className="pt-2 text-center space-y-1">
              <Link
                href="/home"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#C5222E] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Jemaat</span>
              </Link>
              <div className="text-[11px] text-[#6E5D5F] dark:text-[#B5A1A3] pt-2">
                Default superuser: <code className="font-mono font-bold text-[#C5222E]">andreas</code> /
                <code className="font-mono font-bold text-[#C5222E]">5050</code>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#150B0D]">
        <div className="animate-pulse text-[#6E5D5F] dark:text-[#B5A1A3]">Memuat…</div>
      </main>
    );
  }

  // ---------------------- DASHBOARD ----------------------
  const activeCount = users.filter((u) => u.active).length;

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#150B0D] text-[#1F1617] dark:text-[#F5EFEB] flex flex-col justify-between selection:bg-[#C5222E] selection:text-white">
      <Navbar />

      {ToastView}

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF0F0] dark:bg-[#331418] text-[#9A1620] dark:text-[#F2828C] border border-[#F5CDD0] dark:border-[#521E25]">
                🔑 Superuser Portal
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
                <Users className="w-3.5 h-3.5 text-[#C5222E]" />
                <span>
                  {activeCount}/{users.length} user aktif
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1617] dark:text-white tracking-tight">
              Manajemen Akun Pengurus Gereja
            </h1>
            <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
              Kelola akun superuser, admin/operator, dan bendahara youth.
              Akun baru otomatis mendapat akses ke portal sesuai role-nya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={loadUsers}
              title="Refresh"
              className="p-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 text-[#C5222E] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/home"
              className="px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20] transition-colors text-xs font-bold flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5222E]" />
              <span>Lihat Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-3 rounded-2xl bg-[#FDF0F0] dark:bg-[#331418] hover:bg-[#FBE2E4] dark:hover:bg-[#451B21] text-[#9A1620] dark:text-[#F2828C] border border-[#F5CDD0] dark:border-[#521E25] transition-colors text-xs font-bold flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Header dengan greeting */}
        <div className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
          Login sebagai{' '}
          <span className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">
            {authUser?.display_name || authUser?.username}
          </span>
          {' '}
          <span className="text-[#6E5D5F] dark:text-[#B5A1A3]">
            ({authUser?.roles?.join(', ') || authUser?.username})
          </span>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#1F1617] dark:text-white">
              Daftar Akun ({users.length})
            </h2>
            <p className="text-xs text-[#5A4D4E] dark:text-[#D5C2C4]">
              Tambah akun baru, ubah role, atau nonaktifkan akun yang tidak aktif.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-900/10 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah User Baru</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-[2.5rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] border-b border-[#EBDDCF] dark:border-[#3A1C20]">
              <tr>
                <th className="p-4 font-bold">Username</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Nama Tampilan</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Login Terakhir</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBDDCF] dark:divide-[#3A1C20]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                    Belum ada user. Klik "Tambah User Baru" untuk mulai.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  // primary role for badge color (use first role in array)
                  const primaryRole = (u.roles && u.roles[0]) || 'admin';
                  const meta = ROLE_META[primaryRole];
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[#FDFBF7] dark:hover:bg-[#261317] transition-colors ${
                        !u.active ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-mono font-bold text-[#1F1617] dark:text-[#F5EFEB]">
                          {u.username}
                        </div>
                        {u.id === authUser?.id && (
                          <span className="text-[10px] uppercase font-bold text-[#C5222E] dark:text-[#E03643]">
                            ← Anda
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${meta.color}`}>
                          {meta.label}
                        </span>
                        <div className="text-[10px] text-[#6E5D5F] dark:text-[#B5A1A3] mt-0.5">
                          → {meta.portal}
                        </div>
                      </td>
                      <td className="p-4 text-[#1F1617] dark:text-[#F5EFEB]">
                        {u.display_name || <span className="text-[#6E5D5F] dark:text-[#B5A1A3] italic">—</span>}
                      </td>
                      <td className="p-4">
                        {u.active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                            <Power className="w-3 h-3" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200 dark:bg-stone-900/40 dark:text-stone-400 dark:border-stone-800/60">
                            <Power className="w-3 h-3" />
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-[#6E5D5F] dark:text-[#B5A1A3]">
                        {u.last_login_at
                          ? new Date(u.last_login_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : <span className="italic">Belum pernah</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.active && (
                            <button
                              onClick={() => openEditModal(u)}
                              title="Edit role / password"
                              className="p-2 rounded-xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#1F1617] dark:text-[#F5EFEB] hover:bg-[#EBDDCF] dark:hover:bg-[#3A1C20] border border-[#EBDDCF] dark:border-[#3A1C20]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {u.active && u.username !== authUser?.username && (
                            <button
                              onClick={() => handleDeactivate(u)}
                              title="Nonaktifkan"
                              className="p-2 rounded-xl bg-[#FDF0F0] dark:bg-[#331418] hover:bg-[#FBE2E4] dark:hover:bg-[#451B21] text-[#9A1620] dark:text-[#F2828C] border border-[#F5CDD0] dark:border-[#521E25]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Access to Other Portals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link
            href="/admin"
            className="p-5 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] hover:border-[#C5222E]/40 transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">📋 Portal Admin</h3>
              <p className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3] mt-0.5">
                Warta, Roster Pelayanan, Inventaris
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#C5222E] group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/kas"
            className="p-5 rounded-[2rem] bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] hover:border-[#C5222E]/40 transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-[#1F1617] dark:text-[#F5EFEB]">💰 Portal Kas Youth</h3>
              <p className="text-xs text-[#6E5D5F] dark:text-[#B5A1A3] mt-0.5">
                Manajemen keuangan Grow Generation
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#C5222E] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ============== MODAL: ADD / EDIT USER ============== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#221215] border border-[#EBDDCF] dark:border-[#3A1C20] rounded-[2.5rem] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-[#1F1617] dark:text-white">
                {editingId ? 'Edit User' : 'Tambah User Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] uppercase tracking-wider">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingId}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="contoh: noel"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {editingId && (
                  <p className="text-[10px] text-[#6E5D5F] dark:text-[#B5A1A3]">
                    Username tidak bisa diubah. Buat user baru jika perlu ganti.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] uppercase tracking-wider">
                  {editingId ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••"
                  minLength={4}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                />
                <p className="text-[10px] text-[#6E5D5F] dark:text-[#B5A1A3]">
                  Minimal 4 karakter. Disimpan dengan bcrypt (tidak bisa dibaca plain).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] uppercase tracking-wider">
                  Role * <span className="text-[10px] normal-case opacity-60">(pilih 1 atau lebih)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['super', 'admin', 'treasurer'] as Role[]).map((r) => {
                    const isChecked = form.roles.includes(r);
                    return (
                      <label
                        key={r}
                        className={`flex items-start gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#C5222E] bg-[#FDF0F0] dark:bg-[#331418]'
                            : 'border-[#EBDDCF] dark:border-[#3A1C20] bg-[#F7F2E8] dark:bg-[#2A161A] hover:border-[#C5222E]/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? Array.from(new Set([...form.roles, r]))
                              : form.roles.filter((x) => x !== r);
                            setForm({ ...form, roles: next });
                          }}
                          className="mt-0.5 rounded text-[#C5222E] focus:ring-[#C5222E]"
                        />
                        <div className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] leading-tight">
                          {r === 'super' && '🔑 Superuser'}
                          {r === 'admin' && '📋 Admin/Operator'}
                          {r === 'treasurer' && '💰 Bendahara'}
                          <div className="text-[10px] text-[#6E5D5F] dark:text-[#B5A1A3] font-normal mt-0.5">
                            {r === 'super' && 'Akses penuh ke semua portal'}
                            {r === 'admin' && 'Akses ke /admin'}
                            {r === 'treasurer' && 'Akses ke /kas'}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {form.roles.length === 0 && (
                  <p className="text-[10px] text-[#9A1620] dark:text-[#F2828C] font-bold">
                    ⚠️ Pilih minimal 1 role
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F1617] dark:text-[#F5EFEB] uppercase tracking-wider">
                  Nama Tampilan (opsional)
                </label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  placeholder="contoh: Noel Yosan (Admin)"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] border border-[#EBDDCF] dark:border-[#3A1C20] text-sm text-[#1F1617] dark:text-[#F5EFEB] outline-none focus:ring-2 focus:ring-[#C5222E]/30"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-[#F7F2E8] dark:bg-[#2A161A] text-[#5A4D4E] dark:text-[#D5C2C4] text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C5222E] to-[#80141C] text-white text-xs font-bold shadow-md"
                >
                  {editingId ? 'Simpan Perubahan' : 'Buat User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}