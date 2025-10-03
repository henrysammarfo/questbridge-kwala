import { http, createConfig } from 'wagmi'
import { polygonAmoy, sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Configure connectors with proper options
const metaMaskConnector = metaMask({
  dappMetadata: {
    name: 'QuestBridge',
    url: 'https://questbridge.com',
    description: 'Cross-chain quest platform',
    icons: ['https://questbridge.com/icon.png'],
  },
})

const walletConnectConnector = walletConnect({
  projectId: '20255749664031d14f00d4dee2989433',
  metadata: {
    name: 'QuestBridge',
    description: 'Cross-chain quest platform',
    url: 'https://questbridge.com',
    icons: ['https://questbridge.com/icon.png'],
  },
})

export const config = createConfig({
  chains: [polygonAmoy, sepolia],
  connectors: [
    injected(),
    metaMaskConnector,
    walletConnectConnector,
  ],
  transports: {
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_URL),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL),
  },
  ssr: true, // For Next.js SSR support
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}