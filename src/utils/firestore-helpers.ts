/**
 * Helper functions for parsing Firestore data
 * These functions mirror the Flutter app's data parsing logic
 */

export function readString(data: any, field: string): string {
  if (!data || typeof data !== 'object') return ''
  const value = data[field]
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  return ''
}

export function safeStringList(data: any, field: string): string[] {
  if (!data || typeof data !== 'object') return []
  const value = data[field]
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string')
  }
  return []
}

export function parseTimestamp(data: any, field: string): Date | null {
  if (!data || typeof data !== 'object') return null
  const value = data[field]
  if (!value) return null
  
  // Handle Firestore Timestamp
  if (value.seconds !== undefined) {
    return new Date(value.seconds * 1000)
  }
  
  // Handle regular Date
  if (value instanceof Date) {
    return value
  }
  
  // Handle string date
  if (typeof value === 'string') {
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  }
  
  // Handle number timestamp
  if (typeof value === 'number') {
    return new Date(value)
  }
  
  return null
}

export function parseNumber(data: any, field: string, defaultValue: number = 0): number {
  if (!data || typeof data !== 'object') return defaultValue
  const value = data[field]
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
  }
  return defaultValue
}

export function parseBoolean(data: any, field: string, defaultValue: boolean = false): boolean {
  if (!data || typeof data !== 'object') return defaultValue
  const value = data[field]
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  if (typeof value === 'number') return value !== 0
  return defaultValue
}
