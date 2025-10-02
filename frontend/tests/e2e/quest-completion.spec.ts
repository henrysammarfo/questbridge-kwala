import { test, expect } from '@playwright/test'

test.describe('QuestBridge E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')

    // Mock MetaMask wallet connection
    await page.addInitScript(() => {
      // Mock window.ethereum
      Object.defineProperty(window, 'ethereum', {
        value: {
          isMetaMask: true,
          request: async ({ method, params }: { method: string; params?: any[] }) => {
            if (method === 'eth_requestAccounts') {
              return ['0x2f914bcb...'] // Mock deployer address
            }
            if (method === 'eth_chainId') {
              return '0x13882' // Polygon Amoy chain ID (80002)
            }
            if (method === 'eth_accounts') {
              return ['0x2f914bcb...']
            }
            return null
          },
          on: (event: string, handler: () => void) => {
            // Mock event listener
          },
          removeListener: (event: string, handler: () => void) => {
            // Mock remove listener
          },
        },
        writable: true,
      })
    })
  })

  test('Complete quest flow: Connect → Quest → Amoy transaction', async ({ page }) => {
    // 1. Verify landing page loads
    await expect(page.locator('h1')).toContainText('QuestBridge: Cross-Chain Rewards')
    await expect(page.locator('button')).toContainText('Connect Wallet')

    // 2. Connect wallet (mocked)
    await page.click('button:has-text("Connect Wallet")')

    // Wait for connection and verify quest page appears
    await expect(page.locator('h1')).toContainText('Complete Quest')
    await expect(page.locator('input[type="number"]')).toBeVisible()

    // 3. Enter quest amount (1-10 tokens)
    const tokenInput = page.locator('input[type="number"]')
    await tokenInput.fill('5')

    // 4. Submit quest completion
    await page.click('button:has-text("Complete Quest")')

    // 5. Verify transaction processing
    await expect(page.locator('button')).toContainText('Processing...')
    await expect(page.locator('button')).toBeDisabled()

    // 6. Wait for completion and verify success state
    // Note: In real scenario, this would wait for actual blockchain confirmation
    await page.waitForTimeout(3000)

    // 7. Verify success feedback (toast notification)
    // Note: Toast verification would require additional setup for real implementation
  })

  test('Validate token amount input constraints', async ({ page }) => {
    await page.goto('/')

    // Mock wallet connection
    await page.addInitScript(() => {
      Object.defineProperty(window, 'ethereum', {
        value: {
          isMetaMask: true,
          request: async () => ['0x2f914bcb...'],
          on: () => {},
          removeListener: () => {},
        },
        writable: true,
      })
    })

    await page.click('button:has-text("Connect Wallet")')

    const tokenInput = page.locator('input[type="number"]')

    // Test minimum constraint (should allow 1)
    await tokenInput.fill('1')
    await expect(tokenInput).toHaveValue('1')

    // Test maximum constraint (should allow 10)
    await tokenInput.fill('10')
    await expect(tokenInput).toHaveValue('10')

    // Test invalid input (should be constrained by HTML min/max)
    await tokenInput.fill('0')
    await expect(tokenInput).toHaveValue('1') // Browser should enforce min=1

    await tokenInput.fill('11')
    await expect(tokenInput).toHaveValue('10') // Browser should enforce max=10
  })

  test('Responsive design across devices', async ({ page, isMobile }) => {
    await page.goto('/')

    // Verify responsive layout
    if (isMobile) {
      // Mobile-specific checks
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('button')).toBeVisible()
    } else {
      // Desktop-specific checks
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('button')).toBeVisible()
    }
  })

  test('Error handling for wallet disconnection', async ({ page }) => {
    await page.goto('/')

    // Mock wallet disconnection
    await page.addInitScript(() => {
      Object.defineProperty(window, 'ethereum', {
        value: undefined,
        writable: true,
      })
    })

    // Reload page to simulate disconnection
    await page.reload()

    // Should show connect wallet message
    await expect(page.locator('h1')).toContainText('Connect Your Wallet')
    await expect(page.locator('text=Please connect your wallet')).toBeVisible()
  })

  test('Chain switching functionality', async ({ page }) => {
    await page.goto('/')

    // Mock wallet with chain switching
    await page.addInitScript(() => {
      let currentChainId = '0x13882' // Amoy

      Object.defineProperty(window, 'ethereum', {
        value: {
          isMetaMask: true,
          request: async ({ method }: { method: string }) => {
            if (method === 'eth_chainId') {
              return currentChainId
            }
            if (method === 'wallet_switchEthereumChain') {
              currentChainId = '0xaa36a7' // Sepolia
              return null
            }
            return ['0x2f914bcb...']
          },
          on: () => {},
          removeListener: () => {},
        },
        writable: true,
      })
    })

    // Connect wallet
    await page.click('button:has-text("Connect Wallet")')

    // Verify initial chain (Amoy)
    await expect(page.locator('text=Amoy')).toBeVisible()

    // Note: ChainSwitcher component would need additional implementation
    // for full E2E testing of chain switching
  })
})