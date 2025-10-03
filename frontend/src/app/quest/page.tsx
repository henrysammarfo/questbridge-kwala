'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'
import { toast, Toaster } from 'react-hot-toast'
import { questTokenABI, QUEST_TOKEN_ADDRESS, DEPLOYER_ADDRESS } from '@/lib/abi'

export default function Quest() {
  const { isConnected, address } = useAccount()
  const [tokenAmount, setTokenAmount] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract()
  const { writeContract: writeTransfer, data: transferHash, isPending: isTransferPending } = useWriteContract()

  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isTransferConfirming } = useWaitForTransactionReceipt({
    hash: transferHash,
  })

  // Watch for QuestCompleted events
  useWatchContractEvent({
    address: QUEST_TOKEN_ADDRESS,
    abi: questTokenABI,
    eventName: 'QuestCompleted',
    onLogs(logs) {
      const latestLog = logs[logs.length - 1]
      if (latestLog.args.player?.toLowerCase() === address?.toLowerCase()) {
        toast.success(`Quest completed! You earned ${latestLog.args.amount} tokens!`, {
          duration: 5000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
          },
        })
      }
    },
  })

  const handleCompleteQuest = async () => {
    if (!address || tokenAmount < 1 || tokenAmount > 10) {
      toast.error('Please enter a valid token amount between 1 and 10')
      return
    }

    setIsLoading(true)

    try {
      // Check if user has enough tokens (this would need a balanceOf call in real implementation)
      // For demo purposes, we'll assume they need to get tokens first

      toast.success(`Quest completion initiated! Check your wallet for transaction confirmations.`, {
        duration: 3000,
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
        },
      })

      // First approve the tokens
      await writeApprove({
        address: QUEST_TOKEN_ADDRESS,
        abi: questTokenABI,
        functionName: 'approve',
        args: [DEPLOYER_ADDRESS, BigInt(tokenAmount)],
      })

      toast.loading('Confirming token approval in your wallet...', { id: 'approve' })

      // Wait a bit for approval to be mined
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Then transfer the tokens
      await writeTransfer({
        address: QUEST_TOKEN_ADDRESS,
        abi: questTokenABI,
        functionName: 'transfer',
        args: [DEPLOYER_ADDRESS, BigInt(tokenAmount)],
      })

      toast.success('Quest completed! Check Kwala logs for NFT minting confirmation.', {
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
      toast.error(`Error: ${error instanceof Error ? error.message : 'Transaction failed'}. Make sure you're on Amoy network and have test tokens.`)
    } finally {
      setIsLoading(false)
      toast.dismiss('approve')
    }
  }

  useEffect(() => {
    if (isApproveConfirming) {
      toast.loading('Confirming token approval...', { id: 'approve' })
    } else {
      toast.dismiss('approve')
    }
  }, [isApproveConfirming])

  useEffect(() => {
    if (isTransferConfirming) {
      toast.loading('Completing quest...', { id: 'transfer' })
    } else {
      toast.dismiss('transfer')
    }
  }, [isTransferConfirming])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sans text-foreground mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-muted-foreground font-sans">
            Please connect your wallet to complete quests and earn rewards.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-[var(--radius)] shadow-[var(--shadow-x-offset)_var(--shadow-y-offset)_var(--shadow-blur)_var(--shadow-spread)_var(--shadow-color)] p-8 border border-border">
            <h1 className="text-3xl font-bold font-sans text-card-foreground mb-2">
              Complete Quest
            </h1>
            <p className="text-muted-foreground font-sans mb-4">
              Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <div className="bg-chart1/10 border border-chart1/20 rounded-[var(--radius)] p-4 mb-6">
              <p className="text-chart1 text-sm font-sans">
                🔗 Make sure you're connected to <strong>Polygon Amoy</strong> network (Chain ID: 80002)
                <br />
                💰 Need test tokens? Get them from the <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Amoy Faucet</a>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="tokenAmount" className="block text-sm font-medium font-sans text-foreground mb-2">
                  Token Amount (1-10)
                </label>
                <input
                  type="number"
                  id="tokenAmount"
                  min="1"
                  max="10"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-input border border-border rounded-[var(--radius)] focus:ring-2 focus:ring-ring focus:border-transparent text-foreground font-sans placeholder:text-muted-foreground"
                  placeholder="Enter amount (1-10)"
                  required
                />
              </div>

              <button
                onClick={handleCompleteQuest}
                disabled={isLoading || isApprovePending || isTransferPending}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-3 px-6 rounded-[var(--radius)] font-semibold font-sans transition-colors"
              >
                {isLoading || isApprovePending || isTransferPending ? 'Processing...' : 'Complete Quest'}
              </button>
            </div>
          </div>
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