import { describe, it, expect } from 'vitest'
import { fromReadableAmount } from './conversion'

describe('fromReadableAmount', () => {
  it('scales a whole number by 18 decimals', () => {
    expect(fromReadableAmount(1, 18).toString()).toBe('1000000000000000000')
  })

  it('scales a fractional amount by 6 decimals (USDC)', () => {
    expect(fromReadableAmount(2.5, 6).toString()).toBe('2500000')
  })

  it('returns 0 for 0', () => {
    expect(fromReadableAmount(0, 18).toString()).toBe('0')
  })
})
