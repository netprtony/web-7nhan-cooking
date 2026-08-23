"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2, Play } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
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
  body: string | null;
  main_image_url: string | null;
  published_at: string;
  author: string;
  category: string;
  images_json: MediaGroup[] | null;
}

const categoryColors: Record<string, string> = {
  'Hậu Trường': 'bg-amber-600',
  'Sự Kiện': 'bg-blue-500',
  'Đội Ngũ': 'bg-green-600',
  'Khách Hàng': 'bg-pink-500',
  'Phát Triển': 'bg-purple-500',
};

function renderBody(body: string) {
  const lines = body.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3">{trimmed.replace('### ', '')}</h3>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      if (i > 0) elements.push(<h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{trimmed.replace('## ', '')}</h2>);
    } else if (trimmed.startsWith('- ')) {
      const text = trimmed.replace('- ', '');
      const parts = text.split(/(\*\*.*?\*\*)/g);
      listItems.push(
        <li key={i}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
              : <span key={j}>{part}</span>
          )}
        </li>
      );
    } else if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400 bg-accent/50 dark:bg-primary/15 rounded-r-lg">
          {trimmed.replace('> ', '')}
        </blockquote>
      );
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      elements.push(<p key={i} className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{trimmed}</p>);
    }
  });
  flushList();
  return elements;
}

function extractMediaUrls(obj: any): MediaItem[] {
  const items: MediaItem[] = [];
  
  function recurse(current: any) {
    if (!current) return;
    if (typeof current === 'string') {
      const lower = current.toLowerCase();
      if (lower.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) || lower.includes('alt=')) {
        items.push({ image: current });
      } else if (lower.match(/\.(mp4|webm|ogg)$/)) {
        items.push({ video: current });
      } else if (lower.startsWith('http')) {
        // Assume image if it's a URL but no obvious extension
        items.push({ image: current });
      }
      return;
    }
    
    if (Array.isArray(current)) {
      current.forEach(recurse);
      return;
    }
    
    if (typeof current === 'object') {
      // If the object has 'image' or 'video' keys explicitly
      if (current.image && typeof current.image === 'string') {
        items.push({ image: current.image });
      } else if (current.video && typeof current.video === 'string') {
        items.push({ video: current.video });
      } else {
        Object.values(current).forEach(recurse);
      }
    }
  }
  
  recurse(obj);
  return items;
}

function MediaGallery({ imagesJson }: { imagesJson: any }) {
  let parsedData = imagesJson;
  
  if (typeof imagesJson === 'string') {
    try {
      parsedData = JSON.parse(imagesJson);
    } catch (e) {
      console.error('Error parsing images_json:', e);
      return null;
    }
  }

  const allMedia = extractMediaUrls(parsedData);
  if (allMedia.length === 0) return null;

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">📸 Hình Ảnh & Video</h3>
      <div className={`grid gap-3 ${
        allMedia.length === 1 ? 'grid-cols-1' 
        : allMedia.length === 2 ? 'grid-cols-2' 
        : 'grid-cols-2 md:grid-cols-3'
      }`}>
        {allMedia.map((item, idx) => {
          const videoUrl = item.video;
          const imageUrl = item.image;

          return (
            <div key={idx} className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 aspect-video">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Media ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, body, main_image_url, published_at, author, category, images_json')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const postData = data as unknown as BlogPost;
        setPost(postData);
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, main_image_url, published_at, author, category, images_json')
          .eq('category', postData.category)
          .neq('slug', slug)
          .limit(3);
        if (related) setRelatedPosts(related as unknown as BlogPost[]);
      }
      setLoading(false);
    };

    fetchPost().catch(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy bài viết</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Bài viết không tồn tại hoặc đã bị xóa.</p>
        <Link href="/blog">
          <GlassButton size="default" contentClassName="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Image */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-primary to-amber-600">
        {post.main_image_url ? (
          <Image src={post.main_image_url} alt={post.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-30">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="container mx-auto">
            {post.category && (
              <span className={`inline-block px-3 py-1 ${categoryColors[post.category] || 'bg-gray-500'} text-white text-xs font-medium rounded-full mb-3`}>
                {post.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.published_at)}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed border-b border-gray-200 dark:border-neutral-700 pb-8">
            {post.excerpt}
          </p>

          {/* Media Gallery from images_json */}
          {post.images_json && post.images_json.length > 0 && (
            <MediaGallery imagesJson={post.images_json} />
          )}

          {/* Body content */}
          <div className="prose-content">
            {post.body ? renderBody(post.body) : (
              <p className="text-gray-500 dark:text-gray-400 italic">Nội dung chi tiết đang được cập nhật...</p>
            )}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <Link href="/blog">
                <GlassButton size="sm" contentClassName="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </GlassButton>
              </Link>
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
                <Share2 className="w-4 h-4" /> Chia sẻ
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
                <div className="group bg-white dark:bg-neutral-800/50 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-40 w-full">
                    {related.main_image_url ? (
                      <Image src={related.main_image_url} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className={`w-full h-full ${index % 2 === 0 ? 'bg-gradient-to-br from-primary to-amber-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center`}>
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {related.category && (
                      <span className={`inline-block px-2 py-0.5 ${categoryColors[related.category] || 'bg-gray-500'} text-white text-xs rounded-full mb-2`}>{related.category}</span>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">{related.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(related.published_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <FooterRestaurant />
    </div>
  );
}
