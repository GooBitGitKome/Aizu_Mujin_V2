import { ethers } from "hardhat";
import fs from 'fs';
import * as dotenv from "dotenv";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contract = await ethers.deployContract("AizuMujin");
  
  const contractAddress = await contract.getAddress();
  let addressJson ={
    "deployer": deployer.address,
    "address": contractAddress
  };

  let data = JSON.stringify(addressJson);
  fs.writeFileSync(`${process.env.FILEPATH}hardhat/artifacts/contracts/AizuMujin.sol/contractAddress.json`, data);
  console.log("Contract deployer:", deployer.address);
  console.log("Contract deployed to:", contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
