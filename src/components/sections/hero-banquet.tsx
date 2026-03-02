'use client';

import { useEffect, useState } from 'react';
import ScrollExpandMedia from '@/components/scroll-expansion-hero';
import { ScrollVelocityFood } from '@/components/sections/scroll-velocity-food';

// ============================================
// IMAGE POOLS — random on every page load
// ============================================

const BG_IMAGES = [
  '/assets/bgImageSrc/bg1.jpg',
  '/assets/bgImageSrc/bg2.jpg',
  '/assets/bgImageSrc/bg3.jpg',
  '/assets/bgImageSrc/bg4.jpg',
  '/assets/bgImageSrc/bg5.jpg',
  '/assets/bgImageSrc/bg6.png',
];

const MEDIA_IMAGES = [
  '/assets/mediaSrc/ganuongmuoiot.jpg',
  '/assets/mediaSrc/ganuongxoi.jpg',
  '/assets/mediaSrc/goicuhudua.jpg',
  '/assets/mediaSrc/goingoisen.jpg',
  '/assets/mediaSrc/mivittim.png',
  '/assets/mediaSrc/mucne.jpg',
  '/assets/mediaSrc/supcua.jpg',
  '/assets/mediaSrc/20230515161938907.webp',
  '/assets/mediaSrc/20240424094950598.webp',
  '/assets/mediaSrc/202309051543247016.webp',
  '/assets/mediaSrc/202406051707191395.webp',
  '/assets/mediaSrc/202406051717238266.webp',
  '/assets/mediaSrc/202506271648487316.webp',
  '/assets/mediaSrc/202506271649402242.webp',
  '/assets/mediaSrc/202506271709128585.webp',
  '/assets/mediaSrc/202506271713075933.webp',
];

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Main Hero Component ──────────────────────────────────────────────────────
interface HeroBanquetProps {
  onBookingClick?: () => void;
}

const HeroBanquet = ({ onBookingClick }: HeroBanquetProps) => {
  // Start with deterministic defaults (index 0) so server & client match,
  // then randomize on the client after hydration.
  const [bgImage, setBgImage] = useState(BG_IMAGES[0]);
  const [mediaImage, setMediaImage] = useState(MEDIA_IMAGES[0]);

  useEffect(() => {
    setBgImage(pickRandom(BG_IMAGES));
    setMediaImage(pickRandom(MEDIA_IMAGES));
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={mediaImage}
        bgImageSrc={bgImage}
        title="Tiệc Sang Trọng"
        date="Nhà Hàng 7 Nhân"
        scrollToExpand="Cuộn để khám phá ↓"
        textBlend={false}
      >
        {/* Scroll velocity food gallery thay cho HeroExpandedContent */}
        <ScrollVelocityFood />
      </ScrollExpandMedia>
    </div>
  );
};

export default HeroBanquet;
