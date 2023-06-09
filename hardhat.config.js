/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.17",
  paths:{
    artifacts:"./contracts/build/artifacts",
    cache:"./contracts/build/cache"
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [ "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" ]
    },
    local_subnet: {
      url: process.env.PROVIDER_URL,
      accounts: [ "56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027" ]
    }
  }
};