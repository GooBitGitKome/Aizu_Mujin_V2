const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  it("just test functions in this contract", async function () {
    const [owner] = await ethers.getSigners();
    const contract = await ethers.deployContract("AizuMujin");
    console.log("owner.address: ", owner.address);
    console.log("contract.address: ", contract.target);
    await contract.faucet();
    const ownerBalance = await contract.balanceOf(owner.address);
    console.log("ownerBalance: ", ownerBalance);
    await contract.send(50);
    const contractBalance = await contract.balanceOf(contract.target);
    console.log("contractBalance: ", contractBalance);
    console.log(await contract.symbol());
    console.log('finished');
    // expect(await contract.totalSupply()).to.equal(ownerBalance);
  });
});