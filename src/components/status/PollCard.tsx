import React, { useState } from 'react';
import type { Poll } from '../../types/mastodon';
import { CheckCircle2, Circle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionIndex: number) => void;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleVote = () => {
    if (selectedOption !== null && !poll.voted) {
      onVote(poll.id, selectedOption);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // no-op
      }
    }
  };

  const totalVotes = Math.max(poll.votesCount, 1);

  return (
    <div className="my-3 p-3.5 rounded-lg bg-[#21242d] border border-white/10">
      <div className="space-y-2.5">
        {poll.options.map((option, idx) => {
          const percent = Math.round((option.votesCount / totalVotes) * 100);
          const isSelected = selectedOption === idx;
          const isUserVotedOption = poll.ownVotes?.includes(idx);

          return (
            <div key={idx} className="relative overflow-hidden rounded-md border border-white/10 bg-[#282c37]/60">
              {/* Progress bar background */}
              {poll.voted && (
                <div
                  className="absolute inset-y-0 left-0 bg-[#6364ff]/25 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              )}

              <div
                onClick={() => !poll.voted && setSelectedOption(idx)}
                className={`relative z-10 flex items-center justify-between p-2.5 cursor-pointer select-none transition-colors ${
                  !poll.voted ? 'hover:bg-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {!poll.voted ? (
                    isSelected ? (
                      <CheckCircle2 size={18} className="text-[#6364ff]" />
                    ) : (
                      <Circle size={18} className="text-gray-400" />
                    )
                  ) : isUserVotedOption ? (
                    <CheckCircle2 size={18} className="text-[#6364ff]" />
                  ) : null}
                  <span className={`text-sm font-medium ${isUserVotedOption ? 'text-[#a5a6ff]' : 'text-gray-200'}`}>
                    {option.title}
                  </span>
                </div>

                {poll.voted && (
                  <span className="text-xs font-semibold text-gray-300 ml-2">
                    %{percent}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-xs text-gray-400">
        <span>{poll.votesCount} oy • {poll.expired ? 'Sona erdi' : 'Aktif anket'}</span>
        {!poll.voted ? (
          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className="px-4 py-1.5 rounded-md bg-[#6364ff] hover:bg-[#5657ea] disabled:opacity-40 text-white font-medium text-xs cursor-pointer transition-colors"
          >
            Oy Ver
          </button>
        ) : (
          <span className="text-emerald-400 font-medium">Oyunuz kaydedildi ✓</span>
        )}
      </div>
    </div>
  );
};
