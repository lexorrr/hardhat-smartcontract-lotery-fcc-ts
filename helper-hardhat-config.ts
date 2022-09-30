import { ethers } from "hardhat";

export interface networkConfigItem {
  vrfCoordinatorV2?: string;
  blockConfirmations?: number;
  entranceFee?: string;
  gasLane?: string;
  subscriptionId?: string;
  callbackGasLimit?: string;
  interval?: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {
    entranceFee: ethers.utils.parseEther("0.01").toString(),
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "500000",
    interval: "30",
  },
  hardhat: {
    entranceFee: ethers.utils.parseEther("0.01").toString(),
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "500000",
    interval: "30",
  },
  goerli: {
    blockConfirmations: 6,
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    entranceFee: ethers.utils.parseEther("0.01").toString(),
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "2982",
    callbackGasLimit: "500000",
    interval: "30",
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const DECIMALS = 18;
export const INITIAL_ANSWER = "2000000000000000000000";
