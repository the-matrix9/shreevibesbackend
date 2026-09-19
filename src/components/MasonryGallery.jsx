import React, { useState } from 'react';
import { triggerDownload } from '../api.js';

export function Card({ image, index = 0, onOpen, saved, liked, onToggleSave, onToggleLike }) {
  const [downloading, setDownloading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      await triggerDownload(image.large, image.title);
    } catch {
      // swallow — button returns to idle state; user can retry
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="masonry-item gallery-enter relative group rounded-[18px] overflow-hidden bg-surface-container dark:bg-night-surface shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-outline-variant/10 dark:border-night-border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
      style={{ '--stagger': index % 12 }}
      onClick={() => onOpen(image)}
    >
      {!loaded && (
        <div
          className="img-shimmer animate-shimmer w-full"
          style={{ aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : '3 / 4' }}
        />
      )}
      <img
        className={
          'w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 ' +
          (loaded ? 'opacity-100' : 'absolute inset-0 opacity-0')
        }
        src={image.thumb}
        alt={image.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-md">
        <div className="flex justify-end gap-sm translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(image);
            }}
            className={
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ' +
              (saved
                ? 'bg-primary dark:bg-night-primary text-on-primary dark:text-night-on-primary'
                : 'bg-surface/90 dark:bg-night-surface-2/90 text-on-surface dark:text-night-text hover:bg-primary hover:text-on-primary')
            }
            aria-label="Save"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}>
              bookmark
            </span>
          </button>
        </div>
        <div className="translate-y-[10px] group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-headline-md text-headline-md text-white drop-shadow-md mb-xs text-base truncate">
            {image.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-white/90 truncate max-w-[70%]">
              {image.author || 'ShreeVibe'}
            </span>
            <div className="flex gap-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(image.id);
                }}
                className={
                  'w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ' +
                  (liked ? 'bg-error text-white' : 'bg-white/20 text-white hover:bg-white/40')
                }
                aria-label="Like"
              >
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 flex items-center justify-center transition-colors disabled:opacity-60"
                aria-label="Download"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {downloading ? 'hourglass_top' : 'download'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MasonryGallery({ images, onOpen, savedMap, likedIds, onToggleSave, onToggleLike }) {
  if (!images.length) return null;

  return (
    <section className="masonry-grid pb-lg">
      {images.map((img, i) => (
        <Card
          key={img.id}
          image={img}
          index={i}
          onOpen={onOpen}
          saved={savedMap.has(img.id)}
          liked={likedIds.has(img.id)}
          onToggleSave={onToggleSave}
          onToggleLike={onToggleLike}
        />
      ))}
    </section>
  );
}
