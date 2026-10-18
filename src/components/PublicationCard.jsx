import Link from 'next/link'

import { Card } from '@/components/Card'
import { PublicationLinks } from '@/components/PublicationLinks'
import { formatDate } from '@/lib/formatDate'

export function PublicationCard({ article, titleAs = 'h2' }) {
  return (
    <Card as="article">
      <Card.Title as={titleAs}>
        <Link
          href={`/articles/${article.slug}`}
          className="hover:text-teal-600 dark:hover:text-teal-400"
        >
          {article.shortTitle || article.title}
        </Link>
      </Card.Title>
      <Card.Eyebrow>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        {article.venue && <span className="ml-3">{article.venue}</span>}
        {article.status === 'Preprint' && (
          <span className="ml-3 rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
            Preprint
          </span>
        )}
      </Card.Eyebrow>
      <Card.Description>
        {article.summary || article.description}
      </Card.Description>
      {article.highlight && (
        <p className="relative z-10 mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {article.highlight}
        </p>
      )}
      <PublicationLinks article={article} />
    </Card>
  )
}
