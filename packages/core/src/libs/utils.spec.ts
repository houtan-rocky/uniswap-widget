import { describe, it, expect } from 'vitest'
import { fromReadableAmount, toReadableAmount } from './utils'

describe('libs/utils', () => {
  it('fromReadableAmount scales up by decimals', () => {
    expect(fromReadableAmount(1, 18).toString()).toBe('1000000000000000000')
  })

  it('toReadableAmount formats and truncates to 4 characters', () => {
    // formatUnits(1_000_000, 6) === "1.0"
    expect(toReadableAmount(1_000_000, 6)).toBe('1.0')
    // formatUnits(1_234_500, 6) === "1.2345", sliced to 4 chars -> "1.23"
    expect(toReadableAmount(1_234_500, 6)).toBe('1.23')
  })
})
