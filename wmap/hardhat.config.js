require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "ba494574f6fc506f2fb54b5897d9af6892b6446ee6d1f0b8e48d9a55266686c3";
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "a0a5c96ef4e14c948d7fe965051867b5";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    
    celo: {
      
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [privateKey],
    },
    
   
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

