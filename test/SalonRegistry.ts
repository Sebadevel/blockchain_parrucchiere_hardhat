import { expect } from "chai";
import { ethers } from "hardhat";

describe("SalonRegistry", function () {
  it("stores the salon name and city", async function () {
    const Factory = await ethers.getContractFactory("SalonRegistry");
    const registry = await Factory.deploy("Il Parrucchiere", "Gallarate");
    await registry.waitForDeployment();

    expect(await registry.salonName()).to.equal("Il Parrucchiere");
    expect(await registry.city()).to.equal("Gallarate");
  });

  it("emits a booking event", async function () {
    const [, customer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SalonRegistry");
    const registry = await Factory.deploy("Il Parrucchiere", "Gallarate");
    await registry.waitForDeployment();

    await expect(registry.connect(customer).book("Haircut"))
      .to.emit(registry, "Booking");
  });
});
