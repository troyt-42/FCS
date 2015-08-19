(function(){ 'use strict';
angular.module('FCS')
.factory('FCSSocket', FCSSocket)
.factory('APIRegistryService', APIRegistryService);

FCSSocket.$inject = ['socketFactory'];
APIRegistryService.$inject = ['socketFactory'];

function FCSSocket(socketFactory){
  var myIoSocket = io.connect('localhost:3000/');

  return socketFactory({
    ioSocket: myIoSocket
  });
}
})();

function APIRegistryService(socketFactory){
  var currentAPI = [{'Namespace' : "/", 'Event Name' : "test", id : 0}];
  var currentSockets = [{namespace : "/", eventname : "test", id: 0, socket : socketFactory({
  ioSocket: io.connect('localhost:3000/')})}];
  return {
    readCurrentAPI : function(){
      return angular.copy(currentAPI);
    },
    registerNewAPI : function(newAPIInfo){
      var exist = false;
      for(var i = 0; i < currentSockets.length; i ++){
        if((currentSockets[i].namespace === newAPIInfo.Namespace) && (currentSockets[i].eventname === newAPIInfo['Event Name'])){
          exist = true;
        }
      }
      if(!exist){
        newAPIInfo.id = currentAPI.length;
        currentAPI.push(newAPIInfo);
        currentSockets.push({
          namespace : newAPIInfo.Namespace,
          eventname : newAPIInfo['Event Name'],
          id: newAPIInfo.id,
          socket : socketFactory({
          ioSocket: io.connect('localhost:3000/' + (newAPIInfo.Namespace === '/' ? '' : newAPIInfo.Namespace))
        })});
      } else {
        alert("API has already existed(Namespace: " + newAPIInfo.Namespace + "; Event Name: " + newAPIInfo['Event Name'] + ")");
      }
    },
    retrieveSocket : function(APIInfo){
      for(var i = 0; i < currentSockets.length; i ++){
        if((currentSockets[i].namespace === APIInfo.Namespace) && (currentSockets[i].eventname === APIInfo['Event Name'])){
          return currentSockets[i].socket;
        }
      }
      return "API doesn't exist";
    },
    removeAPI : function(APIInfo){
      if(APIInfo.id !== undefined){
        currentAPI.splice(APIInfo.id, 1);
        currentSockets.splice(APIInfo.id, 1);
      }
    }
  };
}
