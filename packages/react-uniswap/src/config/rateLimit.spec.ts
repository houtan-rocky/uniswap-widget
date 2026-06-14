import { describe, it, expect } from 'vitest'
import { RATE_LIMIT_CONFIG, getChainRateLimitSettings } from './rateLimit'

describe('getChainRateLimitSettings', () => {
  it('returns the Base (8453) chain settings', () => {
    expect(getChainRateLimitSettings()).toEqual({
      THROTTLE_LIMIT: 1,
      MIN_REQUEST_INTERVAL: 5000,
    })
  })
})

describe('RATE_LIMIT_CONFIG', () => {
  it('debounces quotes more conservatively than search', () => {
    expect(RATE_LIMIT_CONFIG.QUOTE_DEBOUNCE).toBeGreaterThan(
      RATE_LIMIT_CONFIG.SEARCH_DEBOUNCE,
    )
  })

  it('caches for 15 seconds', () => {
    expect(RATE_LIMIT_CONFIG.CACHE_DURATION).toBe(15000)
  })
})
