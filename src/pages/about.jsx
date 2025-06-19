import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import logoUCSC from '@/images/logos/ucsc.svg'
import logoApple from '@/images/logos/apple.svg'
import logoGoogle from '@/images/logos/google.svg'
import logoX from '@/images/logos/x.svg'
import logoUpr from '@/images/logos/upr.svg'

import { Container } from '@/components/Container'
import {
  TwitterIcon,
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BriefcaseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function Resume() {
  let resume = [
    {
      company: 'UC Santa Cruz',
      title: 'PhD, Graduate Researcher',
      logo: logoUCSC,
      start: 'Sep 2021',
      end: {
        label: 'Present',
        dateTime: new Date().getFullYear(),
      },
    },
    // {
    //   company: 'binit.ai',
    //   title: 'CV Advisor',
    //   logo: logoBinit,
    //   start: 'Apr 2022',
    //   end: {
    //     label: 'Present',
    //     dateTime: new Date().getFullYear(),
    //   },
    // },
    {
      company: 'Google',
      title: 'Student Researcher (PhD)',
      logo: logoGoogle,
      start: 'Jun 2023',
      end: 'Sep 2023',
    },
    {
      company: 'Google [X]',
      title: 'AI Resident (PhD)',
      logo: logoX,
      start: 'Jun 2021',
      end: 'Sep 2022',
    },
    {
      company: 'University of Puerto Rico',
      title: 'BSc, Research Assistant',
      logo: logoUpr,
      start: 'Aug 2017',
      end: 'May 2021',
    },
    {
      company: 'Apple Developer Academy',
      title: 'Full Stack Engineer',
      logo: logoApple,
      start: 'Sep 2018',
      end: 'Jun 2019',
    },
  ]

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work & School</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <li key={roleIndex} className="flex gap-4">
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {role.company}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                {role.title}
              </dd>
              <dt className="sr-only">Date</dt>
              <dd
                className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
                aria-label={`${role.start.label ?? role.start} until ${
                  role.end.label ?? role.end
                }`}
              >
                <time dateTime={role.start.dateTime ?? role.start}>
                  {role.start.label ?? role.start}
                </time>{' '}
                <span aria-hidden="true">—</span>{' '}
                <time dateTime={role.end.dateTime ?? role.end}>
                  {role.end.label ?? role.end}
                </time>
              </dd>
            </dl>
          </li>
        ))}
      </ol>
      <Button href="https://github.com/hectorcarrion/hectorcarrion.github.io/blob/main/Hector%20Carrion%20Resume%20Jun%202025.pdf?raw=true" variant="secondary" className="group mt-6 w-full">
        Download Resume
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </Button>
    </div>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export default function About() {
  return (
    <>
      <Head>
        <title>About - Héctor Carrión</title>
        <meta
          name="description"
          content="I'm Héctor Carrión. I make things that make things better."
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                I’m Héctor - crazy about AI for good ✌🏼
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                Access to healthcare, clean water, sustainable agriculture, renewable energy, social
                equity, equality and justice. These are some of the hard problems I keep front of mind
                when driving my reserach.
              </p>
              <p>
                Often young kids relate their first interests to those of their parents.
                For me, this is very much the case. I remember helping my dad wire his small start-up
                office to our home network so he could access files on the remote computer. It was a beige,
                thin, slow DSL cable. We jumped and climbed around the buidling to get the cable
                from one place to the other. After days of work, we got everything working and
                my dad was able to work wherever he was.
                The best part? He spent new-found time playing with me.
              </p>
              <p>
                This, one of my very first experiences with technology, showed me how it
                could be leveraged to enrich peoples lives at a very personal level.
                Since then, I’ve joined this ideal to my reserach as I look to empower humanity, solve
                critical problems and make the world a better place. This vision, and my love for research,
                have driven me towards my achievements.
              </p>
              <p>
                Today, I’m a PhD candidate at UCSC, I’ve published a half-dozen research papers,
                worked with amazing research teams at Google & Apple and advise a couple successful
                start-ups. Here, I write casually (when I have the time 🤣) about stuff I do - hopefully inspiring
                other boricua latinx kids and showing them that we absolutely <em>can</em>{' '} make a difference.
              </p>
            </div>
            <SocialLink
              href="mailto:hcarrion@ucsc.edu"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              hcarrion@ucsc.edu
            </SocialLink>
          </div>
          <div className="lg:pl-20">
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
