interface CacheItem {
  value: any
  timestamp: number
  ttl: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem>()
  private maxSize = 1000

  set(key: string, value: any, ttl: number = 300000) { // 5 minutes default
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value || ''
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}

export const cache = new SimpleCache()

export const CACHE_KEYS = {
  ADMIN_USER: (email: string) => `admin:${email}`,
  JOB_LIST: (filters: string) => `jobs:${filters}`,
  APPLICANT_INFO: (id: string) => `applicant:${id}`,
} as const
