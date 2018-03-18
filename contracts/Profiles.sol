pragma solidity ^0.4.17;

/**
 * The Profiles contract does this and that...
 */
contract Profiles {

	bytes32[] profileNames;
	mapping (address => bytes32) profileMapping;

	function Profiles() public {
		address adminAddress = msg.sender;
		profileMapping[adminAddress] = "admin";
		profileNames.push("admin");
	}

	function addProfile (bytes32 _profileName) public returns(bool res) {
		if(profileMapping[msg.sender]!=bytes32("admin")) {
			return false;
		}
		bool profileExist = false;
		for(uint i=0; i<profileNames.length; i++) {
			if(profileNames[i]==_profileName) {
				profileExist = true;
				break;
			}
		}
		if(!profileExist) {
			profileNames.push(_profileName);
		} else {
			return false;
		}
		return true;			
	}	

	function assignProfile (address _userAddress, bytes32 _profileName) public returns(bool res) {
		if(profileMapping[msg.sender]!=bytes32("admin")) {
			return false;
		}
		profileMapping[_userAddress] = _profileName;
		return true;
	}
	

	function getProfile (address _userAddress) public constant returns(bytes32) {
		return profileMapping[_userAddress];		
	}

	function getAllProfiles () public constant returns(bytes32[]) {
		return profileNames;
	}
	
}