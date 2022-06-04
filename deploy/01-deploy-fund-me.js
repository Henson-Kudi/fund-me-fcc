const { network } = require("hardhat")
const {
    networksConfig,
    developmentChains,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let args

    if (chainId === 31337) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        const ethUsdPriceFeedAddress = ethUsdAggregator.address
        args = [ethUsdPriceFeedAddress]
    } else {
        const ethUsdPriceFeedAddress = networksConfig[chainId].ethUsdPriceFeed
        args = [ethUsdPriceFeedAddress]
    }

    log(`Deploying FundMe contract to ${network.name} network....`)

    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`Deployed FundMe contract to: ${fundMe.address}`)
    log("------------------------------------------------------------------")

    if (
        !developmentChains.includes(network.name) &&
        networksConfig[chainId].apiKey
    ) {
        await verify(fundMe.address, args)
    } else {
        console.log("not verified")
    }
    // if (
    //     !developmentChains.includes(network.name) &&
    //     POLYSCAN_API_KEY &&
    //     chainId === 80001
    // ) {
    //     await verify(fundMe.address, args)
    // }
}

module.exports.tags = ["all", "fundme"]
