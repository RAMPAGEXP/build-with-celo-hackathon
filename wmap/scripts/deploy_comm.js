const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const WMAP_COMM = await hre.ethers.getContractFactory("WMAP_COMMUNITY");
  const wmap_comm = await WMAP_COMM.deploy();
  await wmap_comm.deployed();
  console.log("wmap_comm deployed to:", wmap_comm.address);

  fs.writeFileSync('./src/config_comm.js', `
  export const wmap_comm_address = "${wmap_comm.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
