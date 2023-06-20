/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

var local_rpc_uri = process.env.RPC_URI || "http://127.0.0.1:9650/ext/bc/C/rpc"

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
      url: local_rpc_uri,
      accounts: [
        "ef5177cd0b6b21c87db5a0bf35d4084a8a57a9d6a064f86d51ac85f2b873a4e2",
        "48fcc39ae27a0e8bf0274021ae6ebd8fe4a0e12623d61464c498900b28feb567",
        "7988b3a148716ff800414935b305436493e1f25237a2a03e5eebc343735e2f31",
        "b3c409b6b0b3aa5e65ab2dc1930534608239a478106acf6f3d9178e9f9b00b35",
        "df9bb6de5d3dc59595bcaa676397d837ff49441d211878c024eabda2cd067c9f",
        "7da08f856b5956d40a72968f93396f6acff17193f013e8053f6fbb6c08c194d6",
      ]
    },

  }
};