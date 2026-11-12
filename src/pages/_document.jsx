import { Head, Html, Main, NextScript } from 'next/document'
import { SITE_URL } from '@/lib/site'

const modeScript = `
  (function () {
    document.documentElement.classList.add('js');
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    var saved = null;
    try {
      saved = localStorage.getItem('theme');
      if (!saved && localStorage.getItem('isDarkMode') !== null) {
        saved = localStorage.getItem('isDarkMode') === 'true' ? 'dark' : 'light';
      }
    } catch (e) {}
    applyTheme(saved || (media.matches ? 'dark' : 'light'));
  })();
`

export default function Document() {
  return (
    <Html className="h-full antialiased" lang="en">
      <Head>
        <meta
          name="theme-color"
          content="#FEF9EF"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1B1C1F"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href="/favicon.ico?v=2026-10-round" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Function Typography: Financier Display -> Playfair Display (official alternate), FT Base -> Inter, DM Mono */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@300..700&family=Playfair+Display:ital,wght@0,400..600;1,400..500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${SITE_URL}/rss/feed.xml`}
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href={`${SITE_URL}/rss/feed.json`}
        />
      </Head>
      <body className="flex min-h-full flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
