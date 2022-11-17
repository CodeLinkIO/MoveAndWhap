/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.17",
  paths:{
    artifacts:"./contracts/build/artifacts",
    cache:"./contracts/build/cache"
  }
};