"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  main_image_url: string | null;
  published_at: string;
  author: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  'Tiệc Cưới': 'bg-pink-500',
  'Tiệc Sinh Nhật': 'bg-purple-500',
  'Tiệc Công Ty': 'bg-blue-500',
  'Tiệc Gia Đình': 'bg-green-500',
  'Tiệc Ngoài Trời': 'bg-orange-500',
  'Tiệc Tân Gia': 'bg-amber-500',
};

// Sample posts data (same as blog listing page, used as fallback)
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Tiệc Cưới Tại Biệt Thự Quận 7 - 50 Khách',
    slug: 'tiec-cuoi-quan-7',
    excerpt: 'Một buổi tiệc cưới ấm cúng với thực đơn đặc biệt gồm các món hải sản tươi sống và đặc sản miền Tây...',
    content: `## Tiệc Cưới Tại Biệt Thự Quận 7

Một buổi tiệc cưới ấm cúng với thực đơn đặc biệt gồm các món hải sản tươi sống và đặc sản miền Tây. Đội ngũ đầu bếp của Nhóm Nấu 7Nhân đã chuẩn bị chu đáo từng món ăn với nguyên liệu tươi ngon nhất.

### Thực Đơn Tiệc

- **Khai vị**: Gỏi ngó sen tôm thịt, Chả giò hải sản
- **Món chính**: Tôm hùm hấp bia, Cá chẽm hấp Hồng Kông, Gà nướng mật ong
- **Lẩu**: Lẩu thái hải sản chua cay
- **Tráng miệng**: Chè khúc bạch, Trái cây tươi

### Không Gian Tiệc

Tiệc được tổ chức trong khuôn viên biệt thự rộng rãi với trang trí hoa tươi theo tông trắng - hồng pastel. Âm nhạc nhẹ nhàng tạo không khí lãng mạn cho buổi tiệc.

### Phản Hồi Khách Hàng

> "Đồ ăn rất ngon, phục vụ chuyên nghiệp. Gia đình tôi rất hài lòng!" - Anh Minh & Chị Hương`,
    main_image_url: null,
    published_at: '2026-01-15',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Cưới',
  },
  {
    id: '2',
    title: 'Sinh Nhật Bé Yêu - Thực Đơn Cho Trẻ Em',
    slug: 'sinh-nhat-be-yeu',
    excerpt: 'Tiệc sinh nhật đáng yêu với các món ăn phù hợp cho trẻ em, trang trí theo chủ đề hoạt hình...',
    content: `## Sinh Nhật Bé Yêu

Tiệc sinh nhật đáng yêu với các món ăn phù hợp cho trẻ em, trang trí theo chủ đề hoạt hình yêu thích của bé.

### Thực Đơn Đặc Biệt Cho Bé

- **Khai vị**: Bánh mì nướng bơ tỏi mini, Súp bí đỏ kem
- **Món chính**: Gà chiên giòn, Mì Ý sốt cà chua, Pizza homemade
- **Tráng miệng**: Bánh sinh nhật 3 tầng, Pudding trái cây, Kem gelato

### Hoạt Động Vui Nhộn

Ngoài phần ẩm thực, đội ngũ 7Nhân còn hỗ trợ tổ chức các trò chơi nhỏ cho các bé và phần thổi nến sinh nhật đáng nhớ.

### Lời Chia Sẻ

> "Bé nhà mình thích lắm, nhất là món gà chiên và bánh kem. Các chú đầu bếp rất thân thiện!" - Chị Mai`,
    main_image_url: null,
    published_at: '2026-01-10',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Sinh Nhật',
  },
  {
    id: '3',
    title: 'Tiệc Công Ty Cuối Năm - 100 Khách',
    slug: 'tiec-cong-ty-cuoi-nam',
    excerpt: 'Buổi tiệc tất niên hoành tráng cho công ty XYZ với thực đơn đa dạng và phong cách phục vụ chuyên nghiệp...',
    content: `## Tiệc Tất Niên Công Ty

Buổi tiệc tất niên hoành tráng phục vụ 100 khách mời với thực đơn đa dạng từ món Việt truyền thống đến món Âu hiện đại.

### Thực Đơn 10 Bàn

- **Khai vị**: Nộm bò bóp thấu, Tôm cocktail sốt chanh dây
- **Món chính**: Bò wagyu nướng đá, Cá hồi áp chảo, Vịt quay Bắc Kinh
- **Hải sản**: Ghẹ hấp bia, Mực nướng sa tế
- **Lẩu**: Lẩu riêu cua Bắc
- **Tráng miệng**: Bánh flan caramel, Trái cây tổng hợp

### Highlights

Tiệc được tổ chức trong không gian nhà hàng riêng với sân khấu mini, âm thanh ánh sáng chuyên nghiệp cho các tiết mục văn nghệ và bốc thăm may mắn.`,
    main_image_url: null,
    published_at: '2025-12-28',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Công Ty',
  },
  {
    id: '4',
    title: 'Đám Giỗ Truyền Thống - Ẩm Thực Miền Trung',
    slug: 'dam-gio-truyen-thong',
    excerpt: 'Chuẩn bị mâm cỗ đám giỗ theo phong cách miền Trung với các món truyền thống đậm đà hương vị...',
    content: `## Đám Giỗ Truyền Thống Miền Trung

Mâm cỗ đám giỗ chuẩn phong cách miền Trung với các món truyền thống đậm đà hương vị quê nhà.

### Mâm Cỗ Truyền Thống

- **Mâm cúng**: Gà luộc lá chanh, Xôi gấc, Chả ram tôm đất
- **Món chính**: Bún bò Huế, Bánh bèo chén, Nem lụi Huế
- **Món phụ**: Bánh nậm, Bánh bột lọc, Cơm hến
- **Tráng miệng**: Chè bắp Huế, Bánh phu thê

### Ý Nghĩa

Đội ngũ 7Nhân hiểu rõ tầm quan trọng của mâm cỗ đám giỗ trong văn hóa Việt Nam. Mỗi món ăn đều được chuẩn bị tỉ mỉ, giữ nguyên hương vị truyền thống.

> "Mâm cỗ đẹp, đúng phong tục miền Trung. Cảm ơn đội ngũ 7Nhân rất nhiều!" - Cô Thanh`,
    main_image_url: null,
    published_at: '2025-12-20',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Gia Đình',
  },
  {
    id: '5',
    title: 'Tiệc BBQ Ngoài Trời - Villa Thảo Điền',
    slug: 'tiec-bbq-ngoai-troi',
    excerpt: 'Buổi tiệc BBQ vui nhộn bên hồ bơi với các loại thịt nướng hảo hạng và cocktail thơm ngon...',
    content: `## Tiệc BBQ Ngoài Trời

Buổi tiệc BBQ pool party tại Villa Thảo Điền với không gian ngoài trời thoáng đãng và thực đơn nướng đặc sắc.

### Thực Đơn BBQ

- **Thịt nướng**: Sườn bò Mỹ, Thăn heo Iberico, Cánh gà teriyaki
- **Hải sản nướng**: Tôm sú nướng muối ớt, Bạch tuộc nướng sa tế, Sò điệp nướng phô mai
- **Salad & Side**: Caesar salad, Khoai tây nướng, Bắp nướng bơ
- **Đồ uống**: Cocktail trái cây, Smoothie nhiệt đới, Bia craft

### Trải Nghiệm

Đội ngũ đầu bếp 7Nhân trực tiếp nướng tại chỗ (live station), khách mời có thể tùy chọn độ chín và gia vị theo sở thích.

> "Tiệc BBQ tuyệt vời! Thịt nướng mềm, hải sản tươi. Party pools + BBQ = combo hoàn hảo!" - Anh Đức`,
    main_image_url: null,
    published_at: '2025-12-15',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Ngoài Trời',
  },
  {
    id: '6',
    title: 'Tân Gia Nhà Mới - Thực Đơn 30 Món',
    slug: 'tan-gia-nha-moi',
    excerpt: 'Tiệc tân gia với đầy đủ các món từ khai vị đến tráng miệng, phục vụ 80 khách mời...',
    content: `## Tiệc Tân Gia Nhà Mới

Tiệc tân gia hoành tráng phục vụ 80 khách mời với thực đơn 30 món đa dạng, đánh dấu cột mốc đáng nhớ của gia đình.

### Thực Đơn Nổi Bật

- **Khai vị**: 5 món gỏi & nộm đặc sắc
- **Hải sản**: Tôm hùm, Cua hoàng đế, Bào ngư
- **Món chính**: 10 món từ gà, bò, heo, vịt
- **Lẩu**: 3 loại lẩu khác nhau
- **Tráng miệng**: 5 loại chè và bánh ngọt

### Quy Mô Phục Vụ

8 bàn tiệc, mỗi bàn 10 khách. Đội ngũ phục vụ 6 người đảm bảo mọi khách mời đều được chăm sóc chu đáo.

> "Tiệc tân gia nhà mình rất hoàn hảo. 80 khách mà ai cũng khen đồ ăn ngon. Cảm ơn 7Nhân!" - Chú Hùng`,
    main_image_url: null,
    published_at: '2025-12-10',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Tân Gia',
  },
];

// Simple markdown-like renderer
function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      flushList();
      // Skip the main title (usually repeated)
      if (i > 0) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('- ')) {
      inList = true;
      const text = trimmed.replace('- ', '');
      // Handle **bold** in list items
      const parts = text.split(/(\*\*.*?\*\*)/g);
      listItems.push(
        <li key={i}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j} className="text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </li>
      );
    } else if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="border-l-4 border-orange-500 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400 bg-orange-50/50 dark:bg-orange-950/20 rounded-r-lg">
          {trimmed.replace('> ', '')}
        </blockquote>
      );
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
          {trimmed}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      // Try Supabase first
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, main_image_url, published_at, author, category')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const postData = data as unknown as BlogPost;
        setPost(postData);
        // Fetch related posts
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, main_image_url, published_at, author, category')
          .eq('category', postData.category)
          .neq('slug', slug)
          .limit(3);
        if (related) setRelatedPosts(related as unknown as BlogPost[]);
      } else {
        // Fallback to sample data
        const found = samplePosts.find((p) => p.slug === slug);
        if (found) {
          setPost(found);
          setRelatedPosts(
            samplePosts.filter((p) => p.category === found.category && p.slug !== slug).slice(0, 3)
          );
        }
      }
      setLoading(false);
    };

    fetchPost().catch(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy bài viết</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/blog">
          <GlassButton size="default" contentClassName="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại Ký Sự
          </GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm dark:shadow-neutral-900/50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Ký Sự</span>
            </Link>
            <div className="w-16 sm:w-24"></div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-orange-500 to-pink-500">
        {post.main_image_url ? (
          <Image
            src={post.main_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-30">🍳</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="container mx-auto">
            <span className={`inline-block px-3 py-1 ${categoryColors[post.category] || 'bg-gray-500'} text-white text-xs font-medium rounded-full mb-3`}>
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                5 phút đọc
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed border-b border-gray-200 dark:border-neutral-700 pb-8">
            {post.excerpt}
          </p>

          {/* Main Content */}
          <div className="prose-content">
            {post.content ? (
              renderContent(post.content)
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Nội dung chi tiết đang được cập nhật...
              </p>
            )}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Chia sẻ bài viết này</p>
              <GlassButton
                size="sm"
                contentClassName="flex items-center gap-2"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </GlassButton>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 py-8 sm:py-12 border-t border-gray-200 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bài Viết Liên Quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedPosts.map((related, index) => (
              <Link key={related.id} href={`/blog/${related.slug}`}>
                <div className="group bg-white dark:bg-neutral-800/50 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 hover:shadow-lg dark:hover:shadow-neutral-900/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-40 w-full">
                    {related.main_image_url ? (
                      <Image
                        src={related.main_image_url}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full ${index % 2 === 0 ? 'bg-gradient-to-br from-orange-400 to-pink-500' : 'bg-gradient-to-br from-purple-400 to-blue-500'} flex items-center justify-center`}>
                        <span className="text-4xl">🍳</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`inline-block px-2 py-0.5 ${categoryColors[related.category] || 'bg-gray-500'} text-white text-xs rounded-full mb-2`}>
                      {related.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(related.published_at)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">
            Bạn Muốn Tổ Chức Tiệc Tương Tự?
          </h3>
          <p className="text-sm sm:text-lg opacity-90 mb-6 max-w-xl mx-auto">
            Liên hệ ngay để được tư vấn thực đơn và báo giá phù hợp
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
