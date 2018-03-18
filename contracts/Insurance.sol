pragma solidity ^0.4.17;
import "./Profiles.sol";

/**
 * The Insurance contract is mainly used to deal with all the insurance related operations of car
 */
contract Insurance {

	struct InsuranceInfo {
		uint vehicleId;
		uint currentInsuranceNumber;
		bytes32 currentExpiryDate;
		bytes32 currentInsuranceProvider;
		uint previousInsuranceNumber;
		bytes32 previousExpiryDate;
		bytes32 previousInsuranceProvider;		
	}

	mapping (address => uint[]) agentInsuranceMap;

	// mapping (address => uint) agentInsuranceLength;

	mapping (uint => InsuranceInfo) insuranceMap;	
	
	function stringToBytes32 (bytes32 data) pure internal returns(bytes32 resData) {
		return data;
	}
	

	function addInsurance (address _profileAddress, uint _vehicleId, uint _currentInsuranceNumber, bytes32 _currentExpiryDate, bytes32 _currentInsuranceProvider, uint _previousInsuranceNumber, bytes32 _previousExpiryDate, bytes32 _previousInsuranceProvider) public returns(bool res) {

		if(Profiles(_profileAddress).getProfile(msg.sender)!=stringToBytes32("insuranceAgent")) {
			return false;
		}

		address _agentAddress = msg.sender;
		bool agentHasVehicle = false;
		uint[] memory vehicleIdsOfAgent = agentInsuranceMap[_agentAddress];
		if(vehicleIdsOfAgent.length>0) {
			for(uint i=0;i<vehicleIdsOfAgent.length;i++) {
				if(vehicleIdsOfAgent[i]==_vehicleId) {
					agentHasVehicle = true;
				}
			}
		}
		if(!agentHasVehicle) {
			// agentInsuranceLength[_agentAddress] = agentInsuranceLength[_agentAddress] + 1;
			agentInsuranceMap[_agentAddress].push(_vehicleId);
		}
		insuranceMap[_vehicleId] = InsuranceInfo(_vehicleId, _currentInsuranceNumber, _currentExpiryDate, _currentInsuranceProvider, _previousInsuranceNumber, _previousExpiryDate, _previousInsuranceProvider);
		return true;
	}

	function getCurrentInsuranceInfoByVehicle (uint _vehicleId) public constant returns(uint, uint, bytes32, bytes32, uint, bytes32, bytes32) {
		InsuranceInfo memory currentInsuranceInfo = insuranceMap[_vehicleId];
		return(currentInsuranceInfo.vehicleId, currentInsuranceInfo.currentInsuranceNumber, currentInsuranceInfo.currentExpiryDate, currentInsuranceInfo.currentInsuranceProvider, currentInsuranceInfo.previousInsuranceNumber, currentInsuranceInfo.previousExpiryDate, currentInsuranceInfo.previousInsuranceProvider);
	}

	function getAllInsuranceInfoByAgent1 (address _agentAddress) public constant returns(uint[], uint[], bytes32[], bytes32[]) {

		uint size = agentInsuranceMap[_agentAddress].length;
		uint[] memory vehicleIds = new uint[](size);
		uint[] memory currentInsuranceNumbers = new uint[](size);
		bytes32[] memory currentExpiryDates = new bytes32[](size);
		bytes32[] memory currentInsuranceProviders = new bytes32[](size);
		uint[] memory agentVehicleIds = agentInsuranceMap[_agentAddress];

		for(uint i=0; i<size; i++) {
			InsuranceInfo memory currentInsurance = insuranceMap[agentVehicleIds[i]];
			vehicleIds[i] = currentInsurance.vehicleId;
			currentInsuranceNumbers[i] = currentInsurance.currentInsuranceNumber;
			currentExpiryDates[i] = currentInsurance.currentExpiryDate;
			currentInsuranceProviders[i] = currentInsurance.currentInsuranceProvider;
		}

		return(vehicleIds, currentInsuranceNumbers, currentExpiryDates, currentInsuranceProviders/*, previousInsuranceNumbers, previousExpiryDates, previousInsuranceProviders*/);
	}

	function getAllInsuranceInfoByAgent2 (address _agentAddress) public constant returns(uint[], bytes32[], bytes32[]) {

		uint size = agentInsuranceMap[_agentAddress].length;
		uint[] memory previousInsuranceNumbers = new uint[](size);
		bytes32[] memory previousExpiryDates = new bytes32[](size);
		bytes32[] memory previousInsuranceProviders = new bytes32[](size);
		uint[] memory agentVehicleIds = agentInsuranceMap[_agentAddress];

		for(uint i=0; i<size; i++) {
			InsuranceInfo memory currentInsurance = insuranceMap[agentVehicleIds[i]];
			previousInsuranceNumbers[i] = currentInsurance.previousInsuranceNumber;
			previousExpiryDates[i] = currentInsurance.previousExpiryDate;
			previousInsuranceProviders[i] = currentInsurance.previousInsuranceProvider;
		}

		return(previousInsuranceNumbers, previousExpiryDates, previousInsuranceProviders);
	}
}