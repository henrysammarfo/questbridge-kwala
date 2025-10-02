# QuestBridge: Cross-Chain Rewards Frontend

A modern, responsive Web3 frontend for the QuestBridge platform that enables users to complete quests and earn NFT rewards on the Polygon Amoy testnet.

## Features

- **🌈 Wallet Connection**: Seamless integration with RainbowKit for multi-wallet support
- **⛓️ Multi-Chain Support**: Live interactions with Polygon Amoy and Sepolia testnets
- **🎯 Quest Completion**: Interactive form to complete quests with token rewards (1-10 tokens)
- **🎨 Professional Design**: Built with a comprehensive design system using OKLCH colors
- **📱 Mobile-First**: Fully responsive design that works on all devices
- **🔥 Real-Time Updates**: Live contract event monitoring for quest completions
- **🧪 Comprehensive Testing**: Full test coverage with Vitest and React Testing Library

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Web3**: Wagmi v2 + Viem for blockchain interactions
- **Wallet**: RainbowKit for wallet connection
- **Testing**: Vitest + React Testing Library
- **Notifications**: React Hot Toast
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- A Web3 wallet (MetaMask recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd questbridge-kwala/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_ALCHEMY_MUMBAI_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY
   NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Connect Your Wallet**: Click the "Connect Wallet" button and select your preferred Web3 wallet
2. **Switch to Amoy**: Use the chain switcher to connect to Polygon Amoy testnet
3. **Complete Quests**: Navigate to the quest page and enter a token amount (1-10)
4. **Earn Rewards**: Submit the quest to earn tokens and NFT rewards

## Smart Contracts

- **QuestToken**: `0xfba199c705761D98aD1cD98c34C0d544e39c1984`
- **Network**: Polygon Amoy Testnet (Chain ID: 80002)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Hero page with wallet connection
│   │   ├── quest/page.tsx  # Quest completion form
│   │   └── providers.tsx   # Wagmi + RainbowKit providers
│   ├── lib/
│   │   ├── wagmi.ts        # Web3 configuration
│   │   └── abi.ts          # Smart contract ABIs
│   └── test/
│       ├── setup.ts        # Test configuration
│       └── quest.test.tsx  # Quest component tests
├── public/                 # Static assets
└── design-system.json      # Design tokens
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add the environment variables from `.env.local`

### Live URL

🚀 **Production Deployment**: [https://your-app.vercel.app](https://your-app.vercel.app) *(Replace with actual URL after deployment)*

## Testing

Run the comprehensive test suite:

```bash
npm run test
```

Tests include:
- Wallet connection states
- Quest completion functionality
- Token amount validation
- Real-time event monitoring
- Error handling

## Design System

The application uses a professional design system with:
- **Colors**: OKLCH color space mapped to hex values
- **Typography**: Geist font family for modern, readable text
- **Spacing**: Consistent radius (0.625rem) and shadows
- **Components**: Reusable, accessible UI components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for the Kwala Hacker House community
