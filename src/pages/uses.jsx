import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { Seo } from '@/components/Seo'
import { SimpleLayout } from '@/components/SimpleLayout'
import { BOOKING_URL, CONTACT_EMAIL } from '@/lib/site'

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

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact - Héctor Carrión"
        description={`Contact Héctor Carrión at ${CONTACT_EMAIL} or book a meeting.`}
      />
      <SimpleLayout title="Come say hi 👋🏼!">
        <div className="space-y-20">
          <ToolsSection title="Email">
            <Tool title="Personal" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </Tool>
            <Tool title="UC Institutional" href="mailto:hcarrion@ucsc.edu">
              hcarrion@ucsc.edu
            </Tool>
          </ToolsSection>
          <ToolsSection title="Meet">
            <Tool title="Book a Meeting" href={BOOKING_URL}>
              Schedule a 30-minute 1:1 on Google Meet.
            </Tool>
          </ToolsSection>
          <ToolsSection title="Social">
            <Tool
              title="LinkedIn"
              href="https://www.linkedin.com/in/hectorcarrion/"
            >
              New papers and projects.
            </Tool>
            <Tool title="GitHub" href="https://github.com/hectorcarrion">
              Research code and datasets.
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
