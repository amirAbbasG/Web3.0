require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/lml09MWS1f8zzGRGWFZr8PWoDVxk8cUW",
      accounts: [
        "280fc0f2e294a2d000268a187671e37bb63e568e654d71c979ac13a26562bceb",
      ],
    },
  },
};
