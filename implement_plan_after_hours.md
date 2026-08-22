# 🖤✨ Implementation Plan: Chuyển đổi Web-7nhan-cooking → AFTER HOURS – MODERN DINING (Investor/Owner Portal)

> Repo gốc: `netprtony/web-7nhan-cooking` (Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase, shadcn/ui, Framer Motion)
> File này bổ sung (không ghi đè) `implement_plan.md` hiện có — dùng cho đợt refactor lớn: đổi đối tượng người dùng từ **khách đặt tiệc** sang **chủ đầu tư / chủ nhà hàng**, đổi thương hiệu, đổi schema, đổi theme màu, và tối ưu mobile.

---

## 🎯 1. Mục tiêu tổng thể

1. **Đổi đối tượng sử dụng**: từ website khách hàng đặt tiệc (booking, menu, blog, cart) → **cổng thông tin/dashboard nội bộ dành cho chủ đầu tư (investor/owner portal)** để theo dõi menu, food cost, hiệu suất kinh doanh nhà hàng.
2. **Đổi thương hiệu**: "Dịch Vụ Nấu Ăn Bảy Nhân" → **AFTER HOURS – MODERN DINING**.
3. **Đổi cấu trúc dữ liệu** bảng `menu_items`: thêm cột **nguyên liệu** (ingredients) và **food cost**.
4. **Đổi bảng màu chủ đạo**:
   - Dark mode: **đen (black) + vàng (gold)**
   - Light mode: **trắng (white) + vàng (gold)**
5. **Tối ưu giao diện cho thiết bị mobile** (responsive, touch-friendly, hiệu năng).

---

## 🧭 2. Bối cảnh & định hướng sản phẩm

### 2.1 Hiện trạng (theo README + implement_plan.md cũ)
- Website là **B2C**: landing page mời khách đặt tiệc, trang `/menu` để khách xem món, giỏ hàng (cart) lưu localStorage, `/blog` giới thiệu tiệc đã tổ chức, modal booking gửi email qua EmailJS.
- Backend: Supabase (Postgres), bảng `menu_items` và `blog_posts`.
- Theme màu hiện tại: cam (`--primary: 28 80% 52%`), light/dark cơ bản theo shadcn convention trong `globals.css`.

### 2.2 Định hướng mới — "Web dành cho chủ đầu tư"
Đối tượng dùng chính không còn là khách vãng lai mà là **chủ đầu tư / quản lý vận hành** nhà hàng AFTER HOURS. Vì vậy các luồng nghiệp vụ B2C (giỏ hàng, đặt tiệc công khai, blog PR) được **thu gọn hoặc chuyển thành khu vực công khai tối giản (marketing site)**, còn trọng tâm chuyển sang một **khu vực quản trị (protected area)** với các tính năng:

| Nhóm | Tính năng |
|---|---|
| **Tổng quan (Dashboard)** | Doanh thu ước tính, tổng số món, food cost % trung bình, cảnh báo món có food cost vượt ngưỡng |
| **Quản lý Menu** | CRUD món ăn, quản lý nguyên liệu từng món, tính giá vốn (food cost), gợi ý giá bán theo % food cost mục tiêu |
| **Phân tích Food Cost** | Bảng/biểu đồ food cost theo danh mục, món lãi nhiều/ít nhất, xu hướng theo thời gian |
| **Marketing site (public, rút gọn)** | Trang giới thiệu thương hiệu AFTER HOURS – MODERN DINING, không còn giỏ hàng công khai |
| **Auth** | Đăng nhập dành cho chủ đầu tư/quản lý (Supabase Auth), phân quyền cơ bản (owner/staff) |

> ⚠️ Vì đây là pivot lớn, đề xuất **giữ song song** một `PUBLIC_MODE` (marketing, không cart) và một khu vực `(/dashboard)` được bảo vệ bằng Supabase Auth, thay vì xoá toàn bộ code cũ. Việc này giảm rủi ro và cho phép rollback từng phần.

---

## 🗂️ 3. Khảo sát bắt buộc trước khi code

```bash
# 1. Xác nhận cấu trúc hiện tại của bảng menu_items và cart
cat supabase/migration.sql
grep -rn "menu_items" src/ --include="*.ts" --include="*.tsx"
grep -rn "CartContext\|useCart\|cart-sidebar" src/ -l

# 2. Xác nhận nơi định nghĩa theme màu
cat src/app/globals.css | sed -n '1,120p'
grep -rn "ThemeProvider\|next-themes" src/

# 3. Xác nhận các trang hiện có (App Router)
find src/app -maxdepth 2 -type d

# 4. Xác nhận thư viện chart đã có chưa (cho dashboard food cost)
cat package.json | grep -i "recharts\|chart\|visx"

# 5. Xác nhận Supabase Auth đã bật chưa
grep -rn "auth" src/lib/supabase.ts supabase/migration.sql
```

> Claude phải báo cáo kết quả khảo sát (đặc biệt: có Supabase Auth chưa, có thư viện chart chưa) trước khi viết code ở các bước sau.

---

## 🗄️ 4. Thay đổi cấu trúc dữ liệu — bảng `menu_items`

### 4.1 Schema hiện tại
| Column | Type | Mô tả |
|---|---|---|
| id | UUID | Primary key |
| title | TEXT | Tên món |
| category | TEXT | Danh mục |
| price | INTEGER | Giá bán (VND) |
| description | TEXT | Mô tả |
| image_url | TEXT | Ảnh |
| is_available | BOOLEAN | Còn phục vụ |
| created_at / updated_at | TIMESTAMPTZ | Thời gian |

### 4.2 Schema mới (thêm cột)
| Column mới | Type | Mô tả |
|---|---|---|
| `ingredients` | `JSONB` | Danh sách nguyên liệu, dạng `[{ "name": "Ức gà", "quantity": 200, "unit": "g", "unit_cost": 45000 }, ...]` — cho phép tính food cost tự động và hiển thị chi tiết nguyên liệu |
| `food_cost` | `NUMERIC(12,2)` | Giá vốn món ăn (VND) — có thể **nhập tay** hoặc **tự tính = SUM(quantity × unit_cost)** từ `ingredients` qua trigger |
| `food_cost_percentage` | `NUMERIC(5,2)` (generated column) | `= ROUND(food_cost / NULLIF(price,0) * 100, 2)` — % giá vốn trên giá bán, chỉ số quan trọng cho chủ đầu tư |

### 4.3 Migration SQL đề xuất (`supabase/migration_add_foodcost.sql`)
```sql
-- 1. Thêm cột nguyên liệu (JSONB) và food cost
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS food_cost NUMERIC(12,2) NOT NULL DEFAULT 0;

-- 2. Cột tính sẵn % food cost trên giá bán (generated column, tự cập nhật)
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS food_cost_percentage NUMERIC(5,2)
  GENERATED ALWAYS AS (
    CASE WHEN price > 0 THEN ROUND((food_cost / price) * 100, 2) ELSE 0 END
  ) STORED;

-- 3. (Tuỳ chọn) Trigger tự tính food_cost từ ingredients nếu chủ đầu tư không nhập tay
CREATE OR REPLACE FUNCTION calc_food_cost_from_ingredients()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ingredients IS NOT NULL AND jsonb_array_length(NEW.ingredients) > 0 THEN
    SELECT COALESCE(SUM((elem->>'quantity')::numeric * (elem->>'unit_cost')::numeric), 0)
    INTO NEW.food_cost
    FROM jsonb_array_elements(NEW.ingredients) AS elem;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_food_cost ON menu_items;
CREATE TRIGGER trg_calc_food_cost
  BEFORE INSERT OR UPDATE OF ingredients ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION calc_food_cost_from_ingredients();

-- 4. Index hỗ trợ lọc theo food_cost_percentage (dashboard cảnh báo món lãi thấp)
CREATE INDEX IF NOT EXISTS idx_menu_items_food_cost_pct ON menu_items (food_cost_percentage);
```

> ⚠️ Trigger ở bước 3 là **tuỳ chọn** — nếu chủ đầu tư muốn tự nhập `food_cost` thủ công (giá vốn thực tế khác với tổng nguyên liệu lý thuyết, ví dụ do hao hụt), có thể bỏ trigger và chỉ dùng `ingredients` như dữ liệu tham khảo hiển thị, không auto-override.

### 4.4 Cập nhật TypeScript types

**`src/types/food.ts`** (mở rộng):
```ts
export interface Ingredient {
  name: string        // "Ức gà"
  quantity: number     // 200
  unit: string          // "g" | "kg" | "ml" | "cái" ...
  unit_cost: number     // giá tiền / đơn vị, VND
}

export interface MenuItem {
  id: string
  title: string
  category: string
  price: number
  description: string
  image_url: string
  is_available: boolean
  ingredients: Ingredient[]
  food_cost: number
  food_cost_percentage: number   // generated ở DB, chỉ đọc trên FE
  created_at: string
  updated_at: string
}
```

**`src/types/supabase.ts`**: cập nhật `Database["public"]["Tables"]["menu_items"]["Row"|"Insert"|"Update"]` để phản ánh 3 cột mới (`ingredients`, `food_cost`, `food_cost_percentage` là read-only/generated).

---

## 🔐 5. Auth cho khu vực chủ đầu tư

1. Bật **Supabase Auth** (email/password hoặc magic link) nếu chưa có.
2. Tạo bảng `profiles` (nếu chưa có) với cột `role` (`owner` | `staff`) liên kết `auth.users`.
3. Route Next.js mới: `src/app/(dashboard)/layout.tsx` — kiểm tra session, redirect `/login` nếu chưa đăng nhập.
4. Middleware `src/middleware.ts` bảo vệ toàn bộ path `/dashboard/*`.
5. RLS (Row Level Security) trên `menu_items`: cho phép `SELECT` public (nếu vẫn muốn hiển thị menu công khai rút gọn), nhưng `INSERT/UPDATE/DELETE` chỉ cho user có `role = 'owner'`.

```sql
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_menu" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "owner_write_menu" ON menu_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'owner')
  );
```

---

## 🎨 6. Thay đổi bảng màu chủ đạo (Dark: đen–vàng / Light: trắng–vàng)

### 6.1 Bảng màu đề xuất (HSL, tương thích shadcn/Tailwind CSS variables)

| Token | Light mode | Dark mode |
|---|---|---|
| `--background` | `0 0% 100%` (trắng) | `0 0% 6%` (đen tuyền, hơi ấm) |
| `--foreground` | `0 0% 8%` (gần đen) | `45 30% 95%` (trắng ngà) |
| `--primary` | `45 90% 48%` (vàng gold đậm, đọc rõ trên nền trắng) | `45 90% 58%` (vàng gold sáng, nổi trên nền đen) |
| `--primary-foreground` | `0 0% 8%` | `0 0% 6%` |
| `--secondary` | `45 20% 95%` (vàng nhạt/kem) | `0 0% 12%` (xám đen) |
| `--muted` | `0 0% 96%` | `0 0% 14%` |
| `--muted-foreground` | `0 0% 40%` | `0 0% 65%` |
| `--accent` | `45 90% 92%` (vàng nhạt) | `45 60% 20%` (vàng đồng tối) |
| `--border` | `0 0% 90%` | `0 0% 18%` |
| `--card` | `0 0% 100%` | `0 0% 9%` |
| `--card-foreground` | `0 0% 8%` | `45 30% 95%` |
| `--destructive` | `0 72% 51%` | `0 62% 45%` |
| `--ring` | `45 90% 48%` | `45 90% 58%` |

> Ý tưởng thiết kế: **vàng gold** đóng vai trò *accent/CTA* (nút, số liệu quan trọng, đường viền active, biểu đồ), **đen/trắng** đóng vai trò nền — giữ cảm giác "modern fine-dining" thay vì cam ấm cúng kiểu tiệc gia đình như bản cũ.

### 6.2 File cần sửa: `src/app/globals.css`
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 8%;
    --primary: 45 90% 48%;
    --primary-foreground: 0 0% 8%;
    --secondary: 45 20% 95%;
    --secondary-foreground: 0 0% 8%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 40%;
    --accent: 45 90% 92%;
    --accent-foreground: 0 0% 8%;
    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 8%;
    --destructive: 0 72% 51%;
    --ring: 45 90% 48%;
  }

  .dark {
    --background: 0 0% 6%;
    --foreground: 45 30% 95%;
    --primary: 45 90% 58%;
    --primary-foreground: 0 0% 6%;
    --secondary: 0 0% 12%;
    --secondary-foreground: 45 30% 95%;
    --muted: 0 0% 14%;
    --muted-foreground: 0 0% 65%;
    --accent: 45 60% 20%;
    --accent-foreground: 45 90% 90%;
    --border: 0 0% 18%;
    --input: 0 0% 18%;
    --card: 0 0% 9%;
    --card-foreground: 45 30% 95%;
    --destructive: 0 62% 45%;
    --ring: 45 90% 58%;
  }
}
```

### 6.3 Việc cần làm kèm theo
- Rà soát toàn bộ code hiện đang **hard-code màu cam** (`orange-400`, `orange-500`, `text-orange-300`... như trong `food-detail-modal.tsx`, `scroll-velocity-food.tsx`) → thay bằng token `text-primary`, `bg-primary`, `border-primary` để đổi màu tập trung một chỗ.
- Cập nhật `--radius` nếu muốn góc bo cứng cáp hơn (phong cách "modern dining" thường bo góc nhỏ, ít bo tròn hơn bản B2C cũ).
- Logo: cân nhắc thay `public/main_logo.png` bằng logo mới cho **AFTER HOURS – MODERN DINING** (chữ vàng trên nền đen, dùng cho cả favicon).
- Font: gợi ý dùng 1 serif/display font sang trọng cho heading (vd. Playfair Display / Cormorant) kết hợp sans-serif hiện đại cho body — phù hợp định vị "modern fine dining" hơn font mặc định hiện tại. Thêm qua `next/font/google` trong `src/app/layout.tsx`.

---

## 🏷️ 7. Đổi thương hiệu (Rebrand)

| Vị trí | Nội dung cũ | Nội dung mới |
|---|---|---|
| `<title>` / metadata (`layout.tsx`) | "Dịch Vụ Nấu Ăn Bảy Nhân" | "AFTER HOURS – MODERN DINING" |
| Header logo/text (`global-header.tsx`) | Logo Bảy Nhân | Logo/wordmark AFTER HOURS |
| Hero section (`hero-banquet.tsx`) | Slogan đặt tiệc tại gia | Slogan định vị nhà hàng modern dining (vd. "Fine Dining. After Hours.") |
| Footer (`footer-section.tsx`) | Thông tin liên hệ Bảy Nhân | Thông tin liên hệ + địa chỉ AFTER HOURS |
| `README.md` | Mô tả dịch vụ nấu ăn | Mô tả nhà hàng + portal quản trị chủ đầu tư |
| `package.json` `name` | `web-7nhan-cooking` | `after-hours-dining` (hoặc giữ nguyên nếu không muốn đổi repo name) |

> Vì đây là đổi tên thương hiệu toàn diện, nên **grep toàn repo theo từ khoá "Bảy Nhân" / "7nhan" / "bay-nhan"** để đảm bảo không sót:
```bash
grep -rniE "bảy nhân|bay nhan|7nhan" src/ public/ README.md
```

---

## 📱 8. Cấu trúc trang mới (App Router)

```
src/app/
├── (public)/                     # Khu vực marketing công khai, rút gọn
│   ├── page.tsx                 # Landing giới thiệu AFTER HOURS
│   └── menu/page.tsx            # Menu công khai (chỉ xem, KHÔNG còn cart/booking)
│
├── (dashboard)/                  # Khu vực quản trị — yêu cầu đăng nhập
│   ├── layout.tsx                # Check session + sidebar/topbar quản trị
│   ├── dashboard/page.tsx        # Trang tổng quan: doanh thu, food cost %, cảnh báo
│   ├── menu/page.tsx             # Danh sách món (bảng, desktop) / (card list, mobile)
│   ├── menu/[id]/page.tsx        # Chi tiết + form sửa món, nguyên liệu, food cost
│   ├── menu/new/page.tsx         # Thêm món mới
│   └── reports/page.tsx          # Báo cáo food cost theo danh mục/thời gian
│
├── login/page.tsx                # Đăng nhập chủ đầu tư/quản lý
└── layout.tsx                    # Root layout (ThemeProvider, fonts)
```

- Xoá hoặc ẩn (không xoá vĩnh viễn để dễ rollback) các phần B2C không còn phù hợp: `cart-sidebar.tsx`, `booking-modal.tsx`, route `/blog` — có thể chuyển `/blog` thành "Câu chuyện thương hiệu" tối giản trong `(public)` nếu vẫn muốn giữ giá trị content-marketing, hoặc gỡ hoàn toàn khỏi menu điều hướng.
- `CartProvider` không còn cần thiết ở khu vực `(dashboard)` — chỉ giữ lại (nếu có) trong `(public)` nếu doanh nghiệp vẫn muốn nhận đặt bàn/đặt món cơ bản; nếu không, gỡ khỏi `layout.tsx` gốc để giảm bundle.

---

## 🧩 9. Component mới cho khu vực Dashboard

### 9.1 `src/components/dashboard/menu-cost-table.tsx`
Bảng hiển thị (desktop) danh sách món: Tên món | Danh mục | Giá bán | Food cost | **Food cost %** (có màu cảnh báo: xanh <28%, vàng 28–35%, đỏ >35% — ngưỡng có thể chỉnh) | Trạng thái.

### 9.2 `src/components/dashboard/menu-cost-card.tsx`
Phiên bản **card dọc cho mobile** thay thế bảng ngang (bảng nhiều cột rất khó dùng trên màn hình nhỏ) — mỗi card hiển thị món, giá bán/food cost dạng progress bar % trực quan bằng màu vàng/đỏ.

### 9.3 `src/components/dashboard/ingredient-editor.tsx`
Form dynamic list: thêm/xoá dòng nguyên liệu (`name`, `quantity`, `unit`, `unit_cost`), tự động tính tổng food cost realtime hiển thị bên dưới form trước khi submit.

### 9.4 `src/components/dashboard/kpi-cards.tsx`
4 thẻ KPI ở trang Dashboard: Tổng số món đang bán, Food cost % trung bình, Món có food cost % cao nhất, Doanh thu ước tính (nếu có dữ liệu order — nếu chưa có bảng orders, để placeholder "Sắp ra mắt").

### 9.5 `src/components/dashboard/food-cost-chart.tsx`
Dùng `recharts` (cần cài nếu chưa có) vẽ bar chart food cost % theo danh mục — dùng màu `--primary` (vàng) cho bar, tương phản trên nền `--card`.

---

## 📲 10. Tối ưu giao diện mobile

1. **Điều hướng**: giữ/điều chỉnh `animated-tab-bar.tsx` hiện có thành bottom navigation bar cho khu vực `(dashboard)` trên mobile (Tổng quan / Menu / Báo cáo / Tài khoản), thay vì sidebar cố định chỉ hợp desktop.
2. **Bảng → Card**: mọi bảng dữ liệu (`menu-cost-table`) phải có breakpoint chuyển sang layout card ở `< 768px` (dùng Tailwind `hidden md:table` / `md:hidden` cho 2 biến thể, hoặc container queries đã có sẵn `@tailwindcss/container-queries`).
3. **Form nguyên liệu trên mobile**: input số lượng dùng `inputmode="decimal"`, nút +/- lớn (tối thiểu 44×44px theo chuẩn touch target) thay vì chỉ dựa vào bàn phím số.
4. **Sticky action bar**: khi sửa món trên mobile, nút "Lưu" nên sticky ở đáy màn hình (giống pattern `cart-sidebar` cũ) thay vì nằm cuối form dài phải scroll mới thấy.
5. **Hình ảnh**: tiếp tục dùng `next/image` với `sizes` phù hợp, lazy loading — quan trọng hơn với dashboard vì danh sách món có thể dài.
6. **Kiểm tra hiệu năng**: chạy Lighthouse mobile cho `(dashboard)/menu` sau khi build, mục tiêu Performance ≥ 85, không có Cumulative Layout Shift do bảng/card đổi kích thước.
7. **Dark mode mặc định trên mobile buổi tối**: cân nhắc tôn trọng `prefers-color-scheme` qua `next-themes` (đã có sẵn) — không cần code thêm, chỉ cần đảm bảo bảng màu mới áp dụng đúng ở cả 2 mode.

---

## ✅ 11. Checklist triển khai theo thứ tự

```
Giai đoạn A — Khảo sát & chuẩn bị
[ ] 1. Chạy lệnh khảo sát ở mục 3, báo cáo kết quả (schema, theme hiện tại, auth, chart lib)
[ ] 2. Backup dữ liệu Supabase hiện tại trước khi chạy migration

Giai đoạn B — Dữ liệu
[ ] 3. Viết & chạy migration_add_foodcost.sql (ingredients, food_cost, food_cost_percentage)
[ ] 4. Cập nhật src/types/food.ts và src/types/supabase.ts
[ ] 5. Bật RLS + policy owner/staff cho menu_items (mục 5)
[ ] 6. Tạo bảng/role profiles nếu chưa có, cấu hình Supabase Auth

Giai đoạn C — Theme & thương hiệu
[ ] 7. Cập nhật globals.css theo bảng màu đen-vàng / trắng-vàng (mục 6)
[ ] 8. Grep và thay toàn bộ màu cam hard-code bằng token --primary
[ ] 9. Đổi tên thương hiệu toàn repo theo bảng mục 7 (grep "Bảy Nhân"/"7nhan")
[ ] 10. Thay logo, favicon, cân nhắc đổi font heading

Giai đoạn D — Cấu trúc trang & auth
[ ] 11. Tạo route group (public) và (dashboard) theo mục 8
[ ] 12. Tạo middleware.ts bảo vệ /dashboard
[ ] 13. Tạo trang /login
[ ] 14. Gỡ/ẩn cart-sidebar, booking-modal khỏi layout gốc (giữ code, không xoá file)

Giai đoạn E — Component Dashboard
[ ] 15. Cài recharts (nếu chưa có)
[ ] 16. Tạo kpi-cards.tsx, food-cost-chart.tsx
[ ] 17. Tạo menu-cost-table.tsx (desktop) + menu-cost-card.tsx (mobile)
[ ] 18. Tạo ingredient-editor.tsx với tính tổng food cost realtime
[ ] 19. Ghép các component vào dashboard/page.tsx, menu/page.tsx, menu/[id]/page.tsx

Giai đoạn F — Mobile & QA
[ ] 20. Áp dụng bottom nav mobile cho (dashboard)
[ ] 21. Kiểm tra breakpoint bảng→card, touch target, sticky save bar
[ ] 22. Chạy Lighthouse mobile, sửa vấn đề hiệu năng/CLS
[ ] 23. Test toàn bộ luồng: đăng nhập → xem dashboard → sửa món (nguyên liệu, food cost) → lưu → % tự cập nhật
[ ] 24. Test dark/light mode trên cả (public) và (dashboard)
[ ] 25. Test RLS: user không phải owner không sửa được menu qua API
```

---

## ⚠️ 12. Lưu ý quan trọng

1. **Không xoá luồng B2C ngay lập tức** — chuyển vào route group `(public)` và tắt các phần không cần (cart, booking) qua feature flag hoặc đơn giản là không link tới trong nav, để dễ khôi phục nếu chủ đầu tư vẫn muốn giữ kênh nhận khách trực tiếp song song với portal quản trị.
2. **`food_cost_percentage` là generated column** — không insert/update trực tiếp cột này từ FE, chỉ đọc.
3. **Trigger tự tính food_cost từ ingredients là tuỳ chọn** — xác nhận với chủ đầu tư xem họ muốn nhập tay hay để hệ thống tự cộng dồn từ nguyên liệu trước khi bật trigger, vì hai cách cho ra số khác nhau (hao hụt, chiết khấu nhà cung cấp...).
4. **RLS bắt buộc** trước khi công khai portal — vì đây là dữ liệu kinh doanh nhạy cảm (giá vốn, lợi nhuận), tuyệt đối không để `food_cost`/`ingredients` lộ ra ở trang `(public)/menu`. Trang menu công khai chỉ nên `SELECT` các cột an toàn (title, price, description, image_url), không select `food_cost`/`ingredients`.
5. **Đổi màu tập trung qua CSS variables**, tránh sửa rải rác từng component để lần sau đổi theme (nếu có) chỉ cần sửa một file `globals.css`.
6. **Kiểm thử tương phản màu** (contrast) giữa vàng gold và nền đen/trắng theo WCAG AA, đặc biệt với text nhỏ trên nền đen — vàng quá sáng trên đen quá tối có thể chói, nên dùng đúng giá trị lightness đã đề xuất ở mục 6.1 thay vì vàng thuần (`#FFD700`) chưa qua điều chỉnh.
