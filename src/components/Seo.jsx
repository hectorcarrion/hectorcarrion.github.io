import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  GITHUB_URL,
  HUGGINGFACE_URL,
  LINKEDIN_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dr. Héctor Carrión',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/profile.png`,
  jobTitle: 'World Model Team Lead',
  worksFor: {
    '@type': 'Organization',
    name: 'Function',
    url: 'https://www.functionhealth.com/',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'University of California, Santa Cruz',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'University of California, Berkeley',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'University of Puerto Rico, Río Piedras',
    },
  ],
  knowsAbout: [
    'World Models',
    'JEPA',
    '3D Vision',
    'Diffusion Models',
    'Medical AI',
    'Self-Supervised Learning',
    'Embodied Autonomy',
  ],
  sameAs: [GITHUB_URL, HUGGINGFACE_URL, LINKEDIN_URL],
}

export function Seo({
  title = `Dr. ${SITE_NAME} · World Models & Multimodal AI`,
  description = SITE_DESCRIPTION,
  type = 'profile',
}) {
  let { asPath } = useRouter()
  let pathname = asPath.split(/[?#]/)[0]
  let url = `${SITE_URL}${pathname}`
  let image = `${SITE_URL}/profile.png`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={url} key="canonical" />
      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:image" content={image} key="og:image" />
      <meta property="og:image:width" content="800" key="og:image:width" />
      <meta property="og:image:height" content="800" key="og:image:height" />
      <meta
        property="og:image:alt"
        content={`${SITE_NAME} - World Model Team Lead at Function`}
        key="og:image:alt"
      />
      <meta name="twitter:card" content="summary" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta
        name="twitter:description"
        content={description}
        key="twitter:description"
      />
      <meta name="twitter:image" content={image} key="twitter:image" />
      <meta
        name="twitter:image:alt"
        content={`${SITE_NAME} - World Model Team Lead at Function`}
        key="twitter:image:alt"
      />
      <script
        key="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
      />
    </Head>
  )
}
