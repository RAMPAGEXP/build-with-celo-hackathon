const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const WMAP_ORG = await hre.ethers.getContractFactory("WMAP_ORGANIZATION");
  const wmap_org = await WMAP_ORG.deploy();
  await wmap_org.deployed();
  console.log("wmap_org deployed to:", wmap_org.address);

  fs.writeFileSync('./src/config_org.js', `
  export const wmap_org_address = "${wmap_org.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
