const { ethers } = require("hardhat");

async function main() {
  // Get the contract factories and signer
  const [deployer] = await ethers.getSigners();
  const MyContract = await ethers.getContractFactory("MAW");

  // Deploy the contract
  const myContract = await MyContract.deploy();

  console.log(myContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });