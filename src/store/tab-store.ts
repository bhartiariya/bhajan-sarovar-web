import { create } from 'zustand'

interface TabState {
  currentTab: number
  setCurrentTab: (tab: number) => void
}

export const useTabStore = create<TabState>((set) => ({
  currentTab: 0,
  setCurrentTab: (tab: number) => set({ currentTab: tab }),
}))
