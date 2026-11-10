import { useState } from 'react';
import { GC_MEDIA, type MediaKey } from '../data/media';

interface CheeseImageProps {
  mediaKey: MediaKey;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export function CheeseImage({
  mediaKey,
  alt,
  className = '',
  imgClassName = '',
}: CheeseImageProps) {
  const [failed, setFailed] = useState(false);
  const src = GC_MEDIA[mediaKey];

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE6] text-[#5C5852] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-10 h-10 mb-2 text-[#8A6A2F] opacity-80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M3 14l9-9 9 5v8l-9 3-9-7z" />
          <path d="M3 14l9 3 9-3" />
          <circle cx="9" cy="13" r="1" fill="currentColor" />
          <circle cx="14" cy="11" r="1.2" fill="currentColor" />
        </svg>
        <span className="text-xs font-medium max-w-[22ch] line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-[#EFECE6] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
