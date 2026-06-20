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
  details: string
}

type ContactLink = {
  label: string
  href: string
  viewBox: string
  paths: string[]
}

const navItems = ['Home', 'About', 'Stack', 'Services', 'Experience', 'Projects', 'Contact']
const sectionIds = navItems.map((item) => item.toLowerCase())

const focusAreas = [
  'RAG Systems',
  'Computer Vision',
  'NLP & LLM',
  'Time Series',
  'Applied AI',
  'Python Engineering',
]

const stats = [
  { value: '6', label: 'Highlighted AI projects' },
  { value: '3.73', label: 'Current GPA' },
  { value: '4', label: 'Core AI domains' },
  { value: 'IS Lab', label: 'Research home' },
]

const stackGroups = [
  {
    title: 'Machine Learning',
    items: ['Pandas', 'NumPy', 'Scikit-learn', 'SHAP', 'Captum', 'Model Evaluation'],
  },
  {
    title: 'Deep Learning & CV',
    items: ['PyTorch', 'TensorFlow', 'Hugging Face', 'OpenCV', 'MONAI', 'Ultralytics'],
  },
  {
    title: 'NLP & LLM',
    items: ['RAG', 'FAISS', 'BGE-M3', 'BM25', 'PostgreSQL', 'Gemini/OpenAI'],
  },
  {
    title: 'Backend & Delivery',
    items: ['FastAPI', 'Flask', 'Streamlit', 'Azure Functions', 'Docker', 'Git'],
  },
]

const services: Service[] = [
  {
    title: 'Machine Learning Systems',
    description: 'Predictive modeling, experiment tracking, explainability, and clean evaluation reports.',
    details:
      'Built around practical workflows: preprocessing, baseline models, feature engineering, SHAP/Captum interpretation, and decision-ready reporting.',
  },
  {
    title: 'RAG & NLP Applications',
    description: 'Document-grounded assistants for Indonesian text, source retrieval, and answer generation.',
    details:
      'Combines chunking, hybrid retrieval, reranking, vector memory, prompt orchestration, and API-first prototypes with clear source traces.',
  },
  {
    title: 'Computer Vision Prototypes',
    description: 'Classification and segmentation workflows for security, medical imaging, and video analytics.',
    details:
      'Experience includes anti-spoofing, MRI segmentation, drowsiness detection, OpenCV pipelines, and deep learning model comparison.',
  },
  {
    title: 'Data Apps & Dashboards',
    description: 'Readable interfaces that turn model outputs into tools people can actually inspect and use.',
    details:
      'From Streamlit demos to FastAPI backends, with visualization, API testing, documentation, and lightweight deployment in mind.',
  },
]

const projects: Project[] = [
  {
    title: 'DSN-MUI UMKM RAG',
    description:
      'A modular RAG prototype for Indonesian Islamic finance guidance with BGE-M3 embeddings, BM25, RRF fusion, reranking, Qwen3-VL visual reasoning, and FastAPI delivery.',
    stack: ['RAG', 'BGE-M3', 'BM25', 'FastAPI'],
    link: 'https://github.com/Ditt-A/DSNMUI_RAG',
    accent: 'rag',
    image: '/images/projects/amana.png',
  },
  {
    title: 'Brain Tumour Segmentation',
    description:
      'MRI brain tumor segmentation research using U-Net and U-Net++ pipelines, comparative training reports, checkpoints, and prediction notebooks.',
    stack: ['Medical Imaging', 'Segmentation', 'PyTorch'],
    link: 'https://github.com/Ditt-A/BrainTumourSegmentation',
    accent: 'vision',
    image: '/images/projects/brain.png',
  },
  {
    title: 'Face Spoofing Detection',
    description:
      'Real/spoof face classification for biometric security across printed, screen, mask, mannequin, unknown spoof, and genuine classes.',
    stack: ['Computer Vision', 'Anti-Spoofing', 'Ensemble'],
    link: 'https://github.com/Ditt-A/Face-Spoofing-Detection',
    accent: 'security',
    image: '/images/projects/spoofing.png',
  },
  {
    title: 'AirSafe School',
    description:
      'Air quality prediction and school recommendation system for DKI Jakarta using PM2.5 data, weather features, Kriging, SHAP, and Azure Functions.',
    stack: ['Time Series', 'LightGBM', 'SHAP'],
    link: 'https://github.com/RedEye1605/airsafe-school',
    accent: 'forecast',
    image: '/images/projects/airsafe.jpeg',
  },
  {
    title: 'Leksara',
    description:
      'Open-source Indonesian text preprocessing library for noisy review content, slang normalization, PII masking, stopwords, and reusable NLP cleaning workflows.',
    stack: ['Python Package', 'Indonesian NLP', 'Preprocessing'],
    link: 'https://github.com/RedEye1605/Leksara',
    accent: 'nlp',
    image: '/images/projects/Leksara.jpeg',
  },
  {
    title: 'AI-MoodBand',
    description:
      'Local AI reflection app with Gemini, FAISS memory retrieval, daily summaries, optional image context, and safety-aware coaching responses.',
    stack: ['Flask', 'Gemini', 'FAISS'],
    link: 'https://github.com/Ditt-A/AI-MoodBand',
    accent: 'memory',
    image: '/images/projects/AI-Moodband.jpeg',
  },
]

const achievements: Achievement[] = [
  {
    title: 'Finalist, Data Analytics Competition Find IT! 2026',
    organizer: 'Universitas Gadjah Mada',
    logo: '/images/logos/ugm.jpg',
    initials: 'UGM',
  },
  {
    title: 'Top 7 Finalist, Datavidia Arkavidia 10.0',
    organizer: 'Institut Teknologi Bandung',
    logo: '/images/logos/itb.png',
    initials: 'ITB',
  },
  {
    title: '12th Place, Machine Learning Competition Data Slayer 3.0',
    organizer: 'Telkom University',
    logo: '/images/logos/telkom-university.png',
    initials: 'T.U',
  },
]

const curationTags = ['Source-Grounded', 'Inspectable', 'Pythonic', 'Research-Ready']

const experienceItems: Experience[] = [
  {
    period: '2025 - Ongoing',
    role: 'Research Member & Research Intern',
    place: 'Intelligent Systems Laboratory, FILKOM UB',
    note: 'Applied AI research, experiment design, model evaluation, and technical documentation.',
    logo: '/images/logos/is-lab.jpg',
    initials: 'IS',
    linkedin: 'https://www.linkedin.com/company/labsc-ub/',
  },
  {
    period: '2025 - Ongoing',
    role: 'Vice Head of Talent Development',
    place: 'BCC FILKOM Universitas Brawijaya',
    note: 'Learning roadmaps, upskilling programs, and talent growth inside a student technology community.',
    logo: '/images/logos/bcc.jpg',
    initials: 'BCC',
    linkedin: 'https://www.linkedin.com/company/bccfilkomub/posts/?feedView=all',
  },
  {
    period: '2025 - Ongoing',
    role: 'Machine Learning Mentor',
    place: 'Google Developer Groups on Campus (GDGoC)',
    note: 'Mentoring machine learning fundamentals, guiding hands-on projects, and supporting members through model development and evaluation.',
    logo: '/images/logos/gdgoc.jpg',
    initials: 'GDG',
    linkedin: 'https://www.linkedin.com/company/gdgcub/',
  },
]

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
    href: 'https://www.linkedin.com/in/aditya-akbar-82a796274/',
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

let scrollFrame = 0
let pointerFrame = 0
let revealObserver: IntersectionObserver | undefined
let latestPointer = { x: 0, y: 0, clientX: 0, clientY: 0 }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
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
  if (prefersReducedMotion.value) return

  cursorVisible.value = true

  if (event.target instanceof Element) {
    cursorInteractive.value = Boolean(event.target.closest(interactiveSelector))
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
    pointerFrame = 0
  })
}

const resetPointerPosition = () => {
  pointerX.value = 0
  pointerY.value = 0
  cursorVisible.value = false
  cursorInteractive.value = false
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
}))

const heroVisualStyle = computed<Record<string, string>>(() => ({
  ...parallaxStyle(-0.045, 70),
  '--tilt-x': `${(-pointerY.value * 4).toFixed(2)}deg`,
  '--tilt-y': `${(pointerX.value * 5).toFixed(2)}deg`,
}))

const projectRevealStyle = (index: number): Record<string, string> => ({
  ...revealDelay(index, 85),
  '--card-depth': `${index % 2 === 0 ? 1 : -1}`,
  '--project-shift-x': `${(pointerX.value * (index % 2 === 0 ? 16 : -16)).toFixed(1)}px`,
  '--project-shift-y': `${(pointerY.value * (index % 2 === 0 ? -10 : 10)).toFixed(1)}px`,
  '--preview-shift-x': `${(pointerX.value * (index % 2 === 0 ? -22 : 22)).toFixed(1)}px`,
  '--preview-shift-y': `${(pointerY.value * (index % 2 === 0 ? 14 : -14)).toFixed(1)}px`,
  '--project-tilt-y': `${(index % 2 === 0 ? -2 : 2).toFixed(1)}deg`,
})

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollPosition)
  window.removeEventListener('pointermove', updatePointerPosition)
  window.removeEventListener('pointerleave', resetPointerPosition)
  window.removeEventListener('pointerdown', setCursorPressed)
  window.removeEventListener('pointerup', releaseCursorPressed)
  revealObserver?.disconnect()

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

    <div class="ambient-stage" aria-hidden="true">
      <span class="parallax-shape shape-prism" :style="parallaxStyle(-0.08, 90)"></span>
      <span class="parallax-shape shape-cylinder" :style="parallaxStyle(0.06, 120)"></span>
      <span class="parallax-shape shape-tile" :style="parallaxStyle(-0.045, 90)"></span>
      <span class="parallax-shape shape-code" :style="parallaxStyle(0.035, 110)"></span>
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
          <p class="eyebrow">Applied AI Systems / Malang, Indonesia</p>
          <h1>Hi, I'm <span>Aditya Akbar</span></h1>
          <p class="hero-lede">
            Computer Science undergraduate at Universitas Brawijaya building source-grounded
            AI workflows across RAG, computer vision, NLP, and time-series forecasting.
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
            <p>Research Member & Research Intern at Intelligent Systems Laboratory, FILKOM UB</p>
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
          <span>Personal Profile / Applied AI</span>
          <span>(Aditya - 01)</span>
          <span>Applied AI Builder</span>
        </div>

        <div class="marquee" aria-hidden="true">
          <div class="marquee-track">
            <span>Source-grounded AI</span>
            <span>Computer Vision</span>
            <span>Indonesian NLP</span>
            <span>Time-Series Forecasting</span>
            <span>Applied Research</span>
            <span>Source-grounded AI</span>
            <span>Computer Vision</span>
            <span>Indonesian NLP</span>
            <span>Time-Series Forecasting</span>
            <span>Applied Research</span>
          </div>
        </div>

        <div class="curated-profile">
          <div>
            <p class="spaced-copy">
              Bridging research discipline and product-minded engineering through AI systems that
              stay traceable, evaluated, and useful beyond the notebook.
            </p>
          </div>

          <div class="terminal-card" :style="parallaxStyle(-0.025, 48)">
            <div class="terminal-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <pre><code>&gt; boot aditya-akbar.profile
role      : applied AI builder
base      : Malang, Indonesia
focus     : RAG / CV / NLP / forecasting
lab       : Intelligent Systems Lab
output    : explainable prototypes</code></pre>
          </div>
        </div>

        <div class="curation-tags">
          <span v-for="tag in curationTags" :key="tag">{{ tag }}</span>
        </div>
      </section>

      <section id="about" class="section split-section">
        <div data-reveal>
          <p class="eyebrow">About Me</p>
          <h2>Turning messy real-world data into <span>inspectable AI tools.</span></h2>
        </div>
        <div class="body-copy" data-reveal>
          <p>
            I work across applied AI product workflows: data preprocessing, experimentation, model
            evaluation, technical documentation, and clean Python-based implementation.
          </p>
          <p>
            My projects cover biometric security, medical imaging, air quality forecasting,
            Indonesian NLP, document-grounded retrieval, and privacy-aware AI companion systems.
          </p>
          <ul class="achievement-list">
            <li v-for="achievement in achievements" :key="achievement.title">
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
            A focused toolkit for building machine learning experiments, AI prototypes, and
            deployable data applications.
          </p>
        </div>

        <div class="stack-grid">
          <article
            v-for="(group, index) in stackGroups"
            :key="group.title"
            class="stack-card"
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

      <section id="services" class="section services-section">
        <div class="section-heading centered" data-reveal>
          <p class="eyebrow">Services</p>
          <h2>What I <span>offer</span></h2>
          <p>
            Practical AI, data, and backend work shaped around readable outputs and usable demos.
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
              <span class="summary-icon">+</span>
            </summary>
            <p>{{ service.details }}</p>
          </details>
        </div>
      </section>

      <section id="experience" class="section experience-section">
        <div class="section-heading centered" data-reveal>
          <p class="eyebrow">Experience</p>
          <h2>Practice. <span>Build.</span> Iterate.</h2>
          <p>
            A compact timeline of research, leadership, and project practice behind the portfolio.
          </p>
        </div>

        <div class="experience-list">
          <article
            v-for="(item, index) in experienceItems"
            :key="item.role"
            class="experience-item"
            :style="revealDelay(index, 90)"
            data-reveal
          >
            <span class="experience-period">{{ item.period }}</span>
            <span class="experience-logo" aria-hidden="true">
              <span>{{ item.initials }}</span>
              <img :src="item.logo" alt="" @error="hideBrokenImage" />
            </span>
            <div class="experience-copy">
              <h3>{{ item.role }}</h3>
              <p class="experience-place">{{ item.place }}</p>
              <p>{{ item.note }}</p>
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
            </div>
          </article>
        </div>
      </section>

      <section id="projects" class="section projects-section">
        <div class="section-heading" data-reveal>
          <p class="eyebrow">Featured Work</p>
          <h2>Selected <span>projects</span></h2>
          <p>
            A curated set of research, competition, and product-style prototypes from my GitHub.
          </p>
        </div>

        <div class="project-grid">
          <article
            v-for="(project, index) in projects"
            :key="project.title"
            class="project-card"
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
        <h2>Let's build applied AI that people can <span>trust.</span></h2>
        <p>
          Open for research collaboration, AI prototypes, competition work, and data product
          experiments.
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
