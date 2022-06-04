const { network, getNamedAccounts, ethers } = require("hardhat")
const {
    networksConfig,
    developmentChains,
} = require("../helper-hardhat-config")

async function main() {
    const { deployer } = await getNamedAccounts()

    const fundMe = await ethers.getContract("FundMe", deployer)

    console.log("Funding contract. Please wait")

    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("1"),
    })

    await transactionResponse.wait(1)

    console.log("Funded contract successfully")
}

main()
    .then(() => process.exit(0))
    .catch((err) => console.log(err))
