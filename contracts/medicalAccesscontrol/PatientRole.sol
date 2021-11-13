pragma solidity ^0.4.24;

import "./Roles.sol";

contract PatientRole {
   using Roles for Roles.Role;
  // Define 2 events, one for Adding, and other for Removing
   event PatientAdded(address indexed account);
   event PatientRemoved(address indexed account);
  
  Roles.Role private patients;

  constructor() public {
     _addPatient(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyPatient() {
     require(isPatient(msg.sender));
    _;
  }

  // Define a function 'isPatient' to check this role
  function isPatient(address account) public view returns (bool) {
    return  patients.has(account);
  }

  // Define a function 'addPatient' that adds this role
  function addPatient(address account) public onlyPatient {
    _addPatient(account);
    
  }

  // Define a function 'renouncePatient' to renounce this role
  function renouncePatient() public {
    _removePatient(msg.sender);
  }

  // Define an internal function '_addPatient' to add this role, called by 'addPatient'
  function _addPatient(address account) internal {
     patients.add(account);
     emit PatientAdded(account);
  }

  // Define an internal function '_removePatient' to remove this role, called by 'removePatient'
  function _removePatient(address account) internal {
    patients.remove(account);
     emit PatientRemoved(account);
  }
}