import '@testing-library/jest-dom'

// Mock environment variables for testing
Object.defineProperty(window, 'process', {
  value: {
    env: {
      NEXT_PUBLIC_ALCHEMY_MUMBAI_URL: 'https://polygon-amoy.g.alchemy.com/v2/test',
      NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL: 'https://eth-sepolia.g.alchemy.com/v2/test',
    },
  },
})

// Mock wagmi providers for testing
import { vi } from 'vitest'

vi.mock('wagmi', () => {
  return {
    useAccount: () => ({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    }),
    useWriteContract: () => ({
      writeContract: vi.fn(),
      data: '0x123',
      isPending: false,
    }),
    useWaitForTransactionReceipt: () => ({
      isLoading: false,
    }),
    useWatchContractEvent: () => ({
      // Mock implementation
    }),
  }
})

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => {
  return {
    ConnectButton: () => null,
  }
})

// Mock react-hot-toast
vi.mock('react-hot-toast', () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      loading: vi.fn(),
      dismiss: vi.fn(),
    },
    Toaster: () => null,
  }
})