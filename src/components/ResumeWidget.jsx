import Image from 'next/image'

import { RESUME_URL } from '@/lib/resume'
import { BriefcaseLineIcon, DownloadFileIcon } from '@/components/Icons'
import logoFunction from '@/images/logos/function.svg'
import logoTera from '@/images/logos/tera.png'
import logoUCSC from '@/images/logos/ucsc.svg'
import logoGoogle from '@/images/logos/google.svg'
import logoX from '@/images/logos/x.svg'
import logoUpr from '@/images/logos/upr.svg'
import logoApple from '@/images/logos/apple.svg'

export const WORK_AND_SCHOOL_ROLES = [
  {
    company: 'Function',
    href: 'https://www.functionhealth.com/',
    title: 'World Model Team Lead',
    logo: logoFunction,
    start: 'Sep 2026',
    end: 'Present',
  },
  {
    company: 'Tera AI',
    href: 'https://www.tera-ai.com/',
    title: 'Founding Lead Research Scientist',
    logo: logoTera,
    start: 'Jun 2024',
    end: 'Sep 2026',
  },
  {
    company: 'UC Santa Cruz',
    href: 'https://www.ucsc.edu/',
    title: 'Ph.D., Graduate Researcher',
    logo: logoUCSC,
    start: 'Jun 2020',
    end: 'Jun 2026',
  },
  {
    company: 'Google Research',
    href: 'https://research.google/',
    title: 'Student Researcher (Ph.D.)',
    logo: logoGoogle,
    start: 'Jun 2023',
    end: 'Sep 2023',
  },
  {
    company: 'Google [X]',
    href: 'https://x.company/',
    title: 'AI Resident (Ph.D.)',
    logo: logoX,
    start: 'Jun 2021',
    end: 'Sep 2022',
  },
  {
    company: 'University of Puerto Rico',
    href: 'https://www.uprrp.edu/',
    title: 'B.Sc., Research Assistant',
    logo: logoUpr,
    start: 'Aug 2017',
    end: 'May 2021',
  },
  {
    company: 'Apple Developer Academy',
    href: 'https://www.developeracademy.unina.it/',
    title: 'Full Stack Engineer',
    logo: logoApple,
    start: 'Sep 2018',
    end: 'Jun 2019',
  },
]

export function ResumeWidget() {
  return (
    <div className="resume-widget">
      <div className="resume-widget-head">
        <h3 className="resume-widget-title">
          <BriefcaseLineIcon className="h-[18px] w-[18px] text-[var(--accent)]" />
          <span>Work &amp; school</span>
        </h3>
        <span className="resume-widget-badge">6+ YoE</span>
      </div>

      <ol className="resume-widget-list">
        {WORK_AND_SCHOOL_ROLES.map((role) => (
          <li key={`${role.company}-${role.start}`} className="resume-role-row">
            <div className="resume-logo-badge">
              <Image
                src={role.logo}
                alt={`${role.company} logo`}
                className="h-7 w-7 object-contain"
                unoptimized
              />
            </div>

            <div className="resume-role-meta">
              <div className="resume-role-top">
                <a
                  href={role.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-company"
                >
                  {role.company}
                </a>
                <span
                  className="resume-date"
                  aria-label={`${role.start} until ${role.end}`}
                >
                  {role.start} &ndash; {role.end}
                </span>
              </div>
              <div className="resume-title">{role.title}</div>
            </div>
          </li>
        ))}
      </ol>

      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-pill btn-pill-ghost btn-pill-sm mt-5 w-full"
      >
        <DownloadFileIcon className="h-4 w-4" />
        <span>Download full CV (PDF)</span>
      </a>
    </div>
  )
}
