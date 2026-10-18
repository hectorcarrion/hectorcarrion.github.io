import { PublicationCard } from '@/components/PublicationCard'
import { Seo } from '@/components/Seo'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles } from '@/lib/getAllArticles'

export default function ArticlesIndex({ articles }) {
  return (
    <>
      <Seo
        title="Publications & Preprints - Héctor Carrión"
        description="Research in medical AI, generative models, world models, and self-supervised learning by Héctor Carrión."
      />
      <SimpleLayout title="Publications & Preprints 📄">
        <div className="max-w-3xl space-y-12">
          {articles.map((article) => (
            <PublicationCard key={article.slug} article={article} />
          ))}
        </div>
      </SimpleLayout>
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
