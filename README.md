# 🍽️ Dịch Vụ Nấu Ăn Bảy Nhân - Website Đặt Tiệc Tại Gia

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)

## 📖 Giới Thiệu

**Bảy Nhân** là website dịch vụ nấu ăn chuyên nghiệp, chuyên tổ chức các loại tiệc tại gia với hơn 20 năm kinh nghiệm. Website cung cấp giải pháp đặt tiệc toàn diện với các tính năng hiện đại:

- 🎉 **Đặt tiệc tại gia**: Cưới hỏi, sinh nhật, liên hoan, hội nghị
- 📋 **Thực đơn đa dạng**: Hơn 100 món ăn từ khai vị đến tráng miệng
- 🛒 **Giỏ hàng thông minh**: Lưu trữ tự động, không mất dữ liệu khi reload
- 📱 **Responsive Design**: Tối ưu cho mọi thiết bị
- 🌙 **Dark Mode**: Hỗ trợ chế độ sáng/tối
- ⚡ **Performance**: Lazy loading, code splitting, tối ưu hình ảnh

## ✨ Tính Năng Chính

### 🏠 Trang Chủ (Landing Page)
- **Hero Section**: Scroll expansion với hiệu ứng parallax
- **Thực đơn cuộn tự động**: 2 hàng món ăn cuộn ngược chiều với `scroll-based-velocity`
- **Why Choose Us**: Cards giới thiệu điểm mạnh của dịch vụ
- **Bảng giá tiệc**: 3 gói tiệc khác nhau (Tiệc Tiết Kiệm, Tiệc Chuẩn, Tiệc VIP)
- **Footer**: Form đăng ký nhận thông tin, liên hệ nhanh

### 🍲 Trang Thực Đơn (`/menu`)
- Danh sách món ăn phân loại theo danh mục
- Tìm kiếm và lọc theo:
  - Danh mục (Khai vị, Món chính, Hải sản, Đặc sản, Lẩu & Súp, Tráng miệng)
  - Giá tiền
  - Tên món
- Click vào món để xem chi tiết
- Modal chi tiết món với:
  - Hình ảnh món ăn
  - Mô tả đầy đủ
  - Giá cả
  - Nút thêm vào giỏ hàng với số lượng

### 🛒 Giỏ Hàng (Cart)
- **Sidebar cart**: Mở/đóng mượt mà
- **LocalStorage persistence**: Giỏ hàng không bị mất khi reload/refresh
- **Quản lý món**: Thêm, xóa, tăng/giảm số lượng
- **Tổng tiền**: Tính tự động theo thời gian thực
- **SSR-safe**: Không lỗi hydration mismatch

### 📝 Blog / Ký Sự Hoạt Động (`/blog`)
- Hiển thị các bài viết về tiệc đã tổ chức
- Phân loại theo:
  - Tiệc Cưới
  - Tiệc Sinh Nhật
  - Tiệc Công Ty
  - Tiệc Gia Đình
  - Tiệc Ngoài Trời
  - Tiệc Tân Gia
- Chi tiết bài viết với gallery ảnh

### 📧 Đặt Tiệc (Booking Modal)
- Form đặt tiệc với EmailJS integration
- Các trường thông tin:
  - Tên khách hàng
    - Email
  - Số điện thoại
  - Loại tiệc
  - Số lượng bàn
  - Ngày tổ chức
  - Ghi chú đặc biệt
- Gửi thông tin trực tiếp qua email

## 🛠️ Công Nghệ Sử Dụng

### Core Framework
- **Next.js 16.1.6** - React framework với App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/container-queries** - Container queries support
- **tw-animate-css** - Animation utilities
- **Radix UI** - Headless UI components:
  - Checkbox, Label, Slot, Switch, Tabs, Tooltip

### Animations & Effects
- **Framer Motion 12** - Animation library
- **@paper-design/shaders-react** - Shader effects
- **lucide-react** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Row Level Security (RLS)
  - Storage cho hình ảnh
  - Real-time subscriptions (optional)

### Additional Libraries
- **@emailjs/browser** - Email service integration
- **next-themes** - Dark mode support
- **clsx + tailwind-merge** - Conditional styling
- **class-variance-authority** - Component variants

### Development Tools
- **ESLint** - Code linting
- **eslint-config-next** - Next.js ESLint config
- **babel-plugin-react-compiler** - React compiler

## 📁 Cấu Trúc Dự Án

```
web-7nhan-cooking/
├── public/                      # Static assets
│   ├── assets/
│   │   ├── bgImageSrc/         # Background images
│   │   ├── mediaSrc/           # Media files
│   │   └── default_food.webp   # Default food image
│   ├── fonts/                   # Custom fonts
│   └── main_logo.png           # Logo
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── blog/               # Blog pages
│   │   │   └── [slug]/        # Dynamic blog post
│   │   ├── menu/               # Menu page
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/
│   │   ├── sections/           # Page sections
│   │   │   ├── hero-banquet.tsx
│   │   │   ├── scroll-velocity-food.tsx
│   │   │   └── latest-blog-cards.tsx
│   │   ├── ui/                 # UI components
│   │   │   ├── animated-footer.tsx
│   │   │   ├── animated-tab-bar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── food-detail-modal.tsx
│   │   │   ├── footer-section.tsx
│   │   │   ├── glass-button.tsx
│   │   │   ├── hero-section-event.tsx
│   │   │   ├── input.tsx
│   │   │   ├── interactive-image-accordion.tsx
│   │   │   ├── label.tsx
│   │   │   ├── liquid-glass-card.tsx
│   │   │   ├── loading-screen.tsx
│   │   │   ├── number-ticker.tsx
│   │   │   ├── pricing-table-banquet.tsx
│   │   │   ├── scroll-based-velocity.tsx
│   │   │   ├── scroll-expansion-hero.tsx
│   │   │   ├── scroll-morph-hero.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── text-animate.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── why-choose-us-cards.tsx
│   │   ├── examples/           # Example components
│   │   ├── booking-modal.tsx   # Booking modal
│   │   ├── cart-sidebar.tsx    # Cart sidebar
│   │   ├── global-header.tsx   # Global header
│   │   └── scroll-expansion-hero.tsx
│   │
│   ├── context/                # React Context
│   │   ├── cart-context.tsx    # Cart state management
│   │   └── cart-ui-context.tsx # Cart UI state
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── use-cart.ts         # Cart hook with localStorage
│   │
│   ├── lib/                    # Utilities
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Utility functions
│   │
│   └── types/                  # TypeScript types
│       ├── food.ts             # Food item types
│       ├── pricing.ts          # Pricing types
│       └── supabase.ts         # Supabase database types
│
├── supabase/
│   └── migration.sql           # Database schema
│
├── .gitignore
├── components.json             # shadcn/ui + MagicUI config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── vercel.json                 # Vercel deployment config
```

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js**: 20.x trở lên
- **npm**: 10.x trở lên (hoặc yarn, pnpm, bun)
- **Supabase Account**: Để cấu hình database và storage

### 1. Clone Repository

```bash
git clone https://github.com/netprtony/web-7nhan-cooking.git
cd web-7nhan-cooking
```

### 2. Cài Đặt Dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
# hoặc
bun install
```

### 3. Cấu Hình Environment Variables

Tạo file `.env.local` trong thư mục root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS (cho booking form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

**Lấy thông tin Supabase:**
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Tạo project mới (hoặc chọn project có sẵn)
3. Vào **Settings** → **API**
4. Copy `Project URL` và `anon/public key`

**Lấy thông tin EmailJS:**
1. Truy cập [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Tạo email service (Gmail, Outlook, v.v.)
3. Tạo email template
4. Copy Service ID, Template ID, và Public Key

### 4. Thiết Lập Database (Supabase)

#### Bước 1: Chạy Migration SQL

1. Truy cập Supabase Dashboard → **SQL Editor**
2. Tạo query mới
3. Copy nội dung file `supabase/migration.sql`
4. Chạy query để tạo tables và data mẫu

#### Bước 2: Tạo Storage Bucket

1. Vào **Storage** → **Create bucket**
2. Tên bucket: `images`
3. Chọn **Public bucket** để có thể truy cập công khai
4. Tạo thư mục con:
   - `images/menu/` - Cho ảnh món ăn
   - `images/blog/` - Cho ảnh bài viết

#### Bước 3: Upload Ảnh (Optional)

Upload ảnh món ăn và blog vào bucket `images`. Update `image_url` trong database:

```sql
-- Ví dụ update ảnh món ăn
UPDATE menu_items
SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/images/menu/ga-nuong.jpg'
WHERE title = 'Gà Nướng Muối Ớt';
```

### 5. Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
# hoặc
bun dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

## 📦 Build & Deploy

### Build cho Production

```bash
npm run build
npm run start
```

### Deploy lên Vercel (Khuyên dùng)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/netprtony/web-7nhan-cooking)

**Hướng dẫn deploy thủ công:**

1. Đăng ký tài khoản [Vercel](https://vercel.com)
2. Cài đặt Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Đăng nhập:
   ```bash
   vercel login
   ```
4. Deploy:
   ```bash
   vercel
   ```
5. Thêm Environment Variables trên Vercel Dashboard:
   - Vào **Project Settings** → **Environment Variables**
   - Thêm tất cả biến trong `.env.local`

### Deploy lên Netlify

1. Kết nối repository với Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Framework: Next.js
3. Thêm Environment Variables trong Netlify dashboard

## 🔧 Scripts Có Sẵn

```bash
# Development
npm run dev          # Chạy dev server (http://localhost:3000)

# Production
npm run build        # Build production
npm run start        # Chạy production server

# Linting
npm run lint         # Chạy ESLint để check code quality
```

## 🗄️ Database Schema

### Table: `menu_items`

| Column        | Type        | Description                           |
|---------------|-------------|---------------------------------------|
| id            | UUID        | Primary key                          |
| title         | TEXT        | Tên món ăn                           |
| category      | TEXT        | Danh mục (appetizer, main, seafood...) |
| price         | INTEGER     | Giá tiền (VND)                       |
| description   | TEXT        | Mô tả món ăn                         |
| image_url     | TEXT        | URL hình ảnh                         |
| is_available  | BOOLEAN     | Còn phục vụ hay không                |
| created_at    | TIMESTAMPTZ | Thời gian tạo                        |
| updated_at    | TIMESTAMPTZ | Thời gian cập nhật                   |

**Categories:**
- `appetizer` - Món Khai Vị
- `main` - Món Chính
- `seafood` - Hải Sản
- `specialty` - Đặc Sản
- `hotpot` - Lẩu & Súp
- `dessert` - Tráng Miệng

### Table: `blog_posts`

| Column          | Type        | Description                           |
|-----------------|-------------|---------------------------------------|
| id              | UUID        | Primary key                          |
| title           | TEXT        | Tiêu đề bài viết                     |
| slug            | TEXT        | URL slug (unique)                    |
| excerpt         | TEXT        | Tóm tắt                              |
| main_image_url  | TEXT        | Ảnh chính                            |
| gallery         | TEXT[]      | Mảng URL ảnh gallery                 |
| published_at    | TIMESTAMPTZ | Ngày xuất bản                        |
| author          | TEXT        | Tác giả                              |
| category        | TEXT        | Loại tiệc                            |
| guest_count     | INTEGER     | Số khách                             |
| location        | TEXT        | Địa điểm tổ chức                     |
| body            | TEXT        | Nội dung bài viết (HTML/Markdown)    |
| created_at      | TIMESTAMPTZ | Thời gian tạo                        |
| updated_at      | TIMESTAMPTZ | Thời gian cập nhật                   |

**Blog Categories:**
- `Tiệc Cưới`
- `Tiệc Sinh Nhật`
- `Tiệc Công Ty`
- `Tiệc Gia Đình`
- `Tiệc Ngoài Trời`
- `Tiệc Tân Gia`

## 🎨 Customization

### Thay Đổi Màu Sắc (Theme)

Chỉnh sửa file `src/app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 28 80% 52%;        /* Orange theme */
    --primary-foreground: 0 0% 98%;
    /* ... các màu khác */
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    /* ... các màu dark mode */
  }
}
```

### Thay Đổi Font

Chỉnh sửa `src/app/layout.tsx` để thêm Google Fonts hoặc custom fonts.

### Thêm Components từ shadcn/ui

```bash
npx shadcn@latest add <component-name>
```

### Thêm Components từ MagicUI

```bash
npx magicui-cli@latest add <component-name>
```

## 🐛 Troubleshooting

### Lỗi Hydration Mismatch với Cart

**Nguyên nhân:** localStorage không tồn tại khi server-side rendering.

**Giải pháp:** Hook `useCart` đã được implement với lazy initialization và hydration flag:

```typescript
const [items, setItems] = useState<CartItem[]>([])
const [hydrated, setHydrated] = useState(false)

useEffect(() => {
  setItems(readCart())  // Load từ localStorage
  setHydrated(true)
}, [])
```

### Lỗi Supabase Connection

1. Kiểm tra `.env.local` có đúng thông tin
2. Verify RLS policies trong Supabase Dashboard
3. Check API keys còn active

### Ảnh Không Hiển Thị

1. Verify bucket `images` là **public**
2. Check URL trong database có đúng format
3. Sử dụng default image nếu lỗi:

```typescript
onError={() => setImgSrc(DEFAULT_FOOD_IMAGE)}
```

### Build Errors

```bash
# Clear cache và rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Tài Liệu Tham Khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MagicUI](https://magicui.design/)

## 🤝 Contributing

Contributions are welcome! Nếu bạn muốn đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này là private repository của Dịch Vụ Nấu Ăn Bảy Nhân. Vui lòng không sao chép hoặc sử dụng mà không có sự cho phép.

## 📞 Liên Hệ

**Dịch Vụ Nấu Ăn Bảy Nhân**
- 📧 Email: contact@7nhan.com (hoặc email thực tế)
- 📱 Hotline: 0901 234 567 (hoặc số thực tế)
- 🌐 Website: [7nhan.com](https://7nhan.com)
- 📍 Địa chỉ: TP. Hồ Chí Minh, Việt Nam

---

**Made with ❤️ by Dịch Vụ Nấu Ăn Bảy Nhân**

*Cam kết thực phẩm tươi sống, giá cả hợp lý, phục vụ tận tâm - Hơn 20 năm kinh nghiệm tổ chức tiệc tại gia*
