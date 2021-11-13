pragma solidity ^0.4.24;

import "./Roles.sol";

contract DoctorRole {
   using Roles for Roles.Role;
  // Define 2 events, one for Adding, and other for Removing
   event DoctorAdded(address indexed account);
   event DoctorRemoved(address indexed account);
  
  Roles.Role private doctors;

  constructor() public {
     _addDoctor(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyDoctor() {
     require(isDoctor(msg.sender));
    _;
  }

  // Define a function 'isDoctor' to check this role
  function isDoctor(address account) public view returns (bool) {
    return  doctors.has(account);
  }

  // Define a function 'addDoctor' that adds this role
  function addDoctor(address account) public onlyDoctor {
    _addDoctor(account);
    
  }

  // Define a function 'renounceDoctor' to renounce this role
  function renounceDoctor() public {
    _removeDoctor(msg.sender);
  }

  // Define an internal function '_addDoctor' to add this role, called by 'addDoctor'
  function _addDoctor(address account) internal {
     doctors.add(account);
     emit DoctorAdded(account);
  }

  // Define an internal function '_removeDoctor' to remove this role, called by 'removeDoctor'
  function _removeDoctor(address account) internal {
    doctors.remove(account);
     emit DoctorRemoved(account);
  }
}