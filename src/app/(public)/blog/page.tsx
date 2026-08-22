"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ChevronRight } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { LiquidCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/liquid-glass-card';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  main_image_url: string | null;
  published_at: string;
  author: string;
  category: string;
}

// Sample blog posts (will be replaced by Supabase data later)
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Tiệc Cưới Tại Biệt Thự Quận 7 - 50 Khách',
    slug: 'tiec-cuoi-quan-7',
    excerpt: 'Một buổi tiệc cưới ấm cúng với thực đơn đặc biệt gồm các món hải sản tươi sống và đặc sản miền Tây...',
    main_image_url: null,
    published_at: '2026-01-15',
    author: 'Nhóm Nấu AFTER HOURS',
    category: 'Tiệc Cưới',
  },
  {
    id: '2',
    title: 'Sinh Nhật Bé Yêu - Thực Đơn Cho Trẻ Em',
    slug: 'sinh-nhat-be-yeu',
    excerpt: 'Tiệc sinh nhật đáng yêu với các món ăn phù hợp cho trẻ em, trang trí theo chủ đề hoạt hình...',
    main_image_url: null,
    published_at: '2026-01-10',
    author: 'Nhóm Nấu AFTER HOURS',
    category: 'Tiệc Sinh Nhật',
  },
  {
    id: '3',
    title: 'Tiệc Công Ty Cuối Năm - 100 Khách',
    slug: 'tiec-cong-ty-cuoi-nam',
    excerpt: 'Buổi tiệc tất niên hoành tráng cho công ty XYZ với thực đơn đa dạng và phong cách phục vụ chuyên nghiệp...',
    main_image_url: null,
    published_at: '2025-12-28',
    author: 'Nhóm Nấu AFTER HOURS',
    category: 'Tiệc Công Ty',
  },
  {
    id: '4',
    title: 'Đám Giỗ Truyền Thống - Ẩm Thực Miền Trung',
    slug: 'dam-gio-truyen-thong',
    excerpt: 'Chuẩn bị mâm cỗ đám giỗ theo phong cách miền Trung với các món truyền thống đậm đà hương vị...',
    main_image_url: null,
    published_at: '2025-12-20',
    author: 'Nhóm Nấu AFTER HOURS',
    category: 'Tiệc Gia Đình',
  },
  {
    id: '5',
    title: 'Tiệc BBQ Ngoài Trời - Villa Thảo Điền',
    slug: 'tiec-bbq-ngoai-troi',
    excerpt: 'Buổi tiệc BBQ vui nhộn bên hồ bơi với các loại thịt nướng hảo hạng và cocktail thơm ngon...',
    main_image_url: null,
    published_at: '2025-12-15',
    author: 'Nhóm Nấu AFTER HOURS',
    category: 'Tiệc Ngoài Trời',
  },
  {
    id: '6',
    title: 'Tân Gia Nhà Mới - Thực Đơn 30 Món',
    slug: 'tan-gia-nha-moi',
    excerpt: 'Tiệc tân gia với đầy đủ các món từ khai vị đến tráng miệng, phục vụ 80 khách mời...',
    main_image_url: null,
    published_at: '2025-12-10',
    author: 'Nhóm Nấu AFTER HOURS',
    category: 'Tiệc Tân Gia',
  },
];

const categoryColors: Record<string, string> = {
  'Tiệc Cưới': 'bg-pink-500',
  'Tiệc Sinh Nhật': 'bg-purple-500',
  'Tiệc Công Ty': 'bg-blue-500',
  'Tiệc Gia Đình': 'bg-green-500',
  'Tiệc Ngoài Trời': 'bg-primary',
  'Tiệc Tân Gia': 'bg-amber-500',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from Supabase
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, main_image_url, published_at, author, category')
        .order('published_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        setPosts(data as BlogPost[]);
      }
      setLoading(false);
    };

    fetchPosts().catch(() => {
      setLoading(false);
    });
  }, []);

  const categories = ['all', ...new Set(posts.map(p => p.category))];
  
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
      {/* Header */}
      <header className="sticky top-16 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm dark:shadow-neutral-900/50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Trang Chủ</span>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[50vw] text-center">Ký Sự Hoạt Động</h1>
            <div className="w-16 sm:w-24"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-10 sm:py-16 px-4 bg-gradient-to-r from-primary to-pink-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Những Khoảnh Khắc Đáng Nhớ
          </h2>
          <p className="text-sm sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Theo dõi hành trình của Nhóm Nấu AFTER HOURS qua những bữa tiệc ấm cúng và đầy yêu thương
          </p>
        </div>
      </section>

      {/* Category Filter */}
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

      {/* Blog Posts Grid */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {loading ? (
          // Skeleton loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200 dark:bg-neutral-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded" />
                  <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: Math.min(index % 6, 4) * 0.07 }}
              >
              <LiquidCard
                className="liquid-card overflow-hidden group h-full"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden rounded-t-xl -mt-6 -mx-0">
                  {post.main_image_url ? (
                    <Image
                      src={post.main_image_url}
                      alt={post.title}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full ${index % 2 === 0 ? 'bg-gradient-to-br from-primary to-pink-500' : 'bg-gradient-to-br from-purple-400 to-blue-500'} flex items-center justify-center`}>
                      <span className="text-6xl">🍳</span>
                    </div>
                  )}
                  <span className={`absolute top-4 left-4 px-3 py-1 ${categoryColors[post.category] || 'bg-gray-500'} text-white text-xs font-medium rounded-full`}>
                    {post.category}
                  </span>
                </div>

                {/* Content */}
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

                <CardFooter>
                  <Link href={`/blog/${post.slug}`}>
                    <GlassButton size="sm" contentClassName="flex items-center gap-1">
                      Xem chi tiết
                      <ChevronRight className="w-4 h-4" />
                    </GlassButton>
                  </Link>
                </CardFooter>
              </LiquidCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-10 sm:mt-16 text-center py-8 sm:py-12 bg-gray-100 dark:bg-neutral-800 rounded-2xl px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">🚀 Sắp Ra Mắt</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base">
            Chúng tôi đang cập nhật thêm nhiều ký sự hoạt động mới. 
            Hãy theo dõi để không bỏ lỡ những câu chuyện thú vị!
          </p>
        </div>
      </main>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="bg-gradient-to-r from-primary to-pink-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Bạn Muốn Tổ Chức Tiệc?
          </h3>
          <p className="text-sm sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-xl mx-auto">
            Liên hệ với chúng tôi ngay để được tư vấn thực đơn phù hợp với sự kiện của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <GlassButton size="lg">
                Xem Thực Đơn
              </GlassButton>
            </Link>
            <Link href="/#booking">
              <GlassButton size="lg">
                Đặt Tiệc Ngay
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
