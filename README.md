# 🌃 Restaurant After Hours - Website Giới Thiệu Nhà Ăn Cho Chủ Đầu Tư

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)

## 📖 Giới Thiệu

**Restaurant After Hours** là website giới thiệu mô hình nhà ăn phục vụ ban đêm dành cho chủ đầu tư. Dự án tập trung vào việc trình bày năng lực vận hành, chất lượng thực đơn, và tiềm năng phát triển theo định hướng kinh doanh:

- 🏢 **Định vị đầu tư rõ ràng**: Trình bày giá trị mô hình, điểm khác biệt và lợi thế vận hành
- 📋 **Thực đơn trực quan**: Danh mục món ăn theo nhóm, dễ đánh giá quy mô dịch vụ
- 📊 **Nội dung truyền thông dự án**: Blog/hoạt động để thể hiện năng lực triển khai thực tế
- 📱 **Responsive Design**: Tối ưu hiển thị trên mobile, tablet và desktop
- 🌙 **Dark Mode**: Tăng trải nghiệm trình chiếu và demo buổi tối
- ⚡ **Performance**: Tối ưu tốc độ tải trang cho demo và giới thiệu đối tác

## ✨ Tính Năng Chính

### 🏠 Trang Chủ (Landing Page)
- **Hero Section**: Truyền tải thông điệp thương hiệu và tầm nhìn dự án
- **Thực đơn cuộn tự động**: Trình bày năng lực món ăn bằng hiệu ứng chuyển động
- **Why Choose Us**: Cards nhấn mạnh ưu điểm mô hình dành cho chủ đầu tư
- **Bảng gói dịch vụ**: Các phương án triển khai theo quy mô khác nhau
- **Footer**: Khối liên hệ nhanh phục vụ kết nối hợp tác

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
- Hiển thị các bài viết về hoạt động vận hành và case study
- Phân loại theo:
  - Tiệc Cưới
  - Tiệc Sinh Nhật
  - Tiệc Công Ty
  - Tiệc Gia Đình
  - Tiệc Ngoài Trời
  - Tiệc Tân Gia
- Chi tiết bài viết với gallery ảnh

### 🤖 Trợ Lý AI Nhà Đầu Tư & Hệ Thống RAG (Modern RAG Q&A)
- **Hỏi đáp thông minh thời gian thực**: Giải đáp các thắc mắc về mô hình kinh doanh, tài chính, thực đơn, kế hoạch hoàn vốn và chiến lược mở rộng.
- **Kiến trúc RAG (Retrieval-Augmented Generation)**:
  - **Tài liệu nguồn**: Đề án khả thi (`data/AFTER_HOURS_Du_An.docx`) & Hợp đồng đầu tư (`data/hop_dong_dau_tu_after_hours_preview.docx`).
  - **Document Loader (`loader.ts`)**: Trích xuất text từ `.docx` bằng `mammoth`, chuẩn hóa và lưu cache.
  - **Recursive Text Splitting (`splitter.ts`)**: Phân tách văn bản ngữ nghĩa (`chunk_size = 500`, `chunk_overlap = 100`) kèm metadata nguồn.
  - **In-Memory Vector Store (`vectorstore.ts`)**: Thuật toán xếp hạng BM25 tiếng Việt tối ưu + chiến lược Context Reordering hình chữ U (chống hiện tượng *Lost in the Middle*).
  - **Grounding Rules (`prompt.ts`)**: Chống ảo giác (anti-hallucination), bám sát 100% tài liệu và trích dẫn nguồn minh bạch.
- **Hỗ trợ đa mô hình AI (OpenRouter API)**:
  - `nvidia/nemotron-3-ultra-550b-a55b:free` (Free)
  - `google/gemma-4-31b-it:free` (Free)
  - `z.ai/glm-4.5-air:free` (Free)
  - `qwen/qwen-2.5-72b-instruct` (Mặc định / Tối ưu tiếng Việt)
  - `meta-llama/llama-3.3-70b-instruct`
  - `anthropic/claude-3.5-sonnet`
  - Tích hợp Model Selector trên Header chat, tự động lưu vào `localStorage`.

### 📄 Review, Chỉnh Sửa & Tải Hợp Đồng Đầu Tư Trực Tiếp
- **Bản In Chuẩn Hóa (A4 Legal Document Layout)**: Hiển thị đầy đủ Quốc hiệu, Tiêu ngữ, Thông tin Bên A (Ban Sáng Lập After Hours), Thông tin Bên B (Nhà Đầu Tư), 6 điều khoản hợp tác, Bảng CAPEX 9 hạng mục 2.8 tỷ và Khung ký tên 2 bên.
- **Điền nhanh thông tin (Quick Form)**: Hỗ trợ chọn nhanh các gói đầu tư (Hạt giống 500Tr, Tăng trưởng 1.5 Tỷ, Chiến lược 2.8 Tỷ, Suất mẫu 400Tr) và tự động đồng bộ vào hợp đồng.
- **Soạn thảo tự do (Live Editor)**: Cho phép tinh chỉnh từng điều khoản trước khi ký.
- **Xuất & Tải về tức thì**:
  - 📥 Xuất file Word chuẩn (`.docx`) bằng thư viện `docx`.
  - 📄 Tải bản PDF mẫu (`.pdf`).
- **Thẻ hành động trong Chat**: Tự động gợi ý nút [Xem & Sửa Hợp Đồng], [Tải .DOCX], [Tải .PDF] ngay trong câu trả lời của AI.

### 📧 Liên Hệ Tư Vấn (Booking Modal)
- Form tiếp nhận nhu cầu tư vấn với EmailJS integration
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

### AI & RAG Pipeline
- **OpenRouter API** via **OpenAI SDK** (`openai`) - Kết nối đa mô hình AI (NVIDIA, Google, GLM, Qwen, Claude, Meta)
- **Mammoth** (`mammoth`) - Đọc và trích xuất dữ liệu thô từ file Word `.docx`
- **Docx** (`docx`) - Khởi tạo tài liệu và xuất file Word `.docx` chuẩn động
- **BM25 Vector Search** - In-memory scoring algorithm tối ưu cho tiếng Việt
- **Server-Sent Events (SSE)** - Streaming response thời gian thực cho chat UI

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
restaurant-after-hours/
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
│   │   ├── api/                # Backend API Routes
│   │   │   ├── chat/route.ts   # RAG Pipeline & OpenRouter Streaming API
│   │   │   └── contract/route.ts # Contract Template & Docx Export API
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
│   │   │   ├── chat-widget.tsx           # Floating AI Chat Widget + Model Selector
│   │   │   ├── contract-preview-modal.tsx # Contract Review, Live Editor & Quick Form
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
│   │   ├── booking-modal.tsx   # Investor consultation modal
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
│   ├── lib/                    # Utilities & RAG Engine
│   │   ├── contract/
│   │   │   └── generator.ts    # Docx Document Generator via 'docx'
│   │   ├── rag/
│   │   │   ├── loader.ts       # Document loader & extractor via 'mammoth'
│   │   │   ├── splitter.ts     # Recursive character text chunking
│   │   │   ├── vectorstore.ts  # In-memory BM25 similarity & U-shape reordering
│   │   │   └── prompt.ts       # Investor Relations system prompt & grounding
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Utility functions
│   │
│   └── types/                  # TypeScript types
│       ├── food.ts             # Food item types
│       ├── pricing.ts          # Pricing types
│       └── supabase.ts         # Supabase database types
│
├── data/                       # Tài liệu nguồn RAG & Hợp đồng mẫu
│   ├── AFTER_HOURS_Du_An.docx  # Đề án khả thi, chi phí CAPEX 2.8 tỷ
│   ├── hop_dong_dau_tu_after_hours_preview.docx # Dự thảo Hợp đồng đầu tư
│   └── hop_dong_dau_tu_after_hours_preview.pdf  # Bản PDF hợp đồng
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

## 🧠 Chi Tiết Kỹ Thuật Hệ Thống RAG (Modern RAG Workflow)

Hệ thống **Trợ Lý AI Nhà Đầu Tư** của AFTER HOURS ứng dụng mô hình **Modern RAG (Retrieval-Augmented Generation)** nhằm trả lời chính xác, minh bạch các câu hỏi của nhà đầu tư mà không xảy ra hiện tượng ảo giác (hallucination):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TÀI LIỆU DỰ ÁN & HỢP ĐỒNG GỐC                         │
│  - data/AFTER_HOURS_Du_An.docx (Đề án khả thi, tài chính, CAPEX 2.8 tỷ)     │
│  - data/hop_dong_dau_tu_after_hours_preview.docx (Dự thảo Hợp đồng đầu tư)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. DOCUMENT LOADER & TEXT EXTRACTION (src/lib/rag/loader.ts)                │
│  - Sử dụng mammoth để trích xuất raw text & HTML                           │
│  - Chuẩn hóa ký tự xuống dòng, khoảng trắng thừa                           │
│  - Cơ chế In-memory Caching tránh đọc file lặp lại                         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. RECURSIVE CHUNKING & METADATA TAGGING (src/lib/rag/splitter.ts)          │
│  - Phân tách theo cấu trúc ngữ nghĩa (đoạn văn -> câu -> từ)                │
│  - chunk_size = 500 ký tự (tập trung 1 ý tài chính/điều khoản)              │
│  - chunk_overlap = 100 ký tự (duy trì ngữ cảnh liền mạch)                   │
│  - Gắn nhãn metadata nguồn: source, chunkIndex                             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. IN-MEMORY VECTOR STORE & BM25 SCORING (src/lib/rag/vectorstore.ts)       │
│  - Thuật toán BM25 Ranking tiếng Việt tối ưu (TF-IDF + doc length norm)    │
│  - Zero API Dependency: Không tốn chi phí và độ trễ gọi Embedding ngoài     │
│  - Context Reordering (U-Shape): Đưa thông tin quan trọng nhất lên đầu và   │
│    cuối prompt nhằm loại bỏ hiện tượng "Lost in the Middle" cho LLM         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
       ┌───────────────────────────────┴───────────────────────────────┐
       ▼                                                               ▼
  [Nhà đầu tư đặt câu hỏi]                                      [Top-5 Context Chunks]
       │                                                               │
       └───────────────────────────────┬───────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. STRICT GROUNDING & PROMPT TEMPLATE (src/lib/rag/prompt.ts)               │
│  - Định vị vai trò Giám đốc Quan hệ Nhà đầu tư (IR Director)                │
│  - Quy tắc Grounding 100%: Chỉ trả lời dựa trên tài liệu được cung cấp      │
│  - Bắt buộc trích dẫn nguồn (ví dụ: [Nguồn: AFTER_HOURS_Du_An.docx])        │
│  - Từ chối lịch sự và cung cấp thông tin liên hệ khi ngoài phạm vi          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. OPENROUTER MULTI-MODEL STREAMING (src/app/api/chat/route.ts)             │
│  - Hỗ trợ đa mô hình: NVIDIA Nemotron 550B, Gemma 4, GLM 4.5, Qwen 2.5 72B │
│  - Phản hồi dạng Server-Sent Events (SSE) theo từng token                   │
│  - Tích hợp Card xem trước, chỉnh sửa & tải file Word .DOCX / .PDF          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Các API Endpoints:
| Endpoint | Method | Chức năng |
|---|---|---|
| `/api/chat` | `POST` | Tiếp nhận câu hỏi, truy xuất ngữ cảnh RAG, streaming phản hồi từ OpenRouter |
| `/api/contract` | `GET` | Lấy dữ liệu mẫu hợp đồng (text, html) hoặc tải file gốc (`?download=raw&type=docx/pdf`) |
| `/api/contract` | `POST` | Nhận dữ liệu tùy chỉnh của Nhà đầu tư và xuất file Word `.docx` động |

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js**: 20.x trở lên
- **npm**: 10.x trở lên (hoặc yarn, pnpm, bun)
- **Supabase Account**: Để cấu hình database và storage
- **OpenRouter API Key**: Để kích hoạt tính năng Trợ lý AI Q&A

### 1. Clone Repository

```bash
git clone https://github.com/netprtony/restaurant-after-hours.git
cd restaurant-after-hours
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

# OpenRouter API (Cho Trợ Lý AI RAG)
OPENROUTER_API_KEY=your_openrouter_api_key

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/netprtony/restaurant-after-hours)

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

Dự án đang được phát triển nội bộ. Vui lòng chỉ sử dụng, sao chép hoặc phân phối khi có sự cho phép từ chủ sở hữu repository.

## 📞 Liên Hệ

Vui lòng mở issue hoặc liên hệ trực tiếp chủ repository để trao đổi về hợp tác, triển khai hoặc đầu tư.

---

**Made with ❤️ for Restaurant After Hours**

*Nền tảng giới thiệu mô hình nhà ăn phục vụ sau giờ cao điểm dành cho chủ đầu tư.*
