import { viem } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";

// Setup Hardhat environment for testing
export async function setupTestEnvironment() {
  // Initialize viem for testing
  const { viem } = await import("hardhat");

  return {
    viem,
  };
}

// Global test setup
beforeEach(async function () {
  // Setup before each test
  await setupTestEnvironment();
});