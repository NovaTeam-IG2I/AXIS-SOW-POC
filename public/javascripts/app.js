//
// Front routing file associating Views and Controllers
//

var app = angular.module('AXIS-SOW-POC', ['ngRoute','ngFileUpload','ngMaterial']);

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
    //the register manager
    .when('/manageRegister', {
      templateUrl: 'manageRegister.html',
      controller: 'manageRegisterController'
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

app.controller('manageRegisterController', function($scope) {
  //TODO : replace with real data
  $scope.categories =[
    {
      label:"Category1",
      subClass:[
      {
        label:"subClass1-1",
        subClass:[{
          label:"subClass1-1-1",
          subClass:[],
          individuals:[
          {
            label:"i1"
          },
          {
            label:"i2"
          }]
        }],
        individuals:[
          {label:"sdqsq"}
        ]
      },
      {
      label:"subClass1-2",
      subClass:[],
      individuals:[]
      }]
    },
    {
      label:"Category2",
      subClass:[
      {
        label:"subClass2-1",
        subClass:[],
        individuals:[]
      }],
      individuals:[]
    },
    {
      label:"Category3",
      subClass:[],
      individuals:[]
    }
  ];

  $scope.selectedClass;
  $scope.selectedIndividual;
  $scope.getSelectedText = function() {
    if ($scope.selectedClass !== undefined) {
      return $scope.selectedClass;
    } else {
      return "Please select a class";
    }
  };
  $scope.getSelectedInd = function() {
    if ($scope.selectedIndividual !== undefined) {
      return $scope.selectedIndividual;
    } else {
      return "Please select an individual";
    }
  };
});

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
