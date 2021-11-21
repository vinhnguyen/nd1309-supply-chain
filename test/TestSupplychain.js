// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')


contract('SupplyChain',  function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    const ownerID = accounts[0]
    const doctorID = accounts[1]
    const patientID = accounts[2]
    const skuPrice = web3.toWei("1", "ether")
    var itemState = 0
    const emptyAddress = '0x00000000000000000000000000000000000000'

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("DoctorID: accounts[1] ", accounts[1])
    console.log("PatientID: accounts[2] ", accounts[2])
    
    it("Testing smart contract createMDR() that allows a doctor to create a Medical Record", async() => {
        const supplyChain = await SupplyChain.deployed()
        await supplyChain.addDoctor(doctorID);
        await supplyChain.addPatient(patientID);
            
        // Declare and Initialize a variable for event
        var eventEmitted = false
       
        var event = supplyChain.Initialized()
        await event.watch((err, data) => {
            eventEmitted = true;
        });

        var fileId = "file-id";

        await supplyChain.createMDR(1, fileId , patientID);
        const mdr = await supplyChain.fetchMDR(1);

        assert.equal(eventEmitted, true, 'Invalid event emitted');
        assert.equal(mdr[0], 1, 'Invalid item SKU');
        assert.equal(mdr[1], fileId, 'Invalid item file Id');
        assert.equal(mdr[2], ownerID, 'Invalid item ownerId');
        assert.equal(mdr[3], ownerID, 'Invalid doctor');
        assert.equal(mdr[4], patientID, 'Invalid patient');
        assert.equal(mdr[5], 0, 'Invalid item status');
        assert.equal(mdr[6], 0, 'Invalid item price');

    });

    it("Testing smart contract updateMDR() that allows a doctor to update an existing MDR", async() => {
        const supplyChain = await SupplyChain.deployed()
        const doctor2 = accounts[2];
        const patient2 = accounts[3];
        await supplyChain.addDoctor(doctor2);
        await supplyChain.addPatient(patient2);
            
        var fileId = "file-id";
        var fileIdUpdated = "file-id updated";
        var price = 0.0001;

       
        await supplyChain.createMDR(2, fileId , patient2);
        await supplyChain.updateMDR(2, fileIdUpdated , price);
        const mdr = await supplyChain.fetchMDR(2);

        assert.equal(mdr[0], 2, 'Invalid item SKU');
        assert.equal(mdr[1], fileIdUpdated, 'Invalid item file Id');
        assert.equal(mdr[2], ownerID, 'Invalid item ownerId');
        assert.equal(mdr[3], ownerID, 'Invalid doctor');
        assert.equal(mdr[4], patient2, 'Invalid patient');

    });

    it("Testing smart contract shareMDR() from a patient", async() => {
        const supplyChain = await SupplyChain.deployed()
        const doctorId = accounts[4];
        const patientId = accounts[5];
        await supplyChain.addDoctor(doctorId);
        await supplyChain.addPatient(patientId);
            
        var sku = 3;
        var fileId = "file-id";
        var fileIdUpdated = "file-id updated";
        var price = 0.0001;

       
        await supplyChain.createMDR(sku, fileId , patientId);
        await supplyChain.shareMDR(sku, doctorId);
        var canRead = await supplyChain.canReadMDR(sku, doctorId);
        var readers = await supplyChain.fetchReaders(sku);

        assert.equal(canRead, true, 'Invalid permission');
    })

});

