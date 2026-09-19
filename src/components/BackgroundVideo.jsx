import React, { useEffect, useRef, useState } from 'react';

/**
 * Full-viewport, fixed background video. Sits behind all content
 * (-z-10, position: fixed) so it never affects layout or scroll height,
 * and stays put while the page scrolls over it.
 *
 * - object-cover + fixed inset-0 keeps it responsive at any aspect ratio.
 * - autoplay/muted/playsInline/loop for reliable mobile autoplay.
 * - a theme-aware tint + blur sits above it so text stays readable in
 *   both light and dark mode without touching every component's colors.
 * - pauses when the tab is hidden to save battery/CPU.
 */
export default function BackgroundVideo({ src = '/bg-video.mp4' }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div className="bg-video-layer fixed inset-0 -z-10 overflow-hidden bg-surface dark:bg-night-bg">
      <video
        ref={videoRef}
        className={
          'w-full h-full object-cover object-center transition-opacity duration-700 ' +
          (ready ? 'opacity-100' : 'opacity-0')
        }
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
      />
      {/* Theme-aware scrim: keeps foreground text/cards legible over the footage */}
      <div className="absolute inset-0 bg-surface/78 dark:bg-night-bg/82 backdrop-blur-[2px] transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-transparent to-surface/60 dark:from-night-bg/50 dark:via-transparent dark:to-night-bg/70" />
    </div>
  );
}
