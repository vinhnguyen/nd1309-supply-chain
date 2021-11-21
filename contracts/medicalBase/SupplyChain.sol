pragma solidity ^0.4.24;

import "@nomiclabs/buidler/console.sol";
import "../medicalAccesscontrol/PatientRole.sol";
import "../medicalAccesscontrol/DoctorRole.sol";
import "../medicalCore/Ownable.sol";

// Define a contract 'Supplychain'
contract SupplyChain is DoctorRole, PatientRole {
    // Define 'owner'
    address owner;

    // Define a variable called 'sku' for Stock Keeping Unit (SKU)
    uint256 sku;

    // maintain the list of doctors who can access to one medical record (SKU)
    mapping(uint256 => address[]) public readers;

    // Define enum 'State' with the following values:
    enum State {
        Initialized, // 0
        Updating, // 1
        Complete // 2
    }

    State constant defaultState = State.Initialized;

    // Define a struct 'Item' with the following fields:
    struct MedicalRecord {
        uint256 sku;
        string file;
        address owner; // can be doctor or patient depends on the status of the item
        address fromDoctor;
        address forPatient;
        State status;
        uint256 price;
    }

    mapping(uint256 => MedicalRecord) items;

    event Initialized(uint256 sku);
    event Updated(uint256 sku);
    event Completed(uint256 sku);

    // Define a modifer that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller(address _address) {
        require(msg.sender == _address);
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint256 _price) {
        require(msg.value >= _price);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Harvested
    modifier initialized(uint256 _sku) {
        require(items[_sku].status == State.Initialized);
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Processed
    modifier updating(State _state) {
        require(_state == State.Updating);
        _;
    }

    constructor() public payable {
        owner = msg.sender;
        sku = 1;
    }

    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

    function createMDR(
        uint256 _sku,
        string _file,
        address _forPatient
    ) public {
        MedicalRecord memory mdr = MedicalRecord({
            sku: _sku,
            file: _file,
            owner: msg.sender,
            fromDoctor: msg.sender,
            forPatient: _forPatient,
            status: State.Initialized,
            price: 0
        });

        items[_sku] = mdr;
        sku = sku + 1;
        emit Initialized(sku);
    }

    function updateMDR(
        uint256 _sku,
        string _file,
        uint256 _price
    ) public verifyCaller(items[_sku].owner) payable {
        items[_sku].file = _file;
        items[_sku].price = _price;
        items[_sku].status = State.Updating;

        emit Updated(_sku);
    }

    function payMDR(uint256 _sku, uint256 _price)
        public
        payable
        verifyCaller(items[_sku].forPatient) 
        paidEnough(items[_sku].price)
    {
        // updating(items[_sku].status) 
        // paidEnough(items[_sku].price) 
        // verifyCaller(items[_sku].forPatient)

        // Transfer money to doctor
        items[_sku].fromDoctor.transfer(_price);
        items[_sku].owner = msg.sender;
        items[_sku].status = State.Complete;

        emit Completed(_sku);
    }

    function shareMDR(uint256 _sku, address forDoctor)
        public verifyCaller(items[_sku].owner) 
    {
        readers[_sku].push(forDoctor);
    }

    function fetchMDR(uint _sku) public view returns 
    (
        uint256 skuItem, 
        string fileItem,
        address ownerItem,
        address fromDoctorItem,
        address forPatientItem,
        State statusItem,
        uint256 priceItem
    )
    {
        skuItem = items[_sku].sku;
        fileItem = items[_sku].file;
        ownerItem = items[_sku].owner;
        fromDoctorItem = items[_sku].fromDoctor;
        forPatientItem = items[_sku].forPatient;
        statusItem = items[_sku].status;
        priceItem = items[_sku].price;

        return (
            skuItem,
            fileItem,
            ownerItem,
            fromDoctorItem,
            forPatientItem,
            statusItem,
            priceItem
        );
    }

    function canReadMDR(uint _sku, address _reader) public view returns (bool)
    {
        bool canRead = false;
        for (uint i = 0; i < readers[_sku].length; i++) {
            if (readers[_sku][i] == _reader) canRead = true;
        }

        return canRead;
    }

    function fetchReaders(uint _sku) public returns (address item)
    {
        item = readers[_sku][0];
        return item;
    }
}
