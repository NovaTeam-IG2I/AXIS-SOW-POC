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
    //the clip display
    .when('/clip', {
      templateUrl: 'clip.html',
      controller: 'clipController'
    })
    //the xmp display
    .when('/xmp', {
      templateUrl: 'xmp.html',
      controller: 'xmpController'
    })
    //the media display
    .when('/media', {
      templateUrl: 'media.html',
      controller: 'mediaController'
    })
    //the import display
    .when('/import', {
      templateUrl: 'import.html',
      controller: 'importController'
    })
    .otherwise({
            redirectTo: '/'
    });
});

app.controller('listController', function(){
  //TODO add the functions to controll the list view
});

app.controller('clipController', function(){
  //TODO add the functions to controll the clip view
});

app.controller('xmpController', function(){
  //TODO add the functions to controll the xmp view
});

app.controller('mediaController', function(){
  //TODO add the functions to controll the media view
});

app.controller('importController', function(){
  //TODO add the functions to controll the import view
});
