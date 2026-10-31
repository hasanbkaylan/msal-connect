import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className = '', onClick }) => {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-full',
    md: 'w-11 h-11 rounded-[6px]',
    lg: 'w-16 h-16 rounded-[8px]',
    xl: 'w-24 h-24 rounded-[10px]',
  };

  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      className={`${sizeMap[size]} object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity bg-[#282c37] border border-white/10 ${className}`}
      loading="lazy"
    />
  );
};
