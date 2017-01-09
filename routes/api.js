//
// API routing code file
//

var express = require('express');
var router = express.Router();
var multer = require('multer')
var querystring = require('querystring');
var http = require('http');
var upload = multer({ dest: 'uploads/' })
//  Some implementation....

router.route('/import')
  .post(upload.single('file'),function(req,res){

      //TODO create an deplacement method to deplace a clip to a particular place
      req.header("Content-Type", "multipart/form-data");

      //
      // Send the imported file to the middleware
      //

      var postData = querystring.stringify({
        'file' : req.file
      });

      var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/productionsheet/test',
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      var request = http.request(options, (result) => {
        console.log(`STATUS: ${result.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        result.on('end', () => {
          console.log('No more data in response.');
        });
      });

      request.on('error', (e) => {
        console.log('problem with request: ${e.message}');
      });

      // write data to request body
      request.write(postData);
      request.end();
        })

router.route('/indexationdata/:id')
  .get(function(req,res){

      //TODO create a get method to get all the indexation of a media
    var data = {};
    /*data.indexedTracks = [];
    data.indexedTracks[0] = {};
    data.indexedTracks[0].name = "Image";*/
    
    data.tags = {};
        data.duree = 171;
        data.tags["0"] = {};
            data.tags["0"].name = "Président";
            data.tags["0"].id = "1";
            data.tags["0"].structure = {};
                data.tags["0"].structure["0"] = {"track" : "Image", "type" : "segment", "begin" : 7.2, "end" : 18 };
                data.tags["0"].structure["1"] = {"track" : "Audio", "type" : "segment", "begin" : 10.5, "end" : 18 };
                data.tags["0"].structure["2"] = {"track" : "Audio", "type" : "segment", "begin" : 23.5, "end" : 34 };
                data.tags["0"].structure["3"] = {"track" : "Audio", "type" : "segment", "begin" : 41.5, "end" : 50 };
                data.tags["0"].structure["4"] = {"track" : "Audio", "type" : "segment", "begin" : 59, "end" : 70};
                data.tags["0"].structure["5"] = {"track" : "Image", "type" : "segment", "begin" : 25, "end" : 27 };
                data.tags["0"].structure["6"] = {"track" : "Image", "type" : "segment", "begin" : 32, "end" : 34 };
                data.tags["0"].structure["7"] = {"track" : "Image", "type" : "point", "begin" : 47, "end" : 50.5 };
                data.tags["0"].structure["8"] = {"track" : "Image", "type" : "segment", "begin" : 59, "end" : 60.6 };
                data.tags["0"].structure["9"] = {"track" : "Image", "type" : "segment", "begin" : 79, "end" : 81 };
                data.tags["0"].structure["10"] = {"track" : "Image", "type" : "segment", "begin" : 156, "end" : 165 };
                data.tags["0"].structure["11"] = {"track" : "Audio", "type" : "segment", "begin" : 154, "end" : 164};
        data.tags["1"] = {};
            data.tags["1"].name = "Directeur général";
            data.tags["1"].id = "2";
            data.tags["1"].structure = {};
                data.tags["1"].structure["0"] = {"track" : "Image", "type" : "segment", "begin" : 84, "end" : 97 };
                data.tags["1"].structure["1"] = {"track" : "Audio", "type" : "flag", "begin" : 117, "end" : 133 };
                data.tags["1"].structure["2"] = {"track" : "Image", "type" : "segment", "begin" : 15, "end" : 40 };
                
                
                
                
    res.json(data);
              
              
  })
  
router.route('/createFragment/')
  .get(function(req,res){
    var mediaId = req.param("mediaId", 0);
    var trackName = req.param("trackName", null);
    var tagId = req.param("tagId", 0);
    var tagName = req.param("tagName", null);
    var fragType = req.param("fragType", null);
    var fragBegin = req.param("fragBegin", null);
    var fragEnd = req.param("fragEnd", null);
    
    var result = {};
    result.success = false;
    result.message = "";          
    if(mediaId == 0){
        result.message += "The media has not been specified. ";
    }else if(trackName == null){
        result.message += "The track has not been specified. ";
    }else if(fragType == null){
        result.message += "The type of fragment has not been specified. ";
    }else if(!(fragType == "segment" || fragType == "flag" )){
        result.message += "A fragment can only be a segment or a flag. ";            
    }else if(fragBegin == null){
        result.message += "The beginning time has not been specified. ";
    }else if(fragType == "segment" && fragEnd == null){
        result.message += "A segment needs an ending time. ";
    }else {   
        if(fragType == "flag")
            fragEnd = fragBegin;
        
        ////////////////////////////////////////////////////////////////
        //  Don't know if it is needed but we have the id of the tag  //
        //   We can create the fragment, we have all the needed data   //
        ////////////////////////////////////////////////////////////////
        result.success = true;
        result.data = {
          "track" : trackName,
          "tag" : { "id" : tagId, "name" : tagName },
          "fragment" : {"type" : fragType, "begin" : fragBegin, "end" : fragEnd}
        };
    }
    res.json(result);
              
  })

router.route('/productionsheet/:id')
  .get(function(req,res){

      //TODO create a get method to get all production metadata of a media
      console.log("TODO get all the production metadata of a media : " + req.params.id);

      /*var postData = querystring.stringify({
        'URI' : req.id
      });

      var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/productionsheet/test',
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      var request = http.request(options, (result) => {
        console.log(`STATUS: ${result.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        result.on('end', () => {
          console.log('No more data in response.');
        });
      });

      request.on('error', (e) => {
        console.log('problem with request: ${e.message}');
      });

      // write data to request body
      request.write(postData);
      request.end();*/

      var productionDataUnparsed = new Object();
      productionDataUnparsed.title = "Titanic";
      productionDataUnparsed.theme1 = "Drama";
      productionDataUnparsed.theme2 = "Love";
      productionDataUnparsed.theme3 = "Disaster";
      productionDataUnparsed.release = 1997;
      productionDataUnparsed.duration = 194;
      productionDataUnparsed.country = "USA";
      productionDataUnparsed.author = "James Cameron";
      productionDataUnparsed.director = "James Cameron";
      productionDataUnparsed.society = "20th Century Fox";
      
      
      var productionDataParsed = {};
      for(var key in productionDataUnparsed)
      {
          productionDataParsed[searchKey(key)] = productionDataUnparsed[key];
      }
      
      
      function searchKey(query){
        var traduction = {};
        traduction["title"] = "Title";
        traduction["theme1"] = "Theme 1";
        traduction["theme2"] = "Theme 2";
        traduction["theme3"] = "Theme 3";
        traduction["theme4"] = "Theme 4";
        traduction["theme5"] = "Theme 5";
        traduction["theme6"] = "Theme 6";
        traduction["release date"] = "Date";
        traduction["duration"] = "Duration";
        traduction["country"] = "Country";
        traduction["author"] = "Author";
        traduction["director"] = "Director";
        traduction["society"] = "Society";

        var regex = new RegExp(query,"gi");
        for(var key in traduction){
            if(key.search(regex) != -1)
                return traduction[key];
        }      
        return query;
      }
      
      res.json(productionDataParsed);

  })

router.route('/technicalsheet/:id')
  .get(function(req,res){

      //TODO create a get method to get all technical metadata of a media
      console.log("TODO get all the technical metadata of a media : " + req.params.id);

      /*var postData = querystring.stringify({
        'URI' : req.id
      });

      var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/productionsheet/test',
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      var request = http.request(options, (result) => {
        console.log(`STATUS: ${result.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        result.on('end', () => {
          console.log('No more data in response.');
        });
      });

      request.on('error', (e) => {
        console.log('problem with request: ${e.message}');
      });

      // write data to request body
      request.write(postData);
      request.end();*/

      var technicalDataUnparsed = new Object();
      technicalDataUnparsed.fileName = "Selma.mp4"
      technicalDataUnparsed.date = 2014;
      technicalDataUnparsed.fileSize = "700mo";
      technicalDataUnparsed.hyperLink = "httpï¿¼/www.imdb.com/title/tt1020072/";
      technicalDataUnparsed.rights = "Warner Bros";
      technicalDataUnparsed.duration = "128";
      technicalDataUnparsed.importationDate = "2016-12-22";
                  
      var technicalDataParsed = {};
      for(var key in technicalDataUnparsed)
      {
          technicalDataParsed[searchKey(key)] = technicalDataUnparsed[key];
      }
      
      
      function searchKey(query){
        var traduction = {};
        traduction["filename"] = "File name";
        traduction["date"] = "Date";
        traduction["datetime"] = "Date";
        traduction["filesize"] = "File Size";
        traduction["hyperlink"] = "Hyperlink";
        traduction["rights"] = "Rights";
        traduction["duration"] = "Duration";
        traduction["importationdate"] = "Importation Date";

        var regex = new RegExp(query,"gi");
        for(var key in traduction){
            if(key.search(regex) != -1)
                return traduction[key];
        }      
        return query;
      }
      
      res.json(technicalDataParsed);

  })

router.route('/clipsheet/:id')
  .get(function(req,res){

      //TODO create a get method to get all the metadata of a tag
      console.log("TODO get all the metadata of a tag : " + req.params.id);

      /*var postData = querystring.stringify({
        'URI' : req.id
      });

      var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/productionsheet/test',
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      var request = http.request(options, (result) => {
        console.log(`STATUS: ${result.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        result.on('end', () => {
          console.log('No more data in response.');
        });
      });

      request.on('error', (e) => {
        console.log('problem with request: ${e.message}');
      });

      // write data to request body
      request.write(postData);
      request.end();*/

      var tagData = new Object();
      tagData.start = "00:17:56";
      tagData.end = "00:21:23";
      tagData.subject = "Discussion between protagonists";
      tagData.track = "Video";
      tagData.media = "Titanic";
      res.json(tagData);

  })

router.route('/cliplist')
  .get(function(req,res){

      //TODO create a get method to get all the URI of all the clips
      console.log("TODO get all the URI of all the clips");

      /*var postData = querystring.stringify({
      });

      var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/productionsheet/test',
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      var request = http.request(options, (result) => {
        console.log(`STATUS: ${result.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        result.on('end', () => {
          console.log('No more data in response.');
        });
      });

      request.on('error', (e) => {
        console.log('problem with request: ${e.message}');
      });

      // write data to request body
      request.write(postData);
      request.end();*/

      var clipList = new Object();
      clipList.number = 6;
      clipList.videos = [
        {"id" : 1 , "adress" : "/video/salameche.mp4" , "thumbnail" : "http://placehold.it/400x300"},
        {"id" : 2 , "adress" : "/video/salameche.mp4" , "thumbnail" : "http://placehold.it/400x300"},
        {"id" : 3 , "adress" : "/video/salameche.mp4" , "thumbnail" : "http://placehold.it/400x300"},
        {"id" : 4 , "adress" : "/video/salameche.mp4" , "thumbnail" : "http://placehold.it/400x300"},
        {"id" : 5 , "adress" : "/video/salameche.mp4" , "thumbnail" : "http://placehold.it/400x300"},
        {"id" : 6 , "adress" : "/video/salameche.mp4" , "thumbnail" : "http://placehold.it/400x300"}
      ];
      res.json(clipList);

  })

// allow us to use this routing configuration in other files as 'router'
module.exports = router;
