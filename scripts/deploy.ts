import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

async function main() {
  const name = process.env.SALONE_NOME || "Parrucchiere";
  const city = process.env.SALONE_CITTA || "Città";
  const network = process.env.NETWORK || "testnet";

  console.log("=== Deploy SalonRegistry ===");
  console.log("Network:", network);
  console.log("Name:", name, "City:", city);

  const Factory = await ethers.getContractFactory("SalonRegistry");
  const contract = await Factory.deploy(name, city);

  // ethers v6: attendi il deployment
  await contract.waitForDeployment();

  // ethers v6: recupera l'indirizzo
  const address = await contract.getAddress();
  console.log("Deployed at:", address);

  // salva output in deployments/
  const outDir = "deployments";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const path = `${outDir}/${network}_${Date.now()}.json`;
  fs.writeFileSync(
    path,
    JSON.stringify({ network, address, name, city, ts: new Date().toISOString() }, null, 2)
  );
  console.log("Saved:", path);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

