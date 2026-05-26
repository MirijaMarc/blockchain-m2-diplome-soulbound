import hre from "hardhat";

const ADDRESS = "0xb5adEfcaB5A163336B86b5dDE4436a934a126F01";

async function main() {
  const contract = await hre.ethers.getContractAt("SoulboundDiploma", ADDRESS);
  console.log("Owner:", await contract.owner());
}

main();
