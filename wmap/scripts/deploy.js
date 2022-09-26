const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const WMAP = await hre.ethers.getContractFactory("WMAP");
  const wmap = await WMAP.deploy();
  await wmap.deployed();
  console.log("wmap deployed to:", wmap.address);

  fs.writeFileSync('./src/config.js', `
  export const wmap = "${wmap.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
