import React, { useState } from 'react';
import type { MediaAttachment } from '../../types/mastodon';
import { EyeOff, Eye, Maximize2 } from 'lucide-react';

interface MediaGalleryProps {
  media: MediaAttachment[];
  sensitive?: boolean;
  onImageClick?: (url: string) => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media, sensitive = false, onImageClick }) => {
  const [revealed, setRevealed] = useState(!sensitive);

  if (!media || media.length === 0) return null;

  return (
    <div className="relative mt-3 rounded-lg overflow-hidden border border-white/10 bg-[#16181d]">
      {!revealed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
          <p className="text-sm font-medium text-gray-300 mb-2">Hassas Medya İçerebilir</p>
          <button
            onClick={() => setRevealed(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#6364ff] hover:bg-[#5657ea] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <Eye size={14} /> İçeriği Göster
          </button>
        </div>
      )}

      <div
        className={`grid gap-1 ${
          media.length === 1 ? 'grid-cols-1' : media.length === 2 ? 'grid-cols-2' : media.length === 3 ? 'grid-cols-2' : 'grid-cols-2'
        } ${!revealed ? 'filter blur-xl' : ''}`}
      >
        {media.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onImageClick?.(item.url)}
            className={`relative group overflow-hidden bg-black/30 cursor-pointer ${
              media.length === 3 && index === 0 ? 'row-span-2 h-72' : 'h-48'
            }`}
          >
            <img
              src={item.previewUrl || item.url}
              alt={item.description || 'Mastodon medya eki'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="p-2 rounded-full bg-black/60 text-white">
                <Maximize2 size={16} />
              </span>
            </div>
            {item.description && (
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/75 text-[10px] text-gray-300">
                ALT
              </span>
            )}
          </div>
        ))}
      </div>

      {revealed && sensitive && (
        <button
          onClick={() => setRevealed(false)}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white text-xs cursor-pointer"
          title="Medyayı Gizle"
        >
          <EyeOff size={14} />
        </button>
      )}
    </div>
  );
};
