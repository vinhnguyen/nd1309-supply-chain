# Supply chain & data auditing

This repository shows a supply chain DAPP. 

## Contract address and transaction hash

This project was deployed on the rinkeby testnet.

```
 transaction hash:  0x22568749da81003da2a20b0a34d80909eb38be564598af9dd60f714ec0483113

 contract address:  0xcB403AcF4A6FC1819e7b1C84BF6066d38B2Ee274

```

## UML Diagrams
Activity Diagram
![activity Diagram](images/activity.png)

Sequence Diagram
![sequence Diagram](images/sequence.png)

State Diagram
![state Diagram](images/state.png)

Class Diagram
![class Diagram](images/class.png)




###  Runing the project

Truffle is used in this project because it makes development easier
and also it is an asset pipeline for ethereum

Web3.js is a collection of libraries for interacting with an ethereum node


versions used:

node v14.17.5,

truffle v4.1.17,

web3 v0.20.7

Install packages

```
npm install

npm install -g truffle@4.1.17

```


Connect to the ganache-cli

```
ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"

```

Delete the build folder and compile again

```
truffle compile

```
Test smart contract

```
truffle test
```
All 10 tests should pass (but it depends on the solidity version)


To Migrate smart contracts to the rinkeby:

```
truffle migrate --network rinkeby

```

## Running the frontend


```
npm run dev

```


Available Accounts obtained from ganache phrase above

    ```
Contract Owner -   (0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95

Doctor         -   (1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a

Patient    -   (2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    
    ```



