import Image from 'next/image'
import { useRef, useState } from 'react'
import clsx from 'clsx'

import { Seo } from '@/components/Seo'
import { HeroCanvas } from '@/components/HeroCanvas'
import { ResumeWidget } from '@/components/ResumeWidget'
import { PublicationsSection } from '@/components/PublicationsSection'
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronDownSmallIcon,
  DiffusionGlyph,
  DownloadFileIcon,
  ExternalArrowIcon,
  FileLinesIcon,
  FlaskIcon,
  GitHubBrandIcon,
  GraduationCapIcon,
  HuggingFaceIcon,
  JepaGlyph,
  LinkedInBrandIcon,
  MailOutlineIcon,
  MedAIGlyph,
  OrbitCubeIcon,
  RocketOutlineIcon,
  SparklesStarIcon,
  ThreeDVisionGlyph,
  TrophyOutlineIcon,
  WorldModelGlyph,
} from '@/components/Icons'
import { RESUME_URL } from '@/lib/resume'
import {
  BOOKING_URL,
  CONTACT_EMAIL,
  GITHUB_URL,
  HUGGINGFACE_URL,
  LINKEDIN_URL,
} from '@/lib/site'
import { generateRssFeed } from '@/lib/generateRssFeed'
import { getAllArticles } from '@/lib/getAllArticles'

import profileImage from '@/images/profile.webp'
import logoFunction from '@/images/logos/function.svg'
import logoTera from '@/images/logos/tera.png'
import logoUCSC from '@/images/logos/ucsc.svg'
import logoGoogle from '@/images/logos/google.svg'
import logoX from '@/images/logos/x.svg'
import logoUpr from '@/images/logos/upr.svg'
import logoApple from '@/images/logos/apple.svg'
import logoVisia from '@/images/logos/visia.svg'
import logoCountie from '@/images/logos/countie.svg'
import logoBreedie from '@/images/logos/breedie.svg'
import logoVesta from '@/images/logos/vesta.svg'

const HERO_DOMAIN_CHIPS = [
  { label: 'World Models', Icon: WorldModelGlyph, cls: 'chip-1' },
  { label: '3D Vision', Icon: ThreeDVisionGlyph, cls: 'chip-2' },
  { label: 'Med AI', Icon: MedAIGlyph, cls: 'chip-3' },
  { label: 'JEPA', Icon: JepaGlyph, cls: 'chip-4' },
  { label: 'Diffusion', Icon: DiffusionGlyph, cls: 'chip-5' },
]

const NEWS_ITEMS = [
  {
    date: 'Sep 2026',
    dateTime: '2026-09',
    highlight: true,
    icon: RocketOutlineIcon,
    content: (
      <>
        Joined{' '}
        <a
          href="https://www.functionhealth.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Function
        </a>{' '}
        as <strong>World Model Team Lead</strong>, directing research on JEPA
        and autoregressive longitudinal health models.
      </>
    ),
  },
  {
    date: 'Sep 2026',
    dateTime: '2026-09',
    highlight: true,
    icon: TrophyOutlineIcon,
    content: (
      <>
        Presented two first-author papers at <strong>MICCAI 2026</strong>:{' '}
        <a href="#dermdepth">DermDepth</a> (metric 3D dermatology) and{' '}
        <a href="#cgddi">cgDDI</a> (controllable generative fairness), with open
        weights,{' '}
        <a
          href="https://huggingface.co/datasets/hcarrion/D-Synth"
          target="_blank"
          rel="noopener noreferrer"
        >
          D-Synth
        </a>
        ,{' '}
        <a
          href="https://huggingface.co/datasets/hcarrion/ControllableGenDDI"
          target="_blank"
          rel="noopener noreferrer"
        >
          266k+ synthetic images
        </a>
        , and an{' '}
        <a
          href="https://huggingface.co/spaces/hcarrion/DermDepth"
          target="_blank"
          rel="noopener noreferrer"
        >
          interactive 3D Space
        </a>
        .
      </>
    ),
  },
  {
    date: 'Jun 2026',
    dateTime: '2026-06',
    highlight: true,
    icon: GraduationCapIcon,
    content: (
      <>
        Completed my <strong>Ph.D. in Computer Science</strong> at{' '}
        <a
          href="https://www.ucsc.edu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          UC Santa Cruz
        </a>
        , advised by{' '}
        <a
          href="https://people.eecs.berkeley.edu/~narges/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dr. Narges Norouzi
        </a>{' '}
        at UC Berkeley.
      </>
    ),
  },
  {
    date: 'Jul 2025',
    dateTime: '2025-07',
    highlight: false,
    icon: FileLinesIcon,
    content: (
      <>
        Published our study on{' '}
        <a
          href="https://www.nature.com/articles/s42003-025-08423-y"
          target="_blank"
          rel="noopener noreferrer"
        >
          portable fluorescent imaging in healing tissue
        </a>{' '}
        in <strong>Nature Communications Biology</strong>.
      </>
    ),
  },
  {
    date: 'Jun 2025',
    dateTime: '2025-06',
    highlight: true,
    icon: OrbitCubeIcon,
    content: (
      <>
        Released{' '}
        <a
          href="https://arxiv.org/abs/2506.11302"
          target="_blank"
          rel="noopener noreferrer"
        >
          TARDIS STRIDE
        </a>
        , our 1B-parameter spatio-temporal world model and street-view autonomy
        dataset at Tera AI, with{' '}
        <a
          href="https://github.com/tera-ai/tardis"
          target="_blank"
          rel="noopener noreferrer"
        >
          training code
        </a>{' '}
        and{' '}
        <a
          href="https://huggingface.co/datasets/Tera-AI/STRIDE"
          target="_blank"
          rel="noopener noreferrer"
        >
          open dataset
        </a>
        .
      </>
    ),
  },
  {
    date: 'May 2025',
    dateTime: '2025-05',
    highlight: false,
    icon: FileLinesIcon,
    content: (
      <>
        Published{' '}
        <a
          href="https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/admt.202500040"
          target="_blank"
          rel="noopener noreferrer"
        >
          Remote-Controlled Wireless Bioelectronics for Fluoxetine Therapy
        </a>{' '}
        in <strong>Advanced Materials Technologies</strong>.
      </>
    ),
  },
  {
    date: 'Sep 2024',
    dateTime: '2024-09',
    highlight: false,
    icon: FileLinesIcon,
    content: (
      <>
        Published{' '}
        <a
          href="https://onlinelibrary.wiley.com/doi/epdf/10.1002/admt.202301115"
          target="_blank"
          rel="noopener noreferrer"
        >
          Programmable Delivery of Fluoxetine via Wearable Bioelectronics
        </a>{' '}
        in <strong>Advanced Materials Technologies</strong>.
      </>
    ),
  },
  {
    date: 'Jun 2024',
    dateTime: '2024-06',
    highlight: true,
    icon: RocketOutlineIcon,
    content: (
      <>
        Joined{' '}
        <a
          href="https://www.tera-ai.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tera AI
        </a>{' '}
        as <strong>Founding Lead Research Scientist</strong> to build world
        models for spatial reasoning and autonomy.
      </>
    ),
  },
  {
    date: 'Oct 2023',
    dateTime: '2023-10',
    highlight: true,
    icon: SparklesStarIcon,
    content: (
      <>
        Presented our first-author paper <a href="#fedd">FEDD</a> on diffusion
        feature learning for label-efficient dermatology at{' '}
        <strong>MICCAI 2023</strong>.
      </>
    ),
  },
  {
    date: 'Jun 2023',
    dateTime: '2023-06',
    highlight: false,
    icon: FlaskIcon,
    content: (
      <>
        Joined <strong>Google Research</strong> as a Ph.D. Student Researcher
        working on unified video and image foundation encoders.
      </>
    ),
  },
]

const EXPERIENCE_WORK = [
  {
    date: 'Sep 2026 – now',
    role: 'World Model Team Lead',
    org: 'Function',
    href: 'https://www.functionhealth.com/',
    logo: logoFunction,
    current: true,
    desc: 'Directing the World Model team on JEPA and autoregressive multimodal models over longitudinal lab tests, imaging, and member health history to monitor early indicators and surface actionable insights.',
  },
  {
    date: '2024 – 2026',
    role: 'Founding Lead Research Scientist',
    org: 'Tera AI',
    href: 'https://www.tera-ai.com/',
    logo: logoTera,
    desc: 'Set and executed the founding research agenda in spatial reasoning and embodied world models; led TARDIS & STRIDE, a 1B-parameter spatio-temporal transformer for autonomy.',
  },
  {
    date: 'Summer 2023',
    role: 'Student Researcher (Ph.D.)',
    org: 'Google Research',
    href: 'https://research.google/',
    logo: logoGoogle,
    desc: 'Trained unified multimodal video-and-image foundation encoders, improving downstream transfer by >25% over single-modality encoders.',
  },
  {
    date: '2021 – 2022',
    role: 'AI Resident (Ph.D.)',
    org: 'X, The Moonshot Factory (Google [X])',
    href: 'https://x.company/',
    logo: logoX,
    desc: 'Built simulation, edge-perception, and aerial/ground vision models for autonomous platforms, exceeding target benchmarks and earning granted Google patents.',
  },
  {
    date: '2020 – 2026',
    role: 'Graduate Student Researcher',
    org: 'UC Santa Cruz & UC Berkeley',
    href: 'https://www.ucsc.edu/',
    logo: logoUCSC,
    desc: 'Developed metric 3D reconstruction (DermDepth), controllable diffusion priors (cgDDI, FEDD), and self-supervised temporal stage discovery (HealNet) for label-constrained medical data.',
  },
]

const EXPERIENCE_EDU = [
  {
    date: '2020 – 2026',
    role: 'Ph.D. in Computer Science',
    org: 'University of California, Santa Cruz',
    logo: logoUCSC,
    desc: 'Advised by Dr. Narges Norouzi (UC Berkeley). 3.92 GPA. Focus on self-supervised temporal dynamics, metric 3D vision, diffusion, and medical AI.',
  },
  {
    date: '2017 – 2021',
    role: 'B.Sc. in Computer Science',
    org: 'University of Puerto Rico, Río Piedras',
    logo: logoUpr,
    desc: 'Undergraduate Research Assistant with Dr. Rémi Mégret on self-supervised multi-day video re-identification. 3.75 GPA.',
  },
  {
    date: '2018 – 2019',
    role: 'Software Engineering & Design',
    org: 'Apple Developer Academy, Univ. of Naples Federico II',
    logo: logoApple,
    desc: 'Full-stack native iOS engineering, interface design, and on-device CoreML apps.',
  },
]

const PROJECTS = [
  {
    name: 'Function · World Models',
    tag: 'Longitudinal Health',
    logo: logoFunction,
    href: 'https://www.functionhealth.com/',
    linkLabel: 'functionhealth.com',
    desc: 'JEPA and autoregressive models over longitudinal lab tests, imaging, and health history to monitor early indicators and surface member insights.',
  },
  {
    name: 'Tera AI · TARDIS & STRIDE',
    tag: 'Embodied Autonomy',
    logo: logoTera,
    href: 'https://github.com/tera-ai/tardis',
    linkLabel: 'github.com/tera-ai/tardis',
    desc: 'Open-source 1B-parameter spatio-temporal transformer and 360° road-network graph uniting view synthesis, georeferencing, and action prediction.',
  },
  {
    name: 'Visia AI',
    tag: 'Technical Advisor',
    logo: logoVisia,
    href: 'https://www.visia.ai/',
    linkLabel: 'visia.ai',
    desc: 'Advising on computer vision for inbound material visibility, hazard monitoring, and recyclability.',
  },
  {
    name: 'DermDepth & D-Synth',
    tag: 'Open Weights & Space',
    logo: logoUCSC,
    href: 'https://huggingface.co/spaces/hcarrion/DermDepth',
    linkLabel: 'Hugging Face Space',
    desc: 'Monocular metric 3D skin reconstruction model and synthetic 3D dataset estimating millimeter geometry from a single photograph.',
  },
  {
    name: 'Breedie',
    tag: 'iOS · On-Device ML',
    logo: logoBreedie,
    href: 'https://apps.apple.com/th/app/breedie/id1492837097',
    linkLabel: 'App Store',
    desc: 'Privacy-first on-device CoreML dog breed-mix app built to support shelter adoption with love4satos.org.',
  },
  {
    name: 'Countie & Vesta',
    tag: 'Open Source',
    logo: logoCountie,
    secondLogo: logoVesta,
    href: 'https://github.com/hectorcarrion/Countie',
    linkLabel: 'github.com/hectorcarrion',
    desc: 'Minimalist iOS Lock Screen countdown widgets (Countie) and open-source chest X-ray research code (Vesta).',
  },
]

export default function Home({ articles }) {
  const heroRef = useRef(null)
  const portraitRef = useRef(null)
  const ledeRef = useRef(null)
  const [newsExpanded, setNewsExpanded] = useState(false)

  const visibleNews = newsExpanded ? NEWS_ITEMS : NEWS_ITEMS.slice(0, 6)

  return (
    <>
      <Seo />

      {/* ===================== Hero ===================== */}
      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-spotlight" aria-hidden="true" />
        <HeroCanvas
          heroRef={heroRef}
          portraitRef={portraitRef}
          ledeRef={ledeRef}
        />

        <div className="site-container hero-grid">
          <div className="hero-text">
            <a className="status-badge" href="#experience">
              <span className="status-dot" aria-hidden="true" />
              <span>World Model Team Lead @ Function</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>

            <h1 className="hero-name">
              <span className="word">
                <span>Dr. Héctor</span>
              </span>{' '}
              <span className="word">
                <span className="hero-name-accent">Carrión</span>
              </span>
            </h1>

            <p className="hero-role">
              World Model Team Lead at{' '}
              <a
                href="https://www.functionhealth.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Function
              </a>{' '}
              &middot; CS Ph.D. (
              <a
                href="https://www.ucsc.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                UC Santa Cruz
              </a>{' '}
              /{' '}
              <a
                href="https://www.berkeley.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                UC Berkeley
              </a>
              ) &middot; ex-
              <a
                href="https://www.tera-ai.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tera AI
              </a>{' '}
              &amp;{' '}
              <a
                href="https://research.google/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Research
              </a>
            </p>

            <p className="hero-lede" ref={ledeRef}>
              I build <strong>multimodal world models</strong> that learn how
              physical and biological systems change across space, time, and
              interventions, spanning 3D autonomy and longitudinal human health.
            </p>

            <div className="hero-cta">
              <a
                className="btn-pill btn-pill-primary"
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadFileIcon className="h-[18px] w-[18px]" />
                <span>Download CV</span>
              </a>
              <a
                className="btn-pill btn-pill-ghost"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                <MailOutlineIcon className="h-[18px] w-[18px]" />
                <span>Get in touch</span>
              </a>
              <a
                className="btn-pill btn-pill-ghost"
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarIcon className="h-[18px] w-[18px]" />
                <span>Schedule a 1:1</span>
              </a>
            </div>

            <ul className="hero-social" aria-label="Profiles">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  data-tip="GitHub"
                >
                  <GitHubBrandIcon className="h-[19px] w-[19px]" />
                </a>
              </li>
              <li>
                <a
                  href={HUGGINGFACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hugging Face"
                  data-tip="Hugging Face"
                >
                  <HuggingFaceIcon className="h-[19px] w-[19px]" />
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  data-tip="LinkedIn"
                >
                  <LinkedInBrandIcon className="h-[19px] w-[19px]" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  aria-label="Email"
                  data-tip="Email"
                >
                  <MailOutlineIcon className="h-[19px] w-[19px]" />
                </a>
              </li>
            </ul>
          </div>

          <div className="hero-portrait">
            <div className="portrait-ring" ref={portraitRef}>
              <Image
                src={profileImage}
                width={640}
                height={640}
                alt="Portrait of Dr. Héctor Carrión"
                priority
              />
              <span className="portrait-glare" aria-hidden="true" />
            </div>

            {HERO_DOMAIN_CHIPS.map(({ label, Icon, cls }) => (
              <span key={label} className={clsx('portrait-chip', cls)}>
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </span>
            ))}

            <ul className="portrait-chips-mobile" aria-label="Research areas">
              {HERO_DOMAIN_CHIPS.map(({ label, Icon }) => (
                <li key={label}>
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== About + Signature Resume Widget ===================== */}
      <section className="site-section" id="about">
        <div className="site-container">
          <header className="section-head">
            <h2 className="section-title">About</h2>
          </header>

          <div className="about-grid">
            <div className="about-text">
              <p>
                I lead the <strong>World Model</strong> team at{' '}
                <a
                  href="https://www.functionhealth.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Function
                </a>
                , building <strong>JEPA and autoregressive models</strong> over
                longitudinal lab tests, imaging, and member health history to
                monitor for early indicators and give members a clearer picture
                of how their biology changes over time.
              </p>

              <p>
                My work across autonomy and medical AI focuses on one core
                problem: learning structured state representations across space,
                time, and actions when labeled data is scarce. Before Function,
                I was <strong>Founding Lead Research Scientist</strong> at{' '}
                <a
                  href="https://www.tera-ai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tera AI
                </a>
                , where I led <a href="#tardis-stride">TARDIS &amp; STRIDE</a>{' '}
                (with Pietro Perona and Jitendra Malik), a 1B-parameter
                spatio-temporal world model for street-view synthesis,
                georeferencing, and action prediction. Earlier, I built
                multimodal video-image encoders and simulation systems at{' '}
                <a
                  href="https://research.google/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Research
                </a>{' '}
                and{' '}
                <a
                  href="https://x.company/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X (Google [X])
                </a>
                .
              </p>

              <p>
                I earned my Computer Science Ph.D. at{' '}
                <a
                  href="https://www.ucsc.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UC Santa Cruz
                </a>
                , advised by{' '}
                <a
                  href="https://people.eecs.berkeley.edu/~narges/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dr. Narges Norouzi
                </a>{' '}
                at UC Berkeley. My doctoral research developed single-view
                metric 3D reconstruction (<a href="#dermdepth">DermDepth</a>),
                self-supervised temporal stage discovery (
                <a href="#healnet">HealNet</a>), controllable diffusion priors
                for underrepresented populations (<a href="#cgddi">cgDDI</a>,{' '}
                <a href="#fedd">FEDD</a>), and closed-loop bioelectronic
                imaging pipelines.
              </p>

              <p>
                Growing up in Puerto Rico, one of my first memories with
                technology was helping my dad wire a thin beige DSL cable across
                his small office so he could work remotely and spend more time
                at home. That practical focus on building reliable systems that
                directly help people still shapes how I lead teams, advise{' '}
                <a
                  href="https://www.visia.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visia AI
                </a>
                , and open-source models and datasets.
              </p>

              <div className="side-card mt-7">
                <h3 className="side-title">Research focus</h3>
                <ul className="chips">
                  <li>World Models</li>
                  <li>JEPA &amp; Autoregressive Dynamics</li>
                  <li>3D Vision</li>
                  <li>Diffusion Models</li>
                  <li>Medical AI</li>
                  <li>Self-Supervised Learning</li>
                  <li>Embodied Autonomy</li>
                </ul>
              </div>
            </div>

            <aside className="about-side">
              <ResumeWidget />

              <div className="side-card">
                <h3 className="side-title">At a glance</h3>
                <dl className="facts">
                  <div>
                    <dt>Role</dt>
                    <dd>World Model Team Lead &middot; Function</dd>
                  </div>
                  <div>
                    <dt>Ph.D.</dt>
                    <dd>UC Santa Cruz &middot; Adv. N. Norouzi (Berkeley)</dd>
                  </div>
                  <div>
                    <dt>Advisory</dt>
                    <dd>
                      <a
                        href="https://www.visia.ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visia AI
                      </a>{' '}
                      (2021&ndash;present)
                    </dd>
                  </div>
                  <div>
                    <dt>Contact</dt>
                    <dd>
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ===================== News ===================== */}
      <section className="site-section" id="news">
        <div className="site-container">
          <header className="section-head">
            <h2 className="section-title">News</h2>
          </header>

          <ol className="news-list">
            {visibleNews.map((item, idx) => {
              const Icon = item.icon
              return (
                <li
                  key={`${item.dateTime}-${idx}`}
                  className={clsx(
                    'news-item',
                    item.highlight && 'is-highlight'
                  )}
                >
                  <time className="news-date" dateTime={item.dateTime}>
                    {item.date}
                  </time>
                  <span className="news-icon" aria-hidden="true">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p>{item.content}</p>
                </li>
              )
            })}
          </ol>

          {NEWS_ITEMS.length > 6 && (
            <button
              type="button"
              className="text-btn"
              aria-expanded={newsExpanded}
              onClick={() => setNewsExpanded((v) => !v)}
            >
              <span>
                {newsExpanded
                  ? 'Show less'
                  : `Show all news (${NEWS_ITEMS.length})`}
              </span>
              <ChevronDownSmallIcon
                className={clsx(
                  'h-3.5 w-3.5 transition-transform',
                  newsExpanded && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>
      </section>

      {/* ===================== Publications ===================== */}
      <PublicationsSection articles={articles} />

      {/* ===================== Experience ===================== */}
      <section className="site-section" id="experience">
        <div className="site-container">
          <header className="section-head">
            <h2 className="section-title">Experience</h2>
          </header>

          <div className="exp-grid">
            <div className="exp-col">
              <h3 className="exp-col-title">
                <FlaskIcon className="h-4 w-4" />
                <span>Research &amp; industry leadership</span>
              </h3>
              <ol className="exp-list">
                {EXPERIENCE_WORK.map((item) => (
                  <li
                    key={`${item.org}-${item.date}`}
                    className={clsx('exp-item', item.current && 'is-current')}
                  >
                    <div className="exp-logo">
                      <Image
                        src={item.logo}
                        alt={`${item.org} logo`}
                        className="h-6 w-6 object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <span className="exp-date">{item.date}</span>
                      <h4 className="exp-role">{item.role}</h4>
                      <p className="exp-org">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.org}
                        </a>
                      </p>
                      <p className="exp-desc">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="exp-col">
              <h3 className="exp-col-title">
                <GraduationCapIcon className="h-4 w-4" />
                <span>Education</span>
              </h3>
              <ol className="exp-list">
                {EXPERIENCE_EDU.map((item) => (
                  <li key={item.role} className="exp-item">
                    <div className="exp-logo">
                      <Image
                        src={item.logo}
                        alt={`${item.org} logo`}
                        className="h-6 w-6 object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <span className="exp-date">{item.date}</span>
                      <h4 className="exp-role">{item.role}</h4>
                      <p className="exp-org">{item.org}</p>
                      <p className="exp-desc">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Projects & Ventures ===================== */}
      <section className="site-section" id="projects">
        <div className="site-container">
          <header className="section-head">
            <h2 className="section-title">Systems, ventures &amp; apps</h2>
          </header>

          <div className="card-grid">
            {PROJECTS.map((project) => (
              <article key={project.name} className="info-card flex flex-col">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="resume-logo-badge">
                      <Image
                        src={project.logo}
                        alt=""
                        className="h-7 w-7 object-contain"
                        unoptimized
                      />
                    </div>
                    {project.secondLogo && (
                      <div className="resume-logo-badge">
                        <Image
                          src={project.secondLogo}
                          alt=""
                          className="h-7 w-7 object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                  <span className="badge badge-preprint">{project.tag}</span>
                </div>

                <h3 className="pub-title" style={{ fontSize: '1.02rem' }}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.name}
                  </a>
                </h3>

                <p className="exp-desc mt-2 flex-1">{project.desc}</p>

                <div className="mt-5 border-t border-[var(--border)] pt-3">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                  >
                    <span>{project.linkLabel}</span>
                    <ExternalArrowIcon className="h-3 w-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== Honors, Patents & Advisory ===================== */}
      <section className="site-section" id="honors">
        <div className="site-container">
          <header className="section-head">
            <h2 className="section-title">Honors, patents &amp; service</h2>
          </header>

          <div className="card-grid">
            <article className="info-card">
              <h3 className="info-title">
                <span className="info-icon">
                  <TrophyOutlineIcon className="h-[18px] w-[18px]" />
                </span>
                <span>Honors &amp; fellowships</span>
              </h3>
              <ul className="info-list">
                <li>
                  <span className="info-year">Award</span>
                  <span>MICCAI STAR Student Travel &amp; Research Award</span>
                </li>
                <li>
                  <span className="info-year">Fellow</span>
                  <span>Google&ndash;CAHSI Doctoral Research Fellowship</span>
                </li>
                <li>
                  <span className="info-year">Patent</span>
                  <span>Google Patent Award (X, The Moonshot Factory)</span>
                </li>
                <li>
                  <span className="info-year">Award</span>
                  <span>SIDIM Outstanding Research Award</span>
                </li>
                <li>
                  <span className="info-year">Fellow</span>
                  <span>NIH Big Data to Knowledge (BD2K) Fellowship</span>
                </li>
              </ul>
            </article>

            <article className="info-card">
              <h3 className="info-title">
                <span className="info-icon">
                  <OrbitCubeIcon className="h-[18px] w-[18px]" />
                </span>
                <span>Open models &amp; datasets</span>
              </h3>
              <ul className="info-list">
                <li>
                  <span className="info-year">2026</span>
                  <span>
                    <a
                      href="https://huggingface.co/datasets/hcarrion/D-Synth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                    >
                      D-Synth &amp; DermDepth
                    </a>
                    : synthetic 3D dermatology dataset, weights &amp; Space
                  </span>
                </li>
                <li>
                  <span className="info-year">2026</span>
                  <span>
                    <a
                      href="https://huggingface.co/datasets/hcarrion/ControllableGenDDI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                    >
                      ControllableGenDDI
                    </a>
                    : 266,136 skin-tone-balanced synthetic images
                  </span>
                </li>
                <li>
                  <span className="info-year">2025</span>
                  <span>
                    <a
                      href="https://huggingface.co/datasets/Tera-AI/STRIDE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                    >
                      TARDIS &amp; STRIDE
                    </a>
                    : 1B spatio-temporal world model &amp; street-view graph
                  </span>
                </li>
                <li>
                  <span className="info-year">2023</span>
                  <span>
                    <a
                      href="https://github.com/hectorcarrion/fedd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--text)] hover:text-[var(--accent)]"
                    >
                      FEDD DDI Masks
                    </a>
                    : annotated lesion segmentation masks
                  </span>
                </li>
              </ul>
            </article>

            <article className="info-card">
              <h3 className="info-title">
                <span className="info-icon">
                  <GraduationCapIcon className="h-[18px] w-[18px]" />
                </span>
                <span>Advisory, teaching &amp; stack</span>
              </h3>
              <ul className="info-list">
                <li>
                  <span className="info-year">2021+</span>
                  <span>Technical Advisor, Visia AI</span>
                </li>
                <li>
                  <span className="info-year">UCSC</span>
                  <span>Machine Learning Tutor &amp; Mentor (2020&ndash;2022)</span>
                </li>
                <li>
                  <span className="info-year">Langs</span>
                  <span>English (native) &middot; Spanish (native)</span>
                </li>
              </ul>
              <p className="info-subtitle">Core technical stack</p>
              <ul className="chips">
                <li style={{ padding: '4px 10px', fontSize: '0.78rem' }}>PyTorch</li>
                <li style={{ padding: '4px 10px', fontSize: '0.78rem' }}>JAX / EasyLM</li>
                <li style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Python</li>
                <li style={{ padding: '4px 10px', fontSize: '0.78rem' }}>C++</li>
                <li style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Swift</li>
                <li style={{ padding: '4px 10px', fontSize: '0.78rem' }}>JEPA</li>
                <li style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Diffusion</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === 'production') {
    await generateRssFeed()
  }

  return {
    props: {
      articles: (await getAllArticles()).map(({ component, ...meta }) => meta),
    },
  }
}
