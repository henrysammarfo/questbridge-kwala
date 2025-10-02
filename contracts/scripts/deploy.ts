import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

interface DeploymentInfo {
  network: string;
  questToken?: string;
  rewardNFT?: string;
  deployer: string;
  timestamp: string;
  blockNumber: bigint;
}

async function deployQuestToken() {
  console.log("Deploying QuestToken to Amoy...");

  const questTokenFactory = await hre.ethers.getContractFactory("QuestToken");
  const questToken = await questTokenFactory.deploy();
  await questToken.deployed();

  const questTokenAddress = questToken.address;
  console.log(`QuestToken deployed to: ${questTokenAddress}`);
  return questTokenAddress;
}

async function deployRewardNFT() {
  console.log("Deploying RewardNFT to Sepolia...");

  const rewardNFTFactory = await hre.ethers.getContractFactory("RewardNFT");
  const rewardNFT = await rewardNFTFactory.deploy();
  await rewardNFT.deployed();

  const rewardNFTAddress = rewardNFT.address;
  console.log(`RewardNFT deployed to: ${rewardNFTAddress}`);
  return rewardNFTAddress;
}

async function saveDeploymentInfo(
  network: string,
  questTokenAddress: string | undefined,
  rewardNFTAddress: string | undefined,
  deployer: string,
  blockNumber: bigint
) {
  const deploymentInfo: DeploymentInfo = {
    network,
    questToken: questTokenAddress,
    rewardNFT: rewardNFTAddress,
    deployer,
    timestamp: new Date().toISOString(),
    blockNumber,
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

  console.log(`Deployment info saved to: ${filename}`);
}

async function main() {
  const network = process.env.HARDHAT_NETWORK;

  if (!network) {
    throw new Error("Network not specified. Use --network amoy or --network sepolia");
  }

  console.log(`Deploying to network: ${network}`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying from address: ${deployer.address}`);

  let questTokenAddress: string | undefined;
  let rewardNFTAddress: string | undefined;

  try {
    if (network === "amoy") {
      // Deploy QuestToken to Amoy
      questTokenAddress = await deployQuestToken();
    } else if (network === "sepolia") {
      // Deploy RewardNFT to Sepolia
      rewardNFTAddress = await deployRewardNFT();
    } else {
      throw new Error(`Unsupported network: ${network}. Use 'amoy' or 'sepolia'`);
    }

    // Get current block number for deployment info
    const blockNumber = await ethers.provider.getBlockNumber();

    // Save deployment information
    await saveDeploymentInfo(
      network,
      questTokenAddress,
      rewardNFTAddress,
      deployer.address,
      BigInt(blockNumber)
    );

    console.log("\n=== Deployment Summary ===");
    console.log(`Network: ${network}`);
    console.log(`Deployer: ${deployer.address}`);

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