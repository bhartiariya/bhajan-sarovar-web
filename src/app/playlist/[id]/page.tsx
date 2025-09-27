import { PlaylistDetailsPage } from '@/components/pages/playlist-details-page'
import { DetailPageLayout } from '@/components/layout/detail-page-layout'

interface PlaylistPageProps {
  params: {
    id: string
  }
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  return (
    <DetailPageLayout title="Playlist">
      <PlaylistDetailsPage playlistId={params.id} />
    </DetailPageLayout>
  )
}
