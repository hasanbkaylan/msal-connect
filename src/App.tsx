import { useState, useEffect } from 'react';
import type { TimelineType, Status, Account, Notification, StatusVisibility, MediaAttachment } from './types/mastodon';
import { StorageService } from './services/storage';
import { MOCK_TRENDS } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ExplorePanel } from './components/layout/ExplorePanel';
import { StatusCard } from './components/status/StatusCard';
import { StatusComposer } from './components/status/StatusComposer';
import { ProfileView } from './components/profile/ProfileView';
import { NotificationsList } from './components/notifications/NotificationsList';
import { SettingsModal } from './components/modals/SettingsModal';
import { LightboxModal } from './components/modals/LightboxModal';
import { SlidersHorizontal, Radio, Search } from 'lucide-react';

export default function App() {
  const [timeline, setTimeline] = useState<TimelineType>('home');
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<Account>(StorageService.getUser());
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeReplyStatus, setActiveReplyStatus] = useState<Status | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    // Theme setup
    const savedTheme = StorageService.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Data load
    setStatuses(StorageService.getStatuses());
    setNotifications(StorageService.getNotifications());
    setCurrentUser(StorageService.getUser());
  }, []);

  // Update localStorage when statuses mutate
  const updateStatuses = (newStatuses: Status[]) => {
    setStatuses(newStatuses);
    StorageService.saveStatuses(newStatuses);
  };

  // Toggle Reblog / Boost
  const handleReblog = (statusId: string) => {
    const updated = statuses.map((s) => {
      if (s.id === statusId) {
        const nextState = !s.reblogged;
        return {
          ...s,
          reblogged: nextState,
          reblogsCount: s.reblogsCount + (nextState ? 1 : -1),
        };
      }
      return s;
    });
    updateStatuses(updated);
  };

  // Toggle Favourite
  const handleFavourite = (statusId: string) => {
    const updated = statuses.map((s) => {
      if (s.id === statusId) {
        const nextState = !s.favourited;
        return {
          ...s,
          favourited: nextState,
          favouritesCount: s.favouritesCount + (nextState ? 1 : -1),
        };
      }
      return s;
    });
    updateStatuses(updated);
  };

  // Toggle Bookmark
  const handleBookmark = (statusId: string) => {
    const updated = statuses.map((s) => {
      if (s.id === statusId) {
        return {
          ...s,
          bookmarked: !s.bookmarked,
        };
      }
      return s;
    });
    updateStatuses(updated);
  };

  // Poll Vote handler
  const handleVote = (pollId: string, optionIndex: number) => {
    const updated = statuses.map((s) => {
      if (s.poll && s.poll.id === pollId && !s.poll.voted) {
        const updatedOptions = s.poll.options.map((opt, i) => {
          if (i === optionIndex) {
            return { ...opt, votesCount: opt.votesCount + 1 };
          }
          return opt;
        });

        return {
          ...s,
          poll: {
            ...s.poll,
            options: updatedOptions,
            votesCount: s.poll.votesCount + 1,
            votersCount: s.poll.votersCount + 1,
            voted: true,
            ownVotes: [optionIndex],
          },
        };
      }
      return s;
    });
    updateStatuses(updated);
  };

  // Publish new status
  const handlePublish = (data: {
    content: string;
    spoilerText: string;
    sensitive: boolean;
    visibility: StatusVisibility;
    mediaAttachments: MediaAttachment[];
    poll?: { options: string[]; expiresHours: number } | null;
    inReplyToId?: string | null;
  }) => {
    const newStatus: Status = {
      id: 'status-' + Date.now(),
      createdAt: new Date().toISOString(),
      inReplyToId: data.inReplyToId,
      sensitive: data.sensitive,
      spoilerText: data.spoilerText,
      visibility: data.visibility,
      language: 'tr',
      uri: `https://connect.msal.org/statuses/${Date.now()}`,
      url: `https://connect.msal.org/@${currentUser.username}/${Date.now()}`,
      repliesCount: 0,
      reblogsCount: 0,
      favouritesCount: 0,
      favourited: false,
      reblogged: false,
      bookmarked: false,
      content: data.content,
      account: currentUser,
      mediaAttachments: data.mediaAttachments,
      mentions: [],
      tags: [],
      poll: data.poll
        ? {
            id: 'poll-' + Date.now(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * data.poll.expiresHours).toISOString(),
            expired: false,
            multiple: false,
            votesCount: 0,
            votersCount: 0,
            options: data.poll.options.map((title) => ({ title, votesCount: 0 })),
            voted: false,
          }
        : null,
    };

    const nextStatuses = [newStatus, ...statuses];
    updateStatuses(nextStatuses);
    setActiveReplyStatus(null);
  };

  // Filter statuses by active view
  const getFilteredStatuses = () => {
    if (selectedTag) {
      return statuses.filter(
        (s) =>
          s.content.toLowerCase().includes(selectedTag.toLowerCase()) ||
          s.tags.some((t) => t.name.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (mobileSearchQuery.trim()) {
      return statuses.filter((s) =>
        s.content.toLowerCase().includes(mobileSearchQuery.toLowerCase())
      );
    }

    switch (timeline) {
      case 'home':
        return statuses;
      case 'local':
        return statuses.filter((s) => s.account.acct.includes('msal.org'));
      case 'federated':
        return statuses;
      case 'bookmarks':
        return statuses.filter((s) => s.bookmarked);
      case 'favourites':
        return statuses.filter((s) => s.favourited);
      default:
        return statuses;
    }
  };

  const getTimelineTitle = () => {
    if (selectedTag) return `#${selectedTag}`;
    switch (timeline) {
      case 'home':
        return 'Ana Sayfa';
      case 'local':
        return 'Yerel Zaman Tüneli';
      case 'federated':
        return 'Fediverse (Genel)';
      case 'bookmarks':
        return 'Yer İmleri';
      case 'favourites':
        return 'Favorilerim';
      case 'explore':
        return 'Keşfet & Gündem';
      case 'notifications':
        return 'Bildirimler';
      default:
        return 'MSAL Connect';
    }
  };

  return (
    <div className="min-h-screen bg-[#191b22] text-white flex justify-center selection:bg-[#6364ff] selection:text-white pb-16 md:pb-0">
      <div className="w-full max-w-7xl flex">
        {/* Left Mastodon Navigation Sidebar */}
        <Sidebar
          currentTimeline={timeline}
          onSelectTimeline={(t) => {
            setSelectedAccount(null);
            setSelectedTag(null);
            setTimeline(t);
          }}
          currentUser={currentUser}
          unreadNotificationsCount={notifications.length}
          onOpenComposer={() => {
            setSelectedAccount(null);
            setTimeline('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSettings={() => setShowSettings(true)}
          onSelectAccount={(acc) => setSelectedAccount(acc)}
        />

        {/* Center Main Feed / Profile Column */}
        <main className="flex-1 min-w-0 max-w-2xl border-r border-white/10 min-h-screen bg-[#191b22] flex flex-col">
          {/* Mobile Top Header */}
          <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#191b22]/95 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6364ff] to-[#8c8dff] flex items-center justify-center text-white">
                <Radio size={16} />
              </div>
              <span className="font-bold text-sm tracking-wide">MSAL Connect</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Search input dropdown */}
          {mobileSearchOpen && (
            <div className="md:hidden p-3 bg-[#282c37] border-b border-white/10">
              <input
                type="text"
                placeholder="Gönderilerde veya etiketlerde ara..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="w-full bg-[#1e222a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          )}

          {/* Main Column Body */}
          {selectedAccount ? (
            <ProfileView
              account={selectedAccount}
              statuses={statuses}
              onBack={() => setSelectedAccount(null)}
              onReply={(st) => {
                setActiveReplyStatus(st);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReblog={handleReblog}
              onFavourite={handleFavourite}
              onBookmark={handleBookmark}
              onVote={handleVote}
              onImageClick={(url) => setLightboxImage(url)}
            />
          ) : timeline === 'notifications' ? (
            <NotificationsList
              notifications={notifications}
              onSelectAccount={(acc) => setSelectedAccount(acc)}
              onClearAll={() => {
                setNotifications([]);
                StorageService.saveNotifications([]);
              }}
            />
          ) : (
            <div>
              {/* Column Top Bar */}
              <div className="sticky top-0 z-20 hidden md:flex items-center justify-between px-4 py-3 bg-[#191b22]/90 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white">{getTimelineTitle()}</h1>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-xs text-[#6364ff] hover:underline"
                    >
                      (Filtreyi kaldır)
                    </button>
                  )}
                </div>
              </div>

              {/* Status Composer (Desktop & Mobile) */}
              <div className="p-3 md:p-4 border-b border-white/10">
                <StatusComposer
                  currentUser={currentUser}
                  inReplyTo={activeReplyStatus}
                  onCloseReply={() => setActiveReplyStatus(null)}
                  onPublish={handlePublish}
                />
              </div>

              {/* Statuses List */}
              <div className="divide-y divide-white/10">
                {getFilteredStatuses().length === 0 ? (
                  <div className="p-12 text-center text-gray-400 text-sm">
                    Bu alanda görüntülenecek gönderi bulunmuyor.
                  </div>
                ) : (
                  getFilteredStatuses().map((status) => (
                    <StatusCard
                      key={status.id}
                      status={status}
                      onReply={(st) => {
                        setActiveReplyStatus(st);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onReblog={handleReblog}
                      onFavourite={handleFavourite}
                      onBookmark={handleBookmark}
                      onVote={handleVote}
                      onImageClick={(url) => setLightboxImage(url)}
                      onAccountClick={(acc) => setSelectedAccount(acc)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Explore / Trending Column */}
        <ExplorePanel
          trends={MOCK_TRENDS}
          onSelectTag={(tag) => setSelectedTag(tag)}
          onSelectAccount={(acc) => setSelectedAccount(acc)}
        />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTimeline={timeline}
        onSelectTimeline={(t) => {
          setSelectedAccount(null);
          setSelectedTag(null);
          setTimeline(t);
        }}
        unreadNotificationsCount={notifications.length}
        onOpenComposer={() => {
          setSelectedAccount(null);
          setTimeline('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Settings Modal (Supabase & Theme) */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onConfigUpdated={() => {
          setStatuses(StorageService.getStatuses());
          setNotifications(StorageService.getNotifications());
        }}
      />

      {/* Lightbox Modal */}
      <LightboxModal imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
};
