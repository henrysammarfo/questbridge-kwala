import hre from "hardhat";

async function main() {
  const network = process.env.HARDHAT_NETWORK;

  if (!network) {
    throw new Error("Network not specified. Use --network amoy or --network sepolia");
  }

  console.log(`Preparing verification for network: ${network}`);

  // Load deployment info
  const fs = require("fs");
  const path = require("path");

  const deploymentPath = path.join(__dirname, `../deployments/${network}.json`);

  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Deployment info not found for network: ${network}`);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  console.log("\n=== Contract Verification Preparation ===");
  console.log(`Network: ${network}`);
  console.log(`QuestToken Address: ${deploymentInfo.questToken || 'Not deployed on this network'}`);
  console.log(`RewardNFT Address: ${deploymentInfo.rewardNFT || 'Not deployed on this network'}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Block Number: ${deploymentInfo.blockNumber}`);

  console.log("\n=== Manual Verification Commands ===");

  if (deploymentInfo.questToken && network === "amoy") {
    console.log(`\nQuestToken (Amoy - PolygonScan):`);
    console.log(`npx hardhat verify --network amoy ${deploymentInfo.questToken}`);
  }

  if (deploymentInfo.rewardNFT && network === "sepolia") {
    console.log(`\nRewardNFT (Sepolia - Etherscan):`);
    console.log(`npx hardhat verify --network sepolia ${deploymentInfo.rewardNFT}`);
  }

  console.log("\n=== Constructor Arguments ===");
  console.log("Both contracts use the default constructor with no arguments.");
  console.log("No constructor arguments needed for verification.");

  console.log("\n=== Verification Checklist ===");
  console.log("1. Ensure your API keys are set in .env:");
  console.log("   - POLYGONSCAN_API_KEY for Amoy");
  console.log("   - ETHERSCAN_API_KEY for Sepolia");
  console.log("2. Wait for a few block confirmations after deployment");
  console.log("3. Run the verification commands above");
  console.log("4. Check the verification status on the respective explorers");

  console.log("\nVerification preparation completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});