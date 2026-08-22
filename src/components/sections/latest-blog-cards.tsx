"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { motion } from "motion/react"
import { Calendar, ArrowRight } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  main_image_url: string | null
  published_at: string | null
  category: string | null
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.15 },
  }),
}

export function LatestBlogCards() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, main_image_url, published_at, category")
        .order("published_at", { ascending: false })
        .limit(3)

      if (!error && data && data.length > 0) {
        setPosts(data as BlogPost[])
      }
    }
    fetchLatest()
  }, [])

  if (posts.length === 0) return null

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-foreground mb-1">
        📰 Hoạt Động Gần Đây
      </h3>
      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group flex gap-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm p-3 transition-all hover:bg-accent/50 hover:shadow-md hover:border-primary/30"
          >
            {/* Thumbnail */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              {post.main_image_url ? (
                <img
                  src={post.main_image_url}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                  <span className="text-2xl">🍳</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {post.category && (
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary mb-0.5">
                  {post.category}
                </span>
              )}
              <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </motion.div>
      ))}

      {/* View all link */}
      <Link
        href="/blog"
        className="text-sm font-medium text-primary hover:underline text-center mt-1"
      >
        Xem tất cả bài viết →
      </Link>
    </div>
  )
}
