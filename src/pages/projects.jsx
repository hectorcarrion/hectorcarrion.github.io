import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Seo } from '@/components/Seo'

export default function ProjectsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/#projects')
  }, [router])

  return (
    <>
      <Seo title="Projects · Dr. Héctor Carrión" />
      <div className="site-container pt-32">
        <p className="text-sm text-[var(--muted)]">
          Redirecting to <Link href="/#projects">Projects</Link>&hellip;
        </p>
      </div>
    </>
  )
}
