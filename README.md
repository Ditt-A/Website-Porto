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
- A black startup screen is present in the initial HTML. It fades after Vue mounts and the main portrait/fonts are ready. The portrait wait is capped at 3.5 seconds; **Open now** skips it. A failed JavaScript load exposes a retry instead of an endless spinner.
- Pointer and scroll frames update scoped styles on visible elements, outside Vue render state. Unchanged values are skipped; cursor coordinates never propagate through the page root.
- Individual offscreen decorations, marquee, portrait-panel, and project-preview animations pause, including while the tab is hidden. Loaded project images stop their hidden placeholder animations.
- Section geometry is refreshed after layout/size changes. Card bounds are read on entry, before frame writes. Full-page animated star repainting and the oversized warp opening have been removed.
- Large cards use their existing color tint without a live backdrop blur. Mobile navigation/portrait overlays use a cheaper rendering path.
- Reduced motion and native cursor fallbacks remain available.

See `src/assets/images/README.md` for the image inventory and original-file locations.

Measured results and verification scope: [docs/PERFORMANCE.md](docs/PERFORMANCE.md).
