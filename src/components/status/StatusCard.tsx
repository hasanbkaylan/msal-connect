import React, { useState } from 'react';
import type { Status, Account } from '../../types/mastodon';
import { Avatar } from '../common/Avatar';
import { MediaGallery } from './MediaGallery';
import { PollCard } from './PollCard';
import {
  MessageSquare,
  Repeat2,
  Star,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  Pin,
  Lock,
  Globe,
  Check,
} from 'lucide-react';

interface StatusCardProps {
  status: Status;
  onReply?: (status: Status) => void;
  onReblog?: (statusId: string) => void;
  onFavourite?: (statusId: string) => void;
  onBookmark?: (statusId: string) => void;
  onVote?: (pollId: string, optionIndex: number) => void;
  onImageClick?: (url: string) => void;
  onAccountClick?: (account: Account) => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  onReply,
  onReblog,
  onFavourite,
  onBookmark,
  onVote,
  onImageClick,
  onAccountClick,
}) => {
  const [spoilerRevealed, setSpoilerRevealed] = useState(!status.sensitive);
  const [copied, setCopied] = useState(false);

  // Format relative date (Turkish)
  const formatTime = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'şimdi';
    if (diff < 3600) return `${Math.floor(diff / 60)}d`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}s`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}g`;
    return new Date(isoString).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(status.url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // noop
    }
  };

  // Render clickable hashtags & mentions in text
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(\B[#@][\w-]+|\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span key={i} className="text-[#6364ff] hover:underline cursor-pointer font-medium">
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-[#6364ff] hover:underline cursor-pointer font-medium">
            {part}
          </span>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <article className="border-b border-white/10 bg-[#282c37] hover:bg-[#2b303c]/90 transition-colors p-4 relative text-[15px]">
      {/* Pinned or Reblogged meta info */}
      {status.pinned && (
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2 pl-12">
          <Pin size={13} className="text-[#6364ff]" />
          <span>Sabitlenen Gönderi</span>
        </div>
      )}

      {status.reblog && (
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2 pl-12">
          <Repeat2 size={13} className="text-emerald-400" />
          <span>{status.account.displayName} yeniden paylaştı</span>
        </div>
      )}

      <div className="flex items-start gap-3.5">
        {/* Author Avatar */}
        <Avatar
          src={status.account?.avatar || ''}
          alt={status.account?.displayName || 'Kullanıcı'}
          onClick={() => status.account && onAccountClick?.(status.account)}
        />

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Header (Display name, acct, timestamp, visibility) */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div
              className="flex items-baseline gap-1.5 truncate cursor-pointer"
              onClick={() => status.account && onAccountClick?.(status.account)}
            >
              <span className="font-bold text-white text-[15px] truncate hover:underline">
                {status.account?.displayName || 'Anonim'}
              </span>
              <span className="text-gray-400 text-xs truncate">
                @{status.account?.username || 'user'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
              {status.visibility === 'public' ? (
                <span title="Herkese açık"><Globe size={13} /></span>
              ) : (
                <span title="Takipçilere özel"><Lock size={13} /></span>
              )}
              <time dateTime={status.createdAt} title={new Date(status.createdAt).toLocaleString('tr-TR')}>
                {formatTime(status.createdAt)}
              </time>
            </div>
          </div>

          {/* Spoiler / Content Warning toggle */}
          {status.sensitive && status.spoilerText && (
            <div className="mb-2">
              <div className="flex items-center justify-between p-2 rounded bg-red-950/30 border border-red-500/20 text-red-200 text-xs">
                <span className="font-medium">{status.spoilerText}</span>
                <button
                  onClick={() => setSpoilerRevealed(!spoilerRevealed)}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  {spoilerRevealed ? (
                    <>
                      Gizle <ChevronUp size={13} />
                    </>
                  ) : (
                    <>
                      Daha fazla göster <ChevronDown size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Main Status Text */}
          {spoilerRevealed && (
            <div className="text-gray-100 whitespace-pre-line leading-relaxed break-words">
              {renderFormattedContent(status.content)}
            </div>
          )}

          {/* Poll */}
          {spoilerRevealed && status.poll && (
            <PollCard
              poll={status.poll}
              onVote={(pollId, optIdx) => onVote?.(pollId, optIdx)}
            />
          )}

          {/* Media Gallery */}
          {spoilerRevealed && status.mediaAttachments && status.mediaAttachments.length > 0 && (
            <MediaGallery
              media={status.mediaAttachments}
              sensitive={status.sensitive}
              onImageClick={onImageClick}
            />
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between max-w-md mt-3.5 pt-1 text-gray-400 text-xs">
            {/* Reply */}
            <button
              onClick={() => onReply?.(status)}
              className="flex items-center gap-1.5 hover:text-[#6364ff] transition-colors p-1.5 -ml-1.5 rounded hover:bg-white/5 cursor-pointer group"
              title="Yanıtla"
            >
              <MessageSquare size={17} className="group-hover:scale-110 transition-transform" />
              <span>{status.repliesCount > 0 ? status.repliesCount : ''}</span>
            </button>

            {/* Reblog / Boost */}
            <button
              onClick={() => onReblog?.(status.id)}
              className={`flex items-center gap-1.5 transition-colors p-1.5 rounded hover:bg-white/5 cursor-pointer group ${
                status.reblogged ? 'text-[#15d68d]' : 'hover:text-[#15d68d]'
              }`}
              title="Yeniden Paylaş (Boost)"
            >
              <Repeat2 size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold">{status.reblogsCount > 0 ? status.reblogsCount : ''}</span>
            </button>

            {/* Favourite / Star */}
            <button
              onClick={() => onFavourite?.(status.id)}
              className={`flex items-center gap-1.5 transition-colors p-1.5 rounded hover:bg-white/5 cursor-pointer group ${
                status.favourited ? 'text-[#ffaa00]' : 'hover:text-[#ffaa00]'
              }`}
              title="Favorilere Ekle"
            >
              <Star
                size={17}
                className={`group-hover:scale-110 transition-transform ${
                  status.favourited ? 'fill-[#ffaa00]' : ''
                }`}
              />
              <span className="font-semibold">{status.favouritesCount > 0 ? status.favouritesCount : ''}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onBookmark?.(status.id)}
              className={`flex items-center gap-1.5 transition-colors p-1.5 rounded hover:bg-white/5 cursor-pointer group ${
                status.bookmarked ? 'text-[#6364ff]' : 'hover:text-[#6364ff]'
              }`}
              title="Yer İmi"
            >
              <Bookmark
                size={17}
                className={`group-hover:scale-110 transition-transform ${
                  status.bookmarked ? 'fill-[#6364ff]' : ''
                }`}
              />
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-white transition-colors p-1.5 rounded hover:bg-white/5 cursor-pointer group"
              title="Bağlantıyı Kopyala"
            >
              {copied ? (
                <Check size={16} className="text-emerald-400" />
              ) : (
                <Share2 size={16} className="group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
