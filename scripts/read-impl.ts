// scripts/read-impl.ts
import { ethers } from "hardhat";

function usage() {
  console.log("Usage: PROXY=0x... pnpm hardhat run --network sepolia scripts/read-impl.ts");
}

async function main() {
  const proxy = process.env.PROXY;
  if (!proxy) { usage(); process.exit(1); }

  // EIP-1967 implementation slot = keccak256('eip1967.proxy.implementation') - 1
  const slot = (BigInt(ethers.keccak256(ethers.toUtf8Bytes("eip1967.proxy.implementation"))) - 1n);

  const raw = await ethers.provider.getStorage(proxy, slot);
  if (!raw || raw === "0x") throw new Error("Storage slot vuoto: controlla l'indirizzo PROXY e la rete");

  const impl = ethers.getAddress("0x" + raw.slice(26)); // ultimi 20 byte
  console.log("Implementation:", impl);

  const code = await ethers.provider.getCode(impl);
  console.log("Bytecode length:", code.length, code === "0x" ? "(NO CODE!)" : "(OK)");
}

main().catch((e) => { console.error(e); process.exit(1); });

