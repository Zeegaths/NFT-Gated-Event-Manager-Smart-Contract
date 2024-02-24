import { ethers } from "hardhat";

async function main() {


  const nft = await ethers.deployContract("ZarahNft");

  await nft.waitForDeployment();

  console.log(
    `NFT deployed to ${nft.target}`
  );


  const eventNft = await ethers.deployContract("NftGatedEvent");

  await eventNft.waitForDeployment();

  console.log(
    `EventNft depoyed to ${eventNft.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
