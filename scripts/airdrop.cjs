require("dotenv").config();

(async () => {
  const { artifacts } = await import("hardhat");
  const { createWalletClient, createPublicClient, http, parseUnits, getAddress } = await import("viem");
  const { privateKeyToAccount } = await import("viem/accounts");

  const RPC_URL = process.env.RPC_URL;
  const CHAIN_ID = Number(process.env.CHAIN_ID);
  const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

  const { abi } = await artifacts.readArtifact("CampusCreditV2");
  const chain = { id: CHAIN_ID, name:`didlab-${CHAIN_ID}`,
    nativeCurrency:{name:"ETH",symbol:"ETH",decimals:18},
    rpcUrls:{ default:{ http:[RPC_URL] } } };

  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });
  const contract = { address: TOKEN_ADDRESS, abi };

  const recipients = [ getAddress(account.address) ];
  const amounts = recipients.map(() => parseUnits("10", 18));

  console.log("Batch airdrop…");
  const hb = await wallet.writeContract({ ...contract, functionName:"airdrop", args:[recipients, amounts] });
  console.log("Batch tx:", hb);
  const rb = await publicClient.waitForTransactionReceipt({ hash: hb });
  console.log("Batch gas:", rb.gasUsed);

  let total = 0n;
  for (let i = 0; i < recipients.length; i++) {
    const h = await wallet.writeContract({ ...contract, functionName:"mint", args:[recipients[i], amounts[i]] });
    const r = await publicClient.waitForTransactionReceipt({ hash: h });
    total += r.gasUsed;
  }
  console.log("Singles total gas:", total);
})().catch((e)=>{ console.error(e); process.exit(1); });
