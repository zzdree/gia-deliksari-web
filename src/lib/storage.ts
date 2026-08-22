import { Announcement, ServantRoster, InventoryItem } from '@/types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_ROSTER, INITIAL_INVENTORY } from './seedData';
import { supabase, isSupabaseConfigured } from './supabase';

const ANNOUNCEMENTS_KEY = 'gia_deliksari_announcements_v1';
const ROSTER_KEY = 'gia_deliksari_roster_v1';
const INVENTORY_KEY = 'gia_deliksari_inventory_v1';

export const dataStore = {
  // Announcements
  getAnnouncements: async (): Promise<Announcement[]> => {
    if (typeof window === 'undefined') return INITIAL_ANNOUNCEMENTS;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('eventDate', { ascending: true });
        if (!error && data && data.length > 0) return data as Announcement[];
      } catch (err) {
        console.warn('Supabase fetch announcements failed, fallback to local', err);
      }
    }

    const local = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // parse error fallback
      }
    }
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  },

  saveAnnouncements: async (items: Announcement[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(items));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('announcements').upsert(items);
      } catch (err) {
        console.warn('Supabase upsert announcements failed', err);
      }
    }
  },

  // Servant Roster
  getRoster: async (): Promise<ServantRoster[]> => {
    if (typeof window === 'undefined') return INITIAL_ROSTER;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('servants_roster')
          .select('*')
          .order('serviceDate', { ascending: true });
        if (!error && data && data.length > 0) return data as ServantRoster[];
      } catch (err) {
        console.warn('Supabase fetch roster failed, fallback to local', err);
      }
    }

    const local = localStorage.getItem(ROSTER_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // parse error fallback
      }
    }
    localStorage.setItem(ROSTER_KEY, JSON.stringify(INITIAL_ROSTER));
    return INITIAL_ROSTER;
  },

  saveRoster: async (items: ServantRoster[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROSTER_KEY, JSON.stringify(items));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('servants_roster').upsert(items);
      } catch (err) {
        console.warn('Supabase upsert roster failed', err);
      }
    }
  },

  // Inventory
  getInventory: async (): Promise<InventoryItem[]> => {
    if (typeof window === 'undefined') return INITIAL_INVENTORY;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .order('category', { ascending: true });
        if (!error && data && data.length > 0) return data as InventoryItem[];
      } catch (err) {
        console.warn('Supabase fetch inventory failed, fallback to local', err);
      }
    }

    const local = localStorage.getItem(INVENTORY_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // parse error fallback
      }
    }
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
    return INITIAL_INVENTORY;
  },

  saveInventory: async (items: InventoryItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('inventory_items').upsert(items);
      } catch (err) {
        console.warn('Supabase upsert inventory failed', err);
      }
    }
  }
};
