const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../../helper-hardhat-config")

developmentChains.includes(network.name) &&
    describe("FundMe", async function () {
        let fundMe, deployer, mockV3Aggregator

        const sendValue = ethers.utils.parseEther("1")

        // before each test is runned, we want to deploy our smart contract first
        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer //gets the account used to deploy the smart contract.

            // this commented code below can also be used in place of deployer code above

            // const accounts = await ethers.getSigners()
            // const deployer = accounts[0]

            await deployments.fixture(["all"]) //the tags in deployment files helps us to deploy the smart contracts easily

            fundMe = await ethers.getContract("FundMe", deployer) //gets the FundMe contract

            mockV3Aggregator = await ethers.getContract(
                "MockV3Aggregator",
                deployer
            )
        })

        describe("Constructor", async function () {
            it("Should set the AggregatorV3Interface priceFeed and also the only owner", async function () {
                const priceFeed = await fundMe.s_priceFeed()
                const onlyOwner = await fundMe.i_owner()

                assert.equal(
                    priceFeed,
                    mockV3Aggregator.address,
                    "PriceFeed is not equal to mockV3Aggregator"
                )
                assert.equal(
                    onlyOwner,
                    deployer,
                    "FundMe address is not equal to i_owner variable in smart contract"
                )
            })
        })

        describe("Fund", async () => {
            it("Should fail if the less than $50 is sent", async () => {
                await expect(fundMe.fund()).to.be.reverted
            })

            it("Should get addressToAmountFunded of the funders and it should equal deployer address since we used deployer to fund", async () => {
                await fundMe.fund({ value: sendValue })

                const addressToAmountFunded =
                    await fundMe.s_addressToAmountFunded(deployer)

                assert.equal(
                    addressToAmountFunded.toString(),
                    sendValue.toString(),
                    "addressToAmountFunded does not equal sendValue"
                )
            })

            it("Should get the first funder and its address must be equal to deployer address", async () => {
                await fundMe.fund({ value: sendValue })

                const firstFunder = await fundMe.s_funders(0)

                assert.equal(
                    firstFunder,
                    deployer,
                    "firstFunder does not equal deployer"
                )
            })
        })

        describe("Withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })

            it("Should revert if the sender is not the owner", async () => {
                await expect(
                    fundMe.withdraw({
                        sender: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
                    })
                ).to.be.reverted
            })

            it("withdraw all the funds from smart contract and send to the owner of the contract", async () => {
                const startingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )

                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer)

                const transactionRes = await fundMe.withdraw()

                const transactionReceipt = await transactionRes.wait(1)

                // from the transactionReceipt we can grab the gas used and effective gas price which we'll use to calculate gasCost. Since the contract spent some gas to withdraw the money to another account. Having the gas cost helps us to add to ending deployer balance so that it equals our assertions

                const { effectiveGasPrice, gasUsed } = transactionReceipt
                const gasCost = effectiveGasPrice.mul(gasUsed)

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )

                const endingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                assert.equal(
                    endingFundMeBalance,
                    0,
                    "fundMe balance needs to be zero at the end of withdrawal"
                )
                assert.equal(
                    startingDeployerBalance
                        .add(startingFundMeBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString(),
                    "deployer balance needs to be more at the end of withdrawal"
                )
            })

            it("Should allow withdrawal with multiple funders", async () => {
                const accounts = await ethers.getSigners()
                for (let i = 1; i < 6; i++) {
                    const account = accounts[i]
                    const connectedAccount = await fundMe.connect(account)

                    await connectedAccount.fund({ value: sendValue })
                }

                const startingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )

                const startingDeployerBalance =
                    await fundMe.provider.getBalance(deployer)

                const transactionRes = await fundMe.withdraw()
                const transReceipt = await transactionRes.wait(1)
                const { gasUsed, effectiveGasPrice } = transReceipt
                const gasCost = effectiveGasPrice.mul(gasUsed)

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )

                const endingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                assert.equal(
                    endingFundMeBalance,
                    0,
                    "fundMe balance needs to be zero at the end of withdrawal"
                )

                assert.equal(
                    startingDeployerBalance
                        .add(startingFundMeBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString(),
                    "deployer balance needs to be more at the end of withdrawal"
                )

                await expect(fundMe.s_funders(0)).to.be.reverted

                for (let i = 1; i < 6; i++) {
                    const account = accounts[i]

                    assert.equal(
                        await fundMe.s_addressToAmountFunded(account.address),
                        0,
                        "accounts to address at index must be zero"
                    )
                }
            })
        })
    })
