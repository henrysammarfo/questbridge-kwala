# QuestBridge Kwala

Automated cross-chain NFT rewards for Web3 games. Built for Kwala Hacker House.

## Overview

QuestBridge is a smart contract system that enables seamless cross-chain quest completion tracking and NFT rewards. The system consists of two main contracts:

- **QuestToken (ERC20)**: Tracks quest completions and manages reward tokens
- **RewardNFT (ERC721)**: Mints unique NFTs as rewards for completed quests

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
📄 QuestToken: [DEPLOYED_ADDRESS_HERE]
🔗 PolygonScan: https://amoy.polygonscan.com/address/[DEPLOYED_ADDRESS_HERE]
```

#### Sepolia Testnet (RewardNFT)
```
📄 RewardNFT: [DEPLOYED_ADDRESS_HERE]
🔗 Etherscan: https://sepolia.etherscan.org/address/[DEPLOYED_ADDRESS_HERE]
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
node scripts/deploy-simple.js amoy
```

#### Deploy RewardNFT to Sepolia
```bash
cd contracts
node scripts/deploy-simple.js sepolia
```

#### Alternative Deployment (TypeScript)
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network amoy
npx hardhat run scripts/deploy.ts --network sepolia
```

### Verification

Prepare verification commands:
```bash
cd contracts
npx hardhat run scripts/verify.ts --network amoy
npx hardhat run scripts/verify.ts --network sepolia
```

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
