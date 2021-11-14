var DoctorRole = artifacts.require("./DoctorRole.sol");
var PatientRole = artifacts.require("./PatientRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(DoctorRole);
  deployer.deploy(PatientRole);
  deployer.deploy(SupplyChain);
};
 