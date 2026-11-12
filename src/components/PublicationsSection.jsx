import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import clsx from 'clsx'

import {
  AlignLeftIcon,
  ChevronDownSmallIcon,
  CodeBracketIcon,
  CopyOutlineIcon,
  DatabaseIcon,
  FileLinesIcon,
  GitHubBrandIcon,
  GlobeLineIcon,
  HuggingFaceIcon,
  OrbitCubeIcon,
  QuoteIcon,
  SparklesStarIcon,
  TOPIC_GLYPH_META,
  XMarkIcon,
} from '@/components/Icons'

function isSelfAuthor(name) {
  return /Carri[oó]n/i.test(name)
}

function AuthorList({ authors = [] }) {
  const [expanded, setExpanded] = useState(false)

  const selfIdx = authors.findIndex(isSelfAuthor)
  const renderAuthor = (author, idx, total) => (
    <span key={`${author}-${idx}`}>
      {isSelfAuthor(author) ? (
        <span className="pub-author-self">{author}</span>
      ) : (
        author
      )}
      {idx < total - 1 ? ', ' : ''}
    </span>
  )

  if (expanded || authors.length <= 8) {
    return (
      <p className="pub-authors">
        {authors.map((a, i) => renderAuthor(a, i, authors.length))}
      </p>
    )
  }

  const keep = [0, 1, 2, authors.length - 1]
  if (selfIdx >= 0 && !keep.includes(selfIdx)) {
    keep.push(selfIdx)
  }
  keep.sort((a, b) => a - b)

  const pieces = []
  keep.forEach((index, k) => {
    if (k > 0 && index > keep[k - 1] + 1) {
      pieces.push({ type: 'ellipsis', key: `ell-${k}` })
    }
    pieces.push({ type: 'author', name: authors[index], key: `auth-${index}` })
  })

  const hiddenCount = authors.length - keep.length

  return (
    <p className="pub-authors">
      {pieces.map((item, idx) => (
        <span key={item.key}>
          {item.type === 'ellipsis' ? (
            '…'
          ) : isSelfAuthor(item.name) ? (
            <span className="pub-author-self">{item.name}</span>
          ) : (
            item.name
          )}
          {idx < pieces.length - 1 ? ', ' : ''}
        </span>
      ))}
      <button
        type="button"
        className="authors-more"
        onClick={() => setExpanded(true)}
        aria-label={`Show all ${authors.length} authors`}
      >
        +{hiddenCount}
      </button>
    </p>
  )
}

function TopicGlyphs({ topics = [] }) {
  if (!topics.length) return null
  return (
    <div className="pub-topic-glyphs" aria-label="Research topics">
      {topics.map((key) => {
        const entry = TOPIC_GLYPH_META[key]
        if (!entry) return null
        const Icon = entry.Icon
        return (
          <span
            key={key}
            className="topic-glyph"
            data-tip={entry.label}
            title={entry.label}
          >
            <Icon className="h-[14px] w-[14px]" />
          </span>
        )
      })}
    </div>
  )
}

function BibtexModal({ bibtex, onClose }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.body.classList.add('modal-open')
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bibtex)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {}
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bibtex-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-panel">
        <div className="modal-head">
          <h3 id="bibtex-modal-title">BibTeX</h3>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close BibTeX dialog"
            onClick={onClose}
          >
            <XMarkIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
        <pre className="modal-code">{bibtex}</pre>
        <div className="modal-actions">
          <button
            type="button"
            className="btn-pill btn-pill-primary btn-pill-sm"
            onClick={handleCopy}
          >
            <CopyOutlineIcon className="h-4 w-4" />
            <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function PublicationItem({ pub, onOpenBibtex }) {
  const [abstractOpen, setAbstractOpen] = useState(false)
  const mainHref = pub.paperLink || pub.arxivLink || pub.externalLink || `/articles/${pub.slug}`
  const isPreprint = /arxiv|preprint/i.test(pub.venue || '') || pub.status === 'Preprint'

  return (
    <article className="pub-card" id={pub.slug}>
      <a
        href={mainHref}
        target="_blank"
        rel="noopener noreferrer"
        className="pub-media"
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className="pub-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pub.thumbnail}
            width="920"
            height="480"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </span>
      </a>

      <div className="pub-body">
        <div className="pub-badges">
          <span
            className={clsx(
              'badge',
              isPreprint ? 'badge-preprint' : 'badge-venue'
            )}
          >
            {pub.venue}
          </span>
          {pub.badgeNote && (
            <span className="badge badge-highlight">
              <SparklesStarIcon className="h-3 w-3" />
              <span>{pub.badgeNote}</span>
            </span>
          )}
          <TopicGlyphs topics={pub.topics} />
        </div>

        <h3 className="pub-title">
          <Link href={`/articles/${pub.slug}`}>
            {pub.displayTitle || pub.shortTitle || pub.title}
          </Link>
        </h3>

        <AuthorList authors={pub.authors || [pub.author]} />

        {pub.summary && <p className="pub-tldr">{pub.summary}</p>}
        {pub.highlight && <p className="pub-result">{pub.highlight}</p>}

        <div className="pub-actions">
          {pub.paperLink && (
            <a
              className="pub-link"
              href={pub.paperLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileLinesIcon className="h-3.5 w-3.5" />
              <span>Paper</span>
            </a>
          )}
          {pub.arxivLink && (
            <a
              className="pub-link"
              href={pub.arxivLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileLinesIcon className="h-3.5 w-3.5" />
              <span>arXiv</span>
            </a>
          )}
          {pub.websiteLink && (
            <a
              className="pub-link"
              href={pub.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlobeLineIcon className="h-3.5 w-3.5" />
              <span>Project page</span>
            </a>
          )}
          {pub.codeLink && (
            <a
              className="pub-link"
              href={pub.codeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/github\.com/.test(pub.codeLink) ? (
                <GitHubBrandIcon className="h-3.5 w-3.5" />
              ) : (
                <CodeBracketIcon className="h-3.5 w-3.5" />
              )}
              <span>Code</span>
            </a>
          )}
          {pub.dataLink && (
            <a
              className="pub-link"
              href={pub.dataLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DatabaseIcon className="h-3.5 w-3.5" />
              <span>Data</span>
            </a>
          )}
          {pub.modelLink && (
            <a
              className="pub-link"
              href={pub.modelLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HuggingFaceIcon className="h-3.5 w-3.5" />
              <span>Models</span>
            </a>
          )}
          {pub.demoLink && (
            <a
              className="pub-link"
              href={pub.demoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OrbitCubeIcon className="h-3.5 w-3.5" />
              <span>Live demo</span>
            </a>
          )}
          {pub.bibtex && (
            <button
              type="button"
              className="pub-link"
              onClick={() => onOpenBibtex(pub.bibtex)}
            >
              <QuoteIcon className="h-3.5 w-3.5" />
              <span>BibTeX</span>
            </button>
          )}
          {pub.description && (
            <button
              type="button"
              className="pub-link"
              aria-expanded={abstractOpen}
              aria-controls={`abstract-${pub.slug}`}
              onClick={() => setAbstractOpen((v) => !v)}
            >
              <AlignLeftIcon className="h-3.5 w-3.5" />
              <span>Abstract</span>
              <ChevronDownSmallIcon
                className={clsx(
                  'h-3 w-3 transition-transform',
                  abstractOpen && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>

        {pub.description && (
          <div
            className={clsx('pub-abstract', abstractOpen && 'is-open')}
            id={`abstract-${pub.slug}`}
          >
            <div>
              <p>{pub.description}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export function PublicationsSection({ articles }) {
  const [filter, setFilter] = useState('all')
  const [activeBibtex, setActiveBibtex] = useState(null)

  const firstAuthorCount = articles.filter((a) => a.isFirstAuthor).length
  const filtered =
    filter === 'first' ? articles.filter((a) => a.isFirstAuthor) : articles

  const groupedByYear = []
  filtered.forEach((pub) => {
    const year = pub.year || new Date(pub.date).getFullYear()
    const last = groupedByYear[groupedByYear.length - 1]
    if (!last || last.year !== year) {
      groupedByYear.push({ year, items: [pub] })
    } else {
      last.items.push(pub)
    }
  })

  return (
    <section className="site-section" id="publications">
      <div className="site-container">
        <header className="section-head section-head--split">
          <h2 className="section-title">Publications</h2>

          <div
            className="pub-filter"
            role="group"
            aria-label="Filter publications"
          >
            <button
              type="button"
              className={clsx('filter-btn', filter === 'all' && 'is-active')}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              <span>All</span>
              <span className="filter-count">{articles.length}</span>
            </button>
            <button
              type="button"
              className={clsx('filter-btn', filter === 'first' && 'is-active')}
              aria-pressed={filter === 'first'}
              onClick={() => setFilter('first')}
            >
              <span>First author</span>
              <span className="filter-count">{firstAuthorCount}</span>
            </button>
          </div>
        </header>

        <div className="pub-list" aria-live="polite">
          {groupedByYear.map((group) => (
            <Fragment key={group.year}>
              <div className="pub-year">{group.year}</div>
              {group.items.map((pub) => (
                <PublicationItem
                  key={pub.slug}
                  pub={pub}
                  onOpenBibtex={setActiveBibtex}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {activeBibtex && (
        <BibtexModal
          bibtex={activeBibtex}
          onClose={() => setActiveBibtex(null)}
        />
      )}
    </section>
  )
}
