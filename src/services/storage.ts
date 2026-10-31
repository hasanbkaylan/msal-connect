import type { Status, Notification, SupabaseConfig, Account } from '../types/mastodon';
import { INITIAL_STATUSES, INITIAL_NOTIFICATIONS, CURRENT_USER } from '../data/mockData';

const STORAGE_KEYS = {
  STATUSES: 'msal_statuses_v1',
  NOTIFICATIONS: 'msal_notifications_v1',
  SUPABASE_CONFIG: 'msal_supabase_cfg_v1',
  USER: 'msal_user_v1',
  BOOKMARKS: 'msal_bookmarks_v1',
  THEME: 'msal_theme_v1',
  FOLLOWS: 'msal_following_v1',
};

export class StorageService {
  static getStatuses(): Status[] {
    const data = localStorage.getItem(STORAGE_KEYS.STATUSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(INITIAL_STATUSES));
      return INITIAL_STATUSES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_STATUSES;
    }
  }

  static saveStatuses(statuses: Status[]): void {
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statuses));
  }

  static getNotifications(): Notification[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static saveNotifications(notifs: Notification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  static getUser(): Account {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return CURRENT_USER;
    try {
      return JSON.parse(data);
    } catch {
      return CURRENT_USER;
    }
  }

  static saveUser(user: Account): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getSupabaseConfig(): SupabaseConfig {
    const data = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (!data) {
      return {
        url: '',
        anonKey: '',
        isConnected: false,
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      return { url: '', anonKey: '', isConnected: false };
    }
  }

  static saveSupabaseConfig(config: SupabaseConfig): void {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
  }

  static getTheme(): string {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'mastodon-classic';
  }

  static saveTheme(theme: string): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  static getFollowingList(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.FOLLOWS);
    if (!data) {
      const initial = ['user-02', 'user-03'];
      localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static toggleFollow(accountId: string): boolean {
    const list = this.getFollowingList();
    const exists = list.includes(accountId);
    let next: string[];
    if (exists) {
      next = list.filter((id) => id !== accountId);
    } else {
      next = [...list, accountId];
    }
    localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(next));
    return !exists;
  }

  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.STATUSES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.FOLLOWS);
  }
}

/**
 * Supabase client adapter.
 * When real credentials are supplied, it can execute Supabase REST calls or synchronize.
 * Defaults flawlessly to localStorage demo engine with instant reactivity.
 */
export const SupabaseClientHelper = {
  async testConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
    if (!url || !key) {
      return { success: false, message: 'URL ve Anon Key boş bırakılamaz.' };
    }
    try {
      // Normalizing Supabase URL
      const cleanUrl = url.replace(/\/$/, '');
      const testEndpoint = `${cleanUrl}/rest/v1/`;
      const response = await fetch(testEndpoint, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });

      if (response.ok || response.status === 200 || response.status === 404) {
        return { success: true, message: 'Supabase sunucusuna başarıyla bağlanıldı!' };
      } else {
        return { success: false, message: `Bağlantı yanıtı: HTTP ${response.status} (${response.statusText})` };
      }
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? `Ağ hatası: ${err.message}` : 'Supabase uç noktasına bağlanılamadı.',
      };
    }
  },
};
