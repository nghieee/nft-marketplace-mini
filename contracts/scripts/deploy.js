const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy NFTCollection contract
  console.log("\n📦 Deploying NFTCollection...");
  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy();
  await nftCollection.waitForDeployment();
  
  const nftCollectionAddress = await nftCollection.getAddress();
  console.log("✅ NFTCollection deployed to:", nftCollectionAddress);
  
  // Deploy NFTMarketplace contract
  console.log("\n📦 Deploying NFTMarketplace...");
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.waitForDeployment();
  
  const nftMarketplaceAddress = await nftMarketplace.getAddress();
  console.log("✅ NFTMarketplace deployed to:", nftMarketplaceAddress);
  
  // Create deployment info object
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      NFTCollection: {
        address: nftCollectionAddress,
        name: "NFT Marketplace Collection",
        symbol: "NFTMC"
      },
      NFTMarketplace: {
        address: nftMarketplaceAddress,
        fee: "2.5%"
      }
    },
    gasUsed: {
      NFTCollection: (await nftCollection.deploymentTransaction().wait()).gasUsed.toString(),
      NFTMarketplace: (await nftMarketplace.deploymentTransaction().wait()).gasUsed.toString()
    }
  };
  
  // Save deployment info to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  // Also save to frontend constants
  const frontendConstantsDir = path.join(__dirname, "../../src/constants");
  if (!fs.existsSync(frontendConstantsDir)) {
    fs.mkdirSync(frontendConstantsDir, { recursive: true });
  }
  
  const contractsConstant = `// Auto-generated contract addresses and ABIs
// Generated at: ${deploymentInfo.deployedAt}
// Network: ${deploymentInfo.network}

export const CONTRACT_ADDRESSES = {
  NFT_COLLECTION: "${nftCollectionAddress}",
  NFT_MARKETPLACE: "${nftMarketplaceAddress}"
} as const;

export const NETWORK_CONFIG = {
  name: "${hre.network.name}",
  chainId: ${hre.network.config.chainId || 'unknown'},
  deployer: "${deployer.address}"
} as const;

export const MARKETPLACE_CONFIG = {
  fee: 250, // 2.5% in basis points
  feePercentage: "2.5%"
} as const;
`;
  
  fs.writeFileSync(
    path.join(frontendConstantsDir, "contracts.ts"),
    contractsConstant
  );
  
  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`NFTCollection: ${nftCollectionAddress}`);
  console.log(`NFTMarketplace: ${nftMarketplaceAddress}`);
  console.log(`Deployment file: ${deploymentFile}`);
  console.log(`Frontend constants: ${path.join(frontendConstantsDir, "contracts.ts")}`);
  console.log("=".repeat(50));
  
  // Verify contracts on testnet (if not localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n🔍 Waiting for block confirmations...");
    await nftCollection.deploymentTransaction().wait(5);
    await nftMarketplace.deploymentTransaction().wait(5);
    
    console.log("📝 To verify contracts on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${nftCollectionAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${nftMarketplaceAddress}`);
  }
  
  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
