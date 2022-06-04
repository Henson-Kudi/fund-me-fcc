const { network } = require("hardhat")
const {
    networksConfig,
    developmentChains,
    DECIMALS,
    initialAnswer,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("Development chain detected...\n Deploying mock contracts...")

        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, initialAnswer],
        })

        log("MockV3Aggregator deployed successfully.")

        log("-------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
