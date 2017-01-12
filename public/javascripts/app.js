//
// Front routing file associating Views and Controllers
//

var app = angular.module('AXIS-SOW-POC', ['ngRoute','ngFileUpload','ngMaterial','ui.bootstrap']).service('sharedMedia', function () {
        var media = new Object();
        
        media.uri = 0;
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
            /* Width of a point tag */
            "POINT_WIDTH": 15
        };
        sequenceurParams.BAR_OFFSET = sequenceurParams.MARGIN + sequenceurParams.INDEXED_TRACK_NAME_WIDTH + sequenceurParams.SPACE;
        

        return {
            getMediaURI: function () {
                return media.uri;
            },
            setMediaURI: function(uri) {
                media.uri = uri;
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
    //the register manager
    .when('/manageRegister', {
      templateUrl: 'manageRegister.html',
      controller: 'manageRegisterController'
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
  $scope.onMediaSelected = function(uri,adress){
    sharedMedia.setMediaURI(uri);
    sharedMedia.setMediaAdress(adress);
  };
}]);

app.controller('clipController', ['$scope', '$http', 'sharedMedia', function ($scope, $http, sharedMedia) {
  //TODO add the functions to control the clip view
    $scope.mediaURI = sharedMedia.getMediaURI();
    $scope.mediaAdress = sharedMedia.getMediaAdress();

    
    $scope.sequenceurParams = sharedMedia.getSequenceurParams();

    $scope.getMediaIndexations = "";
    $scope.getMediaProductions = "";
    $scope.getMediaTechnicals = "";
    $scope.getMediaClip = "";
    
    $scope.productionData = new Object();
    $scope.technicalData = new Object();
    $scope.clipData = new Object();

  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/productionsheet/' + $scope.mediaURI
  }).then(function successCallback(response) {
      $scope.getMediaProductions = "Succes";
      $scope.productionData = response.data;
  }, function errorCallback(response) {
      $scope.getMediaProductions = "Fail";
  });

  $http({
    method: 'GET',
    url: 'http://localhost:3000/api/technicalsheet/' + $scope.mediaURI
  }).then(function successCallback(response) {
      $scope.getMediaTechnicals = "Succes";
      $scope.technicalData = response.data;
  }, function errorCallback(response) {
      $scope.getMediaTechnicals = "Fail";
  });

  $scope.getClipData = function(clipURI){
    $http({
      method: 'GET',
      url: 'http://localhost:3000/api/clipsheet/' + clipURI
    }).then(function successCallback(response) {
        $scope.getMediaClip= "Succes";
        console.log($scope.clipData);
        if ($scope.clipData[clipURI] == undefined){
          $scope.clipData[clipURI] = {"uri" : clipURI,"data" : response.data};
        }
    }, function errorCallback(response) {
        $scope.getMediaClip = "Fail";
    });
  };

    /**
     * Asynchronous request to get the fragments and indexed tracks linked to the media
     * Once the data are acquired, we create the timeline
     */
    $http({
        method: 'GET',
        url: 'http://localhost:3000/api/indexationdata/' + $scope.mediaURI
    }).then(function successCallback(response) {
        $scope.getMediaIndexations = "Succes";
        var data = response.data;
        data = formatIndexations(data);
        sharedMedia.setIndexationData(data);
        paramSequenceur(data);
        sharedMedia.setIndexationData(data);
    }, function errorCallback(response) {
        $scope.getMediaIndexations = "Fail";
    });

    /**
     * function formatIndexations
     * description : format data to allow Angular to manipulate it easily
     * Firstly, we take each structure of each tag and we add it to a line 
     * after verifying if a line exist
     * @param {type} data : data to format
     * @returns formatted data
     */
    function formatIndexations(dataToFormat){
        var dataFormatted = {};
        dataFormatted.duree = dataToFormat.duree;
        dataFormatted.trackNames = new Array();
        dataFormatted.tagNames = new Array();
        dataFormatted.indexedTracks = [];


        var shouldAddFragToTag = true;
        var shouldAddFragToLevel = true;
        var levelToAddFragment = 0;

        for(var i=0; i < dataToFormat.indexedTracks.length; i++)
        {
            //get the current indexedTrack
            var indexedTrack = dataToFormat.indexedTracks[i];
            //Add the name and create the multiline system
            dataFormatted.indexedTracks.push({});
            dataFormatted.indexedTracks[i].name = indexedTrack.name;
            dataFormatted.indexedTracks[i].levels = [];
            dataFormatted.indexedTracks[i].levels.push([]);
            //Add the name of the indexedTrack for futur autocompletion
            dataFormatted.trackNames.push(indexedTrack.name);
            for(var j = 0; j < indexedTrack.fragments.length; j++){
                //get the current fragment
                var fragment = indexedTrack.fragments[j];
                //We need to manipulate the fragment to put some more information
                var seqBegin = (fragment.type == "point") ? (fragment.start - $scope.sequenceurParams.POINT_WIDTH/2) : fragment.start;
                var seqEnd = (fragment.type == "point")? (fragment.start + $scope.sequenceurParams.POINT_WIDTH/2) : fragment.end;
                fragment.seqBegin = seqBegin;
                fragment.seqEnd = seqEnd;
                
                //We need to check for no doublon case
                shouldAddFragToTag = true;
                for(var k = 0; k< dataFormatted.tagNames.length; k++){
                    if(dataFormatted.tagNames[k].name == fragment.name)
                        shouldAddFragToTag = false;
                }
                if(shouldAddFragToTag)
                    dataFormatted.tagNames.push({"name" : fragment.name, "uri" : fragment.uri, "nature" : fragment.nature});
                //We need to test the superposition
                for(var z = 0; z< dataFormatted.indexedTracks[i].levels.length; z++){
                    shouldAddFragToLevel = true;
                    var level = dataFormatted.indexedTracks[i].levels[z];
                    for(var y =0; y < level.length && shouldAddFragToLevel; y++){
                        //if superimposed
                        if (!((fragment.seqBegin < level[y].seqBegin && fragment.seqEnd <= level[y].seqEnd) || (fragment.seqBegin >= level[y].seqEnd && fragment.seqEnd > level[y].seqEnd))){
                            shouldAddFragToLevel = false;
                            levelToAddFragment++;
                        }   
                    }
                }
                if(dataFormatted.indexedTracks[i].levels.length < (levelToAddFragment + 1)){
                    dataFormatted.indexedTracks[i].levels.push([]);
                }
                
                //We need now to add the fragment to the correct level
                dataFormatted.indexedTracks[i].levels[levelToAddFragment].push(fragment);
                levelToAddFragment = 0;
            }
        }
        return dataFormatted;
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
        for (var ntrack = 0; ntrack < correctedData.indexedTracks.length; ntrack++) {
            for (var nline = 0; nline < correctedData.indexedTracks[ntrack].levels.length; nline++) {
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
     * Description : Create all the SVG components of the timeline, the containers, the lines, the sublines, the fragments and the cursor
     * @param {type} indexationData
     * @returns {undefined}
     */
    function createAllComponents(indexationData) {
        var sequenceur = angular.element(document.querySelector('#sequenceur'));
        for (var i = 0; i < indexationData.indexedTracks.length; i++){
            var indexedTrack = indexationData.indexedTracks[i];
            var line = createLine(indexedTrack, i);
            for (var j = 0; j < indexedTrack.levels.length; j++){
                var subline = indexedTrack.levels[j];
                for (var k=0; k <subline.length; k++){
                    var fragment = subline[k];
                    if (fragment.type == "segment")
                        createSegment(i, j, k, fragment, line);
                    else if (fragment.type == "point")
                        createPoint(i, j, k, fragment, line);
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

        //Now we need to create the label and the container for the fragment
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
     * Function createSegment
     * Description : Create the component linked to a segment from the informations given to the line indicated
     * @param {Integer} level : subline of the indexed track 
     * @param {JSON} fragment : fragment which has to be created
     * @param {SVG} currentLine : line to which the fragment created has to be added
     */
    function createSegment(indexIndexedTrack, level, indexFragment, fragment, currentLine) {
        //We create the label
        var textProperties = {};
        textProperties.x = $scope.sequenceurParams.BAR_OFFSET + (fragment.seqBegin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND);
        textProperties.y = $scope.sequenceurParams.LINE_HEIGHT * (level + 0.75);
        
        //Information from fragment
        textProperties.uri = fragment.uri;
        textProperties.indexIndexedTrack = indexIndexedTrack;
        textProperties.level = level;
        textProperties.indexFragment = indexFragment;
        
        textProperties.textLength = (fragment.seqEnd - fragment.seqBegin) * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        textProperties.lengthAdjust = "spacingAndGlyphs";
        textProperties.fill = "#FFF";
        textProperties.class = "tagName";
        textProperties.start = fragment.start;
        var text = createSVGElement("text", textProperties);
        text.innerHTML = fragment.name;

        text.addEventListener("click",function(event){
            event.preventDefault();
            //left click will start the video at the beginning of the fragment
            if(event.which == 1){
                var video = angular.element(document.querySelector('#video'));
                var time = event.target.getAttribute("start");
                if(time != undefined){
                    video[0].pause();
                    video[0].currentTime = time;
                    video[0].play();   
                }
                if(event.ctrlKey){
                   //if right click, we open the dialog for the right tag               
                    var uri = event.target.getAttribute("uri");
                    if(uri != undefined)
                        $scope.getClipData(uri);
                }
            }
        });  

        var segmentProperties = {};
        segmentProperties.type = "segment";
        segmentProperties.fill = "black";
        segmentProperties.x = $scope.sequenceurParams.BAR_OFFSET + fragment.seqBegin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        segmentProperties.y = $scope.sequenceurParams.LINE_HEIGHT * level;
        segmentProperties.width = (fragment.seqEnd - fragment.seqBegin) * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        segmentProperties.height = $scope.sequenceurParams.LINE_HEIGHT;
        var segment = createSVGElement("rect", segmentProperties);

        currentLine.append(segment);
        currentLine.append(text);
    }

    /**
     * Function createPoint
     * Description : Create the components linked to a Point from the informations given to the line indicated
     * @param {Integer} level : subline of the indexed track 
     * @param {JSON} fragment : fragment which has to be created
     * @param {SVG} currentLine : line to which the fragment created has to be added
     */
    function createPoint(indexIndexedTrack, level, indexFragment, fragment, currentLine) {

        var timePointProperties = {};
        timePointProperties.x1 = $scope.sequenceurParams.BAR_OFFSET + fragment.start * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        timePointProperties.x2 = $scope.sequenceurParams.BAR_OFFSET + fragment.start * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        timePointProperties.y1 = $scope.sequenceurParams.LINE_HEIGHT * level;
        timePointProperties.y2 = $scope.sequenceurParams.LINE_HEIGHT * (level+1);
        timePointProperties.stroke = "red";
        timePointProperties["stroke-width"] = $scope.sequenceurParams.RATIO_POINT_TO_SECOND / 2;
        var timePoint = createSVGElement("line", timePointProperties);

        var pointProperties = {};
        pointProperties.type = "point";
        pointProperties.y = $scope.sequenceurParams.LINE_HEIGHT * (level + 0.25);
        pointProperties.x = $scope.sequenceurParams.BAR_OFFSET + fragment.seqBegin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        pointProperties.width = $scope.sequenceurParams.POINT_WIDTH * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        pointProperties.height = 0.5 * $scope.sequenceurParams.LINE_HEIGHT;
        pointProperties.fill = "grey";
        var point = createSVGElement("rect", pointProperties);

        //We create the label
        var textProperties = {};
        textProperties.x = $scope.sequenceurParams.BAR_OFFSET + fragment.seqBegin * $scope.sequenceurParams.RATIO_POINT_TO_SECOND;
        textProperties.y = $scope.sequenceurParams.LINE_HEIGHT * (level + 0.75);
        
        //information from fragment
        textProperties.uri = fragment.uri;
        textProperties.indexIndexedTrack = indexIndexedTrack;
        textProperties.level = level;
        textProperties.indexFragment = indexFragment;        
        
        textProperties.textLength = pointProperties.width;
        textProperties.lengthAdjust = "spacingAndGlyphs";
        textProperties.fill = "#FFF";
        textProperties.class = "tagName";
        textProperties.start = fragment.start;
        var text = createSVGElement("text", textProperties);
        text.innerHTML = fragment.name;

        text.addEventListener("click",function(event){
            event.preventDefault();
            //left click will start the video at the beginning of the fragment
            if(event.which == 1){
                var video = angular.element(document.querySelector('#video'));
                var time = fragment.start;//event.target.getAttribute("start");
                if(time != undefined){
                    video[0].pause();
                    video[0].currentTime = time;
                    video[0].play();   
                }
                if(event.ctrlKey){
                   //if right click, we open the dialog for the right tag               
                    var uri = fragment.name;//event.target.getAttribute("uri");
                    if(uri != undefined)
                        $scope.getClipData(uri);
                }
            }
        });
        currentLine.append(timePoint);
        currentLine.append(point);
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
        for (var ntrack = 0; ntrack < indexationData.indexedTracks.length && ntrack < index; ntrack++) {
            for (var nline = 0; nline < indexationData.indexedTracks[ntrack].levels.length; nline++) {
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
     * Description : show the popup to create a fragment
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
         * to the server, if a fragment is really created, we add it to the 
         * timeline and reload to display the new fragment. Else, a error message
         * is displayed to the user indicating which input is wrongly filled. 
         */
        $scope.create = function() {
            var indexationData = sharedMedia.getIndexationData();
            var track = $scope.selectedTrack;
            var tag = $scope.selectedTag;
            var fragType = indexationForm.fragmentType.value;
            var fragBegin = indexationForm.fragBegin.value;
            var fragEnd = indexationForm.fragEnd.value;       
            var msg = "";
            
            if(track == null || track == undefined)
                msg += "No track has been selected\n";
            
            if(tag == null || tag == undefined)
                msg += "No tag has been selected\n";
            
            if(!(fragType == "segment" || fragType == "point"))
                msg += "Wrong fragment type\n";
            
            if(!isFloat(fragBegin))
                msg += "fragment beginning is not a float\n";
            else if(parseFloat(fragBegin) > indexationData.duree)
                msg += "fragment beginning is superior to the video duration\n";
            
            if(fragType == "segment"){
                if(!isFloat(fragEnd))
                    msg += "fragment end is not a float\n";
                else if(fragEnd >= indexationData.duree)
                    msg += "fragment end is superior to the duration of the video\n";
                else if(isFloat(fragBegin) && parseFloat(fragEnd) < parseFloat(fragBegin))
                   msg += "fragment end is before fragment begin\n";
            }
            
            if(msg.length > 0 )
                alert(msg);
            else{   
                if(fragType == "segment")
                {
                    fragBegin = parseFloat(fragBegin);
                    fragEnd = parseFloat(fragEnd);
                }else{
                    fragEnd = parseFloat(fragBegin);
                }      
                
                
                
                //we need to search for the id of each element (the media and the tag (if the tag has for id 0, it is a new one)
                var mediaURI = sharedMedia.getMediaURI();
                //We don't need the start time nor the end time but we need the uri and the nature of the tag
                var partialFragment = searchTagByName(tag);
                $http({
                    method: 'GET',
                    url: 'http://localhost:3000/api/createFragment/',
                    params : {"mediaURI" : mediaURI, "trackName": track,"tagURI" : partialFragment.uri, "tagName" : partialFragment.name  , "tagNature" : partialFragment.nature, "fragType" : fragType, "fragBegin" : fragBegin, "fragEnd" : fragEnd}
                }).then(function successCallback(response) {
                    var ans = response.data;
                    if(ans.success){
                        addFragment(ans.data);
                        $mdDialog.hide();
                    }
                    else{
                        alert(ans.message);
                    }
                }, function errorCallback(response) {
                });       
            }         
            
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
                            tags.push({"name" : $scope.selectedTag, "uri" : ""});
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
            var elem = angular.element(document.getElementById("autocompleteTrack"));
            elem[0].querySelector("input").style.border = "1px solid green";
            $scope.selectedTrack = item;
        };
        /**
         * function selectedTagChange 
         * Description : Affect to selectedTag the value item which is the tag that the user selects/or creates from the dropdown list
         * @param {String} item
         */
        $scope.selectedTagChange = function(item){
            var elem = angular.element(document.getElementById("autocompleteTag"));
            elem[0].querySelector("input").style.border = "1px solid green";
            $scope.selectedTag = item;
        };
        
        
        /**
         * function searchTrackChange
         * Description : set selectedTrack to null for validation purpose
         */
        $scope.searchTrackChange = function(){
            $scope.selectedTrack = null;
            var elem = angular.element(document.getElementById("autocompleteTrack"));
            elem[0].querySelector("input").style.border = "";
        }
        
        /**
         * function searchTagChange
         * Description : set selectedTag to null for validation purpose
         */
        $scope.searchTagChange = function(){
            $scope.selectedTag = null;
            var elem = angular.element(document.getElementById("autocompleteTag"));
            elem[0].querySelector("input").style.border = "";
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
        
        /**
         * function searchTagByNae
         * description : return the name, uri and nature of the tag if its name is matched by tagName from the data got from clipController
         * @param {type} tagName
         * @returns {JSON} {name, uri, nature}
         */
        function searchTagByName(tagName){
            var indexationData = sharedMedia.getIndexationData();
            for(var i=0; i<indexationData.tagNames.length; i++){
                var tag = indexationData.tagNames[i];
                if(String.toLowerCase(tag.name) == String.toLowerCase(tagName)){
                    return tag;
                }
            }
            return {"name" : tagName, "uri" : "", "nature" : ""};
        }        
        
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
      if (isNaN(value) || value == "" || parseFloat(value)< 0) {
        return false;
      }
      return true;
    }   

    /**
     * Add a fragment to the variable indexationData in the service and reload the timeline from the received data
     * @param {JSON} data
     */
    function addFragment(data)
    {
        var indexationData = sharedMedia.getIndexationData();
        var sequenceurParams = sharedMedia.getSequenceurParams();
        
        //We increment nbFragment to have an "id" accessible from the DOM like the others
        indexationData.nbFragment++;
        
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
            if(data.fragment.type == "segment"){
             indexationData.indexedTracks.push({
               "name" : data.track,
               "levels" : [[{
                    "start" : data.fragment.begin,
                    "end" : data.fragment.end,
                    "uri" : data.fragment.uri,
                    "name" : data.tag.name,
                    "type" : data.fragment.type,
                    "seqBegin" : data.fragment.begin, 
                    "seqEnd" :  data.fragment.end                      
                }]]    
            });               
            }
            else{
             indexationData.indexedTracks.push({
               "name" : data.track,
               "levels" : [[{
                    "start" : data.fragment.begin,
                    "end" : data.fragment.begin,
                    "uri" : data.fragment.uri,
                    "name" : data.tag.name,
                    "type" : data.fragment.type,
                    "seqBegin" : data.fragment.begin - sequenceurParams.POINT_WIDTH/2 , 
                    "seqEnd" :  data.fragment.begin + sequenceurParams.POINT_WIDTH/2                      
                }]]    
            });               
            }
            

        }else{
            var fragbegin = 0;
            var fragend = 0;
            var testLevel = 0;
            var superimposed = false;
            if (data.fragment.type == "segment") {
                fragbegin = data.fragment.begin;
                fragend = data.fragment.end;
            } else {
                fragbegin = parseFloat(data.fragment.begin) - sequenceurParams.POINT_WIDTH / 2;
                fragend = parseFloat(data.fragment.begin) + sequenceurParams.POINT_WIDTH / 2;
            }    

            //We need to browse to prevent the superposition
            for(var indexTrack = 0; indexTrack < indexationData.indexedTracks.length; indexTrack ++){
                var track = indexationData.indexedTracks[indexTrack];
                if(track.name == data.track){
                    for(var level = 0; level < track.levels.length; level++){
                        superimposed = false;
                        var line = track.levels[level];
                        for(var indexfragment = 0; indexfragment < line.length && !superimposed; indexfragment++){
                            var fragment = line[indexfragment];      
                            //superposition test
                            if (!((fragbegin < fragment.seqBegin && fragend <= fragment.seqBegin) || (fragbegin >= fragment.seqEnd && fragend > fragment.seqEnd))) {
                                testLevel++;
                                superimposed = true;
                            }
                        }
                    }
                    if (track.levels.length < (testLevel+1)) {
                        track.levels.push(new Array());
                    }
                    
                    if(data.fragment.type == "segment")
                    {
                        track.levels[testLevel].push({
                            "seqBegin" : fragbegin , 
                            "seqEnd" :  fragend,
                            "start" : fragbegin,
                            "end" : fragend,
                            "uri" : data.tag.uri,
                            "name" : data.tag.name,
                            "type" : data.fragment.type
                        });
                    }else{
                        track.levels[testLevel].push({
                            "seqBegin" : fragbegin, 
                            "seqEnd" :  fragend,
                            "start" : data.fragment.begin,
                            "end" : data.fragment.begin,
                            "uri" : data.tag.uri,
                            "name" : data.tag.name,
                            "type" : data.fragment.type
                        });
                    }
                    
                }
            }
        } 
        
        //We need to update the timeline now
        sharedMedia.setIndexationData(indexationData);
        $scope.$emit('reloadTimeline',indexationData);
    }
    
    
    
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
