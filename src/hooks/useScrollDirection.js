import { useEffect, useRef, useState } from 'react';

/**
 * Tracks scroll direction to drive a "hide on scroll-down, reveal on
 * scroll-up" navbar. Stays visible near the top of the page regardless
 * of direction so the nav doesn't vanish on a tiny wobble at y=0.
 *
 * @param {number} threshold - px of scroll delta required to flip state
 * @param {number} topOffset - px from top where the bar always stays visible
 */
export default function useScrollDirection(threshold = 6, topOffset = 80) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        if (y < topOffset) {
          setHidden(false);
          lastY.current = y;
          ticking.current = false;
          return;
        }

        const delta = y - lastY.current;
        if (Math.abs(delta) > threshold) {
          setHidden(delta > 0); // scrolling down -> hide, scrolling up -> show
          lastY.current = y;
        }
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, topOffset]);

  return hidden;
}
