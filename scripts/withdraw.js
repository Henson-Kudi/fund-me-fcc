const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()

    const fundMe = await ethers.getContract("FundMe", deployer)

    console.log("Withdrawing funds. Please wait")

    const transactionResponse = await fundMe.withdraw()

    await transactionResponse.wait(1)

    console.log("Withdrew funds successfully")
}

main()
    .then(() => process.exit(0))
    .catch((err) => console.log(err))
