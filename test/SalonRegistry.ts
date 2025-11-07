import { expect } from "chai";
import { ethers } from "hardhat";

describe("SalonRegistry", function () {
  it("stores name and city", async function () {
    const Factory = await ethers.getContractFactory("SalonRegistry");
    const c = await Factory.deploy("Il Parrucchiere", "Gallarate");
    await c.deployed();
    expect(await c.salonName()).to.eq("Il Parrucchiere");
    expect(await c.city()).to.eq("Gallarate");
  });
});
