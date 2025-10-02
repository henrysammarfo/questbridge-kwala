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
jest.mock('wagmi', () => ({
  useAccount: () => ({
    isConnected: true,
    address: '0x1234567890123456789012345678901234567890',
  }),
  useWriteContract: () => ({
    writeContract: jest.fn(),
    data: '0x123',
    isPending: false,
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
  }),
  useWatchContractEvent: () => ({
    // Mock implementation
  }),
}))

// Mock RainbowKit
jest.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button>Connect Wallet</button>,
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}))