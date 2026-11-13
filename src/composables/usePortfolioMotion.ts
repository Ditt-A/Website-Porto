import { onMounted, onUnmounted, ref } from 'vue'

export type SpaceObject = {
  id: string
  image: string
  x: number
  y: number
  size: number
  rotation: number
  depth: number
  speed: number
  parallaxRange: number
  opacity: number
  duration: number
}

export type SkyObject = SpaceObject & {
  aspectRatio: number
  mobileX: number
}

// High-frequency animation state stays outside Vue and outside inherited root styles.
export function usePortfolioMotion(options: {
  sectionIds: string[]
  spaceObjects: SpaceObject[]
  skyObjects: SkyObject[]
}) {
  const { sectionIds, spaceObjects, skyObjects } = options
  const portfolioShell = ref<HTMLElement | null>(null)
  const spaceStage = ref<HTMLElement | null>(null)
  const skyStage = ref<HTMLElement | null>(null)
  const atmosphereStage = ref<HTMLElement | null>(null)
  const experienceTimeline = ref<HTMLOListElement | null>(null)
  const activeSection = ref('home')
  const activeExperience = ref(-1)
  const prefersReducedMotion = ref(false)
  let spaceBounds = { width: 0, height: 0, viewportHeight: 0 }
  let skyBounds = { width: 0, height: 0, top: 0, viewportHeight: 0 }
  let atmosphereBounds = { top: 0, height: 0, viewportHeight: 0 }
  let timelineMetrics = { top: 0, height: 0, markers: [] as number[] }
  let sectionPositions: { id: string; top: number }[] = []
  let scrollY = 0,
    pointerX = 0,
    pointerY = 0
  let scrollFrame = 0,
    pointerFrame = 0,
    resizeFrame = 0
  let cursorAssetLoaded = false,
    cursorVisible = false,
    cursorPressed = false,
    cursorInteractive = false
  let customCursor = false
  let latestPointer = { x: 0, y: 0, clientX: -120, clientY: -120 }
  let pointerCard: HTMLElement | null = null
  let activeGlareCard: HTMLElement | null = null
  let glareBounds: {
    left: number
    top: number
    width: number
    height: number
    scrollY: number
  } | null = null
  let cursor: HTMLElement | null = null,
    cursorLight: HTMLElement | null = null
  let hero: HTMLElement | null = null,
    terminal: HTMLElement | null = null,
    progress: HTMLElement | null = null
  let motionPreference: MediaQueryList, finePointerPreference: MediaQueryList
  let revealObserver: IntersectionObserver,
    sceneObserver: IntersectionObserver,
    boundsObserver: ResizeObserver
  let spaceNodes: HTMLElement[] = [],
    skyNodes: HTMLElement[] = [],
    projectNodes: HTMLElement[] = []
  const visibleNodes = new Set<Element>()
  const styles = new WeakMap<HTMLElement, Map<string, string>>()
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)
  const motionEnabled = () =>
    !prefersReducedMotion.value && finePointerPreference?.matches
  const setStyles = (
    element: HTMLElement | null,
    values: Record<string, string>,
  ) => {
    if (!element) return
    let previous = styles.get(element)
    if (!previous) {
      previous = new Map()
      styles.set(element, previous)
    }
    for (const [key, value] of Object.entries(values)) {
      if (previous.get(key) === value) continue
      element.style.setProperty(key, value)
      previous.set(key, value)
    }
  }

  const updateAmbientBounds = () => {
    // Cache section geometry on layout changes instead of reading layout on every scroll frame.
    sectionPositions = sectionIds.flatMap((id) => {
      const section = document.getElementById(id)
      return section
        ? [{ id, top: section.getBoundingClientRect().top + window.scrollY }]
        : []
    })

    if (spaceStage.value) {
      spaceBounds = {
        width: spaceStage.value.clientWidth,
        height: spaceStage.value.clientHeight,
        viewportHeight: window.innerHeight,
      }
    }

    if (skyStage.value) {
      skyBounds = {
        width: skyStage.value.clientWidth,
        height: skyStage.value.clientHeight,
        top: skyStage.value.getBoundingClientRect().top + window.scrollY,
        viewportHeight: window.innerHeight,
      }
    }

    if (atmosphereStage.value) {
      atmosphereBounds = {
        top: atmosphereStage.value.getBoundingClientRect().top + window.scrollY,
        height: atmosphereStage.value.clientHeight,
        viewportHeight: window.innerHeight,
      }
    }

    if (experienceTimeline.value) {
      timelineMetrics = {
        top:
          experienceTimeline.value.getBoundingClientRect().top +
          window.scrollY +
          12,
        height: experienceTimeline.value.clientHeight - 24,
        markers: [
          ...experienceTimeline.value.querySelectorAll<HTMLElement>(
            '.timeline-entry',
          ),
        ].map((entry) => {
          const marker = entry.querySelector<HTMLElement>('.timeline-marker')
          return (
            entry.offsetTop +
            (marker?.offsetTop ?? 40) +
            (marker?.offsetHeight ?? 14) / 2 -
            12
          )
        }),
      }
    }

    updateAllMotionStyles()
    updateScrollPosition()
  }

  const spaceObjectStyle = (object: SpaceObject): Record<string, string> => {
    const { width, height, viewportHeight } = spaceBounds
    if (!width || !height) return { opacity: '0' }

    const compact = width <= 820
    const size = object.size * clamp(width / 1440, compact ? 0.46 : 0.6, 1)
    const angle = ((Math.abs(object.rotation) + 3) * Math.PI) / 180
    // Reserve room for the rotated corners and the child's gentle floating animation.
    const inset = 16 + (size * (Math.cos(angle) + Math.sin(angle) - 1)) / 2 + 12
    const baseX = width * object.x - size / 2
    const isHeroObject = object.id === 'planet' || object.id === 'comet'
    const baseY =
      compact && isHeroObject
        ? viewportHeight * 0.105 - size / 2
        : height * object.y - size / 2
    const localScroll = scrollY - Math.max(0, baseY - viewportHeight / 2)
    const scrollShift = !motionEnabled()
      ? 0
      : clamp(
          localScroll * object.speed,
          -object.parallaxRange,
          object.parallaxRange,
        )
    const pointerShiftX = !motionEnabled() ? 0 : pointerX * object.depth
    const pointerShiftY = !motionEnabled() ? 0 : pointerY * object.depth * 0.7
    const x = clamp(
      baseX + pointerShiftX,
      inset,
      Math.max(inset, width - size - inset),
    )
    const y = clamp(
      baseY + pointerShiftY + scrollShift,
      inset,
      Math.max(inset, height - size - inset),
    )

    return {
      width: `${size.toFixed(1)}px`,
      height: `${size.toFixed(1)}px`,
      '--space-x': `${x.toFixed(1)}px`,
      '--space-y': `${y.toFixed(1)}px`,
      '--space-rotation': `${object.rotation}deg`,
      '--space-opacity': String(object.opacity),
      '--space-duration': `${object.duration}s`,
      '--space-delay': `${-object.duration * 0.35}s`,
    }
  }

  const skyObjectStyle = (object: SkyObject): Record<string, string> => {
    const { width, height, top, viewportHeight } = skyBounds
    if (!width || !height) return { opacity: '0' }

    const compact = width <= 820
    const objectWidth =
      object.size * clamp(width / 1440, compact ? 0.46 : 0.6, 1)
    const objectHeight = objectWidth / object.aspectRatio
    const angle = ((Math.abs(object.rotation) + 3) * Math.PI) / 180
    const drift = object.id === 'cloud' ? (compact ? 14 : 32) : 6
    // Reserve the complete animated envelope, including the sun's pulse and balloon's bob.
    const insetX =
      24 +
      drift +
      objectWidth * 0.04 +
      Math.max(
        0,
        (objectWidth * Math.cos(angle) +
          objectHeight * Math.sin(angle) -
          objectWidth) /
          2,
      )
    const insetY =
      40 +
      objectHeight * 0.04 +
      Math.max(
        0,
        (objectHeight * Math.cos(angle) +
          objectWidth * Math.sin(angle) -
          objectHeight) /
          2,
      )
    const flying =
      motionEnabled() && (object.id === 'plane' || object.id === 'birds')
    const baseX = flying
      ? insetX
      : width * (compact ? object.mobileX : object.x) - objectWidth / 2
    const baseY = height * object.y - objectHeight / 2
    const localScroll = scrollY - Math.max(0, top + baseY - viewportHeight / 2)
    const scrollShift = !motionEnabled()
      ? 0
      : clamp(
          localScroll * object.speed,
          -object.parallaxRange,
          object.parallaxRange,
        )
    const pointerShiftX = !motionEnabled() ? 0 : pointerX * object.depth
    const pointerShiftY = !motionEnabled() ? 0 : pointerY * object.depth * 0.6
    const x = clamp(
      baseX + pointerShiftX,
      insetX,
      Math.max(insetX, width - objectWidth - insetX),
    )
    const y = clamp(
      baseY + pointerShiftY + scrollShift,
      insetY,
      Math.max(insetY, height - objectHeight - insetY),
    )

    return {
      width: `${objectWidth.toFixed(1)}px`,
      height: `${objectHeight.toFixed(1)}px`,
      '--sky-x': `${x.toFixed(1)}px`,
      '--sky-y': `${y.toFixed(1)}px`,
      '--sky-rotation': `${object.rotation}deg`,
      '--sky-opacity': String(object.opacity),
      '--sky-duration': `${object.duration}s`,
      '--sky-delay': `${-object.duration * 0.35}s`,
      '--sky-drift': `${drift}px`,
      '--sky-flight-distance': `${Math.max(0, width - objectWidth - insetX - x).toFixed(1)}px`,
    }
  }

  const updateHero = () =>
    setStyles(hero, {
      '--parallax-y': `${motionEnabled() ? clamp(scrollY * -0.045, -70, 70).toFixed(1) : 0}px`,
      '--tilt-x': `${(pointerY * -4).toFixed(2)}deg`,
      '--tilt-y': `${(pointerX * 5).toFixed(2)}deg`,
    })
  const updateProjects = (all = false) =>
    projectNodes.forEach((element, index) => {
      if (!all && !visibleNodes.has(element)) return
      const sign = index % 2 === 0 ? 1 : -1
      setStyles(element, {
        '--project-shift-x': `${(pointerX * sign * 8).toFixed(1)}px`,
        '--project-shift-y': `${(pointerY * sign * -6).toFixed(1)}px`,
        '--preview-shift-x': `${(pointerX * sign * -12).toFixed(1)}px`,
        '--preview-shift-y': `${(pointerY * sign * 8).toFixed(1)}px`,
      })
    })
  const updateSceneStyles = (all = false) => {
    spaceNodes.forEach((node, index) => {
      if (all || visibleNodes.has(node))
        setStyles(node, spaceObjectStyle(spaceObjects[index]!))
    })
    skyNodes.forEach((node, index) => {
      if (all || visibleNodes.has(node))
        setStyles(node, skyObjectStyle(skyObjects[index]!))
    })
    if (all || (hero && visibleNodes.has(hero))) updateHero()
    if (all || (terminal && visibleNodes.has(terminal)))
      setStyles(terminal, {
        '--parallax-y': `${motionEnabled() ? clamp(scrollY * -0.025, -48, 48).toFixed(1) : 0}px`,
      })
    if (
      all ||
      (atmosphereStage.value && visibleNodes.has(atmosphereStage.value))
    ) {
      const { top, height, viewportHeight } = atmosphereBounds
      const localScroll = scrollY + viewportHeight * 0.5 - top - height * 0.5
      const amount = height
        ? clamp((scrollY + viewportHeight * 0.65 - top) / height, 0, 1)
        : 0
      setStyles(atmosphereStage.value, {
        '--haze-opacity': (motionEnabled()
          ? 0.3 + amount * 0.55
          : 0.55
        ).toFixed(3),
        '--atmosphere-far-y': `${motionEnabled() ? clamp(localScroll * -0.035, -50, 50).toFixed(1) : 0}px`,
        '--atmosphere-near-y': `${motionEnabled() ? clamp(localScroll * -0.1, -110, 110).toFixed(1) : 0}px`,
        '--pointer-soft-x': `${(pointerX * 18).toFixed(1)}px`,
        '--pointer-soft-x-inverse': `${(pointerX * -18).toFixed(1)}px`,
      })
    }
    updateProjects(all)
  }
  const updateAllMotionStyles = () => updateSceneStyles(true)
  const clearGlassGlare = () => {
    setStyles(activeGlareCard, { '--glare-active': '0' })
    activeGlareCard = null
  }
  const updateGlassGlare = () => {
    if (activeGlareCard !== pointerCard) clearGlassGlare()
    if (!pointerCard || !glareBounds || !motionEnabled()) return
    activeGlareCard = pointerCard
    const { left, top, width, height } = glareBounds
    if (!width || !height) return
    setStyles(activeGlareCard, {
      '--glare-x': `${(clamp((latestPointer.clientX - left) / width, 0, 1) * 100).toFixed(2)}%`,
      '--glare-y': `${(clamp((latestPointer.clientY - top + scrollY - glareBounds.scrollY) / height, 0, 1) * 100).toFixed(2)}%`,
      '--glare-active': '1',
    })
  }
  const renderCursor = () => {
    const visible = cursorAssetLoaded && cursorVisible && motionEnabled()
    if (visible !== customCursor) {
      portfolioShell.value?.setAttribute('data-custom-cursor', String(visible))
      customCursor = visible
    }
    const shared = {
      '--cursor-x': `${latestPointer.clientX.toFixed(1)}px`,
      '--cursor-y': `${latestPointer.clientY.toFixed(1)}px`,
      '--cursor-opacity': visible ? '1' : '0',
    }
    setStyles(cursor, {
      ...shared,
      '--cursor-tool-scale': cursorPressed
        ? '0.94'
        : cursorInteractive
          ? '1.04'
          : '1',
    })
    setStyles(cursorLight, {
      ...shared,
      '--cursor-light-scale': cursorPressed
        ? '0.6'
        : cursorInteractive
          ? '1.85'
          : '0.72',
      '--cursor-light-opacity': cursorInteractive ? '0.72' : '0.38',
    })
  }
  const interactiveSelector =
    'a, button, summary, .project-card, .stack-card, .experience-item, .service-item, .focus-pills span, .stat-item'
  const updateScrollPosition = () => {
    if (scrollFrame || document.hidden) return
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0
      scrollY = window.scrollY
      const scrollable = document.documentElement.scrollHeight - innerHeight
      setStyles(progress, {
        '--scroll-progress': (scrollable > 0
          ? clamp(scrollY / scrollable, 0, 1)
          : 0
        ).toFixed(4),
      })
      const timelineHead = scrollY + innerHeight * 0.62 - timelineMetrics.top
      setStyles(experienceTimeline.value, {
        '--timeline-progress': prefersReducedMotion.value
          ? '1'
          : (timelineMetrics.height > 0
              ? clamp(timelineHead / timelineMetrics.height, 0, 1)
              : 0
            ).toFixed(4),
      })
      let reached = -1
      timelineMetrics.markers.forEach((position, index) => {
        if (timelineHead >= position) reached = index
      })
      activeExperience.value = reached
      let section = sectionIds[0] ?? 'home'
      sectionPositions.forEach(({ id, top }) => {
        if (top <= scrollY + innerHeight * 0.34) section = id
      })
      activeSection.value = section
      updateSceneStyles()
    })
  }
  const updatePointerPosition = (event: PointerEvent) => {
    if (
      !motionEnabled() ||
      document.documentElement.hasAttribute('data-loading') ||
      document.hidden ||
      event.pointerType === 'touch'
    )
      return
    const { clientX, clientY } = event
    if (
      clientX < 0 ||
      clientY < 0 ||
      clientX >= document.documentElement.clientWidth ||
      clientY >= innerHeight
    ) {
      resetPointerPosition()
      return
    }
    const target =
      event.type === 'pointerenter'
        ? document.elementFromPoint(clientX, clientY)
        : event.target
    cursorInteractive =
      target instanceof Element && Boolean(target.closest(interactiveSelector))
    const card =
      target instanceof Element
        ? target.closest<HTMLElement>('.glass-card')
        : null
    // Read geometry only when entering a new card, before the animation-frame writes.
    if (card !== pointerCard) {
      const bounds = card?.getBoundingClientRect()
      glareBounds = bounds
        ? {
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
            scrollY,
          }
        : null
      pointerCard = card
    }
    latestPointer = {
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2,
      clientX,
      clientY,
    }
    if (pointerFrame) return
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0
      pointerX = clamp(latestPointer.x, -1, 1)
      pointerY = clamp(latestPointer.y, -1, 1)
      cursorVisible = true
      renderCursor()
      updateGlassGlare()
      updateSceneStyles()
    })
  }
  const resetPointerPosition = () => {
    if (pointerFrame) cancelAnimationFrame(pointerFrame)
    pointerFrame = 0
    pointerX = pointerY = 0
    cursorVisible = cursorPressed = cursorInteractive = false
    pointerCard = null
    glareBounds = null
    clearGlassGlare()
    renderCursor()
    if (!document.hidden) updateSceneStyles()
  }
  const handlePointerOut = (event: PointerEvent) => {
    if (event.relatedTarget === null) resetPointerPosition()
  }
  const handlePageVisibility = () => {
    portfolioShell.value?.toggleAttribute('data-page-hidden', document.hidden)
    if (document.hidden) resetPointerPosition()
    else updateScrollPosition()
  }
  const updateMotionPreference = () => {
    prefersReducedMotion.value = motionPreference.matches
    resetPointerPosition()
    updateAllMotionStyles()
    updateScrollPosition()
  }
  const handleCursorLoad = () => {
    cursorAssetLoaded = true
    renderCursor()
  }
  const handleCursorError = () => {
    cursorAssetLoaded = false
    renderCursor()
  }
  const setCursorPressed = () => {
    cursorPressed = true
    renderCursor()
  }
  const releaseCursorPressed = () => {
    cursorPressed = false
    renderCursor()
  }
  const scheduleBoundsUpdate = () => {
    if (resizeFrame) return
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0
      updateAmbientBounds()
    })
  }
  const revealDelay = (index: number, step = 80): Record<string, string> => ({
    '--reveal-delay': `${index * step}ms`,
  })
  const projectRevealStyle = (index: number): Record<string, string> => ({
    ...revealDelay(index, 85),
    '--card-depth': `${index % 2 === 0 ? 1 : -1}`,
    '--project-tilt-y': `${index % 2 === 0 ? -2 : 2}deg`,
  })
  const handleProjectImageLoad = (event: Event) => {
    if (event.target instanceof HTMLImageElement)
      event.target.parentElement?.setAttribute('data-image-loaded', '')
  }
  onMounted(() => {
    const root = portfolioShell.value!
    motionPreference = matchMedia('(prefers-reduced-motion: reduce)')
    finePointerPreference = matchMedia('(hover: hover) and (pointer: fine)')
    prefersReducedMotion.value = motionPreference.matches
    cursor = root.querySelector('.pointer-cursor')
    cursorLight = root.querySelector('.cursor-light')
    hero = root.querySelector('.hero-visual')
    terminal = root.querySelector('.terminal-card')
    progress = root.querySelector('.scroll-progress span')
    spaceNodes = [...root.querySelectorAll<HTMLElement>('.space-object')]
    skyNodes = [...root.querySelectorAll<HTMLElement>('.sky-object')]
    projectNodes = [...root.querySelectorAll<HTMLElement>('.project-card')]
    const cursorImage = cursor?.querySelector('img')
    cursorAssetLoaded = Boolean(
      cursorImage?.complete && cursorImage.naturalWidth,
    )
    scrollY = window.scrollY
    updateAmbientBounds()
    sceneObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute(
            'data-motion-active',
            entry.isIntersecting,
          )
          if (entry.isIntersecting) visibleNodes.add(entry.target)
          else visibleNodes.delete(entry.target)
        }
        updateSceneStyles()
      },
      { rootMargin: '80px', threshold: 0 },
    )
    root
      .querySelectorAll(
        '.space-object, .sky-object, .atmosphere-cloud, .atmosphere-stage, .landscape-hills, .hero-section, .hero-visual, .editorial-band, .terminal-card, .project-card',
      )
      .forEach((node) => sceneObserver.observe(node))
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8%', threshold: 0.1 },
    )
    root
      .querySelectorAll('[data-reveal]')
      .forEach((node) => revealObserver.observe(node))
    boundsObserver = new ResizeObserver(scheduleBoundsUpdate)
    for (const node of [
      root,
      spaceStage.value,
      skyStage.value,
      atmosphereStage.value,
      experienceTimeline.value,
    ])
      if (node) boundsObserver.observe(node)
    motionPreference.addEventListener('change', updateMotionPreference)
    finePointerPreference.addEventListener('change', updateMotionPreference)
    window.addEventListener('resize', scheduleBoundsUpdate, { passive: true })
    window.addEventListener('scroll', updateScrollPosition, { passive: true })
    window.addEventListener('pointermove', updatePointerPosition, {
      passive: true,
    })
    document.documentElement.addEventListener(
      'pointerenter',
      updatePointerPosition,
    )
    document.documentElement.addEventListener(
      'pointerleave',
      resetPointerPosition,
    )
    document.addEventListener('pointerout', handlePointerOut)
    document.addEventListener('visibilitychange', handlePageVisibility)
    window.addEventListener('blur', resetPointerPosition)
    window.addEventListener('pointerdown', setCursorPressed)
    window.addEventListener('pointerup', releaseCursorPressed)
  })
  onUnmounted(() => {
    boundsObserver?.disconnect()
    sceneObserver?.disconnect()
    revealObserver?.disconnect()
    motionPreference?.removeEventListener('change', updateMotionPreference)
    finePointerPreference?.removeEventListener('change', updateMotionPreference)
    window.removeEventListener('resize', scheduleBoundsUpdate)
    window.removeEventListener('scroll', updateScrollPosition)
    window.removeEventListener('pointermove', updatePointerPosition)
    document.documentElement.removeEventListener(
      'pointerenter',
      updatePointerPosition,
    )
    document.documentElement.removeEventListener(
      'pointerleave',
      resetPointerPosition,
    )
    document.removeEventListener('pointerout', handlePointerOut)
    document.removeEventListener('visibilitychange', handlePageVisibility)
    window.removeEventListener('blur', resetPointerPosition)
    window.removeEventListener('pointerdown', setCursorPressed)
    window.removeEventListener('pointerup', releaseCursorPressed)
    for (const frame of [scrollFrame, pointerFrame, resizeFrame])
      if (frame) cancelAnimationFrame(frame)
  })
  return {
    portfolioShell,
    spaceStage,
    skyStage,
    atmosphereStage,
    experienceTimeline,
    activeSection,
    activeExperience,
    prefersReducedMotion,
    revealDelay,
    projectRevealStyle,
    handleCursorLoad,
    handleCursorError,
    handleProjectImageLoad,
  }
}
