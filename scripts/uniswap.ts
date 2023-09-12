import { ethers } from "hardhat";

async function main() {
  // Contract Addresses
  const uniswapAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  // Recipient Address (mine)
  const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  // Accounts I am Impersonating (Vitalik's lol)
  // const WETHHolder = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  const DAIHolder = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  const USDTHolder = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const deadline = currentTimestampInSeconds + 86400;

  const uniswap = await ethers.getContractAt("IUniswap", uniswapAddress);
  const DAIContract = await ethers.getContractAt("IERC20", DAIAddress);
  const USDTContract = await ethers.getContractAt("IERC20", USDTAddress);
  // const WETH = await uniswap.WETH();

  // The impersonation
  const amountMax = ethers.parseEther("100");

  const DAISigner = await ethers.getImpersonatedSigner(DAIHolder);
  await DAIContract.connect(DAISigner).approve(uniswapAddress, amountMax);

  const USDTSigner = await ethers.getImpersonatedSigner(USDTHolder);
  await USDTContract.connect(USDTSigner).approve(uniswapAddress, amountMax);

  // Adding liquidity
  const amountADesired = ethers.parseEther("50");
  const amountBDesired = ethers.parseEther("50");
  const amountAmin = ethers.parseEther("0");
  const amountBmin = ethers.parseEther("0");

  await uniswap
    .connect(DAISigner)
    .addLiquidity(
      DAIAddress,
      USDTAddress,
      amountADesired,
      amountBDesired,
      amountAmin,
      amountBmin,
      to,
      deadline
    );

  // Liquidity Contract Interactions
  const factory = await uniswap.factory();
  const uniswapFactory = await ethers.getContractAt(
    "IUniswapV2Factory",
    factory
  );

  const pairAddress = await uniswapFactory.getPair(DAIAddress, USDTAddress);

  console.log(`The pair contract address is: ${pairAddress}`);

  const pairContract = await ethers.getContractAt("IERC20", pairAddress);
  await pairContract.connect(USDTSigner).approve(uniswapAddress, amountMax);
  console.log(
    `Liquidity Balance of Signer held in Pair Contract before removal ${await pairContract.balanceOf(
      DAISigner
    )}`
  );

  // Removing liquidity
  const liquidity = await pairContract.balanceOf(DAISigner);
  await uniswap
    .connect(DAISigner)
    .removeLiquidity(
      DAIAddress,
      USDTAddress,
      liquidity,
      amountAmin,
      amountBmin,
      to,
      deadline
    );
  console.log(
    `Liquidity Balance of Signer held in Pair Contract after removal ${await pairContract.balanceOf(
      DAISigner
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
