export function PublicationLinks({ article }) {
  let links = [
    { label: 'Paper', href: article.paperLink || article.externalLink },
    { label: 'Code', href: article.codeLink },
    { label: 'Data', href: article.dataLink },
    { label: 'Demo', href: article.demoLink },
  ].filter((link) => link.href)

  return (
    <div className="relative z-30 mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-teal-600 dark:text-teal-400">
      {links.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}: ${article.title}`}
          className="rounded-sm underline decoration-teal-500/30 underline-offset-4 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
        >
          {label}
        </a>
      ))}
    </div>
  )
}
