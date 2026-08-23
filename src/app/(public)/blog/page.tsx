"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ChevronRight, Play } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { LiquidCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/liquid-glass-card';
import dynamic from 'next/dynamic';

const FooterRestaurant = dynamic(
  () => import('@/components/ui/footer-section').then((m) => ({ default: m.FooterRestaurant })),
  { ssr: false }
);

interface MediaItem {
  video?: string;
  image?: string;
}

interface MediaGroup {
  items: MediaItem[];
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  main_image_url: string | null;
  published_at: string;
  author: string;
  category: string;
  images_json: MediaGroup[] | null;
}

const categoryColors: Record<string, string> = {
  'H\u1eadu Tr\u01b0\u1eddng': 'bg-amber-600',
  'S\u1ef1 Ki\u1ec7n': 'bg-blue-500',
  '\u0110\u1ed9i Ng\u0169': 'bg-green-600',
  'Kh\u00e1ch H\u00e0ng': 'bg-pink-500',
  'Ph\u00e1t Tri\u1ec3n': 'bg-purple-500',
};

function getFirstMedia(imagesJson: any): { type: 'image' | 'video' | null; url: string | null } {
  let parsedData = imagesJson;
  if (typeof imagesJson === 'string') {
    try {
      parsedData = JSON.parse(imagesJson);
    } catch (e) {
      return { type: null, url: null };
    }
  }

  let firstMedia: { type: 'image' | 'video' | null; url: string | null } = { type: null, url: null };

  function recurse(current: any) {
    if (firstMedia.url) return; // Stop if found
    if (!current) return;
    
    if (typeof current === 'string') {
      const lower = current.toLowerCase();
      if (lower.match(/\.(jpeg|jpg|gif|png|webp|svg)$/)) {
        firstMedia = { type: 'image', url: current };
      } else if (lower.match(/\.(mp4|webm|ogg)$/)) {
        firstMedia = { type: 'video', url: current };
      } else if (lower.startsWith('http')) {
        firstMedia = { type: 'image', url: current };
      }
      return;
    }
    
    if (Array.isArray(current)) {
      for (const item of current) recurse(item);
      return;
    }
    
    if (typeof current === 'object') {
      if (current.image && typeof current.image === 'string') {
        firstMedia = { type: 'image', url: current.image };
      } else if (current.video && typeof current.video === 'string') {
        firstMedia = { type: 'video', url: current.video };
      } else {
        for (const val of Object.values(current)) recurse(val);
      }
    }
  }

  recurse(parsedData);
  return firstMedia;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, main_image_url, published_at, author, category, images_json')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data as unknown as BlogPost[]);
      }
      setLoading(false);
    };

    fetchPosts().catch(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 px-4 bg-gradient-to-r from-primary to-amber-600 text-white">
        <div className="container mx-auto text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80 mb-3">Nhật Ký Hoạt Động</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Hành Trình AFTER HOURS
          </h2>
          <p className="text-sm sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Theo dõi hoạt động, sự kiện và những khoảnh khắc đáng nhớ của đội ngũ AFTER HOURS
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <GlassButton
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
                className={`flex-shrink-0 ${selectedCategory === cat ? 'ring-2 ring-primary' : ''}`}
              >
                {cat === 'all' ? 'Tất Cả' : cat}
              </GlassButton>
            ))}
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200 dark:bg-neutral-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl mb-2">📸</p>
            <p className="text-muted-foreground">Chưa có bài viết nào. Hãy quay lại sau!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => {
              const firstMedia = getFirstMedia(post.images_json);
              const thumbnail = post.main_image_url || (firstMedia.type === 'image' ? firstMedia.url : null);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: Math.min(index % 6, 4) * 0.07 }}
                >
                  <LiquidCard className="liquid-card overflow-hidden group h-full">
                    {/* Media Thumbnail */}
                    <div className="relative h-56 w-full overflow-hidden rounded-t-xl -mt-6 -mx-0">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={post.title}
                          fill
                          loading="lazy"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full ${
                          index % 3 === 0 ? 'bg-gradient-to-br from-primary to-amber-600'
                          : index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                          : 'bg-gradient-to-br from-green-500 to-teal-600'
                        } flex items-center justify-center`}>
                          <span className="text-6xl">🍽️</span>
                        </div>
                      )}
                      {/* Video indicator */}
                      {firstMedia.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      )}
                      {post.category && (
                        <span className={`absolute top-4 left-4 px-3 py-1 ${categoryColors[post.category] || 'bg-gray-500'} text-white text-xs font-medium rounded-full`}>
                          {post.category}
                        </span>
                      )}
                    </div>

                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {post.author}
                        </span>
                      </div>
                      <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>

                   
                  </LiquidCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="bg-gradient-to-r from-primary to-amber-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Quan Tâm Đầu Tư?
          </h3>
          <p className="text-sm sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-xl mx-auto">
            Tìm hiểu cơ hội đầu tư vào thương hiệu ẩm thực hiện đại hàng đầu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#investment-section">
              <GlassButton size="lg">Xem Gói Đầu Tư</GlassButton>
            </Link>
            <Link href="/menu">
              <GlassButton size="lg">Xem Thực Đơn</GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterRestaurant />
    </div>
  );
}
