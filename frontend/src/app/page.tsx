'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useConnectors } from 'wagmi'
import Link from 'next/link'

export default function Home() {
  const { isConnected } = useAccount()
  const connectors = useConnectors()

  // Check if MetaMask is installed
  const hasMetaMask = typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask
  const ethereumAddress = typeof window !== 'undefined' ? (window as any).ethereum?.selectedAddress : null
  const ethereumChainId = typeof window !== 'undefined' ? (window as any).ethereum?.chainId : null
  const hasEthereum = typeof window !== 'undefined' && (window as any).ethereum

  // Debug MetaMask detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ethereum = (window as any).ethereum
      console.log('=== MetaMask Debug Info ===')
      console.log('window.ethereum exists:', !!ethereum)
      console.log('window.ethereum.isMetaMask:', ethereum?.isMetaMask)
      console.log('window.ethereum.isConnected:', ethereum?.isConnected)
      console.log('window.ethereum.selectedAddress:', ethereum?.selectedAddress)
      console.log('window.ethereum.chainId:', ethereum?.chainId)
      console.log('Available connectors:', connectors.map(c => ({
        name: c.name,
        id: c.id,
        ready: c.ready,
        uid: c.uid
      })))
      console.log('========================')
    }
  }, [hasMetaMask, connectors])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-sans text-foreground mb-6">
            QuestBridge: Cross-Chain Rewards
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
            Connect your wallet to start your Web3 quest journey with Kwala Hacker House
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <ConnectButton />
          </div>

          {/* Debug Info - Remove in production */}
          <div className="bg-muted/30 rounded-[var(--radius)] p-4 mb-8 border border-border max-w-2xl mx-auto">
            <details className="text-sm">
              <summary className="cursor-pointer text-foreground font-sans mb-2">Debug: Wallet Detection</summary>
              <div className="space-y-2 text-muted-foreground font-sans text-xs">
                <div>Ethereum Provider: {hasEthereum ? 'Available' : 'Not Found'}</div>
                <div>MetaMask Installed: {hasMetaMask ? 'Yes' : 'No'}</div>
                <div>Ethereum Address: {ethereumAddress || 'None'}</div>
                <div>Chain ID: {ethereumChainId || 'Unknown'}</div>
                <div>Connectors Available: {connectors.length}</div>
                <div className="space-y-1">
                  {connectors.map((connector, index) => (
                    <div key={index}>
                      {connector.name} - Ready: {connector.ready ? 'Yes' : 'No'}
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-background rounded text-xs">
                  <strong>Check browser console for detailed logs</strong>
                </div>
                <div className="mt-2 p-2 bg-chart1/10 rounded text-xs">
                  <strong>Troubleshooting:</strong>
                  <br />1. Make sure MetaMask is installed
                  <br />2. Ensure MetaMask is unlocked
                  <br />3. Check if you are on the correct page
                  <br />4. Try refreshing the page
                </div>
              </div>
            </details>
          </div>

          {isConnected && (
            <Link
              href="/quest"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-[0.625rem] font-semibold transition-colors font-sans"
            >
              Start Quest
            </Link>
          )}

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="bg-card border border-border p-8 rounded-[var(--radius)] shadow-[var(--shadow-x-offset)_var(--shadow-y-offset)_var(--shadow-blur)_var(--shadow-spread)_var(--shadow-color)]">
              <div className="w-16 h-16 bg-chart1/10 rounded-[var(--radius)] flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-chart1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-sans text-card-foreground mb-3">Complete Quests</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">Participate in engaging Web3 challenges and earn rewards through our interactive platform</p>
            </div>

            <div className="bg-card border border-border p-8 rounded-[var(--radius)] shadow-[var(--shadow-x-offset)_var(--shadow-y-offset)_var(--shadow-blur)_var(--shadow-spread)_var(--shadow-color)]">
              <div className="w-16 h-16 bg-chart2/10 rounded-[var(--radius)] flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-chart2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-sans text-card-foreground mb-3">Earn Rewards</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">Receive QuestTokens and automated NFT rewards on Sepolia network for completed challenges</p>
            </div>

            <div className="bg-card border border-border p-8 rounded-[var(--radius)] shadow-[var(--shadow-x-offset)_var(--shadow-y-offset)_var(--shadow-blur)_var(--shadow-spread)_var(--shadow-color)]">
              <div className="w-16 h-16 bg-chart3/10 rounded-[var(--radius)] flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-chart3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-sans text-card-foreground mb-3">Cross-Chain Bridge</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">Seamlessly bridge between Polygon Amoy and Sepolia networks with automated reward distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
