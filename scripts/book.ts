// scripts/book.ts
import { ethers } from "hardhat";

async function main() {
  // === PARAMETRI PERSONALIZZABILI ===
  const PROXY = "0x7aA88783c414bcaF9C0cD3c51976B46b6E64d5"; // indirizzo proxy
  const SERVICE = process.env.SERVICE || "taglio uomo"; // descrizione del servizio
  const VALUE_ETH = process.env.VALUE || "0.01"; // prezzo in ETH
  const DELTA_SECS = Number(process.env.DELTA || 7200); // di default tra 2 ore

  // === CALCOLA TIMESTAMP ===
  const when = Math.floor(Date.now() / 1000) + DELTA_SECS;

  // === SETUP ===
  const [me] = await ethers.getSigners();
  const sb = await ethers.getContractAt("SalonBooking", PROXY, me);

  console.log("Prenotazione da:", await me.getAddress());
  console.log("Servizio:", SERVICE);
  console.log("Importo ETH:", VALUE_ETH);
  console.log("Data (timestamp):", when);

  // === TRANSAZIONE ===
  const tx = await sb.book(when, SERVICE, {
    value: ethers.parseEther(VALUE_ETH),
    gasLimit: 200_000,
  });

  console.log("tx:", tx.hash);
  const rc = await tx.wait();
  console.log("✅ Prenotazione confermata al blocco:", rc?.blockNumber);

  const lastId = await sb.lastBookingId();
  console.log("🆕 ID prenotazione:", lastId.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

