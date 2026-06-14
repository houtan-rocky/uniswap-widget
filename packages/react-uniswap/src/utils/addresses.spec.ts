import { describe, it, expect, vi } from 'vitest'
import { toChecksumAddress } from './addresses'

describe('toChecksumAddress', () => {
  it('checksums a lowercase address (EIP-55)', () => {
    expect(toChecksumAddress('0x833589fcd6edb6e08f4c7c32d4f71b54bda02913')).toBe(
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    )
  })

  it('is idempotent on an already-checksummed address', () => {
    const checksummed = '0x4200000000000000000000000000000000000006'
    expect(toChecksumAddress(checksummed)).toBe(checksummed)
  })

  it('returns the input unchanged for an invalid address (and logs)', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(toChecksumAddress('not-an-address')).toBe('not-an-address')
    expect(error).toHaveBeenCalledOnce()
    error.mockRestore()
  })
})
