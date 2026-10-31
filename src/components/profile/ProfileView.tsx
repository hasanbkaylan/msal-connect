import React, { useState } from 'react';
import type { Account, Status } from '../../types/mastodon';
import { StatusCard } from '../status/StatusCard';
import { Avatar } from '../common/Avatar';
import { ArrowLeft, Calendar, UserPlus, UserCheck, ShieldCheck } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface ProfileViewProps {
  account: Account;
  statuses: Status[];
  onBack: () => void;
  onReply?: (status: Status) => void;
  onReblog?: (statusId: string) => void;
  onFavourite?: (statusId: string) => void;
  onBookmark?: (statusId: string) => void;
  onVote?: (pollId: string, optionIndex: number) => void;
  onImageClick?: (url: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  account,
  statuses,
  onBack,
  onReply,
  onReblog,
  onFavourite,
  onBookmark,
  onVote,
  onImageClick,
}) => {
  const [following, setFollowing] = useState(
    StorageService.getFollowingList().includes(account.id)
  );

  const toggleFollow = () => {
    const isNowFollowing = StorageService.toggleFollow(account.id);
    setFollowing(isNowFollowing);
  };

  const userStatuses = statuses.filter((s) => s.account.id === account.id);

  return (
    <div className="flex-1 bg-[#191b22] overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-30 flex items-center gap-4 px-4 py-3 bg-[#282c37]/90 backdrop-blur-md border-b border-white/10">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-base font-bold text-white leading-tight">{account.displayName}</h2>
          <p className="text-xs text-gray-400">{userStatuses.length} gönderi</p>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative h-44 sm:h-52 w-full bg-[#282c37] overflow-hidden">
        {account.header ? (
          <img src={account.header} alt="Kapak fotoğrafı" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-900 to-purple-900" />
        )}
      </div>

      {/* Profile Details Container */}
      <div className="px-4 pb-4 border-b border-white/10 bg-[#282c37]">
        <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-3">
          <Avatar
            src={account.avatar}
            alt={account.displayName}
            size="xl"
            className="ring-4 ring-[#282c37]"
          />
          <button
            onClick={toggleFollow}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-semibold text-xs cursor-pointer transition-colors shadow-sm ${
              following
                ? 'bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-gray-200 border border-white/15'
                : 'bg-[#6364ff] hover:bg-[#5657ea] text-white'
            }`}
          >
            {following ? (
              <>
                <UserCheck size={14} /> Takip Ediliyor
              </>
            ) : (
              <>
                <UserPlus size={14} /> Takip Et
              </>
            )}
          </button>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-1.5">
            {account.displayName}
            {account.bot && (
              <span className="text-[10px] font-semibold bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                BOT
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400">@{account.acct}</p>
        </div>

        {/* Bio */}
        {account.note && (
          <p className="mt-3 text-sm text-gray-200 whitespace-pre-line leading-relaxed">
            {account.note}
          </p>
        )}

        {/* Fields / Metadata */}
        {account.fields && account.fields.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border border-white/10 rounded-lg overflow-hidden bg-[#1e222a]">
            {account.fields.map((field, idx) => (
              <div key={idx} className="p-2.5 border-b sm:border-b-0 border-white/5 text-xs">
                <span className="text-gray-400 font-medium block uppercase text-[10px]">{field.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5 text-indigo-300 truncate">
                  {field.verifiedAt && <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" />}
                  <span className="truncate">{field.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Counts & Join date */}
        <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span>Katıldı: {new Date(account.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div>
            <span className="font-bold text-white">{account.followingCount}</span> Takip Edilen
          </div>
          <div>
            <span className="font-bold text-white">{account.followersCount}</span> Takipçi
          </div>
        </div>
      </div>

      {/* Statuses List */}
      <div>
        {userStatuses.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Henüz hiç gönderi paylaşılmamış.
          </div>
        ) : (
          userStatuses.map((s) => (
            <StatusCard
              key={s.id}
              status={s}
              onReply={onReply}
              onReblog={onReblog}
              onFavourite={onFavourite}
              onBookmark={onBookmark}
              onVote={onVote}
              onImageClick={onImageClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
