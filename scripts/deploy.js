import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const SoulboundDiploma = await ethers.getContractFactory("SoulboundDiploma");
  const contract = await SoulboundDiploma.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SoulboundDiploma deployed to:", address);
  console.log(`npx hardhat verify --network sepolia ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
