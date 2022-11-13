
const hre = require("hardhat");
const fs = require('fs');


async function main() {
  const WMAP_TOKEN = await hre.ethers.getContractFactory("WMAPToken");
  const wmap_token = await WMAP_TOKEN.deploy("10000000000000000000000000000");
  await wmap_token.deployed();
  console.log("wmap_token deployed to:", wmap_token.address);

  fs.writeFileSync('./src/config_token.js', `
  export const wmap_token_address = "${wmap_token.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
