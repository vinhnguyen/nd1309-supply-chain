App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    file: "",
    // fromDoctorID: "0x0000000000000000000000000000000000000000",
    forPatientID: "",
    price: 0,
    updatedSKU: "",
    boughtSKU: "",
    skuPrice: "",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.file = $("#fileID").val();
        // App.fromDoctorID = $("#doctorID").val();
        App.forPatientID = $("#patientID").val();
        App.price = $("#price").val();
        App.updatedSKU = $("#updateSKU").val();
        App.boughtSKU = $("#boughtSKU").val();
        App.skuPrice = $("#skuPrice").val();

        console.log(
            "App.sku",
            App.sku,
            "App.file", 
            App.file, 
            "App.forPatientID", 
            App.forPatientID, 
            "App.price",
            App.price,
            "App.updatedSKU",
            App.updatedSKU,
            "App.boughtSKU",
            App.boughtSKU,
            "App.skuPrice",
            App.skuPrice
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
             App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          // App.web3Provider = new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws'));
        }

        App.getMetaskAccountID();
        web3.eth.defaultAccount = web3.eth.accounts[0];

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            // console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        App.readForm();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.createMDR(event);
                break;
            case 2:
                return await App.updateMDR(event);
                break;
            case 3:
                return await App.payMDR(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            }
    },

    createMDR: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.createMDR(
                App.sku, 
                App.file, 
                App.forPatientID
            );
        }).then(function(result) {
            // $("#ftc-item").text(result);
            console.log('createMDR',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    updateMDR: function (event) {
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.updateMDR(
                App.updatedSKU,
                App.file,
                App.skuPrice);
        }).then(function(result) {
            // $("#ftc-item").text(result);
            console.log('updateMDR',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    payMDR: function (event) {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.payMDR(
                App.boughtSKU,
                App.skuPrice
                );
        }).then(function(result) {
            // $("#ftc-item").text(result);
            console.log('payMDR',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
