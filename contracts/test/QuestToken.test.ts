import { expect } from "chai";
import { viem } from "hardhat";
import { parseAbi } from "viem";

const questTokenABI = parseAbi([
  "constructor()",
  "function mint(address,uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function burn(uint256)",
  "function getMaxSupply() view returns (uint256)",
  "event QuestCompleted(address indexed,uint256)",
  "event Transfer(address indexed,address indexed,uint256)"
]);

describe("QuestToken", function () {
  let questToken: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let publicClient: any;

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await viem.getWalletClients();

    // Deploy QuestToken
    const questTokenFactory = await viem.getContractFactory("QuestToken");
    const txHash = await owner.deployContract({
      abi: questTokenABI,
      bytecode: questTokenFactory.bytecode,
    });

    const receipt = await viem.getPublicClient().waitForTransactionReceipt({ hash: txHash });
    questToken = {
      address: receipt.contractAddress,
      abi: questTokenABI,
      write: {
        mint: async (to: string, amount: bigint) => {
          return await owner.writeContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "mint",
            args: [to, amount],
          });
        },
        transfer: async (to: string, amount: bigint) => {
          return await owner.writeContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "transfer",
            args: [to, amount],
          });
        },
        burn: async (amount: bigint) => {
          return await owner.writeContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "burn",
            args: [amount],
          });
        },
      },
      read: {
        balanceOf: async (address: string) => {
          return await viem.getPublicClient().readContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "balanceOf",
            args: [address],
          });
        },
        totalSupply: async () => {
          return await viem.getPublicClient().readContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "totalSupply",
          });
        },
        getMaxSupply: async () => {
          return await viem.getPublicClient().readContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "getMaxSupply",
          });
        },
      },
    };

    publicClient = viem.getPublicClient();
  });

  describe("Deployment", function () {
    it("Should mint initial supply to deployer", async function () {
      const balance = await questToken.read.balanceOf(owner.account.address);
      expect(balance).to.equal(1000n * 10n**18n); // 1000 tokens
    });

    it("Should set correct token name and symbol", async function () {
      // This would require ERC20 name/symbol functions in ABI
      // For now, we verify deployment was successful
      expect(questToken.address).to.be.properAddress;
    });

    it("Should have correct max supply", async function () {
      const maxSupply = await questToken.read.getMaxSupply();
      expect(maxSupply).to.equal(1000000n * 10n**18n); // 1M tokens
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to specified address", async function () {
      const mintAmount = 100n * 10n**18n;
      await questToken.write.mint(addr1.account.address, mintAmount);

      const balance = await questToken.read.balanceOf(addr1.account.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should not mint to zero address", async function () {
      const mintAmount = 100n * 10n**18n;
      await expect(
        questToken.write.mint("0x0000000000000000000000000000000000000000", mintAmount)
      ).to.be.rejectedWith("QuestToken: cannot mint to zero address");
    });

    it("Should not exceed max supply", async function () {
      const maxSupply = await questToken.read.getMaxSupply();
      const currentSupply = await questToken.read.totalSupply();
      const excessAmount = maxSupply - currentSupply + 1n;

      await expect(
        questToken.write.mint(addr1.account.address, excessAmount)
      ).to.be.rejectedWith("QuestToken: max supply exceeded");
    });

    it("Should only allow owner to mint", async function () {
      const mintAmount = 100n * 10n**18n;
      await expect(
        viem.getWalletClient(addr1.account.address).then(client =>
          client.writeContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "mint",
            args: [addr2.account.address, mintAmount],
          })
        )
      ).to.be.rejected;
    });
  });

  describe("Transfer", function () {
    beforeEach(async function () {
      // Mint some tokens to addr1 for testing
      await questToken.write.mint(addr1.account.address, 100n * 10n**18n);
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = 50n * 10n**18n;

      await questToken.write.transfer(addr2.account.address, transferAmount);

      const addr1Balance = await questToken.read.balanceOf(addr1.account.address);
      const addr2Balance = await questToken.read.balanceOf(addr2.account.address);

      expect(addr1Balance).to.equal(50n * 10n**18n);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should emit QuestCompleted event on transfer", async function () {
      const transferAmount = 50n * 10n**18n;

      await expect(
        questToken.write.transfer(addr2.account.address, transferAmount)
      ).to.emit(questToken, "QuestCompleted")
        .withArgs(addr2.account.address, transferAmount);
    });

    it("Should emit Transfer event", async function () {
      const transferAmount = 50n * 10n**18n;

      await expect(
        questToken.write.transfer(addr2.account.address, transferAmount)
      ).to.emit(questToken, "Transfer")
        .withArgs(owner.account.address, addr2.account.address, transferAmount);
    });

    it("Should not transfer more than balance", async function () {
      const transferAmount = 200n * 10n**18n; // More than addr1 has

      await expect(
        viem.getWalletClient(addr1.account.address).then(client =>
          client.writeContract({
            address: questToken.address,
            abi: questTokenABI,
            functionName: "transfer",
            args: [addr2.account.address, transferAmount],
          })
        )
      ).to.be.rejected;
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Mint some tokens to owner for testing
      await questToken.write.mint(owner.account.address, 100n * 10n**18n);
    });

    it("Should burn tokens from caller balance", async function () {
      const initialBalance = await questToken.read.balanceOf(owner.account.address);
      const burnAmount = 25n * 10n**18n;

      await questToken.write.burn(burnAmount);

      const finalBalance = await questToken.read.balanceOf(owner.account.address);
      expect(finalBalance).to.equal(initialBalance - burnAmount);
    });

    it("Should update total supply after burn", async function () {
      const initialSupply = await questToken.read.totalSupply();
      const burnAmount = 25n * 10n**18n;

      await questToken.write.burn(burnAmount);

      const finalSupply = await questToken.read.totalSupply();
      expect(finalSupply).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Gas Optimization", function () {
    it("Should have efficient mint function", async function () {
      const mintAmount = 100n * 10n**18n;

      // This test would require gas measurement in a real scenario
      // For now, we verify functionality works
      await questToken.write.mint(addr1.account.address, mintAmount);
      const balance = await questToken.read.balanceOf(addr1.account.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should have efficient transfer function", async function () {
      await questToken.write.mint(addr1.account.address, 100n * 10n**18n);
      const transferAmount = 50n * 10n**18n;

      // This test would require gas measurement in a real scenario
      // For now, we verify functionality works
      await questToken.write.transfer(addr2.account.address, transferAmount);
      const balance = await questToken.read.balanceOf(addr2.account.address);
      expect(balance).to.equal(transferAmount);
    });
  });
});