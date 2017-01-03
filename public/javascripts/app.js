//
// Front routing file associating Views and Controllers
//

var app = angular.module('AXIS-SOW-POC', ['ngRoute','ngFileUpload','ui.bootstrap','ngMaterial' ]).service('sharedMedia', function () {
        var media = new Object();
        media.id = 1;
        media.adress = "";

        var indexationData = new Object();
        
        var sequenceurParams = {
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
        sequenceurParams.BAR_OFFSET = sequenceurParams.MARGIN + sequenceurParams.INDEXED_TRACK_NAME_WIDTH + sequenceurParams.SPACE;
        

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
            },
            setIndexationData: function(data){
                indexationData = data;
            },
            getIndexationData: function(){
                return indexationData;
            },
            setSequenceurParams: function(data){
                sequenceurParams = data;
            },
            getSequenceurParams: function(){
                return sequenceurParams;
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
    
    /**
     * Parameters to manipulate the sequenceur design
     * DO NOT Modify the value in lower case
     */
    $scope.sequenceurParams = sharedMedia.getSequenceurParams();

    $scope.mediaID = sharedMedia.getMediaID();
    $scope.mediaAdress = sharedMedia.getMediaAdress();

    $scope.getMediaIndexations = "";
    $scope.getMediaProductions = "";
    $scope.getMediaTechnicals = "";
    $scope.getMediaClip = "";
    
    $scope.productionData = new Object();
    $scope.technicalData = new Object();
    $scope.clipData = new Object();



    /**
     * Asynchronous request to get the segments and indexed tracks linked to the media
     * Once the data are acquired, we create the timeline
     */
    $http({
        method: 'GET',
        url: 'http://localhost:3000/api/indexationdata/' + $scope.mediaID
    }).then(function successCallback(response) {
        $scope.getMediaIndexations = "Succes";
        var data = response.data;
        data = formatIndexations(data);
        sharedMedia.setIndexationData(data);
        data.tags = preventSuperposition(data.tags);
        sharedMedia.setIndexationData(data);
        paramSequenceur(data);
        sharedMedia.setIndexationData(data);
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
    function formatIndexations(dataToFormat){
        var id = 0;
        var dataFormatted = {};
        dataFormatted.informations = dataToFormat.informations;
        dataFormatted.duree = dataToFormat.duree;
        dataFormatted.trackNames = new Array();
        dataFormatted.tagNames = new Array();
        dataFormatted.nbSegment = 0;
        var dataTags = {};
        //Verification of the number of tags
        if (Object.keys(dataToFormat.tags).length > 0) {
            for (var tagString in dataToFormat.tags) {
                var tag = dataToFormat.tags[tagString];
                dataFormatted.tagNames.push({"name" : tag.name, "id" : tag.id});
                //we take each structure of each tag
                //we construct a line if it 
                for (var structString in tag.structure) {
                    var struct = tag.structure[structString];
                    dataFormatted.nbSegment++;
                    //IF an indexed track DOES NOT exist
                    if (!dataTags.hasOwnProperty(struct.track)) {
                        dataTags[struct.track] = {};
                        dataFormatted.trackNames.push(struct.track);
                    }
                    //If an indexed track 
                    if (!dataTags[struct.track].hasOwnProperty(tag.name)) {
                        dataTags[struct.track][tag.name] = new Array();
                    }
                    dataTags[struct.track][tag.name].push({"type": struct.type, "begin": struct.begin, "end": struct.end, "name": tag.name, "idTag": tag.id, "id": dataFormatted.nbSegment});
                }
            }
        }
        dataFormatted.tags = dataTags;
        return dataFormatted;
    }

    function preventSuperposition(formattedData){
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
                    for (var sublevel = 0; sublevel < correctedData[correctedData.length - 1].levels.length; sublevel++){
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
     * Description : Change the frame and create the components of the sequenceur
     * @param {type} correctedData : data with the sublines system
     */
    function paramSequenceur(correctedData) {
        var sequenceur = angular.element(document.querySelector('#sequenceur'));
        sequenceur.empty();

        //Set the width params of the time bars and of the svg itself
        $scope.sequenceurParams.barwidth = correctedData.duree * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        $scope.sequenceurParams.width = $scope.sequenceurParams.MARGIN;
        $scope.sequenceurParams.width += $scope.sequenceurParams.INDEXED_TRACK_NAME_WIDTH;
        $scope.sequenceurParams.width += $scope.sequenceurParams.SPACE;
        $scope.sequenceurParams.width += $scope.sequenceurParams.barwidth;
        $scope.sequenceurParams.width += $scope.sequenceurParams.MARGIN;

        //set the height of the svg
        $scope.sequenceurParams.height = $scope.sequenceurParams.MARGIN * 2;
        for (var ntrack = 0; ntrack < correctedData.tags.length; ntrack++) {
            for (var nline = 0; nline < correctedData.tags[ntrack].levels.length; nline++) {
                $scope.sequenceurParams.height += ($scope.sequenceurParams.LINE_HEIGHT);
            }
            $scope.sequenceurParams.height += $scope.sequenceurParams.SPACE;
        }
        $scope.sequenceurParams.height -= $scope.sequenceurParams.SPACE;
        
        sharedMedia.setSequenceurParams($scope.sequenceurParams);
        
        createAllComponents(correctedData);
    }
    
    /**
     * We need to stay aware if we need the reloading of the timeline
     */
    $scope.$on('reloadTimeline', function(event, data){
        paramSequenceur(data);
    });
    
    /**
     * Function createAllComponents
     * Description : Create all the SVG components of the timeline, the containers, the lines, the sublines, the segments and the cursor
     * @param {type} indexationData
     * @returns {undefined}
     */
    function createAllComponents(indexationData) {
        var sequenceur = angular.element(document.querySelector('#sequenceur'));
        for (var i = 0; i < indexationData.tags.length; i++)
        {
            var indexedTrack = indexationData.tags[i];
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
    /**
     * Function createLine
     * Description : createLine creates an SVG container which represents a line and the SVG Rect components which represent the sublines  
     * @param {type} track : indexed track (line) to be created
     * @param {type} index : index of the indexed track in the track table
     * @returns {Element}
     */
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
    /**
     * Function createFragment
     * Description : Create the component linked to a Fragment from the informations given to the line indicated
     * @param {Integer} level : subline of the indexed track 
     * @param {JSON} segment : segment which has to be created
     * @param {SVG} currentLine : line to which the segment created has to be added
     */
    function createFragment(level, segment, currentLine) {
        console.log(segment);
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

    /**
     * Function createFlag
     * Description : Create the components linked to a Flag from the informations given to the line indicated
     * @param {Integer} level : subline of the indexed track 
     * @param {JSON} segment : segment which has to be created
     * @param {SVG} currentLine : line to which the segment created has to be added
     */
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
        var indexationData = sharedMedia.getIndexationData();
        var y = $scope.sequenceurParams.MARGIN;
        for (var ntrack = 0; ntrack < indexationData.tags.length && ntrack < index; ntrack++) {
            for (var nline = 0; nline < indexationData.tags[ntrack].levels.length; nline++) {
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
    
    }]);    


app.controller('indexationController', function($scope, $http, sharedMedia, $mdDialog) {
    var selectedTrack = null;
    var selectedTag = null;
    
    /**
     * Function showIndexationDialog
     * Description : show the popup to create a segment
     */
    $scope.showIndexationDialog = function(event) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'template/addIndexation.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true
      })
      .then(function(answer) {
      }, function() {
      });
    };
    
    /**
     * function DialogController
     * Description : contains the main functions to manipulate the popup 
     */
    function DialogController($scope, $mdDialog) {

        
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        /**
         * Function create
         * Description : The user inputs are validated and then, a query is sent 
         * to the server, if a segment is really created, we add it to the 
         * timeline and reload to display the new segment. Else, a error message
         * is displayed to the user indicating which input is wrongly filled. 
         */
        $scope.create = function() {
            var track = $scope.selectedTrack;
            var tag = $scope.selectedTag;
            var segType = indexationForm.segmentType.value;
            var segBegin = indexationForm.segBegin.value;
            var segEnd = indexationForm.segEnd.value;
            var msg = "";
            if(track == null || track == undefined)    
                msg += "No track has been selected\n";
            if(tag == null || tag == undefined)
                msg += "No tag has been selected\n";
            if(!(segType == "fragment" || segType == "flag"))
                msg += "Wrong segment type\n";
            if(!isFloat(segBegin))
                msg += "segment beginning is not a float\n";
            if(segType == "fragment" && !isFloat(segEnd))
                msg += "segment end is not a float";
            else if(segType == "fragment" && isFloat(segBegin) && isFloat(segEnd) && segEnd < segBegin)
                msg += "segment end is before segment begin";
            
            if(msg.length > 0 )
                alert(msg);
            else{   
                if(segType == "track")
                {
                    segBegin = parseFloat(segBegin);
                    segEnd = parseFloat(segEnd);
                }else if (segType == "flag"){
                    segBegin = parseFloat(segBegin);
                }
                //we need to search for the id of each element (the media and the tag (if the tag has for id 0, it is a new one)
                var mediaId = sharedMedia.getMediaID();
                var tagId = searchTagId(tag);
                $http({
                    method: 'GET',
                    url: 'http://localhost:3000/api/createSegment/',
                    params : {"mediaId" : mediaId, "trackName": track,"tagId" : tagId, "tagName" : tag  ,"segType" : segType, "segBegin" : segBegin, "segEnd" : segEnd}
                }).then(function successCallback(response) {
                    var ans = response.data;
                    if(ans.success){
                        addSegment(ans.data);
                    }
                    else{
                        alert(ans.message);
                    }
                }, function errorCallback(response) {
                });                
            }         
            $mdDialog.hide();
        };
        
        /**
         * Function searchType
         * Description : query will constitute a regex. If type is a track, it will search the tracks which names correspond to the regex. If it is tag, it will search the tag names. Else, it will return an empty array
         * @param {String} type
         * @param {String} query
         * @returns {Array[String]} items : tracks or tags matching the query 
         */
        $scope.searchType = function(type,query) {
            var items = new Array();
            var regex = new RegExp(regexEscape(query), "i");
            switch(type){
                case "track" :
                    var tracksFromService = sharedMedia.getIndexationData().trackNames;
                    var tracks = new Array();
                    for(var i=0; i < tracksFromService.length; i++){
                        tracks.push(tracksFromService[i]);
                    }
                    if($scope.selectedTrack != null)
                        if(!containsTrack(tracks, $scope.selectedTrack))
                            tracks.push($scope.selectedTrack);
                    if(query.length > 0){
                        for(var i=0; i<tracks.length; i++){
                            var track = tracks[i];
                            if(track.search(regex) == 0){
                                items.push(track);
                            }
                        }
                    }                
                    break;
                case "tag" :
                    var tagsFromService = sharedMedia.getIndexationData().tagNames;
                    var tags = new Array();
                    for(var i=0; i < tagsFromService.length; i++){
                        tags.push(tagsFromService[i]);
                    }
                    if($scope.selectedTag != null)
                        if(!containsTag(tags, $scope.selectedTag))
                            tags.push({"name" : $scope.selectedTag, "id" : 0});
                    if(query.length > 0){
                        for(var i=0; i<tags.length; i++){
                            var tag = tags[i];
                            if(tag.name.search(regex) == 0){
                                items.push(tag.name);
                            }
                        }
                    }                
                    break;
                default : return new Array(); 
            }
            return items;

        };        
        
        /**
         * function selectedTrackChange 
         * Description : Affect to selectedTrack the value item which is the track that the user selects/or creates from the dropdown list
         * @param {String} item
         */
        $scope.selectedTrackChange = function(item){
            $scope.selectedTrack = item;
        };
        /**
         * function selectedTagChange 
         * Description : Affect to selectedTag the value item which is the tag that the user selects/or creates from the dropdown list
         * @param {String} item
         */
        $scope.selectedTagChange = function(item){
            $scope.selectedTag = item;
        };
        
        
        /**
         * function searchTrackChange
         * Description : set selectedTrack to null for validation purpose
         */
        $scope.searchTrackChange = function(){
            $scope.selectedTrack = null;
        }
        
        /**
         * function searchTagChange
         * Description : set selectedTag to null for validation purpose
         */
        $scope.searchTagChange = function(){
            $scope.selectedTag = null;
        }

        /**
        * function newTrack
        * Description : it will call selectedTrackChange to affect the String track which will also have its special caracters escaped.
        * @param {String} track
        */
        $scope.newTrack = function(track) { 
            track = regexEscape(track);
            $scope.selectedTrackChange(track);
            $scope.searchType("track", track);
        };
        
        /**
        * function newTag
        * Description : it will call selectedTagChange to affect the String tag which will also have its special caracters escaped.
        * @param {String} tag
        */
        $scope.newTag = function(tag){
            tag = regexEscape(tag);
            $scope.selectedTagChange(tag);
            $scope.searchType("tag", tag);
        };
    }
    

    /**
     * function regexEscape 
     * Description : It will escape the string str which comes from the user to prevent malicious expectations
     * @param {String} str
     * @returns {String} str that has its special caracters escaped
     */
    function regexEscape(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }


    /**
     * function containsTrack 
     * @param {Array} a, String obj
     */
    function containsTrack(a, obj)
    {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }
    /**
     * function containsTag 
     * @param {Array{"name","id"}} a, String obj
     */
    function containsTag(a, obj)
    {
        for (var i = 0; i < a.length; i++) {
            if (a[i].name === obj) {
                return true;
            }
        }
        return false;
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
    /**
     * function searchTagId
     * description : return the ID of the tag if its name is matched by tagName from the data got from clipController
     * @param {type} tagName
     * @returns {Number} Id of the tag or 0 if it isn't found (which means it will have to be created).
     */
    function searchTagId(tagName){
        var tags = sharedMedia.getIndexationData().tagNames;
        for(var i=0; i<tags.length; i++){
            var tag = tags[i];
            if(String.toLowerCase(tag.name) == String.toLowerCase(tagName)){
                return tag.id;
            }
        }
        return 0;
    }
    /**
     * Add a segment to the variable indexationData in the service and reload the timeline from the received data
     * @param {JSON} data
     */
    function addSegment(data)
    {
        var indexationData = sharedMedia.getIndexationData();
        var sequenceurParams = sharedMedia.getSequenceurParams();
        
        //We increment nbSegment to have an "id" accessible from the DOM like the others
        indexationData.nbSegment++;
        
        var newTrack = true;
        var newTag = true;
        var lastId = 0;
        
        for(var i = 0; i < indexationData.tagNames.length; i++){
            if(indexationData.tagNames[i].name == data.tag.name)
                newTag = false;
        }
        if(newTag){
            indexationData.tagNames.push(data.tag);
        }
        
        for(var i = 0; i< indexationData.trackNames.length; i++){
            if(indexationData.trackNames[i] == data.track)
                newTrack = false;
        }
        
        if(newTrack){
            indexationData.trackNames.push(data.track);
            indexationData.tags.push({
               "name" : data.track,
               "levels" : [[{
                        "begin" : data.segment.begin,
                        "end" : data.segment.end,
                        "id" : indexationData.nbSegment,
                        "idTag" : data.tag.id,
                        "name" : data.tag.name,
                        "type" : data.segment.type
                    }]]    
            });
        }else{
            var segbegin = 0;
            var segend = 0;
            var testLevel = 0;
            var superimposed = false;
            if (data.segment.type == "flag") {
                segbegin = parseFloat(data.segment.begin) - sequenceurParams.FLAG_WIDTH / 2;
                segend = parseFloat(data.segment.begin) + sequenceurParams.FLAG_WIDTH / 2;
            } else {
                segbegin = data.segment.begin;
                segend = data.segment.end;
            }    
            //We need to browse to prevent the superposition
            for(var indexTrack = 0; indexTrack < indexationData.tags.length; indexTrack ++){
                var track = indexationData.tags[indexTrack];
                if(track.name == data.track){
                    for(var level = 0; level < track.levels.length; level++){
                        superimposed = false;
                        var line = track.levels[level];
                        for(var indexSegment = 0; indexSegment < line.length && !superimposed; indexSegment++){
                            var segment = line[indexSegment];      
                            //superposition test
                            if (!((segbegin < segment.begin && segend <= segment.begin) || (segbegin >= segment.end && segend > segment.end))) {
                                testLevel++;
                                superimposed = true;
                            }
                        }
                    }
                    if (track.levels.length <= testLevel) {
                        track.levels.push(new Array());
                    }
                    track.levels[testLevel].push({
                        "begin" : segbegin,
                        "end" : segend,
                        "id" : indexationData.nbSegment,
                        "idTag" : data.tag.id,
                        "name" : data.tag.name,
                        "type" : data.segment.type
                    });
                }
            }
        } 
        
        //We need to update the timeline now
        sharedMedia.setIndexationData(indexationData);
        $scope.$emit('reloadTimeline',indexationData);
    }
    
    
    
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
