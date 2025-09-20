import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    didlab: {
      url: process.env.RPC_URL || "",
      chainId: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : undefined,
    },
  },
};

export default config;
