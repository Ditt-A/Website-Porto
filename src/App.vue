<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import profilePhoto from './assets/profile.jpg'

type Project = {
  title: string
  description: string
  stack: string[]
  link: string
  accent: string
  image: string
}

type Achievement = {
  title: string
  organizer: string
  logo: string
  initials: string
}

type Experience = {
  start: string
  period: string
  role: string
  place: string
  note: string
  logo: string
  initials: string
  linkedin: string
}

type Service = {
  title: string
  description: string
  areas: string[]
}

type ContactLink = {
  label: string
  href: string
  viewBox: string
  paths: string[]
}

type SpaceObject = {
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

type SkyObject = SpaceObject & {
  aspectRatio: number
  mobileX: number
}

const spaceObjects: SpaceObject[] = [
  { id: 'planet', image: '/images/space/planet.png', x: 0.07, y: 0.045, size: 190, rotation: -8, depth: 14, speed: -0.045, parallaxRange: 40, opacity: 0.72, duration: 12 },
  { id: 'moon', image: '/images/space/moon.png', x: 0.93, y: 0.3, size: 122, rotation: 12, depth: -7, speed: 0.02, parallaxRange: 22, opacity: 0.7, duration: 15 },
  { id: 'asteroid', image: '/images/space/asteroid.png', x: 0.06, y: 0.52, size: 104, rotation: -16, depth: 16, speed: -0.075, parallaxRange: 58, opacity: 0.7, duration: 11 },
  { id: 'satellite', image: '/images/space/satellite.png', x: 0.93, y: 0.7, size: 162, rotation: 10, depth: -14, speed: 0.05, parallaxRange: 42, opacity: 0.72, duration: 14 },
  { id: 'comet', image: '/images/space/comet.png', x: 0.82, y: 0.03, size: 138, rotation: 10, depth: -10, speed: -0.03, parallaxRange: 30, opacity: 0.58, duration: 16 },
  { id: 'nebula', image: '/images/space/nebula.png', x: 0.22, y: 0.86, size: 240, rotation: -4, depth: 4, speed: 0.012, parallaxRange: 14, opacity: 0.3, duration: 20 },
]

const skyObjects: SkyObject[] = [
  { id: 'cloud', image: '/images/sky/cloud.png', x: 0.1, mobileX: 0.2, y: 0.1, size: 420, aspectRatio: 2, rotation: -2, depth: 16, speed: -0.12, parallaxRange: 72, opacity: 0.42, duration: 30 },
  { id: 'balloon', image: '/images/sky/balloon.png', x: 0.93, mobileX: 0.84, y: 0.32, size: 155, aspectRatio: 2 / 3, rotation: 3, depth: -10, speed: -0.055, parallaxRange: 44, opacity: 0.72, duration: 18 },
  { id: 'plane', image: '/images/sky/plane.png', x: 0.07, mobileX: 0.18, y: 0.51, size: 245, aspectRatio: 1.5, rotation: -2, depth: 9, speed: 0.035, parallaxRange: 28, opacity: 0.6, duration: 42 },
  { id: 'birds', image: '/images/sky/birds.png', x: 0.83, mobileX: 0.74, y: 0.71, size: 330, aspectRatio: 2, rotation: 0, depth: -6, speed: -0.018, parallaxRange: 18, opacity: 0.62, duration: 56 },
  { id: 'sun', image: '/images/sky/sun.png', x: 0.88, mobileX: 0.83, y: 0.91, size: 330, aspectRatio: 1.5, rotation: 0, depth: -3, speed: 0.008, parallaxRange: 8, opacity: 0.5, duration: 10 },
]

const navItems = ['Home', 'About', 'Stack', 'Expertise', 'Experience', 'Projects', 'Contact']
const sectionIds = navItems.map((item) => item.toLowerCase())

const focusAreas = [
  'Machine Learning',
  'Computer Vision',
  'Natural Language Processing',
  'Time-Series Forecasting',
  'LLM & RAG',
  'MLOps',
]

const stats = [
  { value: '17+', label: 'AI projects done' },
  { value: '6+', label: 'Competitions awards' },
  { value: '4+', label: 'Research' },
]

const stackGroups = [
  {
    title: 'Data & Machine Learning',
    items: ['Pandas', 'NumPy', 'Scikit-learn', 'LightGBM', 'CatBoost', 'SHAP'],
  },
  {
    title: 'Deep Learning & vision',
    items: ['PyTorch', 'TensorFlow', 'OpenCV', 'MONAI', 'Ultralytics', 'Mediapipe'],
  },
  {
    title: 'NLP & Retrieval',
    items: ['RAG', 'BGE-M3', 'BM25', 'RRF', 'FAISS', 'Qwen3-VL'],
  },
  {
    title: 'Backend & Deployment',
    items: ['FastAPI', 'Flask', 'React', 'TypeScript', 'Hugging Face', 'Azure Functions', 'Docker', 'Git', 'PostgreSQL'],
  },
]

const services: Service[] = [
  {
    title: 'Machine Learning & Evaluation',
    description:
      'Developing predictive models, comparing different approaches, and evaluating their performance.',
    areas: [
      'Data Preprocessing',
      'Feature Engineering',
      'Model Training & Comparison',
      'Performance Evaluation',
    ],
  },
  {
    title: 'RAG & NLP Applications',
    description:
      'Developing applications that combine information retrieval with natural language processing and language models.',
    areas: [
      'Document Processing & Chunking',
      'Information Retrieval',
      'LLM Integration',
      'Retrieval & Response Evaluation',
    ],
  },
  {
    title: 'Computer Vision & Image Analysis',
    description:
      'Developing deep learning models for image classification, object detection, and segmentation.',
    areas: [
      'Image Preprocessing',
      'Classification & Object Detection',
      'Image Segmentation',
      'Model Evaluation',
    ],
  },
  {
    title: 'Data Applications & APIs',
    description:
      'Developing APIs and interactive applications to integrate machine learning models and present their results.',
    areas: [
      'Backend API Development',
      'Data Visualization',
      'Model Integration',
      'Testing & Documentation',
    ],
  },
]

const projects: Project[] = [
  {
    title: 'Brain Tumour Segmentation',
    description:
      '3D multimodal MRI segmentation with U-Net, U-Net++, and MedicalNet ResNet18, plus experiment reports and an interactive MRI/reference viewer.',
    stack: ['Medical Imaging', 'Segmentation', 'PyTorch'],
    link: 'https://github.com/Ditt-A/BrainTumourSegmentation',
    accent: 'vision',
    image: '/images/projects/brain.png',
  },
  {
    title: 'AMANA / DSN-MUI UMKM RAG',
    description:
      'Document-grounded DSN-MUI assistant with BGE-M3, BM25, RRF, reranking, optional Qwen3-VL visual reasoning, and a React/FastAPI prototype.',
    stack: ['RAG', 'Hybrid Retrieval', 'Qwen3-VL'],
    link: 'https://github.com/Ditt-A/DSNMUI_RAG',
    accent: 'rag',
    image: '/images/projects/amana.png',
  },
  {
    title: 'Face Spoofing Detection',
    description:
      'Six-class face presentation-attack research using DINOv3, ConvNeXt, and FSFM, with an interactive dataset gallery and FastAPI reference demo.',
    stack: ['Computer Vision', 'Anti-Spoofing', 'Ensemble'],
    link: 'https://github.com/Ditt-A/Face-Spoofing-Detection',
    accent: 'security',
    image: '/images/projects/spoofing.png',
  },
  {
    title: 'Robust Identity Card OCR',
    description:
      'A team project for extracting names, birth dates, and addresses from varied identity documents using PP-OCRv6 and OpenOCR, with retained benchmark reports.',
    stack: ['OCR', 'Document Understanding', 'Computer Vision'],
    link: 'https://github.com/Ditt-A/RobustIdentityCardOCR',
    accent: 'nlp',
    image: '/images/projects/ocr.png',
  },
  {
    title: 'Kalimantan FireWatch',
    description:
      'Decision-support dashboard for Kalimantan fire monitoring, combining satellite detections, geospatial context, incident prioritization, and response-planning support.',
    stack: ['Geospatial Data', 'FastAPI', 'Next.js'],
    link: 'https://github.com/Ditt-A/Kalimantan-FireWatch',
    accent: 'forecast',
    image: '/images/projects/firewatch.png',
  },
  {
    title: 'Senandika / AI-MoodBand',
    description:
      'Non-clinical Indonesian reflection app with Gemini, FAISS conversational memory, mood check-ins, daily summaries, and safety-aware response flows.',
    stack: ['Flask', 'Gemini', 'FAISS'],
    link: 'https://github.com/Ditt-A/AI-MoodBand',
    accent: 'memory',
    image: '/images/projects/AI-Moodband.jpeg',
  },
]

const achievements: Achievement[] = [
  {
    title: '1st Winner — Data Science, Sebelas Maret Statistics Fair 2026',
    organizer: 'Universitas Sebelas Maret · Sep 2026',
    logo: '/images/logos/uns.png',
    initials: 'UNS',
  },
  {
    title: 'Top 8 Semifinalist — Datathon RISTEK UI 2026',
    organizer: 'Universitas Indonesia · Aug 2026',
    logo: '/images/logos/ui.png',
    initials: 'UI',
  },
  {
    title: '1st Honorable Mention — International Data Science FIT Competition 2026',
    organizer: 'Universitas Kristen Satya Wacana · Jul 2026',
    logo: '/images/logos/uksw.png',
    initials: 'UKSW',
  },
  {
    title: 'Finalist — Data Analytics Competition, FIND IT! 2026',
    organizer: 'Universitas Gadjah Mada · May 2026',
    logo: '/images/logos/ugm.jpg',
    initials: 'UGM',
  },
  {
    title: 'Top 7 Finalist — Datavidia Arkavidia 10.0',
    organizer: 'Institut Teknologi Bandung · Mar 2026',
    logo: '/images/logos/itb.png',
    initials: 'ITB',
  },
]

const curationTags = ['Model Development', 'Experimentation', 'Model Evaluation', 'Prototyping']

const experienceItems: Experience[] = [
  {
    start: '2025-02',
    period: 'Feb 2025 – Present',
    role: 'Data Scientist & Vice Head of Talent Development',
    place: 'BCC FILKOM Universitas Brawijaya',
    note: 'Progressed from Data Science Intern to Data Scientist while leading talent development, the 2025 Data Science Mini Bootcamp for 120 participants, and BCC Open Recruitment 2026.',
    logo: '/images/logos/bcc.jpg',
    initials: 'BCC',
    linkedin: 'https://www.linkedin.com/company/bccfilkomub/posts/?feedView=all',
  },
  {
    start: '2025-09',
    period: 'Sep 2025 – Present',
    role: 'AI Researcher',
    place: 'Intelligent Systems Laboratory, FILKOM UB',
    note: 'Progressed from Research Intern to AI Researcher, conducting deep-learning experiments, model evaluation, and scientific reporting in computer vision, medical imaging, and NLP.',
    logo: '/images/logos/is-lab.jpg',
    initials: 'IS',
    linkedin: 'https://www.linkedin.com/company/labsc-ub/',
  },
  {
    start: '2025-10',
    period: 'Oct 2025 – Aug 2026',
    role: 'Machine Learning Mentor',
    place: 'Google Developer Groups on Campus (GDGoC)',
    note: 'Mentored 240 participants through Machine Learning Study Jams covering preprocessing, visualization, machine-learning workflows, deep learning, and introductory computer vision.',
    logo: '/images/logos/gdgoc.jpg',
    initials: 'GDG',
    linkedin: 'https://www.linkedin.com/company/gdgcub/',
  },
  {
    start: '2026-09',
    period: 'Sep – Nov 2026',
    role: 'AI Engineer Intern',
    place: 'PT Pertamina Patra Niaga',
    note: 'Contributing to AI engineering work involving large language models, retrieval-augmented generation, automation, and GraphQL-based workflows.',
    logo: '/images/logos/pertamina-patra-niaga.svg',
    initials: 'PPN',
    linkedin: 'https://www.linkedin.com/company/ptpertaminapatraniaga/',
  },
  {
    start: '2026-09',
    period: 'Sep – Nov 2026',
    role: 'AI Engineer Intern',
    place: 'AI Talent Factory (AITF), Komdigi',
    note: 'Fine-tuned expressive Indonesian TTS models for four voices; developing integration with animated 2D virtual teacher avatars for educational content.',
    logo: '/images/logos/komdigi.svg',
    initials: 'AITF',
    linkedin: 'https://www.linkedin.com/company/ministry-of-communication-and-information-technology-of-the-republic-of-indonesia/?originalSubdomain=id',
  },
].sort((a, b) => a.start.localeCompare(b.start))

const hideBrokenImage = (event: Event) => {
  const image = event.currentTarget
  if (image instanceof HTMLImageElement) image.hidden = true
}

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    href: 'mailto:aditya.akkbbar@gmail.com',
    viewBox: '0 0 24 24',
    paths: [
      'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.25l8 5 8-5V7l-8 5-8-5Zm0 3.6V17h16v-6.4l-7.47 4.67a1 1 0 0 1-1.06 0L4 10.6Z',
    ],
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Ditt-A',
    viewBox: '0 0 24 24',
    paths: [
      'M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2c-3.22.7-3.9-1.38-3.9-1.38-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.2 1.19A11.1 11.1 0 0 1 12 6.03c.99 0 1.98.13 2.91.39 2.22-1.5 3.2-1.19 3.2-1.19.63 1.6.23 2.78.11 3.07.75.81 1.2 1.84 1.2 3.11 0 4.45-2.71 5.43-5.29 5.72.42.36.79 1.08.79 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z',
    ],
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aditya-akkbbar/',
    viewBox: '0 0 24 24',
    paths: [
      'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.25 0h3.83v1.57h.05c.53-.95 1.84-1.96 3.79-1.96 4.05 0 4.8 2.66 4.8 6.12v5.77h-4v-5.12c0-1.22-.02-2.8-1.7-2.8-1.71 0-1.97 1.33-1.97 2.71v5.21h-4V9.75Z',
    ],
  },
]

const scrollY = ref(0)
const scrollProgress = ref(0)
const activeSection = ref('home')
const pointerX = ref(0)
const pointerY = ref(0)
const cursorX = ref(0)
const cursorY = ref(0)
const cursorVisible = ref(false)
const cursorInteractive = ref(false)
const cursorPressed = ref(false)
const prefersReducedMotion = ref(false)
const spaceStage = ref<HTMLElement | null>(null)
const spaceBounds = ref({ width: 0, height: 0, viewportHeight: 0 })
const skyStage = ref<HTMLElement | null>(null)
const skyBounds = ref({ width: 0, height: 0, top: 0, viewportHeight: 0 })
const atmosphereStage = ref<HTMLElement | null>(null)
const atmosphereBounds = ref({ top: 0, height: 0, viewportHeight: 0 })
const experienceTimeline = ref<HTMLOListElement | null>(null)
const timelineProgress = ref(0)
// Keep timeline state in data attributes so Vue preserves the observer's reveal class.
const activeExperience = ref(-1)

let scrollFrame = 0
let pointerFrame = 0
let revealObserver: IntersectionObserver | undefined
let ambientBoundsObserver: ResizeObserver | undefined
let sceneObserver: IntersectionObserver | undefined
let motionPreference: MediaQueryList | undefined
let finePointerPreference: MediaQueryList | undefined
let activeGlareCard: HTMLElement | null = null
let pointerCard: HTMLElement | null = null
let timelineMetrics = { top: 0, height: 0, markers: [] as number[] }
let latestPointer = { x: 0, y: 0, clientX: 0, clientY: 0 }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const updateAmbientBounds = () => {
  if (spaceStage.value) {
    spaceBounds.value = {
      width: spaceStage.value.clientWidth,
      height: spaceStage.value.clientHeight,
      viewportHeight: window.innerHeight,
    }
  }

  if (skyStage.value) {
    skyBounds.value = {
      width: skyStage.value.clientWidth,
      height: skyStage.value.clientHeight,
      top: skyStage.value.getBoundingClientRect().top + window.scrollY,
      viewportHeight: window.innerHeight,
    }
  }

  if (atmosphereStage.value) {
    atmosphereBounds.value = {
      top: atmosphereStage.value.getBoundingClientRect().top + window.scrollY,
      height: atmosphereStage.value.clientHeight,
      viewportHeight: window.innerHeight,
    }
  }

  if (experienceTimeline.value) {
    timelineMetrics = {
      top: experienceTimeline.value.getBoundingClientRect().top + window.scrollY + 12,
      height: experienceTimeline.value.clientHeight - 24,
      markers: [...experienceTimeline.value.querySelectorAll<HTMLElement>('.timeline-entry')].map((entry) => {
        const marker = entry.querySelector<HTMLElement>('.timeline-marker')
        return entry.offsetTop + (marker?.offsetTop ?? 40) + (marker?.offsetHeight ?? 14) / 2 - 12
      }),
    }
  }

  updateScrollPosition()
}

const spaceObjectStyle = (object: SpaceObject): Record<string, string> => {
  const { width, height, viewportHeight } = spaceBounds.value
  if (!width || !height) return { opacity: '0' }

  const compact = width <= 820
  const size = object.size * clamp(width / 1440, compact ? 0.46 : 0.6, 1)
  const angle = ((Math.abs(object.rotation) + 3) * Math.PI) / 180
  // Reserve room for the rotated corners and the child's gentle floating animation.
  const inset = 16 + (size * (Math.cos(angle) + Math.sin(angle) - 1)) / 2 + 12
  const baseX = width * object.x - size / 2
  const isHeroObject = object.id === 'planet' || object.id === 'comet'
  const baseY = compact && isHeroObject
    ? viewportHeight * 0.105 - size / 2
    : height * object.y - size / 2
  const localScroll = scrollY.value - Math.max(0, baseY - viewportHeight / 2)
  const scrollShift = prefersReducedMotion.value ? 0 : clamp(localScroll * object.speed, -object.parallaxRange, object.parallaxRange)
  const pointerShiftX = prefersReducedMotion.value ? 0 : pointerX.value * object.depth
  const pointerShiftY = prefersReducedMotion.value ? 0 : pointerY.value * object.depth * 0.7
  const x = clamp(baseX + pointerShiftX, inset, Math.max(inset, width - size - inset))
  const y = clamp(baseY + pointerShiftY + scrollShift, inset, Math.max(inset, height - size - inset))

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
  const { width, height, top, viewportHeight } = skyBounds.value
  if (!width || !height) return { opacity: '0' }

  const compact = width <= 820
  const objectWidth = object.size * clamp(width / 1440, compact ? 0.46 : 0.6, 1)
  const objectHeight = objectWidth / object.aspectRatio
  const angle = ((Math.abs(object.rotation) + 3) * Math.PI) / 180
  const drift = object.id === 'cloud' ? (compact ? 14 : 32) : 6
  // Reserve the complete animated envelope, including the sun's pulse and balloon's bob.
  const insetX = 24 + drift + objectWidth * 0.04 + Math.max(0, (objectWidth * Math.cos(angle) + objectHeight * Math.sin(angle) - objectWidth) / 2)
  const insetY = 40 + objectHeight * 0.04 + Math.max(0, (objectHeight * Math.cos(angle) + objectWidth * Math.sin(angle) - objectHeight) / 2)
  const flying = !prefersReducedMotion.value && (object.id === 'plane' || object.id === 'birds')
  const baseX = flying ? insetX : width * (compact ? object.mobileX : object.x) - objectWidth / 2
  const baseY = height * object.y - objectHeight / 2
  const localScroll = scrollY.value - Math.max(0, top + baseY - viewportHeight / 2)
  const scrollShift = prefersReducedMotion.value ? 0 : clamp(localScroll * object.speed, -object.parallaxRange, object.parallaxRange)
  const pointerShiftX = prefersReducedMotion.value ? 0 : pointerX.value * object.depth
  const pointerShiftY = prefersReducedMotion.value ? 0 : pointerY.value * object.depth * 0.6
  const x = clamp(baseX + pointerShiftX, insetX, Math.max(insetX, width - objectWidth - insetX))
  const y = clamp(baseY + pointerShiftY + scrollShift, insetY, Math.max(insetY, height - objectHeight - insetY))

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

const atmosphereProgress = computed(() => {
  const { top, height, viewportHeight } = atmosphereBounds.value
  return height ? clamp((scrollY.value + viewportHeight * 0.65 - top) / height, 0, 1) : 0
})

const atmosphereStyle = computed<Record<string, string>>(() => {
  const { top, height, viewportHeight } = atmosphereBounds.value
  const localScroll = scrollY.value + viewportHeight * 0.5 - top - height * 0.5
  const reduced = prefersReducedMotion.value

  return {
    '--haze-opacity': (reduced ? 0.55 : 0.3 + atmosphereProgress.value * 0.55).toFixed(3),
    '--atmosphere-far-y': `${reduced ? 0 : clamp(localScroll * -0.035, -50, 50)}px`,
    '--atmosphere-near-y': `${reduced ? 0 : clamp(localScroll * -0.1, -110, 110)}px`,
  }
})

const clearGlassGlare = () => {
  activeGlareCard?.style.setProperty('--glare-active', '0')
  activeGlareCard = null
}

const updateGlassGlare = () => {
  if (activeGlareCard !== pointerCard) clearGlassGlare()
  if (!pointerCard || !finePointerPreference?.matches || prefersReducedMotion.value) return

  activeGlareCard = pointerCard
  const bounds = activeGlareCard.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  activeGlareCard.style.setProperty('--glare-x', `${(clamp((latestPointer.clientX - bounds.left) / bounds.width, 0, 1) * 100).toFixed(2)}%`)
  activeGlareCard.style.setProperty('--glare-y', `${(clamp((latestPointer.clientY - bounds.top) / bounds.height, 0, 1) * 100).toFixed(2)}%`)
  activeGlareCard.style.setProperty('--glare-active', '1')
}

const interactiveSelector = [
  'a',
  'button',
  'summary',
  '.project-card',
  '.stack-card',
  '.experience-item',
  '.service-item',
  '.focus-pills span',
  '.stat-item',
].join(',')

const updateScrollPosition = () => {
  if (scrollFrame) return

  scrollFrame = window.requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const activeOffset = window.innerHeight * 0.34
    let currentSection = sectionIds[0] ?? 'home'

    scrollY.value = window.scrollY
    scrollProgress.value = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0

    const timelineHead = scrollY.value + window.innerHeight * 0.62 - timelineMetrics.top
    timelineProgress.value = timelineMetrics.height > 0 ? clamp(timelineHead / timelineMetrics.height, 0, 1) : 0
    let reached = -1
    timelineMetrics.markers.forEach((position, index) => {
      if (timelineHead >= position) reached = index
    })
    activeExperience.value = reached

    sectionIds.forEach((id) => {
      const section = document.getElementById(id)

      if (section && section.getBoundingClientRect().top <= activeOffset) {
        currentSection = id
      }
    })

    activeSection.value = currentSection
    scrollFrame = 0
  })
}

const updatePointerPosition = (event: PointerEvent) => {
  if (prefersReducedMotion.value || event.pointerType === 'touch') return

  cursorVisible.value = true

  if (event.target instanceof Element) {
    cursorInteractive.value = Boolean(event.target.closest(interactiveSelector))
    pointerCard = event.target.closest<HTMLElement>('.glass-card')
  }

  latestPointer = {
    x: (event.clientX / window.innerWidth - 0.5) * 2,
    y: (event.clientY / window.innerHeight - 0.5) * 2,
    clientX: event.clientX,
    clientY: event.clientY,
  }

  if (pointerFrame) return

  pointerFrame = window.requestAnimationFrame(() => {
    pointerX.value = clamp(latestPointer.x, -1, 1)
    pointerY.value = clamp(latestPointer.y, -1, 1)
    cursorX.value = latestPointer.clientX
    cursorY.value = latestPointer.clientY
    updateGlassGlare()
    pointerFrame = 0
  })
}

const resetPointerPosition = () => {
  pointerX.value = 0
  pointerY.value = 0
  cursorVisible.value = false
  cursorInteractive.value = false
  pointerCard = null
  clearGlassGlare()
}

const updateMotionPreference = () => {
  prefersReducedMotion.value = motionPreference?.matches ?? false
  if (prefersReducedMotion.value) resetPointerPosition()
  updateScrollPosition()
}

const setCursorPressed = () => {
  cursorPressed.value = true
}

const releaseCursorPressed = () => {
  cursorPressed.value = false
}

const parallaxStyle = (speed: number, limit = 180): Record<string, string> => {
  const y = prefersReducedMotion.value ? 0 : clamp(scrollY.value * speed, -limit, limit)

  return {
    '--parallax-y': `${y.toFixed(1)}px`,
  }
}

const revealDelay = (index: number, step = 80): Record<string, string> => ({
  '--reveal-delay': `${index * step}ms`,
})

const shellStyle = computed<Record<string, string>>(() => ({
  '--scroll-progress': scrollProgress.value.toFixed(4),
  '--pointer-x': pointerX.value.toFixed(3),
  '--pointer-y': pointerY.value.toFixed(3),
  '--pointer-light-x': `${(pointerX.value * 22).toFixed(1)}vw`,
  '--pointer-light-y': `${(pointerY.value * 18).toFixed(1)}vh`,
  '--pointer-soft-x': `${(pointerX.value * 18).toFixed(1)}px`,
  '--pointer-soft-y': `${(pointerY.value * 14).toFixed(1)}px`,
  '--pointer-soft-x-inverse': `${(pointerX.value * -18).toFixed(1)}px`,
  '--pointer-soft-y-inverse': `${(pointerY.value * -14).toFixed(1)}px`,
  '--cursor-x': `${cursorX.value.toFixed(1)}px`,
  '--cursor-y': `${cursorY.value.toFixed(1)}px`,
  '--cursor-opacity': cursorVisible.value && !prefersReducedMotion.value ? '1' : '0',
  '--cursor-ring-scale': cursorPressed.value ? '0.72' : cursorInteractive.value ? '1.85' : '1',
  '--cursor-dot-scale': cursorPressed.value ? '0.55' : cursorInteractive.value ? '0.3' : '1',
  '--cursor-ring-border': cursorInteractive.value
    ? 'rgba(255, 77, 24, 0.72)'
    : 'rgba(247, 247, 248, 0.54)',
  '--cursor-ring-bg': cursorInteractive.value
    ? 'rgba(255, 77, 24, 0.1)'
    : 'rgba(247, 247, 248, 0.02)',
  '--grid-y': `${(scrollY.value * -0.08).toFixed(1)}px`,
  '--star-opacity': (prefersReducedMotion.value ? 0.75 : 0.75 * (1 - atmosphereProgress.value)).toFixed(3),
}))

const heroVisualStyle = computed<Record<string, string>>(() => ({
  ...parallaxStyle(-0.045, 70),
  '--tilt-x': `${(-pointerY.value * 4).toFixed(2)}deg`,
  '--tilt-y': `${(pointerX.value * 5).toFixed(2)}deg`,
}))

const projectRevealStyle = (index: number): Record<string, string> => ({
  ...revealDelay(index, 85),
  '--card-depth': `${index % 2 === 0 ? 1 : -1}`,
  '--project-shift-x': `${(pointerX.value * (index % 2 === 0 ? 8 : -8)).toFixed(1)}px`,
  '--project-shift-y': `${(pointerY.value * (index % 2 === 0 ? -6 : 6)).toFixed(1)}px`,
  '--preview-shift-x': `${(pointerX.value * (index % 2 === 0 ? -12 : 12)).toFixed(1)}px`,
  '--preview-shift-y': `${(pointerY.value * (index % 2 === 0 ? 8 : -8)).toFixed(1)}px`,
  '--project-tilt-y': `${(index % 2 === 0 ? -2 : 2).toFixed(1)}deg`,
})

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  finePointerPreference = window.matchMedia('(hover: hover) and (pointer: fine)')
  updateMotionPreference()
  motionPreference.addEventListener('change', updateMotionPreference)

  updateAmbientBounds()
  ambientBoundsObserver = new ResizeObserver(updateAmbientBounds)
  if (spaceStage.value) ambientBoundsObserver.observe(spaceStage.value)
  if (skyStage.value) ambientBoundsObserver.observe(skyStage.value)
  if (atmosphereStage.value) ambientBoundsObserver.observe(atmosphereStage.value)
  if (experienceTimeline.value) ambientBoundsObserver.observe(experienceTimeline.value)
  window.addEventListener('resize', updateAmbientBounds, { passive: true })

  window.addEventListener('scroll', updateScrollPosition, { passive: true })
  window.addEventListener('pointermove', updatePointerPosition, { passive: true })
  window.addEventListener('pointerleave', resetPointerPosition)
  window.addEventListener('pointerdown', setCursorPressed)
  window.addEventListener('pointerup', releaseCursorPressed)
  updateScrollPosition()

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        entry.target.classList.add('is-visible')
        revealObserver?.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -10%',
      threshold: 0.14,
    },
  )

  document.querySelectorAll('[data-reveal]').forEach((element) => {
    revealObserver?.observe(element)
  })

  sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting))
  }, { rootMargin: '120px', threshold: 0 })
  document.querySelectorAll('.ambient-stage, .atmosphere-stage, .sky-stage, .landscape-hills').forEach((element) => {
    sceneObserver?.observe(element)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateAmbientBounds)
  window.removeEventListener('scroll', updateScrollPosition)
  window.removeEventListener('pointermove', updatePointerPosition)
  window.removeEventListener('pointerleave', resetPointerPosition)
  window.removeEventListener('pointerdown', setCursorPressed)
  window.removeEventListener('pointerup', releaseCursorPressed)
  revealObserver?.disconnect()
  ambientBoundsObserver?.disconnect()
  sceneObserver?.disconnect()
  motionPreference?.removeEventListener('change', updateMotionPreference)
  clearGlassGlare()

  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame)
  }

  if (pointerFrame) {
    window.cancelAnimationFrame(pointerFrame)
  }
})
</script>

<template>
  <div class="portfolio-shell" :style="shellStyle">
    <div class="scroll-progress" aria-hidden="true">
      <span></span>
    </div>
    <div class="cursor-light" aria-hidden="true"></div>
    <div class="pointer-cursor" aria-hidden="true">
      <span class="cursor-ring"></span>
      <span class="cursor-dot"></span>
      <span class="cursor-label">open</span>
    </div>

    <div ref="spaceStage" class="ambient-stage" aria-hidden="true">
      <span
        v-for="object in spaceObjects"
        :key="object.id"
        class="space-object"
        :class="`space-${object.id}`"
        :style="spaceObjectStyle(object)"
      >
        <img :src="object.image" alt="" decoding="async" draggable="false" />
      </span>
    </div>

    <div ref="atmosphereStage" class="atmosphere-stage" :style="atmosphereStyle" aria-hidden="true">
      <span class="atmosphere-haze"></span>
      <span class="atmosphere-cloud atmosphere-cloud-far">
        <img src="/images/sky/cloud.png" alt="" loading="lazy" decoding="async" draggable="false" />
      </span>
      <span class="atmosphere-cloud atmosphere-cloud-near">
        <img src="/images/sky/cloud.png" alt="" loading="lazy" decoding="async" draggable="false" />
      </span>
    </div>

    <div ref="skyStage" class="sky-stage" aria-hidden="true">
      <span
        v-for="object in skyObjects"
        :key="object.id"
        class="sky-object"
        :class="`sky-${object.id}`"
        :style="skyObjectStyle(object)"
      >
        <img :src="object.image" alt="" loading="lazy" decoding="async" draggable="false" />
      </span>
    </div>

    <div class="landscape-hills" aria-hidden="true">
      <svg viewBox="0 0 1600 360" preserveAspectRatio="none">
        <defs>
          <g id="hill-pine">
            <g class="tree-sway">
              <path d="M-4 -36 H4 V1 H-4 Z" fill="#574733" />
              <path d="M0 -98 L-24 -58 H-15 L-34 -31 H-22 L-40 -8 H40 L22 -31 H34 L15 -58 H24 Z" fill="#246344" />
              <path d="M0 -98 L0 -8 H40 L22 -31 H34 L15 -58 H24 Z" fill="#1c573d" />
            </g>
          </g>
          <g id="hill-broadleaf">
            <g class="tree-sway">
              <path d="M-5 -44 H5 V1 H-5 Z M-2 -29 L-17 -44 L-13 -48 L3 -34 Z" fill="#675039" />
              <ellipse cx="-19" cy="-51" rx="24" ry="24" fill="#357b4f" />
              <ellipse cx="17" cy="-53" rx="27" ry="26" fill="#286b45" />
              <ellipse cx="-2" cy="-72" rx="28" ry="27" fill="#3b8555" />
            </g>
          </g>
          <g id="hill-grass" fill="currentColor">
            <g class="grass-sway">
              <path d="M-2 0 Q-9 -9 -18 -13 Q-7 -12 2 0 Z M0 0 Q-5 -14 -1 -25 Q2 -12 4 0 Z M2 0 Q8 -19 17 -22 Q11 -10 6 0 Z M-4 0 Q-15 -3 -23 -8 Q-9 -6 1 0 Z M4 0 Q16 -10 25 -9 Q13 -4 8 0 Z" />
            </g>
          </g>
          <pattern id="hill-grass-texture" width="110" height="58" patternUnits="userSpaceOnUse">
            <use href="#hill-grass" transform="translate(24 36) scale(0.44)" color="#8dc07c" opacity="0.32" />
            <use href="#hill-grass" transform="translate(87 57) scale(0.3)" color="#b0cd8c" opacity="0.24" />
          </pattern>
          <linearGradient id="hill-distant" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#7ebd8c" />
            <stop offset="100%" stop-color="#4d946e" />
          </linearGradient>
          <linearGradient id="hill-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#358a58" />
            <stop offset="100%" stop-color="#18513e" />
          </linearGradient>
        </defs>
        <path
          d="M0 150 C180 45 320 55 510 154 C680 242 820 72 1010 104 C1230 139 1360 42 1600 138 L1600 360 L0 360 Z"
          fill="url(#hill-distant)"
        />
        <g opacity="0.8">
          <use href="#hill-pine" transform="translate(145 105) scale(0.55)" />
          <use href="#hill-pine" transform="translate(182 102) scale(0.4)" />
          <use href="#hill-broadleaf" transform="translate(1335 112) scale(0.58)" />
        </g>
        <path
          d="M0 230 C210 134 356 147 562 236 C780 329 966 139 1190 174 C1370 202 1470 236 1600 184 L1600 360 L0 360 Z"
          fill="#43976a"
        />
        <use href="#hill-broadleaf" transform="translate(320 185) scale(0.78)" />
        <use href="#hill-pine" transform="translate(1120 193) scale(0.8)" />
        <use href="#hill-pine" transform="translate(1165 193) scale(0.6)" />
        <g color="#85bd7c" opacity="0.72">
          <use href="#hill-grass" transform="translate(225 202) scale(0.55)" />
          <use href="#hill-grass" transform="translate(455 236) scale(0.48)" />
          <use href="#hill-grass" transform="translate(690 279) scale(0.64)" />
          <use href="#hill-grass" transform="translate(880 235) scale(0.5)" />
          <use href="#hill-grass" transform="translate(1050 205) scale(0.56)" />
          <use href="#hill-grass" transform="translate(1260 221) scale(0.46)" />
          <use href="#hill-grass" transform="translate(1530 228) scale(0.62)" />
        </g>
        <path
          d="M0 280 C220 333 370 214 610 262 C840 308 1010 233 1220 261 C1380 282 1480 302 1600 260 L1600 360 L0 360 Z"
          fill="url(#hill-near)"
        />
        <path
          d="M0 280 C220 333 370 214 610 262 C840 308 1010 233 1220 261 C1380 282 1480 302 1600 260 L1600 360 L0 360 Z"
          fill="url(#hill-grass-texture)"
        />
        <g color="#92bf78" opacity="0.8">
          <use href="#hill-grass" transform="translate(190 318) scale(0.95)" />
          <use href="#hill-grass" transform="translate(400 291) scale(0.75)" />
          <use href="#hill-grass" transform="translate(590 294) scale(1.05)" />
          <use href="#hill-grass" transform="translate(820 318) scale(0.8)" />
          <use href="#hill-grass" transform="translate(1000 293) scale(0.9)" />
          <use href="#hill-grass" transform="translate(1230 316) scale(0.72)" />
          <use href="#hill-grass" transform="translate(1360 332) scale(1.1)" />
          <use href="#hill-grass" transform="translate(1550 305) scale(0.85)" />
        </g>
        <use href="#hill-broadleaf" transform="translate(90 292) scale(1.05)" />
        <use href="#hill-pine" transform="translate(1420 291) scale(0.78)" />
        <use href="#hill-pine" transform="translate(1485 286) scale(1.08)" />
      </svg>
    </div>

    <nav class="site-nav" aria-label="Primary navigation">
      <a
        v-for="item in navItems"
        :key="item"
        :href="`#${item.toLowerCase()}`"
        class="nav-link"
        :class="{ 'is-active': activeSection === item.toLowerCase() }"
        :aria-current="activeSection === item.toLowerCase() ? 'page' : undefined"
        @click="activeSection = item.toLowerCase()"
      >
        <span class="rolling-text">
          <span>{{ item }}</span>
          <span aria-hidden="true">{{ item }}</span>
        </span>
      </a>
    </nav>

    <main>
      <section id="home" class="hero-section section">
        <div class="hero-copy">
          <p class="eyebrow">AI ENGINEERING & RESEARCH / MALANG, INDONESIA</p>
          <h1>Hi, I'm <span>Aditya Akbar</span></h1>
          <p class="hero-lede">
            I'm a Computer Science student at Universitas Brawijaya, with experience in AI engineering and machine learning research.
             I work on various projects involving computer vision, NLP, retrieval-augmented generation, and time-series forecasting.
          </p>

          <div class="focus-pills" aria-label="Focus areas">
            <span v-for="area in focusAreas" :key="area">{{ area }}</span>
          </div>

          <div class="hero-actions">
            <a class="primary-action" href="#projects">
              <span class="rolling-text">
                <span>See Projects</span>
                <span aria-hidden="true">See Projects</span>
              </span>
            </a>
            <a class="secondary-action" href="/Aditya-Akbar-CV-NLP.pdf" target="_blank" rel="noopener">
              <span class="rolling-text">
                <span>Download CV</span>
                <span aria-hidden="true">Download CV</span>
              </span>
            </a>
          </div>
        </div>

        <div class="hero-visual" :style="heroVisualStyle" aria-label="Aditya Akbar portrait">
          <img :src="profilePhoto" alt="Aditya Akbar" />
          <div class="availability-panel">
            <span class="status-dot"></span>
            <p>AI Researcher at Intelligent Systems Laboratory, FILKOM UBB</p>
          </div>
        </div>
      </section>

      <section class="stats-band" aria-label="Profile statistics">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="stat-item"
          :style="revealDelay(index)"
          data-reveal
        >
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </section>

      <section class="section editorial-band" data-reveal>
        <div class="editorial-meta">
          <span>ABOUT / BACKGROUND</span>
          <span>(Aditya - 01)</span>
          <span>AI ENGINEERING & RESEARCH</span>
        </div>

        <div class="marquee" aria-hidden="true">
          <div class="marquee-track">
            <span>Computer Vision</span>
            <span>Natural Language Processing</span>
            <span>RAG Applications</span>
            <span>Time-Series Forecasting</span>
            <span>Federated Learning</span>
            <span>Computer Vision</span>
            <span>Natural Language Processing</span>
            <span>RAG Applications</span>
            <span>Time-Series Forecasting</span>
            <span>Federated Learning</span>
          </div>
        </div>

        <div class="curated-profile">
          <div>
            <p class="spaced-copy">
              Bringing research and engineering together to develop AI systems
              that are carefully evaluated and practical to use.
            </p>
          </div>

          <div class="terminal-card" :style="parallaxStyle(-0.025, 48)">
            <div class="terminal-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <pre><code>&gt; boot aditya-akbar.profile
role      : AI Engineering / ML Research
base      : Malang, Indonesia
focus     : Computer Vision / NLP / RAG / Forecasting
lab       : Intelligent Systems Laboratory, FILKOM UB
output    : Research Projects & AI Applications</code></pre>
          </div>
        </div>

        <div class="curation-tags">
          <span v-for="tag in curationTags" :key="tag">{{ tag }}</span>
        </div>
      </section>

      <section id="about" class="section split-section">
        <div class="about-heading">
          <div data-reveal>
            <p class="eyebrow">About Me</p>
            <h2>Turning messy real-world data into <span>meaningful AI solutions.</span></h2>
          </div>
        </div>
        <div class="body-copy" data-reveal>
          <p>
            My work involves preparing datasets, developing machine learning models, running experiments, and evaluating results.
            I also focus on understanding model limitations and documenting findings throughout the development process.
          </p>
          <p>
            I've worked on projects involving 3D brain tumor segmentation, document-based question answering, face anti-spoofing,
            identity card OCR, geospatial fire monitoring, and Indonesian-language NLP applications.
          </p>
          <ul class="achievement-list">
            <li v-for="achievement in achievements" :key="achievement.title" class="glass-card">
              <span class="achievement-logo" aria-hidden="true">
                <span>{{ achievement.initials }}</span>
                <img :src="achievement.logo" alt="" @error="hideBrokenImage" />
              </span>
              <span class="achievement-copy">
                <strong>{{ achievement.title }}</strong>
                <small>{{ achievement.organizer }}</small>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section id="stack" class="section stack-section">
        <div class="section-heading centered" data-reveal>
          <p class="eyebrow">Tech Stack</p>
          <h2>Tools & <span>technologies</span></h2>
          <p>
            Libraries, frameworks, and technologies I've used across machine learning research and AI development.
          </p>
        </div>

        <div class="stack-grid">
          <article
            v-for="(group, index) in stackGroups"
            :key="group.title"
            class="stack-card glass-card"
            :style="revealDelay(index)"
            data-reveal
          >
            <h3>{{ group.title }}</h3>
            <div class="tag-list">
              <span v-for="item in group.items" :key="item">{{ item }}</span>
            </div>
          </article>
        </div>
      </section>

      <section id="expertise" class="section services-section">
        <div class="section-heading centered" data-reveal>
          <p class="eyebrow">Expertise</p>
          <h2>What I <span>Work On</span></h2>
          <p>
            My work spans machine learning, natural language processing, computer vision, and application development.
          </p>
        </div>

        <div class="service-list">
          <details
            v-for="(service, index) in services"
            :key="service.title"
            class="service-item"
            :style="revealDelay(index, 70)"
            data-reveal
          >
            <summary>
              <span class="service-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="service-title">
                <strong>{{ service.title }}</strong>
                <small>{{ service.description }}</small>
              </span>
              <span class="summary-icon" aria-hidden="true">+</span>
            </summary>
            <div class="service-areas">
              <p class="service-areas-label">Areas of Work</p>
              <ul class="service-areas-list">
                <li v-for="area in service.areas" :key="area">
                  <svg class="service-area-check" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="m4 10 4 4 8-8" />
                  </svg>
                  <span>{{ area }}</span>
                </li>
              </ul>
            </div>
          </details>
        </div>
      </section>

      <section id="experience" class="section experience-section">
        <div class="section-heading centered" data-reveal>
          <p class="eyebrow">Experience</p>
          <h2>Work <span>Experience</span></h2>
          <p>
            My work in data science, research, mentoring, and AI engineering, from earliest to most recent.
          </p>
        </div>

        <ol
          ref="experienceTimeline"
          class="experience-timeline"
          :style="{ '--timeline-progress': prefersReducedMotion ? '1' : timelineProgress.toFixed(4) }"
          aria-label="Professional experience, earliest to most recent"
        >
          <li
            v-for="(item, index) in experienceItems"
            :key="`${item.place}-${item.role}`"
            class="timeline-entry"
            :data-reached="prefersReducedMotion || index <= activeExperience"
            :data-current="index === activeExperience"
            :style="revealDelay(index, 50)"
            data-reveal
          >
            <span class="timeline-marker" aria-hidden="true"></span>
            <article class="experience-item glass-card">
              <header class="experience-header">
                <span class="experience-logo" aria-hidden="true">
                  <span>{{ item.initials }}</span>
                  <img :src="item.logo" alt="" @error="hideBrokenImage" />
                </span>
                <div class="experience-copy">
                  <h3>{{ item.place }}</h3>
                  <p class="experience-role">{{ item.role }}</p>
                  <p class="experience-period"><time :datetime="item.start">{{ item.period }}</time></p>
                </div>
              </header>
              <p class="experience-note">{{ item.note }}</p>
              <a
                class="experience-link"
                :href="item.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Open ${item.place} on LinkedIn`"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.5 8.5v9M6.5 5.5v.01M10.5 17.5v-5a4 4 0 0 1 8 0v5M10.5 9v8.5" />
                </svg>
                <span>View LinkedIn</span>
                <svg class="experience-link-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </article>
          </li>
        </ol>
      </section>

      <section id="projects" class="section projects-section">
        <div class="section-heading" data-reveal>
          <p class="eyebrow">Featured Work</p>
          <h2>Selected <span>projects</span></h2>
          <p>
            Highlighted projects from my GitHub.
          </p>
        </div>

        <div class="project-grid">
          <article
            v-for="(project, index) in projects"
            :key="project.title"
            class="project-card glass-card"
            :class="`project-${project.accent}`"
            :style="projectRevealStyle(index)"
            data-reveal
          >
            <div class="project-preview" aria-hidden="true">
              <img
                class="project-image"
                :src="project.image"
                alt=""
                loading="lazy"
                @error="hideBrokenImage"
              />
              <div class="preview-window">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="preview-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div class="project-content">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="tag-list compact">
                <span v-for="tag in project.stack" :key="tag">{{ tag }}</span>
              </div>
              <a :href="project.link" target="_blank" rel="noopener">
                <span class="rolling-text">
                  <span>View Repository</span>
                  <span aria-hidden="true">View Repository</span>
                </span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="contact" class="section contact-section" data-reveal>
        <p class="eyebrow">Contact</p>
        <h2>Interested in working together? <span>Let's talk.</span></h2>
        <p>
          I'm open to research collaborations, AI engineering projects, and opportunities to work with new teams.
        </p>
        <div class="contact-actions">
          <a
            v-for="link in contactLinks"
            :key="link.label"
            :href="link.href"
            :target="link.href.startsWith('mailto:') ? undefined : '_blank'"
            :rel="link.href.startsWith('mailto:') ? undefined : 'noopener'"
          >
            <span class="contact-icon" aria-hidden="true">
              <svg :viewBox="link.viewBox" role="img">
                <path
                  v-for="path in link.paths"
                  :key="path"
                  :d="path"
                  pathLength="1"
                />
              </svg>
            </span>
            <span class="rolling-text">
              <span>{{ link.label }}</span>
              <span aria-hidden="true">{{ link.label }}</span>
            </span>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>
