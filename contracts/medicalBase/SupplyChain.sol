pragma solidity ^0.4.24;

import "../medicalAccesscontrol/PatientRole.sol";
import "../medicalAccesscontrol/DoctorRole.sol";
import "../medicalCore/Ownable.sol";


// Define a contract 'Supplychain'
contract SupplyChain is DoctorRole,  PatientRole {

  // Define 'owner'
  address  owner;

  // Define a variable called 'sku' for Stock Keeping Unit (SKU)
  uint  sku;

  // maintain the list of doctors who can access to one medical record (SKU)
  mapping (uint => address[]) readers;
  
  // Define enum 'State' with the following values:
  enum State 
  { 
    Initialized,  // 0
    Updating,  // 1
    Complete   // 2
  }

  State constant defaultState = State.Initialized;

  // Define a struct 'Item' with the following fields:
  struct MedicalRecord {
    uint    sku;  
    string  file; 
    address owner;  // can be doctor or patient depends on the status of the item
    address fromDoctor; 
    address forPatient;
    State   status;
    uint price;
  }

  mapping (uint => MedicalRecord) items;

  event Initialized(uint sku);
  event Updated(uint sku);
  event Completed(uint sku);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyOwnerSku(uint _sku) {
    require(items[_sku].owner == msg.sender);
    _;
  }

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address _address) {
    require(msg.sender == _address); 
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) { 
    require(msg.value >= _price); 
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Harvested
  modifier initialized(uint _sku) {
    require(items[_sku].status == State.Initialized);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Processed
  modifier updating(uint _sku) {
     require(items[_sku].status == State.Updating);
    _;
  }


  // In the constructor set 'owner' to the address that instantiated the contract
  // and set 'sku' to 1
  // and set 'upc' to 1
  constructor() public payable {
    owner = msg.sender;
    sku = 1;
  }

  // Define a function 'kill' if required
  function kill() public {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }


    function createMDR(string _file, address _doctor, address _forPatient) public onlyDoctor {
      MedicalRecord memory mdr = MedicalRecord({
        sku:  sku,
        file: _file,
        owner: _doctor,
        fromDoctor: _doctor,
        forPatient: _forPatient,
        status: State.Initialized,
        price: 0
      });

      items[sku] = mdr;
      sku = sku + 1;
      emit Initialized(sku);
    }

    function updateMDR(uint _sku, string _file, uint _price) public onlyOwnerSku(_sku) {
      items[_sku].file = _file;
      items[_sku].price = _price;
    }

    function payMDR(uint _sku) public payable 
      paidEnough(items[_sku].price) 
      updating(_sku) {
      
      // Transfer money to doctor
      items[_sku].fromDoctor.transfer(items[_sku].price);
      items[_sku].owner = msg.sender;
      items[_sku].status = State.Complete;

      emit Completed(_sku);
    }

    function shareMDR(uint _sku, address forDoctor) public onlyOwnerSku(_sku) {
      readers[_sku].push(forDoctor);
    }  
}
