import Head from 'next/head'

import { Prose } from '@/components/Prose'
import { SimpleLayout } from '@/components/SimpleLayout'

export default function BreediePolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Breedie</title>
        <meta
          name="description"
          content="Privacy policy for Breedie and other apps by Héctor Carrión."
        />
      </Head>
      <SimpleLayout
        title="Privacy Policy"
        intro="Breedie and my other apps run entirely on your device. They do not collect, store, or share your personal data."
      >
        <Prose className="max-w-2xl">
          <p>
            <strong>Last updated: June 21, 2026</strong>
          </p>
          <p>
            This privacy policy applies to Breedie and the other widget apps I
            (Héctor Carrión) publish on the App Store. These apps are designed to
            run locally on your device, and your privacy is fully respected.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We do not collect, store, transmit, or share any personal
            information. The apps do not require an account, and we have no
            servers that receive your data. Any settings or content you create
            within an app remain on your device.
          </p>

          <h2>How Your Data Is Used</h2>
          <p>
            Because no personal data is collected, none of your data is used,
            sold, rented, or shared with third parties for any purpose,
            including advertising or analytics.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            The apps do not integrate third-party analytics, advertising, or
            tracking services. Note that Apple may collect anonymized,
            aggregated information (such as crash reports or App Store usage
            statistics) in accordance with{' '}
            <a
              href="https://www.apple.com/legal/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple’s Privacy Policy
            </a>
            . This is outside of our control and not accessible to us in a way
            that identifies you.
          </p>

          <h2>Children’s Privacy</h2>
          <p>
            The apps do not knowingly collect any information from anyone,
            including children under the age of 13.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this privacy policy, you can reach me
            at{' '}
            <a href="mailto:hi@hectorcarrion.com">hi@hectorcarrion.com</a>.
          </p>
        </Prose>
      </SimpleLayout>
    </>
  )
}
