import React, { useState } from 'react';
import type { TagTrend, Account } from '../../types/mastodon';
import { MOCK_ACCOUNTS } from '../../data/mockData';
import { Avatar } from '../common/Avatar';
import { Search, TrendingUp, Users, Sparkles } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface ExplorePanelProps {
  trends: TagTrend[];
  onSelectTag?: (tag: string) => void;
  onSelectAccount?: (account: Account) => void;
}

export const ExplorePanel: React.FC<ExplorePanelProps> = ({ trends, onSelectTag, onSelectAccount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() => {
    const list = StorageService.getFollowingList();
    return list.reduce((acc, id) => ({ ...acc, [id]: true }), {});
  });

  const toggleFollow = (accountId: string) => {
    const isNowFollowing = StorageService.toggleFollow(accountId);
    setFollowingMap((prev) => ({ ...prev, [accountId]: isNowFollowing }));
  };

  const filteredTrends = trends.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 h-screen sticky top-0 hidden xl:flex flex-col border-l border-white/10 bg-[#191b22] overflow-y-auto p-4 gap-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-gray-400" size={17} />
        <input
          type="text"
          placeholder="Ara veya Fediverse URL'si yapıştır"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#282c37] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#6364ff] transition-colors"
        />
      </div>

      {/* Fediverse & Server Info Card */}
      <div className="bg-[#282c37] border border-white/10 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
          <Sparkles size={16} className="text-[#6364ff]" />
          <span>MSAL Connect • Kampüs</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Mehmet Serttaş Anadolu Lisesi öğrenci ve öğretmenleri için geliştirilmiş bağımsız, Fediverse uyumlu okul sosyal ağıdır.
        </p>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Mehmet Serttaş AL
          </span>
          <span className="font-mono">connect.msal.org</span>
        </div>
      </div>

      {/* Trending Hashtags */}
      <div className="bg-[#282c37] border border-white/10 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
          <TrendingUp size={16} className="text-emerald-400" />
          <span>Gündemdekiler (Trendler)</span>
        </div>

        <div className="space-y-3">
          {filteredTrends.map((trend) => (
            <div
              key={trend.name}
              onClick={() => onSelectTag?.(trend.name)}
              className="flex items-center justify-between hover:bg-white/5 p-1.5 -mx-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-white hover:text-[#6364ff] transition-colors">
                  #{trend.name}
                </p>
                <p className="text-[11px] text-gray-400">{trend.totalUses} kişi bahsediyor</p>
              </div>
              <span className="text-xs text-gray-400">🔥</span>
            </div>
          ))}
        </div>
      </div>

      {/* Who to Follow / Fediverse Accounts */}
      <div className="bg-[#282c37] border border-white/10 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
          <Users size={16} className="text-[#6364ff]" />
          <span>Kimi Takip Etmeli?</span>
        </div>

        <div className="space-y-3">
          {MOCK_ACCOUNTS.slice(1, 4).map((acc) => (
            <div key={acc.id} className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                onClick={() => onSelectAccount?.(acc)}
              >
                <Avatar src={acc.avatar} alt={acc.displayName} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate hover:underline">{acc.displayName}</p>
                  <p className="text-[11px] text-gray-400 truncate">@{acc.username}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFollow(acc.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors flex-shrink-0 ${
                  followingMap[acc.id]
                    ? 'border border-white/20 text-gray-300 hover:text-red-400'
                    : 'bg-[#6364ff] hover:bg-[#5657ea] text-white'
                }`}
              >
                {followingMap[acc.id] ? 'Takipte' : 'Takip'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-[11px] text-gray-400 px-2 space-y-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="hover:underline cursor-pointer">Hakkında</span>
          <span className="hover:underline cursor-pointer">Gizlilik</span>
          <span className="hover:underline cursor-pointer">Mastodon API</span>
          <span className="hover:underline cursor-pointer">Supabase</span>
          <span className="hover:underline cursor-pointer">GitHub</span>
        </div>
        <p className="pt-2 text-gray-400">© 2025 Mehmet Serttaş Anadolu Lisesi (MSAL Connect).</p>
      </footer>
    </aside>
  );
};
