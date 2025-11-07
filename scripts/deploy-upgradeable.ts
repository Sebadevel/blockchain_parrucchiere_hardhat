import { ethers, upgrades, network } from "hardhat";
import "dotenv/config";

async function main() {
  const feeBps = process.env.FEE_BPS ? parseInt(process.env.FEE_BPS, 10) : 300;
  const treasury = process.env.TREASURY;

  if (!treasury) throw new Error("Missing TREASURY in .env");
  if (!ethers.isAddress(treasury)) throw new Error("TREASURY is not a valid address");
  if (feeBps < 0 || feeBps > 2000) throw new Error("FEE_BPS must be between 0 and 2000");

  console.log(`Deploying SalonBooking on ${network.name} with feeBps=${feeBps}`);

  const Salon = await ethers.getContractFactory("SalonBooking");
  const proxy = await upgrades.deployProxy(Salon, [feeBps, treasury], {
    kind: "uups",
    initializer: "initialize",
  });
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  const impl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  const admin = await upgrades.erc1967.getAdminAddress(proxyAddress); // su UUPS è 0x000... (ok)

  console.log("Proxy:", proxyAddress);
  console.log("Implementation:", impl);
  console.log("ERC1967 Admin:", admin);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

