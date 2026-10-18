import Head from 'next/head'
import { useRouter } from 'next/router'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export function Seo({
  title = `${SITE_NAME} - AI Researcher`,
  description = SITE_DESCRIPTION,
  type = 'website',
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
        content={`${SITE_NAME} - World Model Team Lead at Function Health`}
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
        content={`${SITE_NAME} - World Model Team Lead at Function Health`}
        key="twitter:image:alt"
      />
    </Head>
  )
}
