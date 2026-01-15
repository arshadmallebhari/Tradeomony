# Tradeomony Design System

A comprehensive, modern design system for the B2B export-import marketplace, built with Tailwind CSS.

## 🎨 Color Palette

### Primary (Blue) - Trust & Professionalism
Professional blue tones that convey trust and reliability in B2B transactions.

```css
primary-50:  #eff6ff  /* Lightest - backgrounds */
primary-100: #dbeafe  /* Light - hover states */
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6  /* Base */
primary-600: #2563eb  /* Main brand color */
primary-700: #1d4ed8  /* Hover states */
primary-800: #1e40af
primary-900: #1e3a8a  /* Darkest */
```

### Secondary (Gray) - Neutral & Clean
Slate gray tones for text, borders, and backgrounds.

```css
secondary-50:  #f8fafc  /* Lightest backgrounds */
secondary-100: #f1f5f9  /* Light backgrounds */
secondary-200: #e2e8f0  /* Borders */
secondary-300: #cbd5e1  /* Disabled states */
secondary-400: #94a3b8
secondary-500: #64748b  /* Muted text */
secondary-600: #475569
secondary-700: #334155  /* Body text */
secondary-800: #1e293b
secondary-900: #0f172a  /* Headings */
```

### Accent (Gold) - Premium & Value
Warm gold tones for highlighting premium features and calls-to-action.

```css
accent-50:  #fef3c7
accent-100: #fde68a
accent-200: #fcd34d
accent-300: #fbbf24
accent-400: #f59e0b  /* Base */
accent-500: #d97706
accent-600: #b45309  /* Main accent */
accent-700: #92400e
```

### Success (Green) - Verified & Positive
Green tones for success states, verified badges, and positive actions.

```css
success-50:  #f0fdf4
success-100: #dcfce7  /* Verified badge backgrounds */
success-500: #22c55e  /* Icons */
success-600: #16a34a  /* Main success color */
success-700: #15803d
```

### Danger (Red) - Errors & Warnings
Red tones for error states, warnings, and destructive actions.

```css
danger-50:  #fef2f2
danger-100: #fee2e2  /* Error backgrounds */
danger-500: #ef4444
danger-600: #dc2626  /* Main error color */
danger-700: #b91c1c
```

## 📝 Typography

### Font Families

**Sans (Body Text)**: Inter
- Clean, highly legible sans-serif
- Used for body text, UI elements
- Weights: 300, 400, 500, 600, 700, 800

**Display (Headings)**: Outfit
- Modern, geometric sans-serif
- Used for headings, hero text
- Weights: 400, 500, 600, 700, 800

### Usage

```tsx
<h1 className="font-display font-bold">Heading</h1>
<p className="font-sans">Body text</p>
```

### Type Scale

```css
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
text-5xl:  3rem     (48px)
text-6xl:  3.75rem  (60px)
```

## 📏 Spacing

Consistent spacing scale based on 0.25rem (4px) increments.

```css
0:    0px
1:    0.25rem  (4px)
2:    0.5rem   (8px)
3:    0.75rem  (12px)
4:    1rem     (16px)
6:    1.5rem   (24px)
8:    2rem     (32px)
12:   3rem     (48px)
16:   4rem     (64px)
18:   4.5rem   (72px)   /* Custom */
24:   6rem     (96px)
88:   22rem    (352px)  /* Custom */
100:  25rem    (400px)  /* Custom */
112:  28rem    (448px)  /* Custom */
128:  32rem    (512px)  /* Custom */
```

## 🔲 Border Radius

```css
rounded-none: 0px
rounded-sm:   0.125rem (2px)
rounded:      0.25rem  (4px)
rounded-md:   0.375rem (6px)
rounded-lg:   0.5rem   (8px)
rounded-xl:   1rem     (16px)
rounded-2xl:  1.5rem   (24px)
rounded-3xl:  2rem     (32px)
rounded-full: 9999px
```

### Usage
- **Cards**: `rounded-xl` or `rounded-2xl`
- **Buttons**: `rounded-lg`
- **Inputs**: `rounded-lg`
- **Badges**: `rounded-full`
- **Modals**: `rounded-2xl`

## 🌟 Shadows

### Soft Shadows (Default)
Subtle, professional shadows for cards and elevated elements.

```css
shadow-soft:    0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)
shadow-soft-lg: 0 10px 40px -10px rgba(0,0,0,0.1)
```

### Glow Effects
For highlighting interactive elements or premium features.

```css
shadow-glow:    0 0 20px rgba(59,130,246,0.3)
shadow-glow-lg: 0 0 40px rgba(59,130,246,0.4)
```

### Inner Shadow
For inset effects on inputs and containers.

```css
shadow-inner-soft: inset 0 2px 4px 0 rgba(0,0,0,0.06)
```

## 🎬 Animations

### Keyframe Animations

**Fade In**
```css
animate-fade-in
/* 0.5s ease-in-out */
```

**Slide Up**
```css
animate-slide-up
/* Slides from 20px below, 0.5s ease-out */
```

**Slide Down**
```css
animate-slide-down
/* Slides from 20px above, 0.5s ease-out */
```

**Scale In**
```css
animate-scale-in
/* Scales from 95% to 100%, 0.3s ease-out */
```

**Shimmer (Loading)**
```css
animate-shimmer
/* Infinite shimmer effect for skeleton loaders */
```

### Transition Classes

```css
transition-all duration-200  /* Fast interactions */
transition-all duration-300  /* Standard animations */
transition-colors            /* Color-only transitions */
```

## 🔘 Buttons

### Variants

**Primary** - Main CTAs
```tsx
<button className="btn-primary">Get Started</button>
```

**Secondary** - Alternative actions
```tsx
<button className="btn-secondary">Learn More</button>
```

**Outline** - Tertiary actions
```tsx
<button className="btn-outline">View Details</button>
```

**Ghost** - Minimal emphasis
```tsx
<button className="btn-ghost">Cancel</button>
```

**Success** - Positive actions
```tsx
<button className="btn-success">Approve</button>
```

**Danger** - Destructive actions
```tsx
<button className="btn-danger">Delete</button>
```

**Link** - Text-style buttons
```tsx
<button className="btn-link">Learn more →</button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  {/* Default */}
<Button size="lg">Large</Button>
```

## 🏷️ Badges

### Variants

```tsx
<span className="badge-primary">New</span>
<span className="badge-success">Verified</span>
<span className="badge-warning">Pending</span>
<span className="badge-danger">Urgent</span>
<span className="badge-secondary">Draft</span>
```

### Usage
- **Verified sellers**: `badge-success`
- **New products**: `badge-primary`
- **Pending inquiries**: `badge-warning`
- **Urgent items**: `badge-danger`
- **Status indicators**: `badge-secondary`

## 📦 Cards

### Basic Card
```tsx
<div className="card">
  <div className="p-6">Content</div>
</div>
```

### Hoverable Card
```tsx
<div className="card-hover">
  <div className="p-6">Interactive content</div>
</div>
```

### Glass Morphism
```tsx
<div className="glass p-6">
  Translucent card with backdrop blur
</div>
```

## 📝 Form Elements

### Input
```tsx
<input type="text" className="input" placeholder="Enter text" />
```

### Select
```tsx
<select className="select">
  <option>Option 1</option>
</select>
```

### Textarea
```tsx
<textarea className="textarea" placeholder="Enter description"></textarea>
```

### Checkbox
```tsx
<input type="checkbox" className="checkbox" />
```

### Radio
```tsx
<input type="radio" className="radio" />
```

### Labels & Helpers
```tsx
<label className="form-label">Email Address</label>
<input type="email" className="input" />
<p className="form-helper">We'll never share your email</p>
<p className="form-error">Invalid email address</p>
```

## 🚨 Alerts

```tsx
<div className="alert-info">
  <svg>...</svg>
  <span>Informational message</span>
</div>

<div className="alert-success">Success message</div>
<div className="alert-warning">Warning message</div>
<div className="alert-danger">Error message</div>
```

## 🎨 Gradients

### Primary Gradient
```tsx
<div className="gradient-primary">Blue gradient background</div>
```

### Accent Gradient
```tsx
<div className="gradient-accent">Gold gradient background</div>
```

### Mesh Gradient
```tsx
<div className="gradient-mesh">Purple mesh gradient</div>
```

## 🔧 Utility Classes

### Container
```tsx
<div className="container-custom">
  Max-width container with responsive padding
</div>
```

### Section Spacing
```tsx
<section className="section">
  Consistent vertical padding (py-16 md:py-24)
</section>
```

### Skeleton Loader
```tsx
<div className="skeleton h-4 w-32 rounded"></div>
```

### Loading Spinner
```tsx
<div className="spinner"></div>
```

### Dividers
```tsx
<hr className="divider" />
<div className="divider-vertical"></div>
```

### Scrollbar Hide
```tsx
<div className="scrollbar-hide overflow-auto">
  Content with hidden scrollbar
</div>
```

## 🎯 Usage Examples

### Product Card
```tsx
<div className="card-hover">
  <img src="..." className="w-full h-48 object-cover rounded-t-xl" />
  <div className="p-6">
    <div className="flex items-center gap-2 mb-2">
      <span className="badge-success">Verified</span>
      <span className="badge-primary">New</span>
    </div>
    <h3 className="font-display font-semibold text-xl mb-2">Product Name</h3>
    <p className="text-secondary-600 mb-4">Description...</p>
    <button className="btn-primary w-full">Send Inquiry</button>
  </div>
</div>
```

### Form
```tsx
<form className="space-y-6">
  <div>
    <label className="form-label">Company Name</label>
    <input type="text" className="input" required />
  </div>
  
  <div>
    <label className="form-label">Category</label>
    <select className="select">
      <option>Textiles</option>
      <option>Electronics</option>
    </select>
  </div>
  
  <div>
    <label className="form-label">Description</label>
    <textarea className="textarea"></textarea>
    <p className="form-helper">Minimum 50 characters</p>
  </div>
  
  <button type="submit" className="btn-primary">Submit</button>
</form>
```

### Alert Banner
```tsx
<div className="alert-success">
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
  <span>Your product has been successfully listed!</span>
</div>
```

## 📱 Responsive Design

All components are mobile-first and responsive:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive grid */}
</div>

<h1 className="text-3xl md:text-4xl lg:text-5xl">
  {/* Responsive typography */}
</h1>

<div className="p-4 md:p-6 lg:p-8">
  {/* Responsive spacing */}
</div>
```

## 🎨 Design Principles

1. **Trust-Focused**: Professional blues, verified badges, security indicators
2. **Clean & Modern**: Ample whitespace, subtle shadows, smooth animations
3. **Accessible**: High contrast ratios, focus states, semantic HTML
4. **Consistent**: Unified spacing, typography, and color usage
5. **Responsive**: Mobile-first approach, touch-friendly targets
6. **Premium**: Smooth animations, glass effects, gradient accents

---

## 🚀 Quick Start

Import the design system in your components:

```tsx
import '@/app/globals.css';
```

Use Tailwind classes directly or use the component classes:

```tsx
// Direct Tailwind
<button className="px-6 py-3 bg-primary-600 text-white rounded-lg">
  Button
</button>

// Component class
<button className="btn-primary">
  Button
</button>
```

---

**Design System Version**: 1.0  
**Last Updated**: January 2026  
**Maintained by**: Tradeomony Team
