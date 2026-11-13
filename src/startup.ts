import { nextTick } from 'vue'

// The opening screen waits for useful content, not for every decorative asset.
export async function finishStartup() {
  await nextTick()
  window.dispatchEvent(new Event('portfolio:mounted'))

  const portrait = document.querySelector<HTMLImageElement>('.hero-visual img')
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      Promise.allSettled([portrait?.decode(), document.fonts.ready]),
      new Promise<void>((resolve) => {
        timeout = setTimeout(resolve, 3500)
      }),
    ])
  } finally {
    clearTimeout(timeout)
    window.dispatchEvent(new Event('portfolio:ready'))
  }
}
