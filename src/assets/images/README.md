# Portfolio image assets

Runtime images are imported through `../images.ts`. Vite adds content hashes to their production filenames under `/assets/`, so changed images get new URLs while unchanged files can stay cached.

- `profile-720.webp` and `profile-1440.webp`: responsive portrait, with the source photo's EXIF orientation applied before conversion.
- `projects/`: Brain Tumour Segmentation, AMANA, Face Spoofing Detection, Robust Identity Card OCR, Kalimantan FireWatch, and Senandika / AI-MoodBand previews.
- `logos/`: organization and competition logos. Raster logos are WebP; the original Komdigi and Pertamina vectors remain SVG.
- `space/`: six transparent space decorations.
- `sky/`: cloud, balloon, plane, birds, and sun, with their original alpha channels preserved after resizing.
- `cursor/magnifier.webp`: transparent magnifying-glass cursor, displayed at 64 CSS pixels.

Original project images are archived locally in `C:\Users\USER\Downloads\WebPorto-Original-Images-20261027`, preserving their former project paths. The original profile photo is also retained at `src/assets/profile.jpg`; it is not included in production output.

Generation originals and prompts remain in these Downloads folders:

- `WebPorto-Space-Icons-Realistic`
- `WebPorto-Sky-Assets-Realistic`
- `WebPorto-Cursor-Assets`
- `WebPorto-Brand-Assets` (favicon)

Organization logo sources:

- Pertamina Patra Niaga: https://pertaminapatraniaga.com/images/pertamina.svg
- Komdigi: https://commons.wikimedia.org/wiki/File:Logo_Kementerian_Komunikasi_dan_Digital_Republik_Indonesia_(2024).svg

Favicons remain in `public/` in browser-native ICO/PNG formats.
