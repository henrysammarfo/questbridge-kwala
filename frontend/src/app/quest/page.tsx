'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, useReadContract } from 'wagmi'
import { toast, Toaster } from 'react-hot-toast'
import { questTokenABI, QUEST_TOKEN_ADDRESS, DEPLOYER_ADDRESS } from '@/lib/abi'

export default function Quest() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState<'faucet' | 'quest'>('faucet')
  const [faucetAmount, setFaucetAmount] = useState<number>(100)
  const [questAnswer, setQuestAnswer] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract: writeFaucet, data: faucetHash, isPending: isFaucetPending } = useWriteContract()
  const { writeContract: writeQuest, data: questHash, isPending: isQuestPending } = useWriteContract()

  // Check user's QuestToken balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: QUEST_TOKEN_ADDRESS,
    abi: questTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Watch for mint events from faucet
  useWatchContractEvent({
    address: QUEST_TOKEN_ADDRESS,
    abi: questTokenABI,
    eventName: 'Transfer',
    onLogs(logs) {
      const latestLog = logs[logs.length - 1]
      if (latestLog.args.to?.toLowerCase() === address?.toLowerCase() && latestLog.args.from === DEPLOYER_ADDRESS) {
        toast.success(`🎉 Faucet claimed! You received ${Number(latestLog.args.value)} QuestTokens!`, {
          duration: 5000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
          },
        })
        refetchBalance()
      }
    },
  })

  const handleClaimFaucet = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      await writeFaucet({
        address: QUEST_TOKEN_ADDRESS,
        abi: questTokenABI,
        functionName: 'mint',
        args: [address, BigInt(faucetAmount)],
      })

      toast.success(`Faucet claim submitted! You'll receive ${faucetAmount} QuestTokens.`, {
        duration: 4000,
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
        },
      })
    } catch (error) {
      console.error('Faucet claim error:', error)
      toast.error('Failed to claim from faucet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteQuest = async () => {
    if (!address || !questAnswer.trim()) {
      toast.error('Please answer the quest question')
      return
    }

    // Simple quest validation - you can make this more sophisticated
    const correctAnswer = 'questbridge'
    if (questAnswer.toLowerCase() !== correctAnswer) {
      toast.error('❌ Wrong answer! Try again or check the hint.')
      return
    }

    setIsLoading(true)
    try {
      await writeQuest({
        address: QUEST_TOKEN_ADDRESS,
        abi: questTokenABI,
        functionName: 'mint',
        args: [address, BigInt(50)], // Reward 50 tokens for completing quest
      })

      toast.success('🎉 Quest completed! You earned 50 QuestTokens!', {
        duration: 5000,
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
        },
      })
    } catch (error) {
      console.error('Quest completion error:', error)
      toast.error('Failed to complete quest. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sans text-foreground mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-muted-foreground font-sans">
            Please connect your wallet to access the QuestBridge platform.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">
              QuestBridge Platform
            </h1>
            <p className="text-lg text-muted-foreground font-sans mb-6">
              Complete quests, earn rewards, and bridge to Sepolia NFTs
            </p>
            <div className="bg-muted/30 rounded-[var(--radius)] p-4 inline-block border border-border">
              <p className="text-sm font-sans text-foreground">
                Connected: <code className="bg-background px-2 py-1 rounded text-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</code>
              </p>
              {balance && (
                <p className="text-sm font-sans text-chart2 mt-1">
                  💰 Balance: <strong>{Number(balance).toLocaleString()} QUEST</strong>
                </p>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-[var(--radius)] p-1 border border-border">
              <button
                onClick={() => setActiveTab('faucet')}
                className={`px-6 py-3 rounded-[var(--radius)] font-semibold font-sans transition-colors ${
                  activeTab === 'faucet'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🚰 Claim Tokens
              </button>
              <button
                onClick={() => setActiveTab('quest')}
                className={`px-6 py-3 rounded-[var(--radius)] font-semibold font-sans transition-colors ${
                  activeTab === 'quest'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🏆 Complete Quest
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'faucet' && (
            <div className="bg-card rounded-[var(--radius)] shadow-[var(--shadow-x-offset)_var(--shadow-y-offset)_var(--shadow-blur)_var(--shadow-spread)_var(--shadow-color)] p-8 border border-border">
              <h2 className="text-2xl font-bold font-sans text-card-foreground mb-4">
                🚰 QuestToken Faucet
              </h2>
              <p className="text-muted-foreground font-sans mb-6">
                Claim free QuestTokens to participate in quests and earn NFT rewards.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium font-sans text-foreground mb-2">
                    Amount to Claim
                  </label>
                  <select
                    value={faucetAmount}
                    onChange={(e) => setFaucetAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius)] focus:ring-2 focus:ring-ring focus:border-transparent text-foreground font-sans"
                  >
                    <option value={50}>50 QuestTokens</option>
                    <option value={100}>100 QuestTokens</option>
                    <option value={200}>200 QuestTokens</option>
                  </select>
                </div>

                <button
                  onClick={handleClaimFaucet}
                  disabled={isLoading || isFaucetPending}
                  className="w-full bg-chart2 hover:bg-chart2/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-[var(--radius)] font-semibold font-sans transition-colors"
                >
                  {isLoading || isFaucetPending ? 'Claiming...' : `Claim ${faucetAmount} QuestTokens`}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quest' && (
            <div className="bg-card rounded-[var(--radius)] shadow-[var(--shadow-x-offset)_var(--shadow-y-offset)_var(--shadow-blur)_var(--shadow-spread)_var(--shadow-color)] p-8 border border-border">
              <h2 className="text-2xl font-bold font-sans text-card-foreground mb-4">
                🏆 Daily Quest Challenge
              </h2>
              <p className="text-muted-foreground font-sans mb-6">
                Complete the quest to earn QuestTokens and trigger NFT rewards on Sepolia.
              </p>

              <div className="bg-chart3/10 border border-chart3/20 rounded-[var(--radius)] p-6 mb-6">
                <h3 className="text-lg font-semibold font-sans text-chart3 mb-3">
                  📝 Quest: What is the name of this platform?
                </h3>
                <p className="text-chart3/80 font-sans mb-4">
                  <strong>Hint:</strong> It's the bridge that connects quests across different chains...
                </p>
                <input
                  type="text"
                  value={questAnswer}
                  onChange={(e) => setQuestAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius)] focus:ring-2 focus:ring-ring focus:border-transparent text-foreground font-sans placeholder:text-muted-foreground"
                />
              </div>

              <div className="bg-chart1/10 border border-chart1/20 rounded-[var(--radius)] p-4 mb-6">
                <p className="text-chart1 text-sm font-sans">
                  <strong>✅ Reward:</strong> 50 QuestTokens + NFT minting on Sepolia
                  <br />
                  <strong>🔗 Network:</strong> Polygon Amoy (Chain ID: 80002)
                </p>
              </div>

              <button
                onClick={handleCompleteQuest}
                disabled={isLoading || isQuestPending || !questAnswer.trim()}
                className="w-full bg-chart3 hover:bg-chart3/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-[var(--radius)] font-semibold font-sans transition-colors"
              >
                {isLoading || isQuestPending ? 'Completing Quest...' : 'Complete Quest & Earn Rewards'}
              </button>
            </div>
          )}
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
          },
        }}
      />
    </div>
  )
}