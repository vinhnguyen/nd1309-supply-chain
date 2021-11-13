
const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fee2c801f66c4e9a9ea3d4dd3e5ecbfe";


// const fs = require('fs');
//  const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
     // websockets: true
    },
  
  // rinkeby: {
  //   provider: new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
  //   network_id: 4,       // Rinkeby id
  //   gas: 4500000,        // Rinkeby has a lower block limit than mainnet
  //   confirmations: 2,    // # of confs to wait between deployments. (default: 0)
  //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
  //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
  //   },
  // },
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
}
};