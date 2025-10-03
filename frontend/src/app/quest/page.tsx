'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, useReadContract } from 'wagmi'
import { toast, Toaster } from 'react-hot-toast'
import { questTokenABI, QUEST_TOKEN_ADDRESS, DEPLOYER_ADDRESS } from '@/lib/abi'

export default function Quest() {
  const { isConnected, address } = useAccount()
  const [tokenAmount, setTokenAmount] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract()
  const { writeContract: writeTransfer, data: transferHash, isPending: isTransferPending } = useWriteContract()

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

    // Check if user has enough tokens
    const userBalance = balance ? Number(balance) : 0
    if (userBalance < tokenAmount) {
      toast.error(`❌ Insufficient QuestTokens! You have ${userBalance} tokens but need ${tokenAmount} tokens.

💡 Get QuestTokens:
• Ask the deployer to mint you tokens
• Transfer from another address that has tokens
• Check if you've received tokens from previous quests`, {
        duration: 8000,
        style: {
          background: 'var(--destructive)',
          color: 'var(--destructive-foreground)',
          borderRadius: 'var(--radius)',
        },
      })
      return
    }

    setIsLoading(true)

    try {
      toast.loading('Preparing quest completion...', { id: 'prepare' })

      // First approve the tokens
      await writeApprove({
        address: QUEST_TOKEN_ADDRESS,
        abi: questTokenABI,
        functionName: 'approve',
        args: [DEPLOYER_ADDRESS, BigInt(tokenAmount)],
      })

      toast.success('Token approval submitted! Confirm in your wallet.', {
        duration: 4000,
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
        },
      })

      // Wait for approval confirmation
      await new Promise(resolve => setTimeout(resolve, 4000))

      toast.loading('Submitting quest completion...', { id: 'transfer' })

      // Then transfer the tokens
      await writeTransfer({
        address: QUEST_TOKEN_ADDRESS,
        abi: questTokenABI,
        functionName: 'transfer',
        args: [DEPLOYER_ADDRESS, BigInt(tokenAmount)],
      })

      toast.success('🎉 Quest completed! The QuestCompleted event has been emitted. Check Kwala automation logs for NFT minting on Sepolia!', {
        duration: 8000,
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
        },
      })

      // Show instructions for checking results
      setTimeout(() => {
        toast('📋 Next steps: 1) Check PolygonScan for QuestCompleted event 2) Monitor Kwala logs for NFT mint 3) Verify NFT on Sepolia Etherscan', {
          duration: 10000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-x-offset) var(--shadow-y-offset) var(--shadow-blur) var(--shadow-spread) var(--shadow-color)',
          },
        })
      }, 2000)

    } catch (error) {
      console.error('Quest completion error:', error)
      toast.error(`❌ Error: ${error instanceof Error ? error.message : 'Transaction failed'}.

💡 Common solutions:
• Make sure you're on Polygon Amoy network (Chain ID: 80002)
• Get QuestTokens from the faucet or deployer
• Check if you have enough MATIC for gas
• Verify your wallet has sufficient balance`, {
        duration: 8000,
        style: {
          background: 'var(--destructive)',
          color: 'var(--destructive-foreground)',
          borderRadius: 'var(--radius)',
        },
      })
    } finally {
      setIsLoading(false)
      toast.dismiss('prepare')
      toast.dismiss('transfer')
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
            {balance && (
              <div className="bg-muted/50 rounded-[var(--radius)] p-3 mb-4 border border-border">
                <p className="text-sm font-sans text-foreground">
                  💰 Your QuestToken Balance: <strong>{Number(balance).toLocaleString()} QUEST</strong>
                </p>
              </div>
            )}
            <div className="bg-chart1/10 border border-chart1/20 rounded-[var(--radius)] p-4 mb-6">
              <p className="text-chart1 text-sm font-sans mb-3">
                🔗 Make sure you're connected to <strong>Polygon Amoy</strong> network (Chain ID: 80002)
                <br />
                💰 Need test tokens? Get them from the <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Amoy Faucet</a>
              </p>
              <div className="bg-background/50 rounded-[var(--radius)] p-3 border border-chart1/10">
                <p className="text-xs text-muted-foreground font-sans">
                  <strong>Need QuestTokens?</strong> Send a small amount of MATIC to the QuestToken contract or ask the deployer to mint you some tokens first.
                  <br />
                  <strong>Contract:</strong> <code className="bg-muted px-1 rounded text-xs">{QUEST_TOKEN_ADDRESS.slice(0, 10)}...{QUEST_TOKEN_ADDRESS.slice(-8)}</code>
                </p>
              </div>
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