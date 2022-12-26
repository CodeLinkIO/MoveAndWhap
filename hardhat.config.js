/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const fujiURL = process.env.PROVIDER_URL;
const fujiKey = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.17",
  paths:{
    artifacts:"./contracts/build/artifacts",
    cache:"./contracts/build/cache"
  },
  networks: {
    fuji: {
      url: fujiURL,
      accounts: [fujiKey]
    }
  }
};