import React, { useEffect, useState } from 'react';
import { triggerDownload } from '../api.js';

export default function Lightbox({ image, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!image) return null;

  const handleDownload = async () => {
    setError('');
    setDownloading(true);
    try {
      await triggerDownload(image.large, image.title);
    } catch {
      setError('Download failed — try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 z-[60] animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-surface dark:bg-night-surface rounded-[20px] max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl grid grid-cols-1 md:grid-cols-[1.4fr_1fr] animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition-colors z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="bg-surface-container-highest dark:bg-night-bg flex items-center justify-center max-h-[50vh] md:max-h-[85vh] overflow-hidden">
          <img src={image.large} alt={image.title} className="w-full h-full object-contain" />
        </div>

        <div className="p-lg md:p-xl flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-sm">{image.title}</h3>
          {image.author && (
            <p className="font-label-md text-label-md text-primary dark:text-night-primary mb-sm">
              by {image.author}{image.likes ? ` · ${image.likes} likes` : ''}
            </p>
          )}
          {image.description && (
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-night-muted mb-lg line-clamp-6">
              {image.description}
            </p>
          )}
          <div className="mt-auto flex items-center gap-md">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 bg-primary dark:bg-night-primary text-on-primary dark:text-night-on-primary rounded-full px-6 py-3 font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              {downloading ? 'Preparing…' : 'Download image'}
            </button>
            {error && <span className="text-error text-sm">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
