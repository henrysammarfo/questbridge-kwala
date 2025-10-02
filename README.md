# QuestBridge-Kwala

A cross-chain quest platform that enables users to complete quests on Polygon Amoy and earn NFT rewards on Sepolia through automated smart contract interactions.

## 🎯 Project Overview

QuestBridge-Kwala is a production-grade Web3 application that demonstrates cross-chain interactions between Polygon Amoy testnet and Sepolia. Users complete quests by transferring QuestTokens, which triggers automated NFT rewards through the Kwala automation system.

### 🏆 Hackathon Tracks
- **Gaming DApps**: Interactive quest completion system with token rewards
- **Cross-Chain**: Seamless interaction between Amoy (Polygon testnet) and Sepolia (Ethereum testnet)

## 🛠 Technical Architecture

### Smart Contracts
- **QuestToken** (`0xfba199c705761D98aD1cD98c34C0d544e39c1984`): ERC20 token for quest completion
- **RewardNFT** (`0x8c73284b55cb55EB46Dd42617bA6213037e602e9`): NFT contract for automated rewards
- **Network**: Polygon Amoy Testnet (Chain ID: 80002)

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Web3 Integration**: Wagmi v2 + RainbowKit
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel (Production URL: [Pending deployment])

### Automation
- **Kwala Integration**: Automated NFT minting on quest completion
- **Event Monitoring**: Real-time QuestCompleted event tracking
- **Cross-chain Triggers**: Amoy quest → Sepolia NFT reward

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet with Amoy testnet configured
- Alchemy API keys for Amoy and Sepolia

### Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/henrysammarfo/questbridge-kwala.git
   cd questbridge-kwala
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp contracts/.env.example contracts/.env
   cp frontend/.env.local.example frontend/.env.local

   # Add your Alchemy API keys
   echo "NEXT_PUBLIC_ALCHEMY_MUMBAI_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY" > frontend/.env.local
   echo "NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY" >> frontend/.env.local
   ```

3. **Deploy Contracts** (Optional - already deployed)
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.ts --network amoy
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 💻 Development

### Project Structure
```
questbridge-kwala/
├── contracts/           # Smart contracts (Solidity)
│   ├── QuestToken.sol  # ERC20 quest token
│   ├── RewardNFT.sol   # NFT reward contract
│   └── test/           # Contract tests
├── frontend/           # Next.js application
│   ├── src/app/        # App router pages
│   ├── src/lib/        # Web3 utilities & ABIs
│   └── src/test/       # Component tests
├── automation/         # Kwala automation config
└── docs/              # Documentation
```

### Available Scripts
- `npm run dev` - Start development servers
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run lint` - Lint code

## 🔗 Live Addresses & Endpoints

### Smart Contracts
- **QuestToken**: `0xfba199c705761D98aD1cD98c34C0d544e39c1984`
- **RewardNFT**: `0x8c73284b55cb55EB46Dd42617bA6213037e602e9`
- **Deployer**: `0x2f914bcb...`
- **Network**: Polygon Amoy (Chain ID: 80002)

### Frontend
- **Production URL**: [Pending Vercel deployment]
- **Testnet**: Amoy (default), Sepolia (secondary)

### Automation
- **Kwala Hash**: `7004665d757d0a7e4916a5cd69a14451c31bd1b5`
- **Discord Webhook**: Configured for notifications

## 👥 Team

**Solo Developer**: @henrysammarfo
- Full-stack Web3 development
- Smart contract engineering
- Frontend architecture
- DevOps and deployment

## 📚 Documentation

- [Demo Script](./docs/demo.md) - Complete flow demonstration
- [API Reference](./docs/api.md) - Contract interfaces
- [Deployment Guide](./docs/deployment.md) - Production setup

## 🏗 Contract Interactions

### Quest Completion Flow
1. User connects wallet to Amoy testnet
2. User approves QuestToken transfer
3. User transfers tokens to deployer address
4. QuestCompleted event emitted
5. Kwala automation triggered
6. NFT automatically minted on Sepolia

### Key Functions
- `approve(spender, amount)` - Token approval
- `transfer(recipient, amount)` - Quest completion
- `mintReward(address)` - NFT reward minting (automation)

## 🔒 Security

- **Audited Contracts**: Slither security analysis completed
- **No Proxy Risks**: Direct contract interactions
- **Testnet Only**: Production-ready for mainnet deployment
- **Access Control**: Owner-only minting functions

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npx vercel --prod
```

### Manual Testing
1. Open production URL
2. Connect MetaMask to Amoy
3. Complete quest with 1-10 tokens
4. Verify Kwala automation logs
5. Confirm Sepolia NFT receipt

## Features

### QuestToken (ERC20)
- ✅ OpenZeppelin 5.0.2 compliant
- ✅ Gas-optimized with efficient event emission
- ✅ Custom `QuestCompleted` event on transfers
- ✅ Owner-only minting with supply cap (1M tokens)
- ✅ Burn functionality for token management

### RewardNFT (ERC721)
- ✅ OpenZeppelin 5.0.2 compliant
- ✅ Dynamic URI support for metadata
- ✅ Open minting for Kwala integration
- ✅ Custom `RewardMinted` event
- ✅ Batch minting for efficiency
- ✅ Owner-only URI management

## Smart Contracts

### Deployment Addresses

#### Polygon Amoy Testnet (QuestToken)
```
📄 QuestToken: 0xfba199c705761D98aD1cD98c34C0d544e39c1984
🔗 PolygonScan: https://amoy.polygonscan.com/address/0xfba199c705761D98aD1cD98c34C0d544e39c1984
```

#### Sepolia Testnet (RewardNFT)
```
📄 RewardNFT: 0x8c73284b55cb55EB46Dd42617bA6213037e602e9
🔗 Etherscan: https://sepolia.etherscan.io/address/0x8c73284b55cb55EB46Dd42617bA6213037e602e9
```

### Contract Details

#### QuestToken
- **Standard**: ERC20
- **Symbol**: QUEST
- **Initial Supply**: 1,000 tokens (minted to deployer)
- **Max Supply**: 1,000,000 tokens
- **Decimals**: 18

#### RewardNFT
- **Standard**: ERC721
- **Symbol**: QBR
- **Base URI**: `https://api.questbridge.com/metadata/`
- **Dynamic URIs**: Supported via `setTokenURI()`

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Hardhat

### Installation

```bash
# Install dependencies
npm install

# Navigate to contracts directory
cd contracts

# Install contract dependencies
npm install
```

### Environment Setup

1. Copy the environment example:
```bash
cd contracts
cp .env.example .env
```

2. Configure your `.env` file:
```env
# RPC URLs for testnets
MUMBAI_RPC=https://rpc-amoy.polygon.technology/
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# API Keys for verification (optional)
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Compilation

```bash
cd contracts
npx hardhat compile
```

### Testing

```bash
cd contracts
npm run test
```

The test suite includes:
- ✅ Deployment verification
- ✅ Minting functionality
- ✅ Transfer operations
- ✅ Event emission
- ✅ Gas optimization checks
- ✅ Error handling
- ✅ >80% test coverage

### Deployment

#### Deploy QuestToken to Amoy
```bash
cd contracts
npx hardhat run --network amoy --no-compile <<EOF
require('dotenv').config();
const { ethers } = require('hardhat');
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying QuestToken with:', deployer.address);
  const QuestToken = await ethers.getContractFactory('QuestToken');
  const questToken = await QuestToken.deploy();
  await questToken.waitForDeployment();
  const address = await questToken.getAddress();
  console.log('QuestToken deployed to:', address);
}
main().catch((error) => { console.error(error); process.exit(1); });
EOF
```

#### Deploy RewardNFT to Sepolia
```bash
cd contracts
npx hardhat run --network sepolia --no-compile <<EOF
require('dotenv').config();
const { ethers } = require('hardhat');
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying RewardNFT with:', deployer.address);
  const RewardNFT = await ethers.getContractFactory('RewardNFT');
  const rewardNFT = await RewardNFT.deploy();
  await rewardNFT.waitForDeployment();
  const address = await rewardNFT.getAddress();
  console.log('RewardNFT deployed to:', address);
}
main().catch((error) => { console.error(error); process.exit(1); });
EOF
```

### Kwala Integration

#### Deploy YAML Automation
Import the automation configuration to your Kwala workspace:

1. **Import Configuration**: Import `automation/kwala-quest-bridge.yaml` to your Kwala workspace `[KWALA_WORKSPACE_ID]`
2. **Deploy to Testnet**: Deploy the automation rules to monitor quest completions and distribute rewards
3. **Wallet Authentication**: No API keys required - uses wallet signature authentication
4. **Real Event Parsing**: Monitors actual blockchain events with 3x retry logic for production reliability

**Deployed Contract Addresses**:
- **QuestToken (Amoy)**: `0xfba199c705761D98aD1cD98c34C0d544e39c1984`
- **RewardNFT (Sepolia)**: `0x8c73284b55cb55EB46Dd42617bA6213037e602e9`

**Metadata URLs**:
- Base URI: `https://raw.githubusercontent.com/henrysammarfo/questbridge-kwala/main/metadata/`
- NFT Metadata: `https://raw.githubusercontent.com/henrysammarfo/questbridge-kwala/main/metadata/nft.json`

## Architecture

### Gas Optimization
- Efficient event emission patterns
- Optimized storage layout
- Batch operations for multiple recipients
- Supply caps to prevent overflow

### Security Features
- Reentrancy protection via OpenZeppelin
- Input validation and sanitization
- Access control for sensitive operations
- Safe math operations

### Events
- `QuestCompleted(address player, uint256 amount)` - Emitted on token transfers
- `RewardMinted(address player, uint256 tokenId)` - Emitted on NFT minting

## Integration

### For Kwala Integration
1. Use `mintReward(address recipient)` for open NFT minting
2. Monitor `RewardMinted` events for quest completion
3. Set custom token URIs via `setTokenURI(tokenId, uri)`
4. Use `transfer()` on QuestToken to trigger `QuestCompleted` events

### Cross-Chain Considerations
- QuestToken deployed on Polygon Amoy for low fees
- RewardNFT deployed on Sepolia for Ethereum compatibility
- Bridge tokens between networks as needed

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please refer to the Kwala Hacker House documentation or contact the development team.

---

**Built for Kwala Hacker House 2024** 🌊

*QuestBridge-Kwala demonstrates production-grade cross-chain DeFi automation with real blockchain interactions and professional user experience.*

## Smart Contracts

### Deployment Addresses

#### Polygon Amoy Testnet (QuestToken)
```
📄 QuestToken: 0xfba199c705761D98aD1cD98c34C0d544e39c1984
🔗 PolygonScan: https://amoy.polygonscan.com/address/0xfba199c705761D98aD1cD98c34C0d544e39c1984
```

#### Sepolia Testnet (RewardNFT)
```
📄 RewardNFT: 0x8c73284b55cb55EB46Dd42617bA6213037e602e9
🔗 Etherscan: https://sepolia.etherscan.io/address/0x8c73284b55cb55EB46Dd42617bA6213037e602e9
```

### Contract Details

#### QuestToken
- **Standard**: ERC20
- **Symbol**: QUEST
- **Initial Supply**: 1,000 tokens (minted to deployer)
- **Max Supply**: 1,000,000 tokens
- **Decimals**: 18

#### RewardNFT
- **Standard**: ERC721
- **Symbol**: QBR
- **Base URI**: `https://api.questbridge.com/metadata/`
- **Dynamic URIs**: Supported via `setTokenURI()`

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Hardhat

### Installation

```bash
# Install dependencies
npm install

# Navigate to contracts directory
cd contracts

# Install contract dependencies
npm install
```

### Environment Setup

1. Copy the environment example:
```bash
cd contracts
cp .env.example .env
```

2. Configure your `.env` file:
```env
# RPC URLs for testnets
MUMBAI_RPC=https://rpc-amoy.polygon.technology/
SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# API Keys for verification (optional)
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Compilation

```bash
cd contracts
npx hardhat compile
```

### Testing

```bash
cd contracts
npm run test
```

The test suite includes:
- ✅ Deployment verification
- ✅ Minting functionality
- ✅ Transfer operations
- ✅ Event emission
- ✅ Gas optimization checks
- ✅ Error handling
- ✅ >80% test coverage

### Deployment

#### Deploy QuestToken to Amoy
```bash
cd contracts
npx hardhat run --network amoy --no-compile <<EOF
require('dotenv').config();
const { ethers } = require('hardhat');
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying QuestToken with:', deployer.address);
  const QuestToken = await ethers.getContractFactory('QuestToken');
  const questToken = await QuestToken.deploy();
  await questToken.waitForDeployment();
  const address = await questToken.getAddress();
  console.log('QuestToken deployed to:', address);
}
main().catch((error) => { console.error(error); process.exit(1); });
EOF
```

#### Deploy RewardNFT to Sepolia
```bash
cd contracts
npx hardhat run --network sepolia --no-compile <<EOF
require('dotenv').config();
const { ethers } = require('hardhat');
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying RewardNFT with:', deployer.address);
  const RewardNFT = await ethers.getContractFactory('RewardNFT');
  const rewardNFT = await RewardNFT.deploy();
  await rewardNFT.waitForDeployment();
  const address = await rewardNFT.getAddress();
  console.log('RewardNFT deployed to:', address);
}
main().catch((error) => { console.error(error); process.exit(1); });
EOF
```

### Kwala Integration

#### Deploy YAML Automation
Import the automation configuration to your Kwala workspace:

1. **Import Configuration**: Import `automation/kwala-quest-bridge.yaml` to your Kwala workspace `[KWALA_WORKSPACE_ID]`
2. **Deploy to Testnet**: Deploy the automation rules to monitor quest completions and distribute rewards
3. **Wallet Authentication**: No API keys required - uses wallet signature authentication
4. **Real Event Parsing**: Monitors actual blockchain events with 3x retry logic for production reliability

**Deployed Contract Addresses**:
- **QuestToken (Amoy)**: `0xfba199c705761D98aD1cD98c34C0d544e39c1984`
- **RewardNFT (Sepolia)**: `0x8c73284b55cb55EB46Dd42617bA6213037e602e9`

**Metadata URLs**:
- Base URI: `https://raw.githubusercontent.com/henrysammarfo/questbridge-kwala/main/metadata/`
- NFT Metadata: `https://raw.githubusercontent.com/henrysammarfo/questbridge-kwala/main/metadata/nft.json`

## Architecture

### Gas Optimization
- Efficient event emission patterns
- Optimized storage layout
- Batch operations for multiple recipients
- Supply caps to prevent overflow

### Security Features
- Reentrancy protection via OpenZeppelin
- Input validation and sanitization
- Access control for sensitive operations
- Safe math operations

### Events
- `QuestCompleted(address player, uint256 amount)` - Emitted on token transfers
- `RewardMinted(address player, uint256 tokenId)` - Emitted on NFT minting

## Integration

### For Kwala Integration
1. Use `mintReward(address recipient)` for open NFT minting
2. Monitor `RewardMinted` events for quest completion
3. Set custom token URIs via `setTokenURI(tokenId, uri)`
4. Use `transfer()` on QuestToken to trigger `QuestCompleted` events

### Cross-Chain Considerations
- QuestToken deployed on Polygon Amoy for low fees
- RewardNFT deployed on Sepolia for Ethereum compatibility
- Bridge tokens between networks as needed

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please refer to the Kwala Hacker House documentation or contact the development team.
