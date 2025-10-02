const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = process.argv[2];

  if (!network) {
    console.error("Usage: node deploy-simple.js <network>");
    console.error("Networks: amoy, sepolia");
    process.exit(1);
  }

  console.log(`Deploying to network: ${network}`);

  // Load environment variables
  require('dotenv').config();

  // Setup provider based on network
  let provider;
  let chainId;

  if (network === "amoy") {
    provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC || "");
    chainId = 80002;
  } else if (network === "sepolia") {
    provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC || "");
    chainId = 11155111;
  } else {
    throw new Error(`Unsupported network: ${network}. Use 'amoy' or 'sepolia'`);
  }

  // Setup wallet
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log(`Deploying from address: ${wallet.address}`);

  let questTokenAddress;
  let rewardNFTAddress;

  try {
    if (network === "amoy") {
      // Deploy QuestToken to Amoy
      console.log("Deploying QuestToken to Amoy...");

      const QuestToken = await ethers.getContractFactory("QuestToken", wallet);
      const questToken = await QuestToken.deploy();
      await questToken.waitForDeployment();

      questTokenAddress = await questToken.getAddress();
      console.log(`QuestToken deployed to: ${questTokenAddress}`);
    } else if (network === "sepolia") {
      // Deploy RewardNFT to Sepolia
      console.log("Deploying RewardNFT to Sepolia...");

      const RewardNFT = await ethers.getContractFactory("RewardNFT", wallet);
      const rewardNFT = await RewardNFT.deploy();
      await rewardNFT.waitForDeployment();

      rewardNFTAddress = await rewardNFT.getAddress();
      console.log(`RewardNFT deployed to: ${rewardNFTAddress}`);
    }

    // Get current block number for deployment info
    const blockNumber = await provider.getBlockNumber();

    // Save deployment information
    const deploymentInfo = {
      network,
      questToken: questTokenAddress,
      rewardNFT: rewardNFTAddress,
      deployer: wallet.address,
      timestamp: new Date().toISOString(),
      blockNumber: blockNumber.toString(),
    };

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = path.join(deploymentsDir, `${network}.json`);
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

    console.log(`Deployment info saved to: ${filename}`);

    console.log("\n=== Deployment Summary ===");
    console.log(`Network: ${network}`);
    console.log(`Deployer: ${wallet.address}`);

    if (questTokenAddress) {
      console.log(`QuestToken (Amoy): ${questTokenAddress}`);
    }

    if (rewardNFTAddress) {
      console.log(`RewardNFT (Sepolia): ${rewardNFTAddress}`);
    }

    console.log("\nDeployment completed successfully!");

  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});