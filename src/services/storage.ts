import type { Status, Notification, SupabaseConfig, Account } from '../types/mastodon';
import { INITIAL_STATUSES, INITIAL_NOTIFICATIONS, CURRENT_USER } from '../data/mockData';

const STORAGE_KEYS = {
  STATUSES: 'msal_statuses_v2',
  NOTIFICATIONS: 'msal_notifications_v2',
  SUPABASE_CONFIG: 'msal_supabase_cfg_v2',
  USER: 'msal_user_v2',
  BOOKMARKS: 'msal_bookmarks_v2',
  THEME: 'msal_theme_v2',
  FOLLOWS: 'msal_following_v2',
};

export class StorageService {
  static getStatuses(): Status[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATUSES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(INITIAL_STATUSES));
        return INITIAL_STATUSES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure items have minimal valid shape
        return parsed.filter((item) => item && typeof item === 'object' && item.id && item.account);
      }
      return INITIAL_STATUSES;
    } catch (e) {
      console.warn('StorageService.getStatuses fallback to initial data:', e);
      return INITIAL_STATUSES;
    }
  }

  static saveStatuses(statuses: Status[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statuses || []));
    } catch (e) {
      console.error('StorageService.saveStatuses error:', e);
    }
  }

  static getNotifications(): Notification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item && typeof item === 'object' && item.id && item.type);
      }
      return INITIAL_NOTIFICATIONS;
    } catch (e) {
      console.warn('StorageService.getNotifications fallback to initial data:', e);
      return INITIAL_NOTIFICATIONS;
    }
  }

  static saveNotifications(notifs: Notification[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs || []));
    } catch (e) {
      console.error('StorageService.saveNotifications error:', e);
    }
  }

  static getUser(): Account {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return CURRENT_USER;
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.username && parsed.displayName) {
        return parsed;
      }
      return CURRENT_USER;
    } catch (e) {
      console.warn('StorageService.getUser fallback to CURRENT_USER:', e);
      return CURRENT_USER;
    }
  }

  static saveUser(user: Account): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('StorageService.saveUser error:', e);
    }
  }

  static getSupabaseConfig(): SupabaseConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (!data) {
        return {
          url: '',
          anonKey: '',
          isConnected: false,
        };
      }
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return {
          url: parsed.url || '',
          anonKey: parsed.anonKey || '',
          isConnected: Boolean(parsed.isConnected),
        };
      }
      return { url: '', anonKey: '', isConnected: false };
    } catch (e) {
      console.warn('StorageService.getSupabaseConfig fallback:', e);
      return { url: '', anonKey: '', isConnected: false };
    }
  }

  static saveSupabaseConfig(config: SupabaseConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('StorageService.saveSupabaseConfig error:', e);
    }
  }

  static getTheme(): string {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'light' || theme === 'mastodon-classic') {
        return theme;
      }
      return 'mastodon-classic';
    } catch {
      return 'mastodon-classic';
    }
  }

  static saveTheme(theme: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.error('StorageService.saveTheme error:', e);
    }
  }

  static getFollowingList(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLLOWS);
      if (!data) {
        const initial = ['user-02', 'user-03', 'user-04'];
        localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter((id) => typeof id === 'string');
      }
      return [];
    } catch (e) {
      console.warn('StorageService.getFollowingList fallback:', e);
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
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(next));
    } catch (e) {
      console.error('StorageService.toggleFollow error:', e);
    }
    return !exists;
  }

  static resetToDefaults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.STATUSES);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.FOLLOWS);
      localStorage.removeItem(STORAGE_KEYS.THEME);
      localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    } catch (e) {
      console.error('StorageService.resetToDefaults error:', e);
    }
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
