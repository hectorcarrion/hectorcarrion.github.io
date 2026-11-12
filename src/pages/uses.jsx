import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Seo } from '@/components/Seo'

export default function ContactRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/#about')
  }, [router])

  return (
    <>
      <Seo title="Contact · Dr. Héctor Carrión" />
      <div className="site-container pt-32">
        <p className="text-sm text-[var(--muted)]">
          Redirecting to <Link href="/#about">Contact</Link>&hellip;
        </p>
      </div>
    </>
  )
}
