import React from 'react';
import type { TimelineType, Account } from '../../types/mastodon';
import { Avatar } from '../common/Avatar';
import {
  Home,
  Bell,
  Compass,
  Bookmark,
  Star,
  Users,
  Globe2,
  Settings,
  Edit3,
  LogOut,
  Radio,
} from 'lucide-react';

interface SidebarProps {
  currentTimeline: TimelineType;
  onSelectTimeline: (timeline: TimelineType) => void;
  currentUser: Account;
  unreadNotificationsCount?: number;
  onOpenComposer: () => void;
  onOpenSettings: () => void;
  onSelectAccount: (account: Account) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTimeline,
  onSelectTimeline,
  currentUser,
  unreadNotificationsCount = 0,
  onOpenComposer,
  onOpenSettings,
  onSelectAccount,
}) => {
  const navItems = [
    { id: 'home' as TimelineType, label: 'Ana Sayfa', icon: Home },
    {
      id: 'notifications' as TimelineType,
      label: 'Bildirimler',
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    { id: 'explore' as TimelineType, label: 'Keşfet', icon: Compass },
    { id: 'local' as TimelineType, label: 'Yerel Zaman Tüneli', icon: Users },
    { id: 'federated' as TimelineType, label: 'Fediverse (Genel)', icon: Globe2 },
    { id: 'bookmarks' as TimelineType, label: 'Yer İmleri', icon: Bookmark },
    { id: 'favourites' as TimelineType, label: 'Favoriler', icon: Star },
  ];

  return (
    <aside className="w-64 lg:w-72 h-screen sticky top-0 hidden md:flex flex-col justify-between border-r border-white/10 bg-[#191b22] p-4 select-none">
      <div className="flex flex-col gap-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6364ff] to-[#8c8dff] flex items-center justify-center text-white shadow-lg shadow-[#6364ff]/30">
            <Radio size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-wide block leading-tight">
              MSAL Connect
            </span>
            <span className="text-[11px] font-medium text-gray-400">Mastodon Fediverse</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTimeline === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTimeline(item.id)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6364ff] text-white shadow-md shadow-[#6364ff]/25'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
          >
            <Settings size={20} className="text-gray-400" />
            <span>Ayarlar & Supabase</span>
          </button>
        </nav>

        {/* Publish / Toot Button */}
        <button
          type="button"
          onClick={onOpenComposer}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6364ff] hover:bg-[#5657ea] text-white font-bold text-sm shadow-lg shadow-[#6364ff]/30 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Edit3 size={18} />
          <span>Gönderi Paylaş</span>
        </button>
      </div>

      {/* User profile capsule at bottom */}
      <div
        onClick={() => onSelectAccount(currentUser)}
        className="flex items-center justify-between p-2.5 rounded-xl bg-[#282c37] border border-white/10 hover:border-white/20 cursor-pointer transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar src={currentUser.avatar} alt={currentUser.displayName} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
            <p className="text-[11px] text-gray-400 truncate">@{currentUser.username}</p>
          </div>
        </div>
        <LogOut size={16} className="text-gray-400 hover:text-white ml-2 flex-shrink-0" />
      </div>
    </aside>
  );
};
