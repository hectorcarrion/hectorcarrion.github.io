import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({ title, href, children }) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export default function Uses() {
  return (
    <>
      <Head>
        <title>Uses - Héctor Carrión</title>
        <meta
          name="description"
          content="Contact information."
        />
      </Head>
      <SimpleLayout
        title="Come say hi 👋🏼!"
        intro="Feel free to reach out, say hello and talk about world chaning ideas... or puppies!"
      >
        <div className="space-y-20">
          <ToolsSection title="Sync">
            <Tool title=<a href="https://calendar.app.google/z7f3fD4UF7ir6hvq6" target="_blank" className="hover:underline" rel="noopener noreferrer">Book a Meeting</a>>
              <a href="https://calendar.app.google/z7f3fD4UF7ir6hvq6" target="_blank" className="hover:underline" rel="noopener noreferrer">You can easily schedule a 30 minute 1:1 with me on Google Meet, click above or here</a>.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Email">
            <Tool title="UC Institutional">
              <a href="mailto:hcarrion@ucsc.edu" className="hover:underline">hcarrion@ucsc.edu</a>
            </Tool>
            <Tool title="Tera AI">
              <a href="mailto:hector@tera.earth" className="hover:underline">hector@tera.earth</a>
            </Tool>
            <Tool title="Personal">
              <a href="mailto:hi@hectorcarrion.com" className="hover:underline">hi@hectorcarrion.com</a>
            </Tool>
          </ToolsSection>
          <ToolsSection title="Social">
            <Tool title=<a href="https://www.linkedin.com/in/hectorcarrion/" target="_blank" className="hover:underline" rel="noopener noreferrer">LinkedIn</a>>
              I’m active and generally keep my LinkedIn up-to-date, I usually anounce new papers/projects there first.
            </Tool>
            <Tool title=<a href="https://github.com/hectorcarrion" target="_blank" className="hover:underline" rel="noopener noreferrer">GitHub</a>>
              Publishing most of my data and code on GitHub!
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
