import {
  CodeBracketIcon,
  DatabaseIcon,
  FileLinesIcon,
  GitHubBrandIcon,
  GlobeLineIcon,
  HuggingFaceIcon,
  OrbitCubeIcon,
} from '@/components/Icons'

export function PublicationLinks({ article }) {
  let links = [
    {
      label: 'Paper',
      href: article.paperLink || (!article.arxivLink && article.externalLink),
      icon: FileLinesIcon,
    },
    { label: 'arXiv', href: article.arxivLink, icon: FileLinesIcon },
    { label: 'Project page', href: article.websiteLink, icon: GlobeLineIcon },
    {
      label: 'Code',
      href: article.codeLink,
      icon: /github\.com/.test(article.codeLink || '')
        ? GitHubBrandIcon
        : CodeBracketIcon,
    },
    { label: 'Data', href: article.dataLink, icon: DatabaseIcon },
    { label: 'Models', href: article.modelLink, icon: HuggingFaceIcon },
    { label: 'Live Demo', href: article.demoLink, icon: OrbitCubeIcon },
  ].filter((link) => link.href)

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}: ${article.displayTitle || article.title}`}
          className="pub-link"
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  )
}
