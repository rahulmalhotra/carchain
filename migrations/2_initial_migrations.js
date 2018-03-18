var Insurance = artifacts.require("./Insurance.sol");
var Profile = artifacts.require("./Profiles.sol");

module.exports = function(deployer) {
  deployer.deploy(Insurance);
  deployer.deploy(Profile);
};
