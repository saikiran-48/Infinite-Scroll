# 🌃 Infinite Gallery | React + Intersection Observer

> A beautifully minimal educational project demonstrating **infinite scroll pagination** using the powerful **Intersection Observer API**. Build performant, user-friendly content feeds without scroll event listeners.

![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🎯 Intersection Observer API** - Modern, performant way to detect when elements enter viewport
- **⚡ Zero Dependencies** - No bloated pagination libraries (except Pexels API client)
- **📦 Custom Hook** - Reusable `useInfiniteScroll` hook for any project
- **💨 Smooth Loading States** - Skeleton loading animations while fetching data
- **🎨 Modern UI** - Smooth transitions, hover effects, and responsive grid
- **♿ Accessibility Ready** - Lazy loading images, semantic HTML

---

## 🎓 Learning Objective

This project teaches you the **Intersection Observer API** — a fundamental web API for building modern features like infinite scroll, lazy loading, and analytics tracking. It's a perfect beginner-to-intermediate project that avoids outdated `scroll` event approaches.

---

## 🦸 The Hero: Intersection Observer API

### What is the Intersection Observer?

The **Intersection Observer API** is a browser API that lets you efficiently detect when DOM elements become visible or invisible in the viewport. Instead of constantly listening to scroll events (which is bad for performance), you create an observer that watches specific elements and triggers a callback when they intersect with the viewport.

### Why Is It Superior to Scroll Events?

| Approach | Pros | Cons |
|----------|------|------|
| **Scroll Events** | Simple to understand | ❌ Fires 60+ times/second<br>❌ Blocks main thread<br>❌ Poor mobile performance<br>❌ Jank city |
| **Intersection Observer** | ✅ Async, non-blocking<br>✅ Optimized by browser<br>✅ Mobile-friendly<br>✅ Better performance | Requires more setup |

### How It Works (Visual)

```
┌─────────────────────────────────────┐
│         Browser Viewport             │  ← Intersection Observer watches
│                                       │     this area
├─────────────────────────────────────┤
│                                       │
│   Visible Content (in intersection)   │  → Observer fires callback
│                                       │
├─────────────────────────────────────┤
│   Hidden Content (below viewport)     │  → Waiting for intersection
│                                       │
└─────────────────────────────────────┘
        ↓ User scrolls down ↓
        Loader element becomes visible
        → Callback triggers
        → Fetch next page of images
```

### Implementation in This Project

```typescript
const observer = new IntersectionObserver(([entry]) => {
  // This callback fires when the observed element
  // enters or exits the viewport
  if (entry.isIntersecting) {
    callback(); // Fetch more images!
  }
});

// Watch the loader element at the bottom
observer.observe(loaderElement);

// Clean up when component unmounts
observer.unobserve(loaderElement);
```

---

## 📂 Project Structure

```
infinite-gallery/
├── src/
│   ├── App.tsx              # Main gallery component
│   ├── App.css              # Styling (grid, animations, skeleton)
│   ├── useInfiniteScroll.ts # ⭐ Custom hook with Intersection Observer
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts           # Vite build configuration
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or pnpm
- Pexels API Key (free from [pexels.com/api](https://www.pexels.com/api))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/infinite-gallery.git
cd infinite-gallery

# 2. Install dependencies
npm install

# 3. Create .env.local file
echo "VITE_PEXELS_API_KEY=your_api_key_here" > .env.local

# 4. Start development server
npm run dev

# 5. Open http://localhost:5173
```

---

## 💡 How It Works: Step by Step

### 1. **Create the Custom Hook** (`useInfiniteScroll.ts`)

```typescript
export const useInfiniteScroll = (
  callback: () => void,
  enabled = true
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Create observer with default options
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback(); // Trigger load more
      }
    });

    const el = ref.current;
    if (el) observer.observe(el);

    // Cleanup
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [callback, enabled]);

  return ref;
};
```

**Why this design?**
- ✅ Reusable across any React component
- ✅ Clean dependency management
- ✅ Proper cleanup prevents memory leaks
- ✅ `enabled` prop prevents unnecessary requests

### 2. **Use the Hook in Component** (`App.tsx`)

```typescript
export default function App() {
  const [images, setImages] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch when page changes
  useEffect(() => {
    const fetchImages = async () => {
      if (loading) return;
      setLoading(true);

      const res = await client.photos.curated({
        page,
        per_page: 6,
      });

      setImages((prev) => [...prev, ...res.photos]);
      setLoading(false);
    };

    fetchImages();
  }, [page]);

  // When loader element becomes visible, increment page
  const loaderRef = useInfiniteScroll(
    () => setPage((prev) => prev + 1),
    !loading // Disabled while loading
  );

  return (
    <div className="container">
      <h2>INFINITE GALLERY</h2>
      
      <div className="grid">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.src.medium}
            className="image"
            loading="lazy"
          />
        ))}
        
        {/* Skeleton loaders while fetching */}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>

      {/* 🎯 This element triggers infinite scroll */}
      <div ref={loaderRef} className="loader-trigger" />
    </div>
  );
}
```

### 3. **The Data Flow**

```
User scrolls to bottom
         ↓
loader element enters viewport
         ↓
IntersectionObserver detects isIntersecting = true
         ↓
callback() fires
         ↓
setPage(page + 1)
         ↓
useEffect with [page] dependency fires
         ↓
fetchImages() executes
         ↓
API request to Pexels
         ↓
setImages(...prev, ...newPhotos)
         ↓
Component re-renders with new images
         ↓
loader element pushed down (new page)
         ↓
Cycle repeats!
```

---

## ⚙️ Intersection Observer Options (Advanced)

The hook uses default options, but you can customize:

```typescript
const observer = new IntersectionObserver(callback, {
  root: null,           // viewport
  rootMargin: "200px",  // Start loading 200px before entering
  threshold: 0.1        // Trigger when 10% visible (0-1)
});
```

**Try experimenting:**
```typescript
// Eagerly load (before user sees):
rootMargin: "500px"

// Only trigger when mostly visible:
threshold: 0.5

// Trigger multiple times:
threshold: [0.25, 0.5, 0.75, 1]
```

---

## 🎨 Styling & Animations

The project includes:

- **Skeleton Loading** - Shimmer animation while fetching
- **Image Hover Effects** - Scale up with shadow on hover
- **Fade-in Animation** - Smooth appearance of new images
- **Responsive Grid** - 3 columns on desktop (adjust in CSS)

```css
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 🧪 Testing the Hook

Test the custom hook in isolation:

```typescript
import { render } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

it('calls callback when element intersects', () => {
  const callback = vi.fn();
  
  const TestComponent = () => {
    const ref = useInfiniteScroll(callback);
    return <div ref={ref} />;
  };

  render(<TestComponent />);
  // Mock IntersectionObserver and verify callback
});
```

---

## 📈 Performance Tips

1. **Limit `per_page`** - Fetch 6-12 items per request, not 100
2. **Lazy Load Images** - Use `loading="lazy"` attribute
3. **Debounce Callbacks** - Add delay to prevent double-fetching (optional)
4. **Stop at End** - Add `hasMore` state to prevent infinite requests

---

## 🚀 Production Improvements

To make this production-ready:

```typescript
// 1. Add error handling
const [error, setError] = useState<string | null>(null);

try {
  const res = await client.photos.curated(...);
} catch (err) {
  setError("Failed to load images");
}

// 2. Add pagination limit
const MAX_PAGES = 50;
if (page > MAX_PAGES) return;

// 3. Prevent duplicate requests
const isFetchingRef = useRef(false);

// 4. Extract to custom hook
function useInfiniteImages(pageSize: number = 6) {
  // All image logic here
  return { images, loading, error, loadMore };
}
```

---

## 🎯 Key Takeaways

| Concept | Takeaway |
|---------|----------|
| **Intersection Observer API** | Modern, performant alternative to scroll listeners |
| **Custom Hooks** | Encapsulate logic for reusability and testing |
| **Dependency Arrays** | Critical for cleanup and preventing memory leaks |
| **Loading States** | Always show feedback (skeleton, spinner, error) |
| **Ref Management** | Use refs for DOM access, manage cleanup |

---

## 🔗 Resources

- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [React Docs: useRef](https://react.dev/reference/react/useRef)
- [Pexels API](https://www.pexels.com/api)
- [Web.dev: Intersection Observer](https://web.dev/articles/intersectionobserver-v2)

---

## 📝 Project Learnings

This project demonstrates:

✅ **React Hooks** - `useState`, `useEffect`, `useRef`  
✅ **TypeScript** - Proper typing for custom hooks  
✅ **Browser APIs** - Intersection Observer  
✅ **Performance** - Why scroll events are bad  
✅ **Component Design** - Separation of concerns  
✅ **API Integration** - Async/await with external APIs  
✅ **Loading States** - UX best practices  
✅ **CSS Animations** - Modern CSS techniques  

---

## 🤝 Contributing

Found a bug or have improvements? Feel free to open an issue or PR!

---

## 📄 License

MIT © 2025

---

## 🙏 Credits

- Gallery images from [Pexels API](https://www.pexels.com)
- Built with [React](https://react.dev) + [Vite](https://vitejs.dev)

---

## 🔥 Want to Extend This?

Try adding these features:

- [ ] Search functionality
- [ ] Filter by category
- [ ] Dark/Light mode toggle
- [ ] Save favorites to localStorage
- [ ] Share images feature
- [ ] Loading skeleton variations
- [ ] Keyboard navigation
- [ ] Responsive mobile grid

**Happy learning!** 🚀