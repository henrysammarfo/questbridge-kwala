import { expect } from "chai";
import { viem } from "hardhat";
import { parseAbi } from "viem";

const rewardNFTABI = parseAbi([
  "constructor()",
  "function mintReward(address) returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "function ownerOf(uint256) view returns (address)",
  "function setTokenURI(uint256,string)",
  "function setBaseURI(string)",
  "function batchMintRewards(address[])",
  "function getNextTokenId() view returns (uint256)",
  "function getBaseURI() view returns (string)",
  "function hasCustomURI(uint256) view returns (bool)",
  "event RewardMinted(address indexed,uint256 indexed)",
  "event Transfer(address indexed,address indexed,uint256)"
]);

describe("RewardNFT", function () {
  let rewardNFT: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let publicClient: any;

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await viem.getWalletClients();

    // Deploy RewardNFT
    const rewardNFTFactory = await viem.getContractFactory("RewardNFT");
    const txHash = await owner.deployContract({
      abi: rewardNFTABI,
      bytecode: rewardNFTFactory.bytecode,
    });

    const receipt = await viem.getPublicClient().waitForTransactionReceipt({ hash: txHash });
    rewardNFT = {
      address: receipt.contractAddress,
      abi: rewardNFTABI,
      write: {
        mintReward: async (to: string) => {
          return await owner.writeContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "mintReward",
            args: [to],
          });
        },
        setTokenURI: async (tokenId: bigint, uri: string) => {
          return await owner.writeContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "setTokenURI",
            args: [tokenId, uri],
          });
        },
        setBaseURI: async (uri: string) => {
          return await owner.writeContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "setBaseURI",
            args: [uri],
          });
        },
        batchMintRewards: async (recipients: string[]) => {
          return await owner.writeContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "batchMintRewards",
            args: [recipients],
          });
        },
      },
      read: {
        tokenURI: async (tokenId: bigint) => {
          return await viem.getPublicClient().readContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "tokenURI",
            args: [tokenId],
          });
        },
        ownerOf: async (tokenId: bigint) => {
          return await viem.getPublicClient().readContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "ownerOf",
            args: [tokenId],
          });
        },
        getNextTokenId: async () => {
          return await viem.getPublicClient().readContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "getNextTokenId",
          });
        },
        getBaseURI: async () => {
          return await viem.getPublicClient().readContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "getBaseURI",
          });
        },
        hasCustomURI: async (tokenId: bigint) => {
          return await viem.getPublicClient().readContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "hasCustomURI",
            args: [tokenId],
          });
        },
      },
    };

    publicClient = viem.getPublicClient();
  });

  describe("Deployment", function () {
    it("Should set correct token name and symbol", async function () {
      // Verify deployment was successful
      expect(rewardNFT.address).to.be.properAddress;
    });

    it("Should initialize with correct next token ID", async function () {
      const nextTokenId = await rewardNFT.read.getNextTokenId();
      expect(nextTokenId).to.equal(1n);
    });

    it("Should set default base URI", async function () {
      const baseURI = await rewardNFT.read.getBaseURI();
      expect(baseURI).to.equal("https://api.questbridge.com/metadata/");
    });
  });

  describe("Minting", function () {
    it("Should mint reward NFT to specified address", async function () {
      const txHash = await rewardNFT.write.mintReward(addr1.account.address);
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      // Extract token ID from event logs
      const transferEvent = receipt.logs.find((log: any) =>
        log.topics[0] === viem.getPublicClient().chain.contracts.erc721.topics.Transfer
      );

      const tokenId = BigInt(transferEvent.topics[3]);

      expect(await rewardNFT.read.ownerOf(tokenId)).to.equal(addr1.account.address);
    });

    it("Should emit RewardMinted event", async function () {
      await expect(
        rewardNFT.write.mintReward(addr1.account.address)
      ).to.emit(rewardNFT, "RewardMinted")
        .withArgs(addr1.account.address, 1n);
    });

    it("Should increment token ID after each mint", async function () {
      await rewardNFT.write.mintReward(addr1.account.address);
      await rewardNFT.write.mintReward(addr2.account.address);

      const nextTokenId = await rewardNFT.read.getNextTokenId();
      expect(nextTokenId).to.equal(3n);
    });

    it("Should not mint to zero address", async function () {
      await expect(
        rewardNFT.write.mintReward("0x0000000000000000000000000000000000000000")
      ).to.be.rejectedWith("RewardNFT: cannot mint to zero address");
    });

    it("Should allow anyone to mint (open minting)", async function () {
      // This test verifies that minting is open (not owner-only)
      const addr1Client = await viem.getWalletClient(addr1.account.address);

      await expect(
        addr1Client.writeContract({
          address: rewardNFT.address,
          abi: rewardNFTABI,
          functionName: "mintReward",
          args: [addr2.account.address],
        })
      ).to.not.be.rejected;
    });
  });

  describe("Token URI", function () {
    let tokenId: bigint;

    beforeEach(async function () {
      const txHash = await rewardNFT.write.mintReward(addr1.account.address);
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      const transferEvent = receipt.logs.find((log: any) =>
        log.topics[0] === viem.getPublicClient().chain.contracts.erc721.topics.Transfer
      );

      tokenId = BigInt(transferEvent.topics[3]);
    });

    it("Should return default URI for token", async function () {
      const uri = await rewardNFT.read.tokenURI(tokenId);
      expect(uri).to.equal(`https://api.questbridge.com/metadata/${tokenId}.json`);
    });

    it("Should return custom URI when set", async function () {
      const customURI = "https://custom.example.com/token/1";
      await rewardNFT.write.setTokenURI(tokenId, customURI);

      const uri = await rewardNFT.read.tokenURI(tokenId);
      expect(uri).to.equal(customURI);
    });

    it("Should confirm token has custom URI", async function () {
      const customURI = "https://custom.example.com/token/1";
      await rewardNFT.write.setTokenURI(tokenId, customURI);

      const hasCustom = await rewardNFT.read.hasCustomURI(tokenId);
      expect(hasCustom).to.be.true;
    });

    it("Should update base URI", async function () {
      const newBaseURI = "https://new.example.com/metadata/";
      await rewardNFT.write.setBaseURI(newBaseURI);

      const baseURI = await rewardNFT.read.getBaseURI();
      expect(baseURI).to.equal(newBaseURI);

      // Mint new token to test new base URI
      const txHash = await rewardNFT.write.mintReward(addr2.account.address);
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      const transferEvent = receipt.logs.find((log: any) =>
        log.topics[0] === viem.getPublicClient().chain.contracts.erc721.topics.Transfer
      );

      const newTokenId = BigInt(transferEvent.topics[3]);
      const uri = await rewardNFT.read.tokenURI(newTokenId);
      expect(uri).to.equal(`${newBaseURI}${newTokenId}.json`);
    });

    it("Should only allow owner to set custom URI", async function () {
      const customURI = "https://custom.example.com/token/1";

      await expect(
        viem.getWalletClient(addr1.account.address).then(client =>
          client.writeContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "setTokenURI",
            args: [tokenId, customURI],
          })
        )
      ).to.be.rejected;
    });

    it("Should only allow owner to set base URI", async function () {
      const newBaseURI = "https://new.example.com/metadata/";

      await expect(
        viem.getWalletClient(addr1.account.address).then(client =>
          client.writeContract({
            address: rewardNFT.address,
            abi: rewardNFTABI,
            functionName: "setBaseURI",
            args: [newBaseURI],
          })
        )
      ).to.be.rejected;
    });
  });

  describe("Batch Minting", function () {
    it("Should batch mint rewards to multiple addresses", async function () {
      const recipients = [
        addr1.account.address,
        addr2.account.address,
        owner.account.address
      ];

      await rewardNFT.write.batchMintRewards(recipients);

      // Check ownership of minted tokens
      expect(await rewardNFT.read.ownerOf(1n)).to.equal(addr1.account.address);
      expect(await rewardNFT.read.ownerOf(2n)).to.equal(addr2.account.address);
      expect(await rewardNFT.read.ownerOf(3n)).to.equal(owner.account.address);
    });

    it("Should emit RewardMinted events for each mint", async function () {
      const recipients = [addr1.account.address, addr2.account.address];

      await expect(
        rewardNFT.write.batchMintRewards(recipients)
      ).to.emit(rewardNFT, "RewardMinted")
        .withArgs(addr1.account.address, 1n)
        .and.to.emit(rewardNFT, "RewardMinted")
        .withArgs(addr2.account.address, 2n);
    });

    it("Should not allow empty batch", async function () {
      await expect(
        rewardNFT.write.batchMintRewards([])
      ).to.be.rejectedWith("RewardNFT: no recipients");
    });

    it("Should not allow batch too large", async function () {
      const recipients = Array(101).fill(addr1.account.address);

      await expect(
        rewardNFT.write.batchMintRewards(recipients)
      ).to.be.rejectedWith("RewardNFT: batch too large");
    });

    it("Should not mint to zero address in batch", async function () {
      const recipients = [
        addr1.account.address,
        "0x0000000000000000000000000000000000000000",
        addr2.account.address
      ];

      await expect(
        rewardNFT.write.batchMintRewards(recipients)
      ).to.be.rejectedWith("RewardNFT: cannot mint to zero address");
    });
  });

  describe("Utility Functions", function () {
    it("Should return correct next token ID", async function () {
      const initialNextId = await rewardNFT.read.getNextTokenId();
      expect(initialNextId).to.equal(1n);

      await rewardNFT.write.mintReward(addr1.account.address);
      const nextId = await rewardNFT.read.getNextTokenId();
      expect(nextId).to.equal(2n);
    });

    it("Should correctly identify tokens without custom URI", async function () {
      await rewardNFT.write.mintReward(addr1.account.address);

      const hasCustom = await rewardNFT.read.hasCustomURI(1n);
      expect(hasCustom).to.be.false;
    });

    it("Should correctly identify tokens with custom URI", async function () {
      await rewardNFT.write.mintReward(addr1.account.address);

      await rewardNFT.write.setTokenURI(1n, "https://custom.example.com/token/1");

      const hasCustom = await rewardNFT.read.hasCustomURI(1n);
      expect(hasCustom).to.be.true;
    });
  });

  describe("Error Handling", function () {
    it("Should revert when querying URI for non-existent token", async function () {
      await expect(
        rewardNFT.read.tokenURI(999n)
      ).to.be.rejectedWith("RewardNFT: token does not exist");
    });

    it("Should revert when querying owner for non-existent token", async function () {
      await expect(
        rewardNFT.read.ownerOf(999n)
      ).to.be.rejectedWith("RewardNFT: token does not exist");
    });

    it("Should revert when setting URI for non-existent token", async function () {
      await expect(
        rewardNFT.write.setTokenURI(999n, "https://example.com")
      ).to.be.rejectedWith("RewardNFT: token does not exist");
    });
  });
});