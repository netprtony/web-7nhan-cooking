-- =============================================
-- Supabase Migration: 7Nhan Cooking Database
-- Chuyển đổi từ Sanity sang Supabase
-- =============================================

-- Bật extension uuid nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Bảng: menu_items (Thực đơn)
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('appetizer','main_course','sharing_plate','dessert')),
  price INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,  -- URL ảnh từ Supabase Storage hoặc URL bên ngoài
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Bảng: blog_posts (Bài viết / Ký sự hoạt động)
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  main_image_url TEXT,  -- URL ảnh chính
  gallery TEXT[],       -- Mảng URL ảnh gallery
  published_at TIMESTAMPTZ,
  author TEXT NOT NULL DEFAULT 'Nhóm Nấu 7Nhân',
  category TEXT CHECK (category IN ('Tiệc Cưới', 'Tiệc Sinh Nhật', 'Tiệc Công Ty', 'Tiệc Gia Đình', 'Tiệc Ngoài Trời', 'Tiệc Tân Gia')),
  guest_count INTEGER,
  location TEXT,
  body TEXT,  -- Nội dung bài viết (HTML hoặc Markdown)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- =============================================
-- Trigger: tự động cập nhật updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: cho phép mọi người đọc (public read)
CREATE POLICY "Allow public read on menu_items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on blog_posts" ON blog_posts
  FOR SELECT USING (true);

-- Policy: chỉ authenticated users mới được ghi (admin)
CREATE POLICY "Allow authenticated insert on menu_items" ON menu_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on menu_items" ON menu_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on menu_items" ON menu_items
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on blog_posts" ON blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on blog_posts" ON blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- Dữ liệu mẫu (Sample Data)
-- =============================================
INSERT INTO menu_items (title, category, price, description, image_url, is_available) VALUES
  ('Gỏi Cuốn Tôm Thịt', 'appetizer', 45000, 'Gỏi cuốn tươi với tôm, thịt heo, rau sống và bún', NULL, true),
  ('Chả Giò Rế', 'appetizer', 55000, 'Chả giò giòn rụm theo kiểu truyền thống miền Nam', NULL, true),
  ('Bò Lúc Lắc', 'main', 180000, 'Bò Úc xào với ớt chuông, hành tây trên lửa lớn', NULL, true),
  ('Gà Nướng Muối Ớt', 'main', 250000, 'Gà ta nướng than hoa tẩm muối ớt đặc biệt', NULL, true),
  ('Tôm Hùm Nướng Bơ Tỏi', 'seafood', 850000, 'Tôm hùm Alaska nướng bơ tỏi thơm lừng', NULL, true),
  ('Cua Rang Me', 'seafood', 450000, 'Cua thịt rang me chua ngọt kiểu Sài Gòn', NULL, true),
  ('Lẩu Thái Hải Sản', 'hotpot', 350000, 'Lẩu Thái chua cay với tôm, mực, cá hồi và rau', NULL, true),
  ('Chè Khúc Bạch', 'dessert', 35000, 'Chè khúc bạch thanh mát với trái cây tươi', NULL, true)
ON CONFLICT DO NOTHING;

INSERT INTO blog_posts (title, slug, excerpt, published_at, author, category, guest_count, location) VALUES
  ('Tiệc Cưới Tại Biệt Thự Quận 7 - 50 Khách', 'tiec-cuoi-quan-7', 'Một buổi tiệc cưới ấm cúng với thực đơn đặc biệt gồm các món hải sản tươi sống và đặc sản miền Tây...', '2026-01-15T00:00:00Z', 'Nhóm Nấu 7Nhân', 'Tiệc Cưới', 50, 'Quận 7, TP.HCM'),
  ('Sinh Nhật Bé Yêu - Thực Đơn Cho Trẻ Em', 'sinh-nhat-be-yeu', 'Tiệc sinh nhật đáng yêu với các món ăn phù hợp cho trẻ em, trang trí theo chủ đề hoạt hình...', '2026-01-10T00:00:00Z', 'Nhóm Nấu 7Nhân', 'Tiệc Sinh Nhật', 30, 'Quận 2, TP.HCM'),
  ('Tiệc Công Ty Cuối Năm - 100 Khách', 'tiec-cong-ty-cuoi-nam', 'Buổi tiệc tất niên hoành tráng cho công ty XYZ với thực đơn đa dạng và phong cách phục vụ chuyên nghiệp...', '2025-12-28T00:00:00Z', 'Nhóm Nấu 7Nhân', 'Tiệc Công Ty', 100, 'Quận 1, TP.HCM'),
  ('Đám Giỗ Truyền Thống - Ẩm Thực Miền Trung', 'dam-gio-truyen-thong', 'Chuẩn bị mâm cỗ đám giỗ theo phong cách miền Trung với các món truyền thống đậm đà hương vị...', '2025-12-20T00:00:00Z', 'Nhóm Nấu 7Nhân', 'Tiệc Gia Đình', 40, 'Bình Thạnh, TP.HCM'),
  ('Tiệc BBQ Ngoài Trời - Villa Thảo Điền', 'tiec-bbq-ngoai-troi', 'Buổi tiệc BBQ vui nhộn bên hồ bơi với các loại thịt nướng hảo hạng và cocktail thơm ngon...', '2025-12-15T00:00:00Z', 'Nhóm Nấu 7Nhân', 'Tiệc Ngoài Trời', 60, 'Thảo Điền, TP.HCM'),
  ('Tân Gia Nhà Mới - Thực Đơn 30 Món', 'tan-gia-nha-moi', 'Tiệc tân gia với đầy đủ các món từ khai vị đến tráng miệng, phục vụ 80 khách mời...', '2025-12-10T00:00:00Z', 'Nhóm Nấu 7Nhân', 'Tiệc Tân Gia', 80, 'Gò Vấp, TP.HCM')
ON CONFLICT DO NOTHING;

-- =============================================
-- Tạo Storage Bucket cho ảnh (chạy trong Supabase Dashboard > Storage)
-- Lưu ý: Phần này không chạy được bằng SQL, cần tạo thủ công:
-- 1. Vào Supabase Dashboard > Storage
-- 2. Tạo bucket "images" (public)
-- 3. Upload ảnh vào thư mục: images/menu/ và images/blog/
-- =============================================
