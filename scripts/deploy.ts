import { ethers } from "hardhat";

async function main() {
  const votingSystem = await ethers.deployContract("VotingSystem", []);
  await votingSystem.waitForDeployment();
  console.log(`Voting System contract is deployed to ${votingSystem.target}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
