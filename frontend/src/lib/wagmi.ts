import { http, createConfig } from 'wagmi'
import { polygonAmoy, sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [polygonAmoy, sepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID! }),
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