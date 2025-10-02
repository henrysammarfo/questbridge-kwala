import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from '@/lib/wagmi'
import Quest from '@/app/quest/page'
import { toast } from 'react-hot-toast'

// Mock the wagmi hooks
const mockWriteContract = vi.fn()
const mockUseAccount = vi.fn()

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi')
  return {
    ...actual,
    useAccount: () => mockUseAccount(),
    useWriteContract: () => ({
      writeContract: mockWriteContract,
      data: '0x123',
      isPending: false,
    }),
    useWaitForTransactionReceipt: () => ({
      isLoading: false,
    }),
    useWatchContractEvent: () => ({}),
  }
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

describe('Quest Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    })
  })

  it('renders quest completion form when wallet is connected', () => {
    const Wrapper = createWrapper()
    render(<Quest />, { wrapper: Wrapper })

    expect(screen.getByText('Complete Quest')).toBeInTheDocument()
    expect(screen.getByLabelText(/Token Amount/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Complete Quest/ })).toBeInTheDocument()
  })

  it('shows connect wallet message when wallet is not connected', () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: undefined,
    })

    const Wrapper = createWrapper()
    render(<Quest />, { wrapper: Wrapper })

    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
    expect(screen.getByText(/Please connect your wallet/)).toBeInTheDocument()
  })

  it('validates token amount input (1-10 range)', async () => {
    const Wrapper = createWrapper()
    render(<Quest />, { wrapper: Wrapper })

    const input = screen.getByLabelText(/Token Amount/)
    const button = screen.getByRole('button', { name: /Complete Quest/ })

    // Test invalid input (0)
    fireEvent.change(input, { target: { value: '0' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid token amount between 1 and 10')
    })

    // Test invalid input (11)
    fireEvent.change(input, { target: { value: '11' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid token amount between 1 and 10')
    })
  })

  it('handles valid quest completion', async () => {
    const Wrapper = createWrapper()
    render(<Quest />, { wrapper: Wrapper })

    const input = screen.getByLabelText(/Token Amount/)
    const button = screen.getByRole('button', { name: /Complete Quest/ })

    // Set valid input
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0xfba199c705761D98aD1cD98c34C0d544e39c1984',
        abi: expect.any(Array),
        functionName: 'approve',
        args: ['0x2f914bcb...', BigInt(5)],
      })
    })
  })

  it('displays connected wallet address', () => {
    const Wrapper = createWrapper()
    render(<Quest />, { wrapper: Wrapper })

    expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
  })

  it('disables button during loading state', () => {
    // Mock loading state
    vi.mocked(mockWriteContract).mockImplementation(() => {
      // Simulate pending state
    })

    const Wrapper = createWrapper()
    render(<Quest />, { wrapper: Wrapper })

    const button = screen.getByRole('button', { name: /Complete Quest/ })

    // Simulate loading
    fireEvent.click(button)

    // Button should be disabled during loading
    expect(button).toBeDisabled()
  })
})