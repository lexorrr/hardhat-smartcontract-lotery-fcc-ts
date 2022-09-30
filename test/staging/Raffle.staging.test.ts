import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Tests", () => {
      let raffle: Raffle;
      let raffleEntranceFee: BigNumber;
      let deployer: string;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Raffle", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe("fulfillRandomWords", async () => {
        it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
          // enter the raffle
          const startingTimeStamp = await raffle.getLatestTimestamp();
          const accounts = await ethers.getSigners();

          console.log("Setting up listeners");
          // setup listener befor we enter the raffle
          // Just in case the blockchain moves REALLY fast
          await new Promise<void>(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("WinnerPicked event fired!");

              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerBalance = await accounts[0].getBalance();
                const endingTimestamp = await raffle.getLatestTimestamp();

                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(raffleState, 0);
                assert.equal(
                  winnerBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee).toString()
                );
                assert(endingTimestamp > startingTimeStamp);
                resolve();
              } catch (error) {
                console.log(error);
                reject(error);
              }
            });

            console.log("Entering raffle...");

            // Then entering the raffle
            const tx = await raffle.enterRaffle({ value: raffleEntranceFee });
            await tx.wait(1);
            const winnerStartingBalance = await accounts[0].getBalance();

            // and this code WONT complete until our listener has finished listening
          });
        });
      });
    });
