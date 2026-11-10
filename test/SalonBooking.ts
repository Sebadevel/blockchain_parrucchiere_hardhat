import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("SalonBooking (prototype)", function () {
  async function deployFixture() {
    const [owner, customer, outsider, treasury] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SalonBooking");
    const booking = await upgrades.deployProxy(Factory, [300, treasury.address], {
      initializer: "initialize",
      kind: "uups",
    });
    await booking.waitForDeployment();
    return { booking, owner, customer, outsider, treasury };
  }

  it("initializes fees and treasury", async function () {
    const { booking, owner, treasury } = await deployFixture();
    expect(await booking.owner()).to.equal(owner.address);
    expect(await booking.feeBps()).to.equal(300n);
    expect(await booking.treasury()).to.equal(treasury.address);
  });

  it("records a paid booking and its customer", async function () {
    const { booking, customer } = await deployFixture();
    const when = BigInt((await time.latest()) + 3600);
    const amount = ethers.parseEther("0.1");

    await expect(booking.connect(customer).book(when, "", { value: amount }))
      .to.emit(booking, "Booked")
      .withArgs(1n, customer.address, when, amount);

    const record = await booking.bookings(1);
    expect(record.user).to.equal(customer.address);
    expect(record.amount).to.equal(amount);
    expect(record.cancelled).to.equal(false);
    expect(await booking.bookingsOf(customer.address)).to.deep.equal([1n]);
  });

  it("rejects zero-value or too-soon bookings", async function () {
    const { booking, customer } = await deployFixture();
    const now = await time.latest();
    await expect(booking.connect(customer).book(now + 3600, "", { value: 0 }))
      .to.be.revertedWith("no value");
    await expect(booking.connect(customer).book(now + 60, "", { value: 1 }))
      .to.be.revertedWith("when too soon");
  });

  it("prevents another customer from cancelling or rescheduling", async function () {
    const { booking, customer, outsider } = await deployFixture();
    const when = BigInt((await time.latest()) + 3600);
    await booking.connect(customer).book(when, "", { value: ethers.parseEther("0.1") });
    await expect(booking.connect(outsider).cancelBooking(1))
      .to.be.revertedWith("not your booking");
    await expect(booking.connect(outsider).rescheduleBooking(1, when + 1800n))
      .to.be.revertedWith("not your booking");
  });

  it("cancels a future booking and pays the configured fee", async function () {
    const { booking, customer, treasury } = await deployFixture();
    const when = BigInt((await time.latest()) + 3600);
    const amount = ethers.parseEther("1");
    const fee = (amount * 300n) / 10_000n;
    await booking.connect(customer).book(when, "", { value: amount });
    const before = await ethers.provider.getBalance(treasury.address);

    await expect(booking.connect(customer).cancelBooking(1))
      .to.emit(booking, "Cancelled")
      .withArgs(1n, customer.address, amount - fee);

    expect((await booking.bookings(1)).cancelled).to.equal(true);
    expect(await ethers.provider.getBalance(treasury.address)).to.equal(before + fee);
    expect(await ethers.provider.getBalance(await booking.getAddress())).to.equal(0n);
    await expect(booking.connect(customer).cancelBooking(1))
      .to.be.revertedWith("already cancelled");
  });

  it("restricts fee changes to the owner", async function () {
    const { booking, outsider, treasury } = await deployFixture();
    await expect(booking.connect(outsider).setFeeParams(100, treasury.address))
      .to.be.reverted;
    await expect(booking.setFeeParams(2001, treasury.address))
      .to.be.revertedWith("fee too high");
  });
});
