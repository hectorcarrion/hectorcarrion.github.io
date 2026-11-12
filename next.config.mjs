import fs from 'fs'
import path from 'path'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'

const resumeModule = fs.readFileSync(
  path.join(process.cwd(), 'src/lib/resume.js'),
  'utf8'
)
const filenameMatch = resumeModule.match(
  /RESUME_FILENAME\s*=\s*['"]([^'"]+)['"]/
)
if (filenameMatch) {
  const rootResumePath = path.join(process.cwd(), filenameMatch[1])
  const publicResumePath = path.join(
    process.cwd(),
    'public/assets/cv_hector_carrion.pdf'
  )
  if (fs.existsSync(rootResumePath)) {
    fs.mkdirSync(path.dirname(publicResumePath), { recursive: true })
    fs.copyFileSync(rootResumePath, publicResumePath)
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['jsx', 'mdx'],
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)
