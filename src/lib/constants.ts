// Tab indices for navigation
export const TAB_INDICES = {
  HOME: 0,
  SEARCH: 1,
  LIBRARY: 2,
  PROFILE: 3,
  SETTINGS: 4,
  CONTACT: 5,
  ADMIN: 6,
  APPLY_ARTIST: 7,
  ARTIST_DASHBOARD: 8,
  ARTIST_DETAILS: 9,
} as const

// Tab titles
export const TAB_TITLES = {
  [TAB_INDICES.HOME]: 'Home',
  [TAB_INDICES.SEARCH]: 'Search',
  [TAB_INDICES.LIBRARY]: 'Library',
  [TAB_INDICES.PROFILE]: 'Profile',
  [TAB_INDICES.SETTINGS]: 'Settings',
  [TAB_INDICES.CONTACT]: 'Contact Us',
  [TAB_INDICES.ADMIN]: 'Admin Dashboard',
  [TAB_INDICES.APPLY_ARTIST]: 'Apply to be Artist',
  [TAB_INDICES.ARTIST_DASHBOARD]: 'Artist Dashboard',
  [TAB_INDICES.ARTIST_DETAILS]: 'Artist Details',
} as const

// App configuration
export const APP_CONFIG = {
  SPLASH_DURATION: 2000, // 2 seconds
  QUERY_STALE_TIME: 60 * 1000, // 1 minute
  QUERY_GC_TIME: 5 * 60 * 1000, // 5 minutes
  QUERY_RETRY_COUNT: 1,
} as const

// UI configuration
export const UI_CONFIG = {
  FEATURED_ARTISTS_LIMIT: 5,
  DEFAULT_VOLUME: 80,
  DEFAULT_THEME: 'light' as const,
  SIDEBAR_WIDTH: 256, // 64 * 4 = 256px (w-64)
} as const
