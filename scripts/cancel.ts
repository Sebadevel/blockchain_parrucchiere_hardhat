// scripts/cancel.ts
import { ethers } from "hardhat";

async function main() {
  const PROXY = "0x7aA88783c414bcaF9C0cD3c51976B46b6E64d5";
  const BOOKING_ID = Number(process.env.ID || 1);

  const [me] = await ethers.getSigners();
  const sb = await ethers.getContractAt("SalonBooking", PROXY, me);

  console.log("Signer:", await me.getAddress());
  console.log("Cancel id:", BOOKING_ID);

  const tx = await sb.cancelBooking(BOOKING_ID, { gasLimit: 200_000 });
  console.log("tx:", tx.hash);
  const rc = await tx.wait();
  console.log("confirmed in block:", rc?.blockNumber);

  const b = await sb.bookings(BOOKING_ID);
  console.log("Booking completed flag:", b.completed);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

