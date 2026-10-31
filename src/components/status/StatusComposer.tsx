import React, { useState, useRef } from 'react';
import type { Status, StatusVisibility, MediaAttachment } from '../../types/mastodon';
import { Avatar } from '../common/Avatar';
import {
  Image as ImageIcon,
  BarChart2,
  AlertTriangle,
  Globe,
  Lock,
  Smile,
  X,
  Plus,
  Trash2,
} from 'lucide-react';

interface StatusComposerProps {
  currentUser: {
    avatar: string;
    displayName: string;
    username: string;
  };
  inReplyTo?: Status | null;
  onCloseReply?: () => void;
  onPublish: (newStatus: {
    content: string;
    spoilerText: string;
    sensitive: boolean;
    visibility: StatusVisibility;
    mediaAttachments: MediaAttachment[];
    poll?: { options: string[]; expiresHours: number } | null;
    inReplyToId?: string | null;
  }) => void;
  placeholder?: string;
}

const MAX_CHARS = 500;

export const StatusComposer: React.FC<StatusComposerProps> = ({
  currentUser,
  inReplyTo,
  onCloseReply,
  onPublish,
  placeholder = 'Aklınızdan ne geçiyor?',
}) => {
  const [content, setContent] = useState('');
  const [spoilerText, setSpoilerText] = useState('');
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [visibility, setVisibility] = useState<StatusVisibility>('public');
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [mediaList, setMediaList] = useState<MediaAttachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingChars = MAX_CHARS - content.length - (showSpoiler ? spoilerText.length : 0);
  const isValid = (content.trim().length > 0 || mediaList.length > 0) && remainingChars >= 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setMediaList((prev) => [
          ...prev,
          {
            id: 'media-' + Date.now() + Math.random().toString(36).substring(2, 6),
            type: 'image',
            url,
            previewUrl: url,
            description: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const validPollOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
    const pollData =
      showPoll && validPollOptions.length >= 2
        ? {
            options: validPollOptions,
            expiresHours: 24,
          }
        : null;

    onPublish({
      content: content.trim(),
      spoilerText: showSpoiler ? spoilerText.trim() : '',
      sensitive: showSpoiler && spoilerText.trim().length > 0,
      visibility,
      mediaAttachments: mediaList,
      poll: pollData,
      inReplyToId: inReplyTo?.id || null,
    });

    // Reset composer
    setContent('');
    setSpoilerText('');
    setShowSpoiler(false);
    setShowPoll(false);
    setPollOptions(['', '']);
    setMediaList([]);
    onCloseReply?.();
  };

  const emojis = ['👍', '❤️', '🔥', '🎉', '🚀', '✨', '🐘', '👀', '💡', '☕', '💻', '🇹🇷'];

  return (
    <div className="bg-[#282c37] border border-white/10 rounded-xl p-4 shadow-lg mb-4">
      {/* Reply banner if replying */}
      {inReplyTo && (
        <div className="flex items-center justify-between mb-3 px-3 py-1.5 rounded-lg bg-[#1f232b] border border-white/10 text-xs text-gray-300">
          <span className="truncate">
            <span className="text-[#6364ff] font-medium">@{inReplyTo.account.username}</span> adlı kullanıcıya yanıt veriliyor
          </span>
          <button
            onClick={onCloseReply}
            className="p-1 hover:text-white rounded hover:bg-white/10 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <Avatar src={currentUser.avatar} alt={currentUser.displayName} size="md" />

          <div className="flex-1 min-w-0">
            {/* CW (Content Warning) input if enabled */}
            {showSpoiler && (
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Uyarı başlığı (Örn: Dizi spoilerı, politika...)"
                  value={spoilerText}
                  onChange={(e) => setSpoilerText(e.target.value)}
                  className="w-full bg-[#1e222a] border border-amber-500/40 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            )}

            {/* Main Text Area */}
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent resize-none border-none text-white text-[15px] placeholder-gray-400 focus:outline-none leading-relaxed"
            />

            {/* Media previews */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 gap-2 my-2">
                {mediaList.map((m) => (
                  <div key={m.id} className="relative group rounded-lg overflow-hidden h-28 border border-white/10">
                    <img src={m.url} alt="Eklenen medya" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeMedia(m.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Poll Builder */}
            {showPoll && (
              <div className="my-3 p-3 bg-[#1e222a] rounded-lg border border-white/10 space-y-2">
                <p className="text-xs font-semibold text-gray-300">Anket Seçenekleri</p>
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Seçenek ${i + 1}`}
                      value={opt}
                      onChange={(e) => handlePollOptionChange(i, e.target.value)}
                      className="flex-1 bg-[#282c37] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6364ff]"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removePollOption(i)}
                        className="text-gray-400 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="flex items-center gap-1 text-xs text-[#6364ff] hover:text-[#5657ea] font-medium pt-1 cursor-pointer"
                  >
                    <Plus size={13} /> Seçenek Ekle
                  </button>
                )}
              </div>
            )}

            {/* Emoji popover */}
            {showEmojiPicker && (
              <div className="flex flex-wrap gap-2 p-2 mb-2 bg-[#1e222a] border border-white/10 rounded-lg">
                {emojis.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => handleEmojiSelect(em)}
                    className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}

            {/* Composer Footer toolbar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-1 text-gray-400">
                {/* Upload Image */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded hover:bg-white/10 hover:text-[#6364ff] transition-colors cursor-pointer"
                  title="Görsel ekle"
                >
                  <ImageIcon size={18} />
                </button>

                {/* Poll Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPoll(!showPoll)}
                  className={`p-2 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                    showPoll ? 'text-[#6364ff] bg-white/5' : 'hover:text-[#6364ff]'
                  }`}
                  title="Anket ekle"
                >
                  <BarChart2 size={18} />
                </button>

                {/* Content Warning (CW) Toggle */}
                <button
                  type="button"
                  onClick={() => setShowSpoiler(!showSpoiler)}
                  className={`p-2 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                    showSpoiler ? 'text-amber-400 bg-amber-500/10' : 'hover:text-amber-400'
                  }`}
                  title="İçerik Uyarısı (CW)"
                >
                  <AlertTriangle size={18} />
                </button>

                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setVisibility((v) => (v === 'public' ? 'private' : 'public'))}
                  className="p-2 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  title={visibility === 'public' ? 'Herkese açık' : 'Yalnızca takipçiler'}
                >
                  {visibility === 'public' ? <Globe size={18} /> : <Lock size={18} />}
                </button>

                {/* Emoji toggle */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 rounded hover:bg-white/10 hover:text-yellow-400 transition-colors cursor-pointer"
                  title="Emoji ekle"
                >
                  <Smile size={18} />
                </button>
              </div>

              {/* Characters count & Publish button */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono ${
                    remainingChars < 20 ? (remainingChars < 0 ? 'text-red-400' : 'text-amber-400') : 'text-gray-400'
                  }`}
                >
                  {remainingChars}
                </span>

                <button
                  type="submit"
                  disabled={!isValid}
                  className="px-5 py-2 rounded-lg bg-[#6364ff] hover:bg-[#5657ea] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm cursor-pointer transition-colors shadow-md shadow-[#6364ff]/20"
                >
                  {inReplyTo ? 'Yanıtla' : 'Paylaş'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
