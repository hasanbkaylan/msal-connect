import React from 'react';
import type { TimelineType } from '../../types/mastodon';
import { Home, Bell, Compass, Globe2, PlusCircle } from 'lucide-react';

interface MobileNavProps {
  currentTimeline: TimelineType;
  onSelectTimeline: (timeline: TimelineType) => void;
  unreadNotificationsCount?: number;
  onOpenComposer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTimeline,
  onSelectTimeline,
  unreadNotificationsCount = 0,
  onOpenComposer,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#191b22]/95 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-around">
      <button
        onClick={() => onSelectTimeline('home')}
        className={`flex flex-col items-center gap-1 p-1.5 cursor-pointer transition-colors ${
          currentTimeline === 'home' ? 'text-[#6364ff]' : 'text-gray-400'
        }`}
      >
        <Home size={22} />
        <span className="text-[10px] font-medium">Akış</span>
      </button>

      <button
        onClick={() => onSelectTimeline('explore')}
        className={`flex flex-col items-center gap-1 p-1.5 cursor-pointer transition-colors ${
          currentTimeline === 'explore' ? 'text-[#6364ff]' : 'text-gray-400'
        }`}
      >
        <Compass size={22} />
        <span className="text-[10px] font-medium">Keşfet</span>
      </button>

      {/* Floating Center Action Button */}
      <button
        onClick={onOpenComposer}
        className="p-3 -mt-6 rounded-full bg-[#6364ff] text-white shadow-xl shadow-[#6364ff]/40 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Yeni Gönderi"
      >
        <PlusCircle size={26} />
      </button>

      <button
        onClick={() => onSelectTimeline('notifications')}
        className={`relative flex flex-col items-center gap-1 p-1.5 cursor-pointer transition-colors ${
          currentTimeline === 'notifications' ? 'text-[#6364ff]' : 'text-gray-400'
        }`}
      >
        <Bell size={22} />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500" />
        )}
        <span className="text-[10px] font-medium">Bildirim</span>
      </button>

      <button
        onClick={() => onSelectTimeline('federated')}
        className={`flex flex-col items-center gap-1 p-1.5 cursor-pointer transition-colors ${
          currentTimeline === 'federated' ? 'text-[#6364ff]' : 'text-gray-400'
        }`}
      >
        <Globe2 size={22} />
        <span className="text-[10px] font-medium">Fediverse</span>
      </button>
    </nav>
  );
};
