export type MinistryCategory = 'kidz' | 'youth' | 'hana' | 'general' | 'all';

export interface Announcement {
  id: string;
  title: string;
  category: MinistryCategory;
  content: string;
  eventDate: string; // ISO date string or YYYY-MM-DD
  endDate?: string;
  isPinned: boolean;
  isPublished: boolean;
  createdAt: string;
  author?: string;
  badgeText?: string;
}

export interface ServantRole {
  category: MinistryCategory;
  roles: string[];
}

export interface ServantRoster {
  id: string;
  serviceCategory: 'kidz' | 'youth' | 'hana' | 'general';
  serviceDate: string; // YYYY-MM-DD
  role: string;
  servantName: string;
  phone?: string;
  status: 'confirmed' | 'pending' | 'replacement';
  notes?: string;
  createdAt: string;
}

export type InventoryCategory = 'Sound System' | 'Multimedia & Kamera' | 'Alat Musik' | 'Ibadah & Ruangan';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  code: string;
  quantity: number;
  isChecked: boolean;
  condition: 'good' | 'maintenance' | 'broken';
  location: string;
  lastCheckedAt?: string;
  checkedBy?: string;
  notes?: string;
  createdAt: string;
}
