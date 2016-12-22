//
// Front routing file associating Views and Controllers
//

var app = angular.module('AXIS-SOW-POC', ['ngRoute','ngFileUpload','ui.bootstrap']).service('sharedMedia', function () {
        var media = new Object();
        media.id = 0;
        media.adress = "";

        return {
            getMediaID: function () {
                return media.id;
            },
            setMediaID: function(id) {
                media.id = id;
            },
            getMediaAdress: function () {
                return media.adress;
            },
            setMediaAdress: function(adress) {
                media.adress = adress;
            }
        };
      });

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
    //the import display
    .when('/import', {
      templateUrl: 'import.html',
      controller: 'importController'
    })
    .otherwise({
            redirectTo: '/'
    });
});

app.controller('listController', ['$scope', '$http', 'sharedMedia',function($scope,$http,sharedMedia){
  //TODO add the functions to control the list view
  $scope.getAllVideos = "";
  $scope.numberOfVideos = 0;
  $scope.videos = [];
  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/cliplist'
  }).then(function successCallback(response) {
      $scope.getAllVideos = "Succes";
      $scope.numberOfVideos = response.data.number;
      $scope.videos = response.data.videos;
  }, function errorCallback(response) {
      $scope.getAllVideos = "Fail";
  });
  $scope.onMediaSelected = function(id,adress){
    sharedMedia.setMediaID(id);
    sharedMedia.setMediaAdress(adress);
  };
}]);

app.controller('clipController', ['$scope','$http','sharedMedia',function($scope,$http,sharedMedia){
  //TODO add the functions to control the clip view
  $scope.mediaID = sharedMedia.getMediaID();
  $scope.mediaAdress = sharedMedia.getMediaAdress();

  $scope.getMediaProductions = "";
  $scope.getMediaTechnicals = "";

  $scope.productionData = new Object();
  $scope.technicalData = new Object();

  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/productionsheet/' + $scope.mediaID
  }).then(function successCallback(response) {
      $scope.getMediaProductions = "Succes";
      $scope.productionData = response.data;
  }, function errorCallback(response) {
      $scope.getMediaProductions = "Fail";
  });
  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/technicalsheet/' + $scope.mediaID
  }).then(function successCallback(response) {
      $scope.getMediaTechnicals = "Succes";
      $scope.technicalData = response.data;
  }, function errorCallback(response) {
      $scope.getMediaTechnicals = "Fail";
  });
}]);

// Controller for the importation of a video mp4
app.controller('importController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/import',
                method: 'POST',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        }
    }
}]);
