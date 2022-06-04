const { network } = require("hardhat")
const { verify } = require("./verify")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async (chainId, apiKey, address, args) => {
    if (!developmentChains.includes(network.name) && apiKey && chainId === 4) {
        await verify(address, args)
    }
}
