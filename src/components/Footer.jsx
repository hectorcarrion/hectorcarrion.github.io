import Link from 'next/link'
import { ArrowUpIcon } from '@/components/Icons'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <p>
          &copy; {new Date().getFullYear()} Dr. Héctor Carrión &middot; Last
          updated November 2026 &middot;{' '}
          <Link
            href="/breedie-policy"
            className="hover:underline"
            style={{ color: 'inherit' }}
          >
            App Privacy
          </Link>
        </p>
        <a href="#top" className="text-btn" style={{ marginTop: 0 }}>
          <span>Back to top</span>
          <ArrowUpIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  )
}
