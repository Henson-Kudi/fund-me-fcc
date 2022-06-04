require("dotenv").config()

const { ETHERSCAN_API_KEY, POLYSCAN_API_KEY, BSCSCAN_API_KEY } = process.env

const networksConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
        apiKey: ETHERSCAN_API_KEY,
    },
    // 1: {
    //     name: "ethereum",
    //     ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    //     apiKey: ETHERSCAN_API_KEY,
    // },
    // 137: {
    //     name: "polygon",
    //     ethUsdPriceFeed: "0xDf3f72Be10d194b58B1BB56f2c4183e661cB2114",
    // },
    // 43114: {
    //     name: "avalanche",
    //     ethUsdPriceFeed: "0x976B3D034E162d8bD72D6b9C989d545b839003b0",
    // },
    // 56: {
    //     name: "binance",
    //     ethUsdPriceFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
    // },
    // 97: {
    //     name: "binance-testnet",
    //     ethUsdPriceFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
    //     apiKey: BSCSCAN_API_KEY,
    // },
    // 42: {
    //     name: "kovan",
    //     ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    //     apiKey: ETHERSCAN_API_KEY,
    // },
    // 80001: {
    //     name: "polygon-mumbai",
    //     ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    //     apiKey: POLYSCAN_API_KEY,
    // },
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const initialAnswer = 200000000000

module.exports = { networksConfig, developmentChains, DECIMALS, initialAnswer }
