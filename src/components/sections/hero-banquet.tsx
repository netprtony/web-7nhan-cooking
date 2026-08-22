'use client';

import { useEffect, useState } from 'react';
import ScrollExpandMedia from '@/components/scroll-expansion-hero';
import { ScrollVelocityFood } from '@/components/sections/scroll-velocity-food';

const BG_IMAGES = [
  '/Lau1.png',
  '/Lau2.png',
];

const MEDIA_IMAGES = [
  '/food/1787405416813_4393983564459447264_4393983564459447264_d6d36cdd1be63d7affabd24aaeadb6c9.jpg',
  '/food/1787405417055_4393983564459447264_4393983564459447264_d31176e44e3f538be97aa2c553648b0e.jpg',
  '/food/1787405417233_4393983564459447264_4393983564459447264_083e8fe634e3d95628e8f520418911d9.jpg',
  '/food/1787405417393_4393983564459447264_4393983564459447264_bc9d55124d58885527cb4008333ae2d5.jpg',
  '/food/1787405417596_4393983564459447264_4393983564459447264_7c9271b4ec1ac97f8de1f6fe744746c4.jpg',
  '/food/1787405417816_4393983564459447264_4393983564459447264_40cf7aad4be5dde776fedfd32c442e1f.jpg',
  '/food/1787405418044_4393983564459447264_4393983564459447264_8424b973507176169b9599dc875d8187.jpg',
  '/food/1787405418213_4393983564459447264_4393983564459447264_456eef33281b0693ebf5eebdfc4dde06.jpg',
  '/food/1787405418399_4393983564459447264_4393983564459447264_acb8ff495c80d5ba1d4115fd2eec3dd4.jpg',
  '/food/1787405418592_4393983564459447264_4393983564459447264_d8a40616c3f894a74db2a5121ffb1e34.jpg',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface HeroBanquetProps {
  onBookingClick?: () => void;
}

const HeroBanquet = ({ onBookingClick }: HeroBanquetProps) => {
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
        title="Modern Dining Experience"
        date="AFTER HOURS"
        scrollToExpand="Cuộn để khám phá ↓"
        textBlend={false}
      >
        <ScrollVelocityFood />
      </ScrollExpandMedia>
    </div>
  );
};

export default HeroBanquet;
