# NFT Marketplace Smart Contracts

This directory contains the smart contracts for the NFT Marketplace Mini project.

## 📋 Contracts Overview

### NFTCollection.sol
- **Purpose**: ERC-721 contract for minting NFTs
- **Features**:
  - Mint NFTs with metadata URI and rarity
  - Track token creators
  - Get tokens by owner
  - OpenZeppelin based for security

### NFTMarketplace.sol
- **Purpose**: Marketplace for buying and selling NFTs
- **Features**:
  - List NFTs for sale
  - Buy NFTs with ETH
  - Cancel listings
  - 2.5% marketplace fee
  - Owner fee management
  - Reentrancy protection

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation
```bash
cd contracts
npm install
```

### Environment Setup
```bash
cp env.example .env
# Edit .env with your values
```

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Deploy to Localhost
```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:localhost
```

### Deploy to Sepolia Testnet
```bash
# Make sure you have Sepolia ETH and filled .env
npm run deploy:sepolia
```

## 📁 Project Structure

```
contracts/
├── contracts/           # Smart contract source files
│   ├── NFTCollection.sol
│   └── NFTMarketplace.sol
├── scripts/            # Deployment scripts
│   └── deploy.js
├── test/              # Contract tests
│   ├── NFTCollection.test.js
│   └── NFTMarketplace.test.js
├── deployments/       # Deployment artifacts (auto-generated)
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Dependencies and scripts
```

## 🔧 Configuration

### Networks
- **Hardhat**: Local development network
- **Localhost**: Local Hardhat node (chainId: 1337)
- **Sepolia**: Ethereum testnet (chainId: 11155111)

### Environment Variables
```bash
PRIVATE_KEY=your_private_key_without_0x
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 📊 Contract Details

### NFTCollection
- **Name**: "NFT Marketplace Collection"
- **Symbol**: "NFTMC"
- **Standard**: ERC-721
- **Features**: URI storage, creator tracking, rarity system

### NFTMarketplace
- **Fee**: 2.5% (250 basis points)
- **Security**: ReentrancyGuard, Ownable
- **Functions**: List, buy, cancel, fee management

## 🧪 Testing

Run comprehensive tests:
```bash
npm test
```

Test coverage includes:
- ✅ NFT minting and metadata
- ✅ Marketplace listing and buying
- ✅ Fee calculations
- ✅ Access control
- ✅ Error handling
- ✅ Edge cases

## 🚀 Deployment

### Local Development
1. Start Hardhat node: `npm run node`
2. Deploy contracts: `npm run deploy:localhost`
3. Contracts will be available at localhost:8545

### Testnet Deployment
1. Get Sepolia ETH from [faucet](https://sepoliafaucet.com/)
2. Configure .env file
3. Deploy: `npm run deploy:sepolia`
4. Verify on Etherscan (optional)

### Deployment Artifacts
After deployment, check:
- `deployments/{network}.json` - Deployment details
- `../src/constants/contracts.ts` - Frontend constants

## 🔍 Contract Verification

For testnet deployments:
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 💡 Usage Examples

### Mint NFT
```javascript
const tx = await nftCollection.mintNFT(
  userAddress,
  "https://metadata-url.com/token/1",
  "Epic"
);
```

### List NFT
```javascript
// First approve marketplace
await nftCollection.setApprovalForAll(marketplaceAddress, true);

// Then list NFT
const tx = await nftMarketplace.listNFT(
  nftCollectionAddress,
  tokenId,
  ethers.parseEther("1.0")
);
```

### Buy NFT
```javascript
const tx = await nftMarketplace.buyNFT(listingId, {
  value: ethers.parseEther("1.0")
});
```

## 🛡️ Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Access control for admin functions
- **SafeTransfer**: Safe NFT transfers
- **Input Validation**: Comprehensive parameter checking
- **Fee Limits**: Maximum 10% marketplace fee
- **Approval Checks**: Ensures proper NFT approvals

## 📈 Gas Optimization

- Efficient storage patterns
- Batch operations where possible
- Optimized loops and mappings
- Minimal external calls

## 🤝 Contributing

1. Write tests for new features
2. Follow Solidity style guide
3. Add comprehensive comments
4. Test on localhost before testnet

## 📄 License

MIT License - see LICENSE file for details
