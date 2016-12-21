//
// Front routing file associating Views and Controllers
//

var app = angular.module('AXIS-SOW-POC', ['ngRoute','ngFileUpload']);

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

app.controller('listController', ['$scope', '$http', function($scope,$http){
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
}]);

app.controller('clipController', ['$scope',function($scope){
  //TODO add the functions to control the clip view
  $scope.videoAdress = "video/salameche.mp4";
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
