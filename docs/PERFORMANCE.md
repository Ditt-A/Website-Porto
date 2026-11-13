# Rendering and startup performance

The portfolio uses a static Vite build on Vercel. The main bottleneck in the
inspected release was browser rendering during mouse movement and scrolling,
not a server-side model or API call.

## Changes

- The black loading screen is in `index.html`, so it appears before application
  JavaScript loads. `src/startup.ts` waits for Vue's first render and portrait/font
  readiness, with a bounded 3.5-second wait. Open now releases the screen early.
  Failure to load the app exposes Reload after 12 seconds. Reduced motion,
  keyboard focus, `aria-busy`, and inert content are handled explicitly.
- `src/composables/usePortfolioMotion.ts` owns transient frame state. Only section,
  timeline, and motion-preference state participates in Vue rendering. Cursor
  and parallax variables are written on their consumers rather than inherited
  from the page root. Identical values are not written again.
- Intersection observers track individual decorations, not only their tall
  parent stages. Offscreen animation work and hidden image placeholders pause.
- Scroll geometry is cached until layout changes; pointer-card geometry is read
  on entry before style writes. Star texture remains static. Reveals use opacity
  and transform without animated blur or clipping. Large backdrop blurs and the
  old warp intro were removed; the visual content and links are preserved.
- Existing hashed WebP assets and immutable Vercel asset caching are retained.

## Local comparison

Measured against commit `587f081` using the same production-preview server,
Chromium, 1440 × 900 viewport, and **4× CPU throttling**. Each interaction ran
120 animation frames. Measurements include the page's ambient animation work.

| Measurement | Before | After |
|---|---:|---:|
| Pointer: style recalculation time | 6.863 s | 0.676 s |
| Pointer: layout count | 120 | 1 |
| Pointer: root style mutation records | 927 | 0 |
| Scroll: style recalculation time | 6.705 s | 0.980 s |
| Scroll: layout count | 139 | 30 |
| Scroll: root style mutation records | 272 | 0 |
| Initially running animations | 8 | 4 |
| Production CSS, gzip | 10.02 kB | 8.95 kB |

These are controlled local browser measurements, not Lighthouse scores or
real-user Core Web Vitals. Network/device conditions and Vercel field results
can differ. The loading screen does not preload every decorative or project
image; those retain their own lazy loading.

## Verification

`npm run build` performs the TypeScript check and production build. Browser
checks cover slow startup, early dismissal, an unavailable image, failed-script
retry, reduced motion, cursor fallback, anchor navigation, accordions, timeline
visibility, project images, CV download, and responsive overflow.
