const { ethers, upgrades } = require("hardhat");

async function main() {
  const NewImplementation = await ethers.getContractFactory("SalonBookingV2");
  const proxyAddress = "0x1317e9dc0eae1f3ef84f1157951d5629e699bc54";

  console.log("Upgrading proxy to new implementation...");
  await upgrades.upgradeProxy(proxyAddress, NewImplementation);
  console.log("✅ Upgrade complete!");
}

main();

