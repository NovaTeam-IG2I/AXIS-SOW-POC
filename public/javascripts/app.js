//
// Front routing file associating Views and Controllers
//

var app = angular.module('AXIS-SOW-POC', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    //the list display
    .when('/', {
      templateUrl: 'list.html',
      controller: 'listController'
    })
    //the gallery display
    .when('/gallery', {
      templateUrl: 'list.html',
      controller: 'listController'
    })
    //the gallery display
    .when('/clip', {
      templateUrl: 'clip.html',
      controller: 'clipController'
    })
    .otherwise({
            redirectTo: '/'
    });
});

app.controller('listController', ['$scope', function($scope){
  //TODO add the functions to control the list view
  $scope.getAllVideo = "";
}]);

app.controller('clipController', function(){
  //TODO add the functions to control the clip view
});

app.controller('xmpController', function(){
  //TODO add the functions to control the xmp view
});

app.controller('mediaController', function(){
  //TODO add the functions to controll the media view
});
