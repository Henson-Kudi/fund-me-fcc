const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name) &&
    describe("FundMe", async function () {
        let fundMe, deployer

        const sendValue = ethers.utils.parseEther("1")

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("Lets people to fund and withdraw", async () => {
            await fundMe.fund({ value: sendValue })

            await fundMe.withdraw()

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            assert.equal(endingFundMeBalance.toString(), "0", "Should be zero")
        })
    })
