import { create } from 'zustand'

interface TabState {
  currentTab: number
  selectedArtistId: string | null
  setCurrentTab: (tab: number) => void
  setSelectedArtist: (artistId: string) => void
  clearSelectedArtist: () => void
}

export const useTabStore = create<TabState>((set) => ({
  currentTab: 0,
  selectedArtistId: null,
  setCurrentTab: (tab: number) => set({ currentTab: tab }),
  setSelectedArtist: (artistId: string) => set({ selectedArtistId: artistId, currentTab: 9 }),
  clearSelectedArtist: () => set({ selectedArtistId: null }),
}))
