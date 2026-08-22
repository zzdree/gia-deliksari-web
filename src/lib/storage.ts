import { Announcement, ServantRoster, InventoryItem } from '@/types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_ROSTER, INITIAL_INVENTORY } from './seedData';
import { supabase, isSupabaseConfigured } from './supabase';

const ANNOUNCEMENTS_KEY = 'gia_deliksari_announcements_v1';
const ROSTER_KEY = 'gia_deliksari_roster_v1';
const INVENTORY_KEY = 'gia_deliksari_inventory_v1';

// Mappers for Announcements
function toAnnouncementModel(db: any): Announcement {
  return {
    id: db.id,
    title: db.title,
    category: db.category,
    content: db.content,
    eventDate: db.event_date || db.eventDate,
    isPinned: db.is_pinned ?? db.isPinned ?? false,
    isPublished: db.is_published ?? db.isPublished ?? true,
    badgeText: db.badge_text || db.badgeText,
    author: db.author || 'Sekretariat GIA Deliksari',
    createdAt: db.created_at || db.createdAt,
  };
}

function toAnnouncementDB(model: Announcement) {
  return {
    id: model.id.startsWith('ann-') ? undefined : model.id,
    title: model.title,
    category: model.category,
    content: model.content,
    event_date: model.eventDate,
    is_pinned: model.isPinned,
    is_published: model.isPublished,
    badge_text: model.badgeText,
    author: model.author,
  };
}

// Mappers for Servant Roster
function toRosterModel(db: any): ServantRoster {
  return {
    id: db.id,
    serviceCategory: db.service_category || db.serviceCategory || 'general',
    serviceDate: db.service_date || db.serviceDate,
    role: db.role,
    servantName: db.servant_name || db.servantName,
    phone: db.phone,
    status: db.status || 'confirmed',
    notes: db.notes,
    createdAt: db.created_at || db.createdAt,
  };
}

function toRosterDB(model: ServantRoster) {
  return {
    id: model.id.startsWith('rst-') ? undefined : model.id,
    service_category: model.serviceCategory,
    service_date: model.serviceDate,
    role: model.role,
    servant_name: model.servantName,
    phone: model.phone,
    status: model.status,
    notes: model.notes,
  };
}

// Mappers for Inventory
function toInventoryModel(db: any): InventoryItem {
  return {
    id: db.id,
    name: db.name,
    category: db.category,
    code: db.code,
    quantity: db.quantity ?? 1,
    isChecked: db.is_checked ?? db.isChecked ?? true,
    condition: db.condition || 'good',
    location: db.location,
    notes: db.notes,
    lastCheckedAt: db.last_checked_at || db.lastCheckedAt,
    checkedBy: db.checked_by || db.checkedBy,
    createdAt: db.created_at || db.createdAt,
  };
}

function toInventoryDB(model: InventoryItem) {
  return {
    id: model.id.startsWith('inv-') ? undefined : model.id,
    name: model.name,
    category: model.category,
    code: model.code,
    quantity: model.quantity,
    is_checked: model.isChecked,
    condition: model.condition,
    location: model.location,
    notes: model.notes,
    last_checked_at: model.lastCheckedAt,
    checked_by: model.checkedBy,
  };
}

export const dataStore = {
  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('event_date', { ascending: true });
        if (!error && data && data.length > 0) {
          const list = data.map(toAnnouncementModel);
          if (typeof window !== 'undefined') {
            localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(list));
          }
          return list;
        }
      } catch (err) {
        console.warn('Supabase fetch announcements error, using local storage:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(ANNOUNCEMENTS_KEY);
      if (local) {
        try {
          return JSON.parse(local);
        } catch {}
      }
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    }
    return INITIAL_ANNOUNCEMENTS;
  },

  saveAnnouncements: async (items: Announcement[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(items));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        const dbItems = items.map(toAnnouncementDB);
        await supabase.from('announcements').upsert(dbItems);
      } catch (err) {
        console.warn('Supabase upsert announcements failed:', err);
      }
    }
  },

  // Servant Roster
  getRoster: async (): Promise<ServantRoster[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('servant_rosters')
          .select('*')
          .order('service_date', { ascending: true });
        if (!error && data && data.length > 0) {
          const list = data.map(toRosterModel);
          if (typeof window !== 'undefined') {
            localStorage.setItem(ROSTER_KEY, JSON.stringify(list));
          }
          return list;
        }
      } catch (err) {
        console.warn('Supabase fetch roster error, using local storage:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(ROSTER_KEY);
      if (local) {
        try {
          return JSON.parse(local);
        } catch {}
      }
      localStorage.setItem(ROSTER_KEY, JSON.stringify(INITIAL_ROSTER));
    }
    return INITIAL_ROSTER;
  },

  saveRoster: async (items: ServantRoster[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROSTER_KEY, JSON.stringify(items));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        const dbItems = items.map(toRosterDB);
        await supabase.from('servant_rosters').upsert(dbItems);
      } catch (err) {
        console.warn('Supabase upsert roster failed:', err);
      }
    }
  },

  // Inventory
  getInventory: async (): Promise<InventoryItem[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .order('category', { ascending: true });
        if (!error && data && data.length > 0) {
          const list = data.map(toInventoryModel);
          if (typeof window !== 'undefined') {
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(list));
          }
          return list;
        }
      } catch (err) {
        console.warn('Supabase fetch inventory error, using local storage:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(INVENTORY_KEY);
      if (local) {
        try {
          return JSON.parse(local);
        } catch {}
      }
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
    }
    return INITIAL_INVENTORY;
  },

  saveInventory: async (items: InventoryItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        const dbItems = items.map(toInventoryDB);
        await supabase.from('inventory_items').upsert(dbItems);
      } catch (err) {
        console.warn('Supabase upsert inventory failed:', err);
      }
    }
  }
};
