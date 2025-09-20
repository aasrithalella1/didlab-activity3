require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox-viem");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: { version: "0.8.24", settings: { optimizer: { enabled: true, runs: 200 } } },
  networks: {
    // Local dev chain (new HH v3 engine)
    hardhat: { type: "edr-simulated", chainId: 31342 },

    // Remote DIDLab chain (keep this for later)
    didlab: {
      type: "http",
      url: process.env.RPC_URL || "",
      chainId: process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : undefined,
    },
  },
};
