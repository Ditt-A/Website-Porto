<script setup lang="ts">
defineEmits<{ complete: [] }>()

const rays = Array.from({ length: 96 }, (_, index) => ({
  id: index,
  angle: `${((index * 137.507764) % 360).toFixed(2)}deg`,
  start: `${5 + (index * 13) % 25}vmin`,
  flight: `${40 + (index * 23) % 76}vmax`,
  length: `${4 + index % 7 * 1.5}vmin`,
  thickness: `${index % 9 === 0 ? 2 : 1}px`,
  delay: `${index % 8 * 18}ms`,
  color: index % 13 === 0 ? '#ffd5ad' : index % 3 === 0 ? '#77caff' : '#d6edff',
}))
</script>

<template>
  <div class="warp-intro" aria-hidden="true" @animationend.self="$emit('complete')">
    <div class="warp-veil"></div>
    <div class="warp-dust"></div>
    <div class="warp-rays">
      <span
        v-for="ray in rays"
        :key="ray.id"
        :style="{
          '--angle': ray.angle,
          '--start': ray.start,
          '--flight': ray.flight,
          '--length': ray.length,
          '--thickness': ray.thickness,
          '--delay': ray.delay,
          '--ray-color': ray.color,
        }"
      ></span>
    </div>
    <div class="warp-bloom"></div>
    <div class="warp-portal"></div>
    <div class="warp-flare"></div>
  </div>
</template>

<style scoped>
.warp-intro {
  position: fixed;
  inset: 0;
  z-index: 50;
  overflow: hidden;
  pointer-events: none;
  animation: warpExit 2000ms linear both;
}

.warp-veil {
  position: absolute;
  inset: 0;
  background: #020617;
  animation: veilOpen 1920ms ease-in-out both;
}

.warp-dust {
  position: absolute;
  inset: -15%;
  background-image:
    radial-gradient(1px 1px at 22% 26%, #d9ecff 98%, transparent),
    radial-gradient(1px 1px at 76% 58%, #a9d8ff 98%, transparent),
    radial-gradient(1.5px 1.5px at 48% 84%, #e3f2ff 98%, transparent);
  background-size: 211px 193px, 367px 317px, 487px 431px;
  transform-origin: 50% 44%;
  animation: dustApproach 1400ms ease-in both;
}

.warp-rays {
  position: absolute;
  inset: 0;
}

.warp-rays span {
  position: absolute;
  top: 44%;
  left: 50%;
  width: var(--length);
  height: var(--thickness);
  background: linear-gradient(90deg, transparent, var(--ray-color));
  border-radius: 999px;
  transform-origin: left center;
  animation: starFlight 1500ms cubic-bezier(0.55, 0.05, 0.82, 0.45) var(--delay) both;
}

.warp-bloom {
  position: absolute;
  top: 44%;
  left: 50%;
  width: min(1100px, 120vw);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(93, 196, 255, 0.38), rgba(39, 114, 222, 0.2) 34%, transparent 68%);
  animation: portalBloom 1900ms ease-out both;
}

.warp-portal {
  position: absolute;
  top: 44%;
  left: 50%;
  width: min(32vmin, 320px);
  aspect-ratio: 1;
  border: 2px solid rgba(187, 235, 255, 0.95);
  border-radius: 50%;
  background: radial-gradient(circle, transparent 48%, rgba(44, 160, 245, 0.12) 67%, rgba(149, 226, 255, 0.24));
  box-shadow: 0 0 12px rgba(133, 220, 255, 0.7), 0 0 40px rgba(50, 143, 255, 0.45), inset 0 0 22px rgba(97, 192, 255, 0.4);
  animation: portalArrival 2000ms cubic-bezier(0.6, 0.08, 0.7, 0.5) both;
}

.warp-portal::before,
.warp-portal::after {
  position: absolute;
  content: "";
  border-radius: 50%;
}

.warp-portal::before {
  inset: -10px;
  border: 1px solid rgba(112, 202, 255, 0.48);
  box-shadow: 0 0 20px rgba(74, 165, 255, 0.26);
}

.warp-portal::after {
  inset: 9px;
  border: 1px dashed rgba(166, 230, 255, 0.55);
  animation: portalOrbit 1800ms linear both;
}

.warp-flare {
  position: absolute;
  top: 44%;
  left: 50%;
  width: min(1400px, 120vw);
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(78, 180, 255, 0.35) 28%, rgba(202, 241, 255, 0.9) 50%, rgba(78, 180, 255, 0.35) 72%, transparent);
  box-shadow: 0 0 14px rgba(110, 204, 255, 0.3);
  animation: portalFlare 1800ms ease-out both;
}

@keyframes veilOpen {
  0%, 48% { opacity: 1; }
  88%, 100% { opacity: 0; }
}

@keyframes dustApproach {
  0% { opacity: 0.55; transform: scale(0.8); }
  32% { opacity: 0.85; }
  100% { opacity: 0; transform: scale(1.75); }
}

@keyframes starFlight {
  0% { opacity: 0; transform: rotate(var(--angle)) translateX(var(--start)) scaleX(0.015); }
  18% { opacity: 0.85; }
  38% { transform: rotate(var(--angle)) translateX(calc(var(--start) * 1.8)) scaleX(0.16); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: rotate(var(--angle)) translateX(var(--flight)) scaleX(1.45); }
}

@keyframes portalArrival {
  0%, 12% { opacity: 0; transform: translate(-50%, -50%) scale(0.08); }
  28% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.35); }
  43% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  55% { opacity: 1; transform: translate(-50%, -50%) scale(1.6); }
  86% { opacity: 0.6; transform: translate(-50%, -50%) scale(14); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(16); }
}

@keyframes portalBloom {
  0%, 14% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
  53% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.7); }
}

@keyframes portalOrbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(100deg); }
}

@keyframes portalFlare {
  0%, 28% { opacity: 0; transform: translate(-50%, -50%) scaleX(0.08); }
  54% { opacity: 0.85; }
  100% { opacity: 0; transform: translate(-50%, -50%) scaleX(1.15); }
}

@keyframes warpExit {
  0%, 86% { opacity: 1; }
  100% { opacity: 0; }
}

@media (max-width: 820px) {
  .warp-rays span:nth-child(3n) { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .warp-intro { display: none; }
}
</style>
