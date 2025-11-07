// scripts/book.direct.ts
import { JsonRpcProvider, Wallet, parseEther, Contract, getAddress } from "ethers";
import * as dotenv from "dotenv";
import { artifacts } from "hardhat";
dotenv.config();

async function main() {
  // Usa ENV oppure fallback; TRIM e normalizza l'indirizzo
  const RAW_PROXY = (process.env.PROXY || "0xf7aA887834c14bcaF9C0c0d3c5196784cb66E4d5").trim();
  const PROXY = getAddress(RAW_PROXY); // <-- valida e normalizza (se non è address, lancia errore)

  const SERVICE = process.env.SERVICE || "taglio uomo";
  const VALUE_ETH = process.env.VALUE || "0.01";
  const DELTA_SECS = Number(process.env.DELTA || 7200);

  const when = Math.floor(Date.now() / 1000) + DELTA_SECS;

  const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL!);
  const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);

  const artifact = await artifacts.readArtifact("SalonBooking");
  const sb = new Contract(PROXY, artifact.abi, wallet);

  console.log("Prenotazione da:", wallet.address);
  console.log("PROXY:", PROXY);
  console.log("Servizio:", SERVICE);
  console.log("Importo ETH:", VALUE_ETH);
  console.log("when:", when);

  const tx = await sb.book(when, SERVICE, {
    value: parseEther(VALUE_ETH),
    gasLimit: 200_000,
  });
  console.log("tx:", tx.hash);
  const rc = await tx.wait();
  console.log("Confermata al blocco:", rc?.blockNumber);

  const lastId = await sb.lastBookingId();
  console.log("Nuovo ID:", lastId.toString());
}

main().catch((e) => { console.error(e); process.exit(1); });

