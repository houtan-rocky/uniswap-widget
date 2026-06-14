import { describe, it, expect } from 'vitest'
import { lightTheme, darkTheme } from './types'

describe('themes', () => {
  it('light and dark expose the same keys', () => {
    expect(Object.keys(lightTheme).sort()).toEqual(
      Object.keys(darkTheme).sort(),
    )
  })

  it('define hex swap-button backgrounds', () => {
    expect(lightTheme.swapButton.background).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(darkTheme.swapButton.background).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})
