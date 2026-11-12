import { useEffect, useRef } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Seo } from '@/components/Seo'

import '@/styles/tailwind.css'
import 'focus-visible'

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default function App({ Component, pageProps, router }) {
  let previousPathname = usePrevious(router.pathname)

  return (
    <>
      <Seo />
      <Header />
      <main id="main" className="flex-1">
        <Component previousPathname={previousPathname} {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
