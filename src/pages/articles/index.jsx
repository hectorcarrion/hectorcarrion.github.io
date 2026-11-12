import { PublicationsSection } from '@/components/PublicationsSection'
import { Seo } from '@/components/Seo'
import { getAllArticles } from '@/lib/getAllArticles'

export default function ArticlesIndex({ articles }) {
  return (
    <>
      <Seo
        title="Publications · Dr. Héctor Carrión"
        description="Publications and preprints on multimodal world models, 3D vision, generative AI, and longitudinal medical systems by Dr. Héctor Carrión."
      />
      <div className="pt-12">
        <PublicationsSection articles={articles} />
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      articles: (await getAllArticles()).map(({ component, ...meta }) => meta),
    },
  }
}
