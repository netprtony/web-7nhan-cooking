'use client';

import { useEffect, useState } from 'react';
import ScrollExpandMedia from '@/components/scroll-expansion-hero';

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
  '/assets/mediaSrc/28bfece31aec43815a8672ba4d73f6d0.jpg',
  '/assets/mediaSrc/60afa1fc5e8f70ef4a8c59e1d5bca40f.jpg',
  '/assets/mediaSrc/66c5e81f029b084e391bf6288dd9ba97.jpg',
  '/assets/mediaSrc/968e05a09c03679b1f45dee657c93b76.jpg',
  '/assets/mediaSrc/a54fd36edd21d5d67e641980c95d551e.jpg',
  '/assets/mediaSrc/e1c9b9ddac992e063b8ec15676a3e579.jpg',
];

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Children content hiện ra sau khi scroll expand ──────────────────────────
const HeroExpandedContent = ({ onBookingClick }: { onBookingClick?: () => void }) => (
  <div className="max-w-4xl mx-auto text-center space-y-8">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
      Không Gian Tiệc Đẳng Cấp
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
      Hơn 10 năm kinh nghiệm tổ chức tiệc cưới, hội nghị và sự kiện doanh nghiệp.
      Đội ngũ chuyên nghiệp, thực đơn phong phú, không gian sang trọng —
      tất cả để buổi tiệc của bạn trở nên hoàn hảo và đáng nhớ.
    </p>

    {/* Stats nhanh */}
    <div className="grid grid-cols-3 gap-6 pt-4">
      {[
        { value: '500+', label: 'Tiệc thành công' },
        { value: '10 năm', label: 'Kinh nghiệm' },
        { value: '4.9★', label: 'Đánh giá Google' },
      ].map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-3xl font-bold text-orange-600">{stat.value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* CTA buttons */}
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      <button
        onClick={onBookingClick}
        className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
      >
        Đặt Bàn Ngay
      </button>
      <a
        href="/menu"
        className="px-8 py-3 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 font-semibold rounded-xl transition-colors"
      >
        Xem Thực Đơn
      </a>
    </div>
  </div>
);

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
        <HeroExpandedContent onBookingClick={onBookingClick} />
      </ScrollExpandMedia>
    </div>
  );
};

export default HeroBanquet;
