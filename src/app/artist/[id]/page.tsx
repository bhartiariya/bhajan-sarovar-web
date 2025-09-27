import { ArtistDetailsPage } from '@/components/pages/artist-details-page'
import { DetailPageLayout } from '@/components/layout/detail-page-layout'

interface ArtistPageProps {
  params: {
    id: string
  }
}

export default function ArtistPage({ params }: ArtistPageProps) {
  return (
    <DetailPageLayout title="Artist">
      <ArtistDetailsPage artistId={params.id} />
    </DetailPageLayout>
  )
}
