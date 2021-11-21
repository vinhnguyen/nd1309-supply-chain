
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "a0bdfa8f1ea9439596c4583ed957aa09";
const mnemonic = "cram duty imitate truly pride antenna join arch shadow know equip vintage";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
     // websockets: true
    },
  
  rinkeby: {
    provider: new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
    network_id: 4,       // Rinkeby id
    gas: 4500000,        // Rinkeby has a lower block limit than mainnet
    }
  },
  compilers: {
    solc: {
       version: "^0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  }
};