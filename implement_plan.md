# Kế Hoạch Tích Hợp GlassButton Component

## Tổng Quan
Tài liệu này mô tả kế hoạch chi tiết để tích hợp component GlassButton vào dự án và thay thế tất cả các button hiện có.

---

## Phần 1: Kiểm Tra & Chuẩn Bị Môi Trường

### 1.1 Kiểm Tra Cấu Trúc Dự Án Hiện Tại

```bash
# Kiểm tra xem dự án có sử dụng:
- shadcn/ui (kiểm tra file components.json)
- Tailwind CSS (kiểm tra tailwind.config.js/ts)
- TypeScript (kiểm tra tsconfig.json)
```

### 1.2 Cài Đặt Môi Trường (Nếu Chưa Có)

#### A. Nếu chưa có shadcn/ui:
```bash
npx shadcn@latest init
```

Khi được hỏi, chọn:
- TypeScript: Yes
- Style: Default/New York (tùy preference)
- Base color: Slate/Zinc (tùy preference)
- CSS variables: Yes
- Tailwind config: Yes

#### B. Nếu chưa có Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Cấu hình `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### C. Nếu chưa có TypeScript:
```bash
npm install --save-dev typescript @types/react @types/node
npx tsc --init
```

---

## Phần 2: Cài Đặt Dependencies

### 2.1 Cài Đặt Package Bắt Buộc

```bash
# Cài đặt class-variance-authority (CVA)
npm install class-variance-authority

# Cài đặt clsx (utility để merge class names)
npm install clsx

# Cài đặt lucide-react (cho icons)
npm install lucide-react
```

### 2.2 Kiểm Tra Dependencies Đã Cài

```bash
npm list class-variance-authority
npm list clsx
npm list lucide-react
```

---

## Phần 3: Tạo Cấu Trúc Thư Mục

### 3.1 Tạo Thư Mục Components

```bash
# Tạo thư mục components/ui nếu chưa có
mkdir -p components/ui
# hoặc
mkdir -p src/components/ui
```

**Lý do tại sao cần `/components/ui`:**
- shadcn/ui sử dụng convention này cho tất cả UI components
- Dễ dàng quản lý và import components
- Tách biệt UI components với business logic components
- Nhất quán với ecosystem React và Next.js

### 3.2 Cấu Trúc Thư Mục Đề Xuất

```
project-root/
├── components/           (hoặc src/components/)
│   ├── ui/              
│   │   ├── glass-button.tsx    ← Component mới
│   │   ├── button.tsx          ← Component cũ (sẽ được thay thế)
│   │   └── ...
│   └── demos/
│       └── glass-button-demo.tsx
├── lib/
│   └── utils.ts         ← Utility functions (cn helper)
└── styles/
    └── globals.css      ← CSS cho glass effect
```

---

## Phần 4: Cài Đặt Component Files

### 4.1 Tạo Utility Function (nếu chưa có)

**File: `lib/utils.ts`**
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4.2 Copy GlassButton Component

**File: `components/ui/glass-button.tsx`**
- Copy toàn bộ code từ document đã cung cấp
- Đảm bảo import path `@/components/ui/glass-button` hoạt động

### 4.3 Thêm CSS Styles

**File: `styles/globals.css` hoặc `app/globals.css`**
```css
/* Glass Button Styles */
.glass-button-wrap {
  position: relative;
  display: inline-block;
}

.glass-button {
  background: linear-gradient(
    135deg,
    oklch(from var(--foreground) l c h / 12%),
    oklch(from var(--foreground) l c h / 5%)
  );
  border: 1px solid oklch(from var(--foreground) l c h / 15%);
  box-shadow: 
    inset 0 1px 0 0 oklch(from var(--foreground) l c h / 20%),
    0 1px 2px 0 oklch(from var(--background) l c h / 10%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.glass-button:hover {
  background: linear-gradient(
    135deg,
    oklch(from var(--foreground) l c h / 18%),
    oklch(from var(--foreground) l c h / 8%)
  );
  border-color: oklch(from var(--foreground) l c h / 20%);
}

.glass-button:active {
  background: linear-gradient(
    135deg,
    oklch(from var(--foreground) l c h / 10%),
    oklch(from var(--foreground) l c h / 4%)
  );
  transform: translateY(1px);
}

.glass-button-shadow {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    circle at center,
    oklch(from var(--primary) l c h / 20%),
    transparent 70%
  );
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glass-button-wrap:hover .glass-button-shadow {
  opacity: 1;
}

.glass-button-text {
  color: var(--foreground);
  text-shadow: 0 1px 2px oklch(from var(--background) l c h / 30%);
}
```

### 4.4 Cấu Hình Path Aliases

**File: `tsconfig.json`**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

Hoặc nếu dùng `src/`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

---

## Phần 5: Audit & Mapping Buttons Hiện Tại

### 5.1 Tìm Tất Cả Buttons Trong Dự Án

```bash
# Tìm tất cả file có chứa button elements
grep -r "<button" --include="*.tsx" --include="*.jsx" .

# Tìm import của button component cũ
grep -r "from.*button" --include="*.tsx" --include="*.jsx" .

# Hoặc dùng ripgrep (nhanh hơn)
rg "<button" -t tsx -t jsx
```

### 5.2 Tạo Danh Sách Buttons

Tạo file `button-audit.md`:

```markdown
# Button Audit Log

## Locations Found:
1. File: components/Header.tsx
   - Line: 45
   - Type: Primary button
   - Props: onClick, className
   - Text: "Get Started"

2. File: pages/index.tsx
   - Line: 120
   - Type: Submit button
   - Props: type="submit", disabled
   - Text: "Submit Form"

[... list all buttons found ...]
```

### 5.3 Phân Loại Buttons

| Type | Current Props | GlassButton Mapping |
|------|---------------|---------------------|
| Primary | className, onClick | size="default" |
| Small | className="btn-sm" | size="sm" |
| Large | className="btn-lg" | size="lg" |
| Icon only | | size="icon" |

---

## Phần 6: Tạo Migration Strategy

### 6.1 Chiến Lược Thay Thế

**Option 1: Gradual Migration (Khuyến nghị)**
- Giữ cả button cũ và GlassButton
- Migrate từng page/component một
- Test kỹ trước khi xóa button cũ

**Option 2: Complete Replacement**
- Tạo alias: export GlassButton as Button
- Thay thế một lần toàn bộ
- Rủi ro cao hơn

**Khuyến nghị: Chọn Option 1**

### 6.2 Migration Checklist Template

Cho mỗi file cần migrate:

```markdown
- [ ] File: path/to/component.tsx
  - [ ] Backup original file
  - [ ] Update imports
  - [ ] Replace button tags
  - [ ] Map props correctly
  - [ ] Test functionality
  - [ ] Test styling
  - [ ] Test responsive behavior
  - [ ] Commit changes
```

---

## Phần 7: Implementation Steps

### 7.1 Phase 1: Setup (Day 1)

1. **Cài đặt dependencies:**
   ```bash
   npm install class-variance-authority clsx lucide-react
   ```

2. **Tạo cấu trúc thư mục:**
   ```bash
   mkdir -p components/ui
   mkdir -p lib
   ```

3. **Copy component files:**
   - `components/ui/glass-button.tsx`
   - `lib/utils.ts`

4. **Thêm CSS styles vào `globals.css`**

5. **Test component isolation:**
   - Tạo test page để verify GlassButton hoạt động
   - File: `pages/test/glass-button.tsx` hoặc `app/test/page.tsx`

### 7.2 Phase 2: Audit (Day 1-2)

1. **Scan toàn bộ codebase:**
   ```bash
   # Tạo report file
   grep -rn "<button" --include="*.tsx" --include="*.jsx" . > button-locations.txt
   ```

2. **Phân tích và categorize buttons**

3. **Tạo migration priority list:**
   - Priority 1: Landing page, main navigation
   - Priority 2: Forms, modals
   - Priority 3: Secondary features
   - Priority 4: Admin/internal pages

### 7.3 Phase 3: Create Migration Helpers (Day 2)

**File: `components/ui/button-migration-wrapper.tsx`**
```typescript
import { GlassButton, type GlassButtonProps } from './glass-button';
import { type ButtonHTMLAttributes } from 'react';

// Helper to map old button props to GlassButton props
export function mapOldButtonProps(
  oldProps: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'small' | 'large';
  }
): GlassButtonProps {
  const { variant, className, ...rest } = oldProps;
  
  let size: GlassButtonProps['size'] = 'default';
  
  if (variant === 'small') size = 'sm';
  if (variant === 'large') size = 'lg';
  
  return {
    size,
    className,
    ...rest,
  };
}

// Wrapper component for easier migration
export function MigratedButton(props: any) {
  const mappedProps = mapOldButtonProps(props);
  return <GlassButton {...mappedProps} />;
}
```

### 7.4 Phase 4: Migration Execution (Day 3-7)

**Per-file migration steps:**

1. **Backup:**
   ```bash
   cp components/Header.tsx components/Header.tsx.backup
   ```

2. **Update imports:**
   ```typescript
   // Before
   import { Button } from './ui/button';
   
   // After
   import { GlassButton } from '@/components/ui/glass-button';
   import { Zap } from 'lucide-react'; // if needed
   ```

3. **Replace button usage:**
   ```typescript
   // Before
   <button className="btn btn-primary" onClick={handleClick}>
     Click me
   </button>
   
   // After
   <GlassButton size="default" onClick={handleClick}>
     Click me
   </GlassButton>
   ```

4. **Handle icons:**
   ```typescript
   // Before
   <button>
     <Icon />
     Text
   </button>
   
   // After
   <GlassButton contentClassName="flex items-center gap-2">
     <Icon className="h-5 w-5" />
     <span>Text</span>
   </GlassButton>
   ```

5. **Test:**
   - Visual appearance
   - Click handlers
   - Disabled states
   - Loading states
   - Form submission (if applicable)

6. **Commit:**
   ```bash
   git add components/Header.tsx
   git commit -m "feat: migrate Header buttons to GlassButton"
   ```

### 7.5 Phase 5: Special Cases (Ongoing)

**A. Form Submit Buttons:**
```typescript
<GlassButton 
  type="submit" 
  disabled={isSubmitting}
  size="default"
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</GlassButton>
```

**B. Icon-only Buttons:**
```typescript
import { Zap } from 'lucide-react';

<GlassButton size="icon">
  <Zap className="h-5 w-5" />
</GlassButton>
```

**C. Loading States:**
```typescript
import { Loader2 } from 'lucide-react';

<GlassButton 
  disabled={isLoading}
  contentClassName="flex items-center gap-2"
>
  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
  <span>{isLoading ? 'Loading...' : 'Load Data'}</span>
</GlassButton>
```

**D. Button Groups:**
```typescript
<div className="flex gap-4">
  <GlassButton size="sm">Option 1</GlassButton>
  <GlassButton size="sm">Option 2</GlassButton>
  <GlassButton size="sm">Option 3</GlassButton>
</div>
```

### 7.6 Phase 6: Testing & QA (Day 8-9)

1. **Unit Tests:**
   ```typescript
   // __tests__/glass-button.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { GlassButton } from '@/components/ui/glass-button';
   
   describe('GlassButton', () => {
     it('renders children correctly', () => {
       render(<GlassButton>Click me</GlassButton>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
     
     it('handles click events', () => {
       const handleClick = jest.fn();
       render(<GlassButton onClick={handleClick}>Click</GlassButton>);
       fireEvent.click(screen.getByText('Click'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
     
     it('applies size variants correctly', () => {
       const { container } = render(<GlassButton size="sm">Small</GlassButton>);
       expect(container.querySelector('.glass-button')).toHaveClass('text-sm');
     });
   });
   ```

2. **Visual Regression Tests:**
   - Screenshot comparison
   - Cross-browser testing
   - Responsive testing (mobile, tablet, desktop)

3. **Accessibility Tests:**
   ```typescript
   import { axe, toHaveNoViolations } from 'jest-axe';
   expect.extend(toHaveNoViolations);
   
   it('should not have accessibility violations', async () => {
     const { container } = render(<GlassButton>Accessible</GlassButton>);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

4. **Integration Tests:**
   - Test trong context của forms
   - Test với các state management libraries
   - Test với routing

### 7.7 Phase 7: Cleanup (Day 10)

1. **Remove old button component:**
   ```bash
   git rm components/ui/button.tsx
   ```

2. **Remove unused dependencies:**
   ```bash
   npm uninstall [old-button-library]
   ```

3. **Update documentation:**
   - Update component library docs
   - Update style guide
   - Add GlassButton examples

4. **Final commit:**
   ```bash
   git add .
   git commit -m "feat: complete migration to GlassButton component"
   ```

---

## Phần 8: Prop Mapping Reference

### 8.1 Common Props Mapping

| Old Button Prop | GlassButton Equivalent | Notes |
|----------------|------------------------|-------|
| `variant="primary"` | `size="default"` | Default style |
| `size="small"` | `size="sm"` | Small variant |
| `size="large"` | `size="lg"` | Large variant |
| `iconOnly` | `size="icon"` | Icon only button |
| `className` | `className` | Direct pass-through |
| `onClick` | `onClick` | Direct pass-through |
| `disabled` | `disabled` | Direct pass-through |
| `type` | `type` | Direct pass-through |
| Custom content | `children` | Content inside button |
| Inner class | `contentClassName` | Style the inner span |

### 8.2 Migration Examples

**Example 1: Simple Button**
```typescript
// Before
<button className="btn" onClick={() => console.log('clicked')}>
  Click Me
</button>

// After
<GlassButton onClick={() => console.log('clicked')}>
  Click Me
</GlassButton>
```

**Example 2: Button with Icon**
```typescript
// Before
<button className="btn-primary">
  <IconComponent />
  Submit Form
</button>

// After
import { Send } from 'lucide-react';

<GlassButton contentClassName="flex items-center gap-2">
  <Send className="h-5 w-5" />
  <span>Submit Form</span>
</GlassButton>
```

**Example 3: Different Sizes**
```typescript
// Before
<button className="btn-sm">Small</button>
<button className="btn">Default</button>
<button className="btn-lg">Large</button>

// After
<GlassButton size="sm">Small</GlassButton>
<GlassButton size="default">Default</GlassButton>
<GlassButton size="lg">Large</GlassButton>
```

---

## Phần 9: Troubleshooting Guide

### 9.1 Common Issues & Solutions

**Issue 1: CSS không hoạt động**
```
Solution:
- Kiểm tra globals.css đã được import trong _app.tsx hoặc layout.tsx
- Verify Tailwind config includes component paths
- Clear .next cache: rm -rf .next && npm run dev
```

**Issue 2: Import path không hoạt động**
```
Solution:
- Check tsconfig.json có path aliases
- Restart TypeScript server trong VS Code
- Verify file tồn tại tại đúng path
```

**Issue 3: Glass effect không hiển thị**
```
Solution:
- Check CSS variables (--foreground, --background) đã được define
- Verify browser hỗ trợ backdrop-filter
- Add fallback styles cho browser cũ
```

**Issue 4: TypeScript errors**
```
Solution:
- Ensure @types/react is installed
- Check React version compatibility
- Verify all props are correctly typed
```

### 9.2 Browser Compatibility

Fallback cho browsers không hỗ trợ `backdrop-filter`:

```css
@supports not (backdrop-filter: blur(10px)) {
  .glass-button {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.05)
    );
  }
}
```

---

## Phần 10: Performance Optimization

### 10.1 Code Splitting

```typescript
// Lazy load GlassButton if needed
import dynamic from 'next/dynamic';

const GlassButton = dynamic(
  () => import('@/components/ui/glass-button').then(mod => mod.GlassButton),
  { loading: () => <button>Loading...</button> }
);
```

### 10.2 Memoization

```typescript
import { memo } from 'react';

export const MemoizedGlassButton = memo(GlassButton);
```

---

## Phần 11: Documentation

### 11.1 Component Documentation

Tạo file `components/ui/glass-button.md`:

```markdown
# GlassButton Component

Modern glass-morphism button with smooth animations.

## Usage

\`\`\`tsx
import { GlassButton } from '@/components/ui/glass-button';

<GlassButton>Click me</GlassButton>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'default' \| 'sm' \| 'lg' \| 'icon' | 'default' | Button size variant |
| className | string | - | Additional classes for wrapper |
| contentClassName | string | - | Classes for inner content |
| children | ReactNode | - | Button content |

## Examples

### With Icon
\`\`\`tsx
import { Zap } from 'lucide-react';

<GlassButton contentClassName="flex items-center gap-2">
  <Zap className="h-5 w-5" />
  <span>Generate</span>
</GlassButton>
\`\`\`

### Icon Only
\`\`\`tsx
<GlassButton size="icon">
  <Zap className="h-5 w-5" />
</GlassButton>
\`\`\`
```

### 11.2 Update Team Documentation

- Add to component library
- Update design system
- Create Storybook stories (if applicable)
- Update onboarding docs

---

## Phần 12: Timeline & Resources

### 12.1 Estimated Timeline

| Phase | Duration | Team Members |
|-------|----------|--------------|
| Setup & Planning | 1 day | 1 developer |
| Audit & Mapping | 1-2 days | 1-2 developers |
| Migration Execution | 3-5 days | 2-3 developers |
| Testing & QA | 2 days | 1 QA + 1 developer |
| Documentation | 1 day | 1 developer |
| **Total** | **8-11 days** | |

### 12.2 Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking existing functionality | High | Medium | Thorough testing, gradual rollout |
| CSS conflicts | Medium | Low | Namespace CSS, test cross-browser |
| Performance issues | Low | Low | Monitor bundle size, lazy loading |
| Team adoption | Medium | Medium | Good documentation, training session |

### 12.3 Success Criteria

- ✅ All buttons migrated to GlassButton
- ✅ No visual regressions
- ✅ All tests passing
- ✅ Performance maintained or improved
- ✅ Documentation complete
- ✅ Team trained on new component

---

## Phần 13: Rollback Plan

Trong trường hợp cần rollback:

### 13.1 Immediate Rollback
```bash
# Revert last commit
git revert HEAD

# Or reset to previous commit
git reset --hard <commit-hash>

# Deploy previous version
npm run build
npm run deploy
```

### 13.2 Partial Rollback

Nếu chỉ một số components có vấn đề:

```bash
# Restore specific files from backup
git checkout HEAD~1 -- components/Header.tsx

# Or use backup files
cp components/Header.tsx.backup components/Header.tsx
```

---

## Checklist Tổng Thể

### Pre-Implementation
- [ ] Đọc và hiểu toàn bộ kế hoạch
- [ ] Backup toàn bộ codebase
- [ ] Create feature branch
- [ ] Set up staging environment

### Setup Phase
- [ ] Check existing dependencies
- [ ] Install required packages
- [ ] Create folder structure
- [ ] Add utility functions
- [ ] Add CSS styles
- [ ] Configure path aliases
- [ ] Test component in isolation

### Audit Phase
- [ ] Scan all button usages
- [ ] Create button inventory
- [ ] Categorize by priority
- [ ] Estimate migration effort
- [ ] Create migration checklist

### Migration Phase
- [ ] Migrate Priority 1 components
- [ ] Migrate Priority 2 components
- [ ] Migrate Priority 3 components
- [ ] Migrate Priority 4 components
- [ ] Handle special cases
- [ ] Update tests

### Testing Phase
- [ ] Unit tests
- [ ] Integration tests
- [ ] Visual regression tests
- [ ] Accessibility tests
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Performance testing

### Documentation Phase
- [ ] Component documentation
- [ ] Migration guide
- [ ] Update style guide
- [ ] Create examples
- [ ] Training materials

### Deployment Phase
- [ ] Deploy to staging
- [ ] QA approval
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Gather feedback

### Cleanup Phase
- [ ] Remove old button component
- [ ] Remove unused dependencies
- [ ] Delete backup files
- [ ] Update package.json
- [ ] Final commit and tag

---

## Resources & Links

### Documentation
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [class-variance-authority](https://cva.style/docs)
- [lucide-react Icons](https://lucide.dev)

### Tools
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [TypeScript Extension](https://code.visualstudio.com/docs/languages/typescript)

### Testing
- [React Testing Library](https://testing-library.com/react)
- [jest-axe](https://github.com/nickcolley/jest-axe)

---

## Support & Questions

Nếu gặp vấn đề trong quá trình implementation:

1. Check Troubleshooting Guide (Section 9)
2. Review component documentation
3. Check existing issues on GitHub
4. Ask team lead or senior developer

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-05 | Initial implementation plan |

---

**Prepared by:** Development Team  
**Last Updated:** February 05, 2026  
**Status:** Ready for Implementation
