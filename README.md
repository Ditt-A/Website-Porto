# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Performance

- Runtime raster images use resized WebP files, including transparent sky/space assets. The profile photo has 1x/2x variants and high fetch priority; lower-page images use lazy loading.
- Images are imported from `src/assets/images.ts`, producing content-hashed URLs under `/assets/` instead of fixed public filenames.
- `vercel.json` caches hashed assets for one year with `immutable`. HTML is revalidated on every visit, so a new deployment can reference new assets immediately. Unversioned favicons and the downloadable CV use shorter cache lifetimes.
- Offscreen decorative, marquee, portrait-panel, and project-preview animations pause. Section geometry is refreshed when layout changes instead of being read on every scroll frame.
- Reduced motion and native cursor fallbacks remain available.

See `src/assets/images/README.md` for the image inventory and original-file locations.
