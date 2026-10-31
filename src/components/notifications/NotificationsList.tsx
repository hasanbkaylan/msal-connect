import React from 'react';
import type { Notification, Account } from '../../types/mastodon';
import { Avatar } from '../common/Avatar';
import { Star, Repeat2, UserPlus, MessageSquare } from 'lucide-react';

interface NotificationsListProps {
  notifications: Notification[];
  onSelectAccount?: (account: Account) => void;
  onClearAll?: () => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onSelectAccount,
  onClearAll,
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'favourite':
        return <Star size={18} className="text-[#ffaa00] fill-[#ffaa00]" />;
      case 'reblog':
        return <Repeat2 size={18} className="text-[#15d68d]" />;
      case 'follow':
        return <UserPlus size={18} className="text-[#6364ff]" />;
      case 'mention':
        return <MessageSquare size={18} className="text-cyan-400" />;
      default:
        return <Star size={18} className="text-gray-400" />;
    }
  };

  const getText = (notif: Notification) => {
    switch (notif.type) {
      case 'favourite':
        return 'gönderini favorilerine ekledi';
      case 'reblog':
        return 'gönderini yeniden paylaştı';
      case 'follow':
        return 'seni takip etmeye başladı';
      case 'mention':
        return 'bir gönderide senden bahsetti';
      default:
        return 'etkileşimde bulundu';
    }
  };

  return (
    <div className="bg-[#282c37] min-h-screen">
      <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-[#282c37]/90 backdrop-blur-md z-20">
        <h2 className="text-base font-bold text-white">Bildirimler</h2>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-[#6364ff] hover:text-[#5657ea] font-medium cursor-pointer"
          >
            Tümünü Temizle
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm">
          Henüz bildiriminiz yok. Etkileşimler burada görüntülenecektir.
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-4 flex items-start gap-3.5 hover:bg-white/5 transition-colors">
              <div className="mt-1 flex-shrink-0">{getIcon(notif.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar
                    src={notif.account.avatar}
                    alt={notif.account.displayName}
                    size="sm"
                    onClick={() => onSelectAccount?.(notif.account)}
                  />
                  <div className="truncate">
                    <span
                      onClick={() => onSelectAccount?.(notif.account)}
                      className="font-bold text-white text-sm hover:underline cursor-pointer mr-1"
                    >
                      {notif.account.displayName}
                    </span>
                    <span className="text-gray-400 text-xs">{getText(notif)}</span>
                  </div>
                </div>

                {notif.status && (
                  <p className="text-xs text-gray-300 bg-[#1e222a] p-2.5 rounded-lg border border-white/5 line-clamp-2">
                    {notif.status.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
