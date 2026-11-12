import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Seo } from '@/components/Seo'

export default function AboutRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/#about')
  }, [router])

  return (
    <>
      <Seo title="About · Dr. Héctor Carrión" />
      <div className="site-container pt-32">
        <p className="text-sm text-[var(--muted)]">
          Redirecting to <Link href="/#about">About</Link>&hellip;
        </p>
      </div>
    </>
  )
}
