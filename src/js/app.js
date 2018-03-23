App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    /*
     * Replace me...
     */

    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */

    // Initializing the Insurance Contract
    $.getJSON('Insurance.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var InsuranceArtifact = data;
      App.contracts.Insurance = TruffleContract(InsuranceArtifact);
      // Set the provider for our contract
      App.contracts.Insurance.setProvider(App.web3Provider);

//      return App.getInsuranceRecords();
    });

    // Initializing the Profiles Contract
    $.getJSON('Profiles.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ProfilesArtifact = data;
      App.contracts.Profiles = TruffleContract(ProfilesArtifact);
      // Set the provider for our contract
      App.contracts.Profiles.setProvider(App.web3Provider);

      return App.getCurrentUserProfile();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#saveInsurance', App.saveInsuranceRecord);
    $(document).on('click', '#getInsuranceRecord', App.getInsuranceRecord);
    $(document).on('click', '#saveProfile', App.saveProfileRecord);
    $(document).on('click', '#assignProfile', App.assignProfile);
  },

  assignProfile: function(event) {
    event.preventDefault();
    var profileInstance;
    var inputAddress = $('#inputAddress').val();
    var profileName = $('#profileNames').val();
    console.log(profileName);
    web3.eth.getAccounts(function(error, accounts){      

      if(error) {
        console.log(error);
      }

      var account = accounts[0];
      App.contracts.Profiles.deployed().then(function(instance) {
          profileInstance = instance;
          return profileInstance.assignProfile(inputAddress, profileName, {from: account});
        }).then(function(result) {
          console.log(result);
          if(result)
            alert('New profile assigned successfully');
          else
            alert('Profile not assigned. Make sure you have the correct permissions');
        }).catch(function(err) {
          console.log(err.message);
        });
      });
  },

  saveProfileRecord: function(event) {
    event.preventDefault();
    var profileInstance;
    var profileName = $('#inputProfileName').val();
    web3.eth.getAccounts(function(error, accounts){      

      if(error) {
        console.log(error);
      }

      var account = accounts[0];
      App.contracts.Profiles.deployed().then(function(instance) {
          profileInstance = instance;
          return profileInstance.addProfile(profileName, {from: account});
        }).then(function(result) {
          console.log(result);
          if(result)
            alert('New profile saved successfully');
          else
            alert('Profile not saved. Make sure you have the correct permissions');
        }).catch(function(err) {
          console.log(err.message);
        });
      });
  },

  getCurrentUserProfile: function() {

    var profileInstance;

    web3.eth.getAccounts(function(error, accounts){      

      if(error) {
        console.log(error);
      }

      var account = accounts[0];
      App.contracts.Profiles.deployed().then(function(instance) {
          profileInstance = instance;
          return profileInstance.getProfile.call(account);
        }).then(function(result) {
          if(result) {
            $("#profileName").html(web3.toUtf8(result));
            console.log('Your profile is:- '+ web3.toUtf8(result));
          }
          else
            console.log('No profile is associated with your address');
        }).catch(function(err) {
          console.log(err.message);
        });
      });

    return App.getAllProfiles();
  },

  getAllProfiles:  function() {
    App.contracts.Profiles.deployed().then(function(instance) {
        profileInstance = instance;
        return profileInstance.getAllProfiles.call();
      }).then(function(result) {
        var options = "";
        for(var i=0;i<result.length;i++) {
            options = options + "<option>"+web3.toUtf8(result[i])+"</option>";
        }
        $("#profileNames").html(options);
        console.log(result);
      }).catch(function(err) {
        console.log(err.message);
      });
  },

  getInsuranceRecord: function(event) {    
    event.preventDefault();
    var vehicleId = $("#inputVehicleId").val();
    App.contracts.Insurance.deployed().then(function(instance) {
        insuranceInstance = instance;
        return insuranceInstance.getCurrentInsuranceInfoByVehicle.call(vehicleId);
      }).then(function(result) {
        var tableRow = "";
        for(var i=0;i<7;i++) {
          if(i==2||i==3||i==5||i==6) 
            tableRow = tableRow + "<td>"+web3.toUtf8(result[i])+"</td>";
          else
            tableRow = tableRow + "<td>"+result[i]+"</td>";
        }
        tableRow = "<tr>" + tableRow + "</tr>";
        $("#tableBody").html(tableRow);
        console.log(result);
      }).catch(function(err) {
        console.log(err.message);
      });
  },

  saveInsuranceRecord: function(event) {
    event.preventDefault();
    var insuranceInstance;
    var vehicleId = $('#vehicleId').val();
    var currentInsuranceNumber = $('#currentInsuranceNumber').val();
    var currentExpiryDate = $('#currentExpiryDate').val();
    var currentInsuranceProvider = $('#currentInsuranceProvider').val();
    var previousInsuranceNumber = $('#previousInsuranceNumber').val();
    var previousExpiryDate = $('#previousExpiryDate').val();
    var previousInsuranceProvider = $('#previousInsuranceProvider').val();
    web3.eth.getAccounts(function(error, accounts){      

      if(error) {
        console.log(error);
      }

      var account = accounts[0];
      App.contracts.Profiles.deployed().then(function(instance) {
          profileInstance = instance;
          return profileInstance.getProfile.call(account);
        }).then(function(result) {
          if(result) {
            var profile = web3.toUtf8(result);
            if(profile!='insuranceagent') {
              alert("You don't have the necessary permissions to save this insurance");
              return;
            }
          }
          else 
            console.log('No profile is associated with your address');
        }).catch(function(err) {
          console.log(err.message);
        });

//     var account = accounts[0];
      App.contracts.Insurance.deployed().then(function(instance) {
          insuranceInstance = instance;
          console.log(insuranceInstance.address);
//          hehehe
          return insuranceInstance.addInsurance(insuranceInstance.address,vehicleId, 
            currentInsuranceNumber,
            currentExpiryDate,
            currentInsuranceProvider,
            previousInsuranceNumber,
            previousExpiryDate,
            previousInsuranceProvider
            , {from: account});
        }).then(function(result) {
          console.log(result);
          if(result)
            alert('Insurance record saved successfully');
          else
            alert('Insurance record not saved. Make sure you have the correct permissions');
        }).catch(function(err) {
          console.log(err.message);
        });
  });
}
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
