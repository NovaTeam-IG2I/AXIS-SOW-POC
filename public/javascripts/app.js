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

app.controller('clipController', ['$scope', '$http', 'sharedMedia', function ($scope, $http, sharedMedia) {
    //TODO add the functions to control the clip view
    $scope.sequenceurParams = {
        "width": 0,
        "height": 0,
        "barwidth": 0,
        /* space between the border of the sequenceur and the sequenceur itself */
        "MARGIN": 10,
        /*space between each element*/
        "SPACE": 15,
        /*Height of the line of a sequenceur. Should be at least 8*/
        "LINE_HEIGHT": 20,
        /*Width of the indexed tracks names*/
        "INDEXED_TRACK_NAME_WIDTH": 100,
        /* Ratio to determine the width of a bar */
        "RATIO_POINT_TO_SECOND": 3,
        /* Width of a flag tag */
        "FLAG_WIDTH": 15
    };
    $scope.sequenceurParams.BAR_OFFSET = $scope.sequenceurParams.MARGIN + $scope.sequenceurParams.INDEXED_TRACK_NAME_WIDTH + $scope.sequenceurParams.SPACE;

    $scope.mediaID = sharedMedia.getMediaID();
    $scope.mediaAdress = sharedMedia.getMediaAdress();

    $scope.getMediaIndexations = "";
    $scope.getMediaProductions = "";
    $scope.getMediaTechnicals = "";
    $scope.getMediaClip = "";

    $scope.indexationData = new Object();
    $scope.productionData = new Object();
    $scope.technicalData = new Object();
    $scope.clipData = new Object();




    $http({
        method: 'GET',
        url: 'http://localhost:3000/api/indexationdata/' + $scope.mediaID
    }).then(function successCallback(response) {
        $scope.getMediaIndexations = "Succes";
        $scope.indexationData = response.data;
        $scope.indexationData.tags = formatIndexations($scope.indexationData);
        $scope.indexationData.tags = preventSuperposition($scope.indexationData.tags);
        paramSequenceur($scope.indexationData);
    }, function errorCallback(response) {
        $scope.getMediaIndexations = "Fail";
    });

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

    $scope.getClipData = function (clipID) {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/clipsheet/' + clipID
        }).then(function successCallback(response) {
            $scope.getMediaClip = "Succes";
            console.log("clipdata" + $scope.clipData);
            if ($scope.clipData[clipID] == undefined) {
                $scope.clipData[clipID] = {"id": clipID, "data": response.data};
            }
        }, function errorCallback(response) {
            $scope.getMediaClip = "Fail";
        });
    };

    /**
     * function formatIndexations
     * description : format data to allow Angular to manipulate it easily
     * Firstly, we take each structure of each tag and we add it to a line 
     * after verifying if a line exist
     * @param {type} data : data to format
     * @returns formatted data
     */
    function formatIndexations(data)
    {
        var id = 0;
        var formattedData = {};
        //Verification of the number of tags
        if (Object.keys(data.tags).length > 0) {
            for (var tagString in data.tags) {
                var tag = data.tags[tagString];
                //we take each structure of each tag
                //we construct a line if it 
                for (var structString in tag.structure) {
                    var struct = tag.structure[structString];
                    id++;
                    //IF an indexed track DOES NOT exist
                    if (!formattedData.hasOwnProperty(struct.track)) {
                        formattedData[struct.track] = {};
                    }
                    //If an indexed track 
                    if (!formattedData[struct.track].hasOwnProperty(tag.name)) {
                        formattedData[struct.track][tag.name] = new Array();
                    }
                    formattedData[struct.track][tag.name].push({"type": struct.type, "begin": struct.begin, "end": struct.end, "name": tag.name, "idTag": tag.id, "id": id});
                }
            }
        }
        return formattedData;
    }

    function preventSuperposition(formattedData)
    {
        var level = 0;
        var superimposed = false;
        var segbegin, segend, begin, end;
        var correctedData = new Array();
        //for each track, we verify the superposition
        for (var trackString in formattedData) {
            var track = formattedData[trackString];
            //we add the track 
            correctedData.push({});
            correctedData[correctedData.length - 1].name = trackString;
            correctedData[correctedData.length - 1].levels = new Array();
            correctedData[correctedData.length - 1].levels.push(new Array());
            //for each structure of each tag, we verify if it superimposed and
            //add it to corrected data
            for (var tagString in track) {
                var tags = track[tagString];
                for (var i = 0; i < tags.length; i++) {
                    var segment = tags[i];
                    if (segment.type == "flag") {
                        segbegin = segment.begin - $scope.sequenceurParams.FLAG_WIDTH / 2;
                        segend = segment.begin + $scope.sequenceurParams.FLAG_WIDTH / 2;
                    } else {
                        segbegin = segment.begin;
                        segend = segment.end;
                    }
                    level = 0;
                    //test in correctedData
                    for (var sublevel = 0; sublevel < correctedData[correctedData.length - 1].levels.length; sublevel++)
                    {
                        superimposed = false;
                        for (var index = 0; index < correctedData[correctedData.length - 1].levels[sublevel].length && !superimposed; index++) {
                            var addedSegment = correctedData[correctedData.length - 1].levels[sublevel][index];
                            if (addedSegment.type == "flag") {
                                begin = addedSegment - $scope.sequenceurParams.FLAG_WIDTH / 2;
                                end = addedSegment.begin + $scope.sequenceurParams.FLAG_WIDTH / 2;
                            } else {
                                begin = addedSegment.begin;
                                end = addedSegment.end;
                            }
                            //superposition test
                            if (!((segbegin < begin && segend <= end) || (segbegin >= end && segend > end))) {
                                level++;
                                superimposed = true;
                            }
                        }
                        if (!superimposed)
                            break;
                    }

                    if (correctedData[correctedData.length - 1].levels.length <= level) {
                        correctedData[correctedData.length - 1].levels.push(new Array());
                    }
                    correctedData[correctedData.length - 1].levels[level].push(segment);

                }
            }
        }

        return correctedData;
    }
    /**
     * function paramSequenceur
     * Description : Change the frame and add the lines to the sequenceur
     * @param {type} correctedData : data with the sublines system
     */
    function paramSequenceur(correctedData) {

        //Set the width params of the time bars and of the svg itself
        $scope.sequenceurParams.barwidth = correctedData.duree * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        $scope.sequenceurParams.width = $scope.sequenceurParams.MARGIN;
        $scope.sequenceurParams.width += $scope.sequenceurParams.INDEXED_TRACK_NAME_WIDTH;
        $scope.sequenceurParams.width += $scope.sequenceurParams.SPACE;
        $scope.sequenceurParams.width += $scope.sequenceurParams.barwidth;
        $scope.sequenceurParams.width += $scope.sequenceurParams.MARGIN;

        //set the height of the svg
        $scope.sequenceurParams.height += $scope.sequenceurParams.MARGIN * 2;
        for (var ntrack = 0; ntrack < correctedData.tags.length; ntrack++) {
            for (var nline = 0; nline < correctedData.tags[ntrack].levels.length; nline++) {
                $scope.sequenceurParams.height += ($scope.sequenceurParams.LINE_HEIGHT);
            }
            $scope.sequenceurParams.height += $scope.sequenceurParams.SPACE;
        }
        $scope.sequenceurParams.height -= $scope.sequenceurParams.SPACE;
        createAllLines();
    }

    function createAllLines() {
        var sequenceur = angular.element(document.querySelector('#sequenceur'));
        for (var i = 0; i < $scope.indexationData.tags.length; i++)
        {
            var indexedTrack = $scope.indexationData.tags[i];
            var line = createLine(indexedTrack, i);
            for (var j = 0; j < indexedTrack.levels.length; j++)
            {

                var subline = indexedTrack.levels[j];
                for (var k = 0; k < subline.length; k++)
                {
                    var segment = subline[k];
                    var el;
                    if (segment.type == "fragment")
                        el = createFragment(j, segment, line);
                    else if (segment.type == "flag")
                        el = createFlag(j, segment, line);
                }
            }
            sequenceur.append(line);
        }
        addCursor();
    }

    function createLine(track, index)
    {
        var line;
        var lineProperties = {};

        lineProperties.y = computeYLine(index);
        lineProperties.x = 0;
        lineProperties.width = $scope.sequenceurParams.width;
        lineProperties.height = $scope.sequenceurParams.LINE_HEIGHT * track.levels.length;
        lineProperties.track = track.name;
        line = createSVGElement("svg", lineProperties);

        //Now we need to create the label and the container for the segment
        //We create the label
        var textProperties = {};
        textProperties.y = "75%";
        textProperties.textLength = $scope.sequenceurParams.INDEXED_TRACK_NAME_WIDTH;
        textProperties.lengthAdjust = "spacingAndGlyphs";
        textProperties.fill = "#000";
        var text = createSVGElement("text", textProperties);
        text.innerHTML = track.name;

        line.append(text);

        for(var i=0; i < track.levels.length; i++){
            //We create the "rectangle" which is the length of the video
            var tagContainerProperties = {};
            tagContainerProperties.x = $scope.sequenceurParams.BAR_OFFSET;
            tagContainerProperties.y = $scope.sequenceurParams.LINE_HEIGHT * i;
            tagContainerProperties.width = $scope.sequenceurParams.barwidth;
            tagContainerProperties.height = $scope.sequenceurParams.LINE_HEIGHT;
            tagContainerProperties.fill = "#F0F0F0";
            tagContainerProperties.type = "tagContainer";
            tagContainerProperties.class = "tagContainer";
            tagContainerProperties.nline = i;
            var tagContainer = createSVGElement("rect", tagContainerProperties);
            line.append(tagContainer);
        }
        return line;
    }

    function createFragment(level, segment, currentLine) {
        //We create the label
        var textProperties = {};
        textProperties.x = $scope.sequenceurParams.BAR_OFFSET + (segment.begin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND);
        textProperties.y = $scope.sequenceurParams.LINE_HEIGHT * (level + 0.75);
        textProperties.id = segment.id + "_text";
        textProperties.nline = level;
        textProperties.textLength = (segment.end - segment.begin) * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        textProperties.lengthAdjust = "spacingAndGlyphs";
        textProperties.fill = "#FFF";
        textProperties.class = "tagName";
        textProperties.begin = segment.begin;
        var text = createSVGElement("text", textProperties);
        text.innerHTML = segment.name;

        text.addEventListener("click",function(event){
            event.preventDefault();
            //left click will start the video at the beginning of the segment
            if(event.which == 1){
                var video = angular.element(document.querySelector('#video'));
                video[0].pause();
                video[0].currentTime = event.target.getAttribute("begin");
                video[0].play();   
                if(event.ctrlKey){
                   //if right click, we open the dialog for the right tag    
                   var id_text = this.getAttribute("id");
                   var id = id_text.substr(0, id_text.indexOf('_'));
                   var rect = document.getElementById(id);
                   if(rect != null){
                       var idTag = rect.getAttribute("idTag");
                       $scope.getClipData(idTag);
                   }
                }
            }
        });   

        var fragmentProperties = {};
        fragmentProperties.type = "fragment";
        fragmentProperties.id = segment.id;
        fragmentProperties.idTag = segment.idTag;
        fragmentProperties.nline = level;
        fragmentProperties.begin = segment.begin;
        fragmentProperties.end = segment.end;
        fragmentProperties.fill = "black";
        fragmentProperties.x = $scope.sequenceurParams.BAR_OFFSET + segment.begin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        fragmentProperties.y = $scope.sequenceurParams.LINE_HEIGHT * level;
        fragmentProperties.width = (segment.end - segment.begin) * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        fragmentProperties.height = $scope.sequenceurParams.LINE_HEIGHT;
        var fragment = createSVGElement("rect", fragmentProperties);

        currentLine.append(fragment);
        currentLine.append(text);
    }

    function createFlag(level, segment, currentLine) {

        var timePointProperties = {};
        timePointProperties.id = segment.id + "_line";
        timePointProperties.x1 = $scope.sequenceurParams.BAR_OFFSET + segment.begin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        timePointProperties.x2 = $scope.sequenceurParams.BAR_OFFSET + segment.begin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        timePointProperties.y1 = $scope.sequenceurParams.LINE_HEIGHT * level;
        timePointProperties.y2 = $scope.sequenceurParams.LINE_HEIGHT * (level+1);
        timePointProperties.nline = level;
        timePointProperties.stroke = "red";
        timePointProperties["stroke-width"] = $scope.sequenceurParams.RATIO_POINT_TO_SECOND / 2;
        var timePoint = createSVGElement("line", timePointProperties);

        var flagProperties = {};
        flagProperties.type = "flag";
        flagProperties.id = segment.id;
        flagProperties.idTag = segment.idTag;
        flagProperties.begin = segment.begin;
        flagProperties.nline = level;
        flagProperties.y = $scope.sequenceurParams.LINE_HEIGHT * (level + 0.25);
        flagProperties.x = $scope.sequenceurParams.BAR_OFFSET + (segment.begin - $scope.sequenceurParams.FLAG_WIDTH / 2) * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        flagProperties.width = $scope.sequenceurParams.FLAG_WIDTH * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        flagProperties.height = 0.5 * $scope.sequenceurParams.LINE_HEIGHT;
        flagProperties.fill = "grey";
        var flag = createSVGElement("rect", flagProperties);

        //We create the label
        var textProperties = {};
        textProperties.x = $scope.sequenceurParams.BAR_OFFSET + (segment.begin - $scope.sequenceurParams.FLAG_WIDTH / 2) * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        textProperties.y = $scope.sequenceurParams.LINE_HEIGHT * (level + 0.75);
        textProperties.nline = level;
        textProperties.id = segment.id + "_text";
        textProperties.textLength = flagProperties.width;
        textProperties.lengthAdjust = "spacingAndGlyphs";
        textProperties.fill = "#FFF";
        textProperties.class = "tagName";
        textProperties.begin = segment.begin;
        var text = createSVGElement("text", textProperties);
        text.innerHTML = segment.name;

        text.addEventListener("click",function(event){
            event.preventDefault();
            //left click will start the video at the beginning of the segment
            if(event.which == 1){
                var video = angular.element(document.querySelector('#video'));
                video[0].pause();
                video[0].currentTime = event.target.getAttribute("begin");
                video[0].play();   
                if(event.ctrlKey){
                   //if right click, we open the dialog for the right tag    
                   var id_text = this.getAttribute("id");
                   var id = id_text.substr(0, id_text.indexOf('_'));
                   var rect = document.getElementById(id);
                   if(rect != null){
                       var idTag = rect.getAttribute("idTag");
                       $scope.getClipData(idTag);
                   }
                }
            }
        });


        currentLine.append(timePoint);
        currentLine.append(flag);
        currentLine.append(text);
    }

    /**
     * Function addCursors
     * description : add a cursor to synchronised video and timeline
     * @returns true/false
     */
    function addCursor(){
        var sequenceur = angular.element(document.querySelector('#sequenceur'));
        var video = angular.element(document.querySelector('#video'));

        //Now we will create the vertical bar
        var cursorProperties = {};
        cursorProperties.x1 = $scope.sequenceurParams.BAR_OFFSET;
        cursorProperties.y1 = $scope.sequenceurParams.MARGIN; 
        cursorProperties.x2 = $scope.sequenceurParams.BAR_OFFSET;
        cursorProperties.y2 = $scope.sequenceurParams.height - $scope.sequenceurParams.MARGIN;
        cursorProperties.style = "stroke:rgb(0,255,0);stroke-width:1";
        cursorProperties.id = "cursor";
        cursorProperties.class = "cursor";

        var cursor = createSVGElement("line", cursorProperties);
        sequenceur.append(cursor);

        //add the synchronisation to the cursor
        video[0].ontimeupdate = function(event){
            //It is possible during a drag that currentTime becomes NaN hence the test
            if(isFloat(video[0].currentTime)){
                var posx = $scope.sequenceurParams.BAR_OFFSET + (video[0].currentTime * $scope.sequenceurParams.RATIO_POINT_TO_SECOND);
                cursor.setAttributeNS(null, "x1", posx);
                cursor.setAttributeNS(null, "x2", posx);
                //we need to know if we are near the overflow or not 
                var scrollMax = sequenceur[0].parentNode.scrollLeftMax;
                var currentScroll = sequenceur[0].parentNode.scrollLeft;
                if(currentScroll < scrollMax){
                    if(posx > ($scope.sequenceurParams.width - (scrollMax - currentScroll + 20)))
                        sequenceur[0].parentNode.scrollLeft += (sequenceur[0].parentNode.getBoundingClientRect().width / 2);
                }    
            }
        };
        return true; 
    }
    /**
     * function computeYLine
     * description : we give the index of the line of the sequenceur we are trying to create, it will give the y coordinate
     * @param {type} index
     * @returns Coordinate Y of the line we wish to create
     */
    function computeYLine(index) {
        var y = $scope.sequenceurParams.MARGIN;
        for (var ntrack = 0; ntrack < $scope.indexationData.tags.length && ntrack < index; ntrack++) {
            for (var nline = 0; nline < $scope.indexationData.tags[ntrack].levels.length; nline++) {
                y += ($scope.sequenceurParams.LINE_HEIGHT);
            }
            y += $scope.sequenceurParams.SPACE;
        }
        return y;
    }
    /**
     *function : createSVGElement
     *params :
     * - tag : name of the svg element you wish to create
     * - attributes : dictionnary of the svg element attributes you want to personnalize 
     *Description : Function to create a personnalized SVG element
     */
    function createSVGElement(tag, attributes) {
        var svg_element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attributes)
            svg_element.setAttributeNS(null, k, attributes[k]);
        return svg_element;
    }
    /**
    * function isFloat
    * Param :
    * - value : variable to test
    * Description : test if a variable is a float, especially undefined and NaN variable.
    */
    function isFloat(value) {
      var x;
      if (isNaN(value)) {
        return false;
      }
      x = parseFloat(value);
      return x;
    }   
    
    $scope.showIndexationDialog = function(event) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'template/addIndexation.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
    }   
    
    
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
