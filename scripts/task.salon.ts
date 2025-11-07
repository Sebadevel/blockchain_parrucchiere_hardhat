import { task } from "hardhat/config";

task("salon:ping", "Esempio task personalizzato").setAction(async (_, hre) => {
  console.log("pong from", hre.network.name);
});
