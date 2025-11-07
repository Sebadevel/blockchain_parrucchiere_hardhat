import { ethers, upgrades } from "hardhat";

async function main() {
  // Indirizzo del PROXY già esistente su Polygon
  const proxyAddress = "0x1317e9dc0eae1f3ef84f1157951d5629e699bc54";

  // Usa il contratto "SalonBooking" (stesso nome del file .sol)
  const SalonBooking = await ethers.getContractFactory("SalonBooking");

  console.log("⏳ Upgrading SalonBooking proxy on Polygon to new implementation (same contract name)...");

  // ethers v6 + hardhat-upgrades: upgradeProxy restituisce già l'istanza del proxy
  const upgraded = await upgrades.upgradeProxy(proxyAddress, SalonBooking);

  // In ethers v6 NON esiste più .deployed(), ma .waitForDeployment()
  await upgraded.waitForDeployment();

  const proxyAddr = await upgraded.getAddress();
  console.log("✅ Upgrade completed. Proxy is still:", proxyAddr);

  // Test: chiamiamo la nuova funzione version()
  const ver = await upgraded.version();
  console.log("New implementation version():", ver);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

