// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const AconomyDrop = await hre.ethers.getContractFactory("AconomyDrop");
  const instance = await AconomyDrop.deploy("0xf02c627B3Ae533D488cb25F072e542ee7CCc1D10");

  await instance.deployed();

  console.log(
    `Drop deployed to ${instance.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
