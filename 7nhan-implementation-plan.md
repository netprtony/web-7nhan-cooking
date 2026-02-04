# 7Nhân Restaurant Booking Website - Implementation Plan

## Project Overview
A professional catering service booking website for "Nhóm Nấu 7Nhân" featuring menu management, interactive UI, and booking functionality.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router, TypeScript)
- **CMS**: Sanity Studio
- **UI Library**: Shadcn UI + Tailwind CSS
- **Hosting**: Vercel (Frontend) + Sanity Cloud (CMS)
- **Booking**: EmailJS (no backend required)

---

## Phase 1: Project Initialization

### 1.1 Sanity Studio Setup
```bash
# Create Sanity project
npm create sanity@latest -- --project z1p6n8xh --dataset production --template clean --typescript --output-path studio-7nhan

# Navigate and start
cd studio-7nhan
npm install
npm run dev
```

**Verify**: Studio should run on `http://localhost:3333`

### 1.2 Next.js Frontend Setup
```bash
# Create Next.js app (in parent directory)
npx create-next-app@latest web-7nhan --typescript --tailwind --eslint

# Configuration prompts:
# - Use src directory? Yes
# - Use App Router? Yes
# - Import alias: @/*

cd web-7nhan
npm run dev
```

**Verify**: App should run on `http://localhost:3000`

### 1.3 Shadcn UI Installation
```bash
# Inside web-7nhan directory
npx shadcn@latest init

# Configuration:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
```

**Important**: Keep default path `@/components/ui` for compatibility

---

## Phase 2: Core Component Development

### 2.1 Interactive Image Accordion Component

**File**: `components/ui/interactive-image-accordion.tsx`

```typescript
"use client";

import React, { useState } from 'react';

const accordionItems = [
  {
    id: 1,
    title: 'Món Khai Vị',
    imageUrl: 'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Hải Sản Tươi Sống',
    imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Đặc Sản Ba Miền',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Lẩu & Súp',
    imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2090&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Tráng Miệng',
    imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop',
  },
];

interface AccordionItemProps {
  item: typeof accordionItems[0];
  isActive: boolean;
  onMouseEnter: () => void;
}

const AccordionItem = ({ item, isActive, onMouseEnter }: AccordionItemProps) => {
  return (
    <div
      className={`
        relative h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-[400px]' : 'w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
              : 'bottom-24 left-1/2 -translate-x-1/2 rotate-90'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};

export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="container mx-auto px-4 py-12 md:py-24 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tighter">
            Nhóm Nấu 7Nhân - Tận Tâm Trong Từng Món Ăn
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
            Dịch vụ đặt tiệc tại gia chuyên nghiệp. Thực đơn phong phú, giá cả minh bạch, phục vụ tận tình.
          </p>
          <div className="mt-8">
            <button className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all">
              Đặt Lịch Ngay
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
          {accordionItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              isActive={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 2.2 Homepage Integration

**File**: `app/page.tsx`

```typescript
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingAccordionItem />
    </main>
  );
}
```

**Test**: Visit `http://localhost:3000` to verify accordion animation

---

## Phase 3: Sanity CMS Schema Setup

### 3.1 Install Sanity Dependencies in Next.js
```bash
# Inside web-7nhan directory
npm install @sanity/client next-sanity @sanity/image-url
```

### 3.2 Create Sanity Schema for Menu Items

**File**: `studio-7nhan/schemas/menuItem.ts`

```typescript
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'menuItem',
  title: 'Menu Items',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tên Món Ăn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Danh Mục',
      type: 'string',
      options: {
        list: [
          { title: 'Món Khai Vị', value: 'appetizer' },
          { title: 'Hải Sản', value: 'seafood' },
          { title: 'Đặc Sản', value: 'specialty' },
          { title: 'Lẩu & Súp', value: 'hotpot' },
          { title: 'Tráng Miệng', value: 'dessert' },
        ],
      },
    }),
    defineField({
      name: 'price',
      title: 'Giá (VNĐ)',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Mô Tả',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Hình Ảnh',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isAvailable',
      title: 'Còn Hàng',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});
```

**File**: `studio-7nhan/schemas/index.ts`

```typescript
import menuItem from './menuItem';

export const schemaTypes = [menuItem];
```

### 3.3 Sanity Configuration

**File**: `web-7nhan/src/lib/sanity.ts`

```typescript
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'z1p6n8xh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

---

## Phase 4: Dynamic Menu Section

### 4.1 Menu Display Component

**File**: `components/menu-section.tsx`

```typescript
"use client";

import { useEffect, useState } from 'react';
import { client, urlFor } from '@/lib/sanity';
import Image from 'next/image';

interface MenuItem {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: any;
  isAvailable: boolean;
}

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const query = `*[_type == "menuItem" && isAvailable == true] | order(category asc)`;
    
    client.fetch(query).then((data) => setMenuItems(data));
  }, []);

  const categories = [
    { value: 'all', label: 'Tất Cả' },
    { value: 'appetizer', label: 'Món Khai Vị' },
    { value: 'seafood', label: 'Hải Sản' },
    { value: 'specialty', label: 'Đặc Sản' },
    { value: 'hotpot', label: 'Lẩu & Súp' },
    { value: 'dessert', label: 'Tráng Miệng' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-8">Thực Đơn</h2>
      
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-6 py-2 rounded-full transition-all ${
              selectedCategory === cat.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {item.image && (
              <div className="relative h-64 w-full">
                <Image
                  src={urlFor(item.image).width(800).url()}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <p className="text-2xl font-bold text-gray-900">
                {item.price.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Update**: `app/page.tsx`

```typescript
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { MenuSection } from "@/components/menu-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingAccordionItem />
      <MenuSection />
    </main>
  );
}
```

---

## Phase 5: Booking Form with EmailJS

### 5.1 Install EmailJS
```bash
npm install @emailjs/browser
```

### 5.2 Install Shadcn Form Components
```bash
npx shadcn@latest add form input textarea button
```

### 5.3 Booking Form Component

**File**: `components/booking-form.tsx`

```typescript
"use client";

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    guests: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          date: formData.date,
          guests: formData.guests,
          message: formData.message,
        },
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      setStatus('success');
      setFormData({ name: '', phone: '', email: '', date: '', guests: '', message: '' });
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8">Đặt Tiệc Ngay</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và Tên</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số Điện Thoại</label>
            <Input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0901234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày Tổ Chức</label>
            <Input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số Khách</label>
            <Input
              required
              type="number"
              min="1"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Yêu Cầu Thêm</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Ghi chú đặc biệt..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-gray-800"
          >
            {isSubmitting ? 'Đang Gửi...' : 'Gửi Yêu Cầu'}
          </Button>

          {status === 'success' && (
            <p className="text-green-600 text-center">Đã gửi thành công! Chúng tôi sẽ liên hệ sớm.</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-center">Có lỗi xảy ra. Vui lòng thử lại.</p>
          )}
        </form>
      </div>
    </section>
  );
}
```

**Setup EmailJS**:
1. Create account at https://www.emailjs.com/
2. Add email service (Gmail recommended)
3. Create email template
4. Get Service ID, Template ID, and Public Key
5. Replace placeholders in code above

---

## Phase 6: Deployment

### 6.1 Deploy Sanity Studio
```bash
# Inside studio-7nhan directory
npx sanity deploy
```

Follow prompts to choose a hostname (e.g., `7nhan-studio.sanity.studio`)

### 6.2 Deploy Next.js to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=z1p6n8xh`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
5. Deploy

### 6.3 Configure CORS in Sanity

**File**: `studio-7nhan/sanity.config.ts`

Add your Vercel domain to allowed origins:

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: '7Nhan Restaurant',
  projectId: 'z1p6n8xh',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
  cors: {
    origin: [
      'http://localhost:3000',
      'https://your-vercel-domain.vercel.app', // Add your domain
    ],
  },
});
```

---

## Phase 7: Additional Features (Optional)

### 7.1 Navigation Header
- Logo
- Menu links
- Contact info
- Mobile responsive menu

### 7.2 Footer
- Social media links
- Contact information
- Business hours
- Copyright

### 7.3 About Section
- Team introduction
- Service highlights
- Customer testimonials

### 7.4 Gallery
- Food photography
- Event photos
- Behind-the-scenes

---

## Testing Checklist

- [ ] Sanity Studio runs locally
- [ ] Can create/edit menu items in Studio
- [ ] Next.js app runs locally
- [ ] Accordion animation works smoothly
- [ ] Menu items display from Sanity
- [ ] Category filtering works
- [ ] Booking form submits successfully
- [ ] EmailJS sends notifications
- [ ] Responsive design on mobile
- [ ] Images load properly
- [ ] Sanity Studio deployed
- [ ] Next.js deployed to Vercel
- [ ] Production data syncs correctly

---

## Environment Variables

**File**: `web-7nhan/.env.local`

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=z1p6n8xh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## Project Structure

```
project-root/
├── studio-7nhan/          # Sanity CMS
│   ├── schemas/
│   │   ├── menuItem.ts
│   │   └── index.ts
│   └── sanity.config.ts
│
└── web-7nhan/             # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx
    │   │   └── layout.tsx
    │   ├── components/
    │   │   ├── ui/
    │   │   │   └── interactive-image-accordion.tsx
    │   │   ├── menu-section.tsx
    │   │   └── booking-form.tsx
    │   └── lib/
    │       └── sanity.ts
    └── .env.local
```

---

## Resources

- Next.js Docs: https://nextjs.org/docs
- Sanity Docs: https://www.sanity.io/docs
- Shadcn UI: https://ui.shadcn.com
- EmailJS: https://www.emailjs.com/docs
- Vercel: https://vercel.com/docs

---

## Support & Maintenance

- Update menu items via Sanity Studio
- Monitor booking emails
- Regular image optimization
- Performance monitoring via Vercel Analytics
