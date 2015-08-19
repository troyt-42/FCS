(function(){ 'use strict';
angular.module('FCS')
.controller('FCSController', FCSController);

FCSController.$inject = ['$scope', 'FCSSocket', 'APIRegistryService'];

function FCSController($scope, FCSSocket, APIRegistryService){
  var vm = this;

  //functions
  vm.clearAPIInfo = clearAPIInfo;
  vm.createNewAPI = createNewAPI;
  vm.removeAPI = removeAPI;
  vm.sendMessageToAPI = sendMessageToAPI;
  //variables
  vm.messageContent = [];
  vm.newAPIInfo = {
    "Namespace" : '',
    "Event Name" : ''
  };
  vm.currentAPI = APIRegistryService.readCurrentAPI();

  $scope.$watch(function(){
    return vm.currentAPI;
  }, function(newValue, oldValue){
    if(newValue.length !== 0){
      newValue.forEach(function(element, index, array){
        if(vm.messageContent[element.id] !== undefined){
          vm.messageContent[element.id] = '';
        }
      });
    }

  });
  ///////////////////////////////////

  function clearAPIInfo(){
    vm.newAPIInfo = {
      "Namespace" : '',
      "Event Name" : ''
    };
  }

  function createNewAPI(){
    APIRegistryService.registerNewAPI(vm.newAPIInfo);
    vm.clearAPIInfo();
    vm.currentAPI = APIRegistryService.readCurrentAPI();
    console.log(vm.currentAPI);
  }

  function removeAPI(api){
    APIRegistryService.removeAPI(api);
    vm.currentAPI = APIRegistryService.readCurrentAPI;
  }
  function sendMessageToAPI(api){
    var socket = APIRegistryService.retrieveSocket(api);
    if(socket){
      console.log(socket);
      socket.emit(api['Event Name'], vm.messageContent[api.id]);
      vm.messageContent[api.id] = '';
    }
  }
}
})();
