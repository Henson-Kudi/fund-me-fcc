require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

const {
    COINMARKETCAP_API_KEY,
    RPC_URL: RINKEBY_RPC_URL,
    POLYGON_MUMBAI_URL,
    POLYSCAN_API_KEY,
    PRIVATE_KEY,
    ETHERSCAN_API_KEY,
    BSCSCAN_API_KEY,
    BSC_RPC_URL,
    KOVAN_RPC_URL,
} = process.env

// const RINKEBY_RPC_URL = process.env.RPC_URL

// const POLYGON_MUMBAI_URL = process.env.POLYGON_MUMBAI_URL

// const PRIVATE_KEY = process.env.PRIVATE_KEY

// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.6.6",
            },
            {
                version: "0.8.8",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 42,
            blockConfirmations: 6,
        },
        polygon_mumbai: {
            url: POLYGON_MUMBAI_URL,
            accounts: [PRIVATE_KEY],
            chainId: 80001,
            blockConfirmations: 6,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
        },
        bsc: {
            url: BSC_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 97,
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        // outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    etherscan: {
        apiKey: {
            // ethereum mainnet
            mainnet: ETHERSCAN_API_KEY,
            // rinkeby testnet
            rinkeby: ETHERSCAN_API_KEY,
            // kovan testnet
            kovan: ETHERSCAN_API_KEY,
            // polygon testnet
            polygonMumbai: POLYSCAN_API_KEY,
            // binance testnet
            bscTestnet: BSCSCAN_API_KEY,
        },
    },
}
