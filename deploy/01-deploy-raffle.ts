import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";
import { verify } from "../utils/verify";

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2");

export const deployRaffle = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let vrfCoordinatorV2Address: string;
  let subscriptionId: string;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId;
    // Fund the subscription
    // Usually, you'd need the link token on a real network
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[network.name].vrfCoordinatorV2!;
    subscriptionId = networkConfig[network.name].subscriptionId!;
  }

  log("subscriptionId:", subscriptionId);

  const entraceFee = networkConfig[network.name].entranceFee!;
  const gasLane = networkConfig[network.name].gasLane!;
  const callbackGasLimit = networkConfig[network.name].callbackGasLimit!;
  const interval = networkConfig[network.name].interval!;

  const args = [
    vrfCoordinatorV2Address,
    entraceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    interval,
  ];
  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(raffle.address, args);
    log("--------------------------------------");
  }
};

export default deployRaffle;
deployRaffle.tags = ["all", "raffle"];
