"use client";

import { useEffect, useState } from 'react';
import { client, urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: any;
  publishedAt: string;
  author: string;
  category: string;
}

// Sample blog posts (will be replaced by Sanity data later)
const samplePosts: BlogPost[] = [
  {
    _id: '1',
    title: 'Tiệc Cưới Tại Biệt Thự Quận 7 - 50 Khách',
    slug: { current: 'tiec-cuoi-quan-7' },
    excerpt: 'Một buổi tiệc cưới ấm cúng với thực đơn đặc biệt gồm các món hải sản tươi sống và đặc sản miền Tây...',
    mainImage: null,
    publishedAt: '2026-01-15',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Cưới',
  },
  {
    _id: '2',
    title: 'Sinh Nhật Bé Yêu - Thực Đơn Cho Trẻ Em',
    slug: { current: 'sinh-nhat-be-yeu' },
    excerpt: 'Tiệc sinh nhật đáng yêu với các món ăn phù hợp cho trẻ em, trang trí theo chủ đề hoạt hình...',
    mainImage: null,
    publishedAt: '2026-01-10',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Sinh Nhật',
  },
  {
    _id: '3',
    title: 'Tiệc Công Ty Cuối Năm - 100 Khách',
    slug: { current: 'tiec-cong-ty-cuoi-nam' },
    excerpt: 'Buổi tiệc tất niên hoành tráng cho công ty XYZ với thực đơn đa dạng và phong cách phục vụ chuyên nghiệp...',
    mainImage: null,
    publishedAt: '2025-12-28',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Công Ty',
  },
  {
    _id: '4',
    title: 'Đám Giỗ Truyền Thống - Ẩm Thực Miền Trung',
    slug: { current: 'dam-gio-truyen-thong' },
    excerpt: 'Chuẩn bị mâm cỗ đám giỗ theo phong cách miền Trung với các món truyền thống đậm đà hương vị...',
    mainImage: null,
    publishedAt: '2025-12-20',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Gia Đình',
  },
  {
    _id: '5',
    title: 'Tiệc BBQ Ngoài Trời - Villa Thảo Điền',
    slug: { current: 'tiec-bbq-ngoai-troi' },
    excerpt: 'Buổi tiệc BBQ vui nhộn bên hồ bơi với các loại thịt nướng hảo hạng và cocktail thơm ngon...',
    mainImage: null,
    publishedAt: '2025-12-15',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Ngoài Trời',
  },
  {
    _id: '6',
    title: 'Tân Gia Nhà Mới - Thực Đơn 30 Món',
    slug: { current: 'tan-gia-nha-moi' },
    excerpt: 'Tiệc tân gia với đầy đủ các món từ khai vị đến tráng miệng, phục vụ 80 khách mời...',
    mainImage: null,
    publishedAt: '2025-12-10',
    author: 'Nhóm Nấu 7Nhân',
    category: 'Tiệc Tân Gia',
  },
];

const categoryColors: Record<string, string> = {
  'Tiệc Cưới': 'bg-pink-500',
  'Tiệc Sinh Nhật': 'bg-purple-500',
  'Tiệc Công Ty': 'bg-blue-500',
  'Tiệc Gia Đình': 'bg-green-500',
  'Tiệc Ngoài Trời': 'bg-orange-500',
  'Tiệc Tân Gia': 'bg-amber-500',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from Sanity first
    const query = `*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author,
      category
    }`;
    
    client.fetch(query).then((data) => {
      if (data && data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    }).catch(() => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Trang Chủ</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Ký Sự Hoạt Động</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Những Khoảnh Khắc Đáng Nhớ
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Theo dõi hành trình của Nhóm Nấu 7Nhân qua những bữa tiệc ấm cúng và đầy yêu thương
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
              className={`flex-shrink-0 ${selectedCategory === cat ? 'ring-2 ring-orange-500' : ''}`}
            >
              {cat === 'all' ? 'Tất Cả' : cat}
            </GlassButton>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={post._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).width(600).height(400).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full ${index % 2 === 0 ? 'bg-gradient-to-br from-orange-400 to-pink-500' : 'bg-gradient-to-br from-purple-400 to-blue-500'} flex items-center justify-center`}>
                      <span className="text-6xl">🍳</span>
                    </div>
                  )}
                  <span className={`absolute top-4 left-4 px-3 py-1 ${categoryColors[post.category] || 'bg-gray-500'} text-white text-xs font-medium rounded-full`}>
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <GlassButton size="sm" contentClassName="flex items-center gap-1">
                    Xem chi tiết
                    <ChevronRight className="w-4 h-4" />
                  </GlassButton>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-16 text-center py-12 bg-gray-100 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">🚀 Sắp Ra Mắt</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Chúng tôi đang cập nhật thêm nhiều ký sự hoạt động mới. 
            Hãy theo dõi để không bỏ lỡ những câu chuyện thú vị!
          </p>
        </div>
      </main>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Bạn Muốn Tổ Chức Tiệc?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
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
