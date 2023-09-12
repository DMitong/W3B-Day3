import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config'
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
  //   base: {
  //     url: process.env.BASERPC,
  //     //@ts-ignore
  //     accounts: [process.env.PRIVATEKEY],
//  networks: {
    // sepolia: {
      // url: process.env.SEPOLIARPC,
      // //@ts-ignore
      // accounts: [process.env.PRIVATEKEY],

    // },
    hardhat: {
      forking: {
        url: process.env.MAINNETRPC!,
     }
    }
 },
};

export default config;