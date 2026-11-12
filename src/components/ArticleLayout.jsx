import Link from 'next/link'

import { formatDate } from '@/lib/formatDate'
import { Prose } from '@/components/Prose'
import { Seo } from '@/components/Seo'
import { PublicationLinks } from '@/components/PublicationLinks'
import { SparklesStarIcon } from '@/components/Icons'

export function ArticleLayout({ children, meta, isRssFeed = false }) {
  if (isRssFeed) {
    return (
      <>
        <p>{meta.summary || meta.description}</p>
        <p>
          <a href={meta.paperLink || meta.arxivLink || meta.externalLink}>
            Paper
          </a>
        </p>
        {meta.codeLink && (
          <p>
            <a href={meta.codeLink}>Code</a>
          </p>
        )}
        {children}
      </>
    )
  }

  const displayTitle = meta.displayTitle || meta.title

  return (
    <>
      <Seo
        title={`${displayTitle} · Dr. Héctor Carrión`}
        description={meta.summary || meta.description}
        type="article"
      />
      <div className="site-container pt-28 pb-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/#publications"
            className="pub-link mb-8 inline-flex"
            aria-label="Back to all publications"
          >
            <span aria-hidden="true">&larr;</span>
            <span>All publications</span>
          </Link>

          <article>
            <header>
              <div className="pub-badges">
                {meta.venue && (
                  <span className="badge badge-venue">{meta.venue}</span>
                )}
                {meta.badgeNote && (
                  <span className="badge badge-highlight">
                    <SparklesStarIcon className="h-3 w-3" />
                    <span>{meta.badgeNote}</span>
                  </span>
                )}
                <time
                  dateTime={meta.date}
                  className="text-xs font-medium text-[var(--muted)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {formatDate(meta.date)}
                </time>
              </div>

              <h1
                className="mt-3 text-3xl sm:text-5xl"
                style={{
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1.08,
                  color: 'var(--text)',
                }}
              >
                {displayTitle}
              </h1>

              {meta.authors && (
                <p className="pub-authors mt-4 text-base">
                  {meta.authors.map((a, idx) => (
                    <span key={a}>
                      {/Carri[oó]n/i.test(a) ? (
                        <span className="pub-author-self">{a}</span>
                      ) : (
                        a
                      )}
                      {idx < meta.authors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              )}

              <PublicationLinks article={meta} />
            </header>

            {meta.thumbnail && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.thumbnail}
                  alt=""
                  className="mx-auto max-h-[380px] w-auto object-contain"
                />
              </div>
            )}

            <div className="side-card mt-8 space-y-4">
              {meta.summary && (
                <p className="text-base leading-relaxed text-[var(--text-2)]">
                  {meta.summary}
                </p>
              )}
              {meta.highlight && (
                <p className="text-sm font-semibold text-[var(--text)]">
                  {meta.highlight}
                </p>
              )}
            </div>

            <Prose className="mt-10 max-w-none">
              <h2>Abstract</h2>
              <p>{meta.description}</p>
              {children}
            </Prose>

            {meta.bibtex && (
              <div className="mt-10">
                <h2
                  className="mb-3 text-2xl"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  BibTeX
                </h2>
                <pre className="modal-code">{meta.bibtex}</pre>
              </div>
            )}
          </article>
        </div>
      </div>
    </>
  )
}
