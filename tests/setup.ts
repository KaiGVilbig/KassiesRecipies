import '@testing-library/jest-dom'
import { expect } from 'vitest'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
// import { afterEach } from '@testing-library/react';


// Mock fetch globally
global.fetch = vi.fn()

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
