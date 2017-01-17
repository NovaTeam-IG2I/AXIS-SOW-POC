//
// API routing code file
//

var express = require('express');
var router = express.Router();
var FormData = require('form-data');
var fs = require('fs');
var querystring = require('querystring');
var http = require('http');

//  Some implementation....

router.route('/import')
  .post(function(req,res){

      //TODO create an deplacement method to deplace a clip to a particular place
      req.header("Content-Type", "multipart/form-data");

      var form = new FormData();
      form.append('title',req.body.title);
      form.append('file', fs.createReadStream('./uploads/'+ req.body.file));
      form.submit('http://localhost:8080/AXIS-SOW-POC-backend/import', function(err, res) {
        // res – response object (http.IncomingMessage)  //
        res.resume();
      });
        })

router.route('/productionsheet/:uri')
  .get(function(req,res){

      //TODO create a get method to get all production metadata of a media
      console.log("TODO get all the production metadata of a media");

      /*var postData = querystring.stringify({
        'URI' : req.params.uri
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

router.route('/technicalsheet/:uri')
  .get(function(req,res){

      //TODO create a get method to get all technical metadata of a media
      console.log("TODO get all the technical metadata of a media.");

      /*var postData = querystring.stringify({
        'URI' : req.params.uri
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

router.route('/clipsheet/:uri')
  .get(function(req,res){

      //TODO create a get method to get all the metadata of a tag
      console.log("TODO get all the metadata of a tag.");

      /*var postData = querystring.stringify({
        'URI' : req.params.uri
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
      var tagDataUnparsed;
      switch(req.params.uri)
      {
          case "URI Président 1":
            tagDataUnparsed = { "type" : "segment", "start" : 7.2, "end" : 18, "uri" : "URI Président 1", "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 2":
            tagDataUnparsed = { "type" : "segment", "start" : 25, "end" : 27,  "uri" : "URI Président 2", "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 3":
            tagDataUnparsed = { "type" : "segment", "start" : 32, "end" : 34,  "uri" : "URI Président 3", "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 4":
            tagDataUnparsed = { "type" : "point" , "start" : 47, "end" : 50.5,"uri" : "URI Président 4", "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 5":
            tagDataUnparsed = { "type" : "segment", "start" : 59, "end" : 60.6,"uri" : "URI Président 5", "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 6":
            tagDataUnparsed = { "type" : "segment", "start" : 79, "end" : 87,  "uri" : "URI Président 6", "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 7":
            tagDataUnparsed = { "type" : "segment", "start" : 156, "end" : 165, "uri" : "URI Président 7", "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 8":
            tagDataUnparsed = { "type" : "segment", "start" : 10.5, "end" : 18, "uri" : "URI Président 8" ,  "nature" : "Personne", "name" : "Président" };
            break;
          case "URI Président 9":
            tagDataUnparsed = { "type" : "segment", "start" : 23.5, "end" : 34, "uri" : "URI Président 9" ,  "nature" : "Personne", "name" : "Président" };
            break;
          case "URI DG 1":
            tagDataUnparsed = { "type" : "segment", "start" : 84, "end" : 97, "uri" : "URI DG 1", "nature" : "Personne", "name" : "Directeur général"};
            break;
          case "URI DG 2":
            tagDataUnparsed = { "type" : "segment", "start" : 15, "end" : 40, "uri" : "URI DG 2", "nature" : "Personne", "name" : "Directeur général"};
            break;
          case "URI DG 3":
            tagDataUnparsed = { "type" : "segment", "start" : 41.5, "end" : 50, "uri" : "URI DG 3" ,  "nature" : "Personne", "name" : "Directeur général" };
            break;
          case "URI DG 4":
            tagDataUnparsed = { "type" : "segment", "start" : 59, "end" : 70, "uri" : "URI DG 4" ,  "nature" : "Personne", "name" : "Directeur général" };
            break;
          case "URI DG 5":
            tagDataUnparsed = { "type" : "segment", "start" : 154, "end" : 164, "uri" : "URI DG 5" ,  "nature" : "Personne", "name" : "Directeur général" };
            break;
          case "URI DG 6":
            tagDataUnparsed = { "type" : "segment", "start" : 7.2, "end" : 18, "uri" : "URI Président 1", "nature" : "Personne", "name" : "Président" };
            break;
          default :
           tagDataUnparsed =  { "type" : "N/A" , "start" : "N/A" , "end" : "N/A" , "uri" : "N/A" ,  "nature" :"N/A" , "name" : "N/A" };
          
      }


      /*
      if(req.params.uri == "URI Président")
      {

      tagDataUnparsed.start = "00:17:56";
      tagDataUnparsed.end = "00:21:23";
      tagDataUnparsed.subject = "Présentation du président de l'entreprise";
      tagDataUnparsed.track = "Video";
      tagDataUnparsed.media = "SVS presentation";
      }
      else
      {
       tagDataUnparsed.start = "00:40:56";
       tagDataUnparsed.end = "00:21:23";
       tagDataUnparsed.subject = "Présentation par le vice-directeur";
       tagDataUnparsed.track = "Video";
       tagDataUnparsed.media = "SVS présentation";

      }
      */
      
      var tagDataParsed = {};
      for(var key in tagDataUnparsed)
      {
          tagDataParsed[searchKey(key)] = tagDataUnparsed[key];
      }

      function searchKey(query){
        var traduction = {};
        traduction["start"] = "Start";
        traduction["type"] = "Type";
        traduction["uri"] = "URI";
        traduction["nature"] = "Nature";
        traduction["name"] = "Name";
        traduction["end"] = "End";
        traduction["subject"] = "Subject";
        traduction["track"] = "Indexed Track";
        traduction["media"] = "Indexed Media";

        var regex = new RegExp(query,"gi");
        for(var key in traduction){
            if(key.search(regex) != -1)
                return traduction[key];
        }
        return query;
      }

      res.json(tagDataParsed);

  })

router.route('/cliplist')
  .get(function(req,res){

      //TODO create a get method to get all the URI of all the clips
      console.log("TODO get all the URI of all the clips");

      http.get('http://localhost:8080/AXIS-SOW-POC-backend/list', (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\n` +
                        `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(`Invalid content-type.\n` +
                        `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.log(error.message);
          // consume response data to free up memory
          result.resume();
          return;
        }

        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            let sendData = new Object();
            sendData.videos = parsedData.videos;
            sendData.thumbnail = "http://placehold.it/400x300";
            sendData.number = sendData.videos.length;
            res.json(sendData);
          } catch (e) {
            console.log(e.message);
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });

  })

  router.route('/mediavideo/:uri')
    .get(function(req,res){

        //TODO create a get method to get all the URI of all the clips
        console.log("TODO get the video of a media by his URI");

        http.get('http://localhost:8080/AXIS-SOW-POC-backend/video?uri=' + encodeURIComponent(req.params.uri), (result) => {
          const statusCode = result.statusCode;
          const contentType = result.headers['content-type'];
          let error;
          if (statusCode !== 200) {
            error = new Error(`Request Failed.\n` +
                          `Status Code: ${statusCode}`);
          }
          if (error) {
            console.log(error.message);
            // consume response data to free up memory
            result.resume();
            return;
          }
          result.setEncoding('utf8');
          let rawData = '';
          result.on('data', (chunk) => rawData += chunk);
          result.on('end', () => {
            try {
              res.send('http://localhost:8080/AXIS-SOW-POC-backend/video?uri=' + encodeURIComponent(req.params.uri));
            } catch (e) {
              console.log(e.message);
            }
          });
        }).on('error', (e) => {
          console.log(`Got error: ${e.message}`);
        });

    })

    router.route('/indexationdata/:uri')
    .get(function(req,res){
        //TODO create a get method to get all the indexation of a media
      var data = {};
      data.duree = 171;
      data.indexedTracks = [];
          data.indexedTracks[0] = {};
          data.indexedTracks[0].name = "Image";
          data.indexedTracks[0].uri = "URI Image";
          data.indexedTracks[0].fragments = [];
              data.indexedTracks[0].fragments[0] = { "type" : "segment", "start" : 7.2, "end" : 18, "uri" : "URI Président 1", "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[0].fragments[1] = { "type" : "segment", "start" : 25, "end" : 27,  "uri" : "URI Président 2", "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[0].fragments[2] = { "type" : "segment", "start" : 32, "end" : 34,  "uri" : "URI Président 3", "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[0].fragments[3] = { "type" : "point" , "start" : 47, "end" : 50.5,"uri" : "URI Président 4", "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[0].fragments[4] = { "type" : "segment", "start" : 59, "end" : 60.6,"uri" : "URI Président 5", "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[0].fragments[5] = { "type" : "segment", "start" : 79, "end" : 87,  "uri" : "URI Président 6", "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[0].fragments[6] = { "type" : "segment", "start" : 156, "end" : 165, "uri" : "URI Président 7", "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[0].fragments[7] = { "type" : "segment", "start" : 84, "end" : 97, "uri" : "URI DG 1", "nature" : "Personne", "name" : "Directeur général"};
              data.indexedTracks[0].fragments[8] = { "type" : "segment", "start" : 15, "end" : 40, "uri" : "URI DG 2", "nature" : "Personne", "name" : "Directeur général"};
      data.indexedTracks[1] = {};
          data.indexedTracks[1].name = "Audio";
          data.indexedTracks[1].uri = "URI Audio";
          data.indexedTracks[1].fragments = [];
              data.indexedTracks[1].fragments[0] = { "type" : "segment", "start" : 10.5, "end" : 18, "uri" : "URI Président 8" ,  "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[1].fragments[1] = { "type" : "segment", "start" : 23.5, "end" : 34, "uri" : "URI Président 9" ,  "nature" : "Personne", "name" : "Président" };
              data.indexedTracks[1].fragments[2] = { "type" : "segment", "start" : 41.5, "end" : 50, "uri" : "URI DG 3" ,  "nature" : "Personne", "name" : "Directeur général" };
              data.indexedTracks[1].fragments[3] = { "type" : "segment", "start" : 59, "end" : 70, "uri" : "URI DG 4" ,  "nature" : "Personne", "name" : "Directeur général" };
              data.indexedTracks[1].fragments[4] = { "type" : "segment", "start" : 154, "end" : 164, "uri" : "URI DG 5" ,  "nature" : "Personne", "name" : "Directeur général" };
              data.indexedTracks[1].fragments[5] = { "type" : "point" , "start" : 50 , "end" : 55, "uri" : "URI DG 6" ,  "nature" : "Personne", "name" : "Directeur général" };
      res.json(data);
  })

  router.route('/createFragment/')
    .get(function(req,res){
      var trackURI = req.param("trackURI", null);
      var tagURI = req.param("tagURI", null);
      var tagName = req.param("tagName", null);
      var tagNature = req.param("tagNature", null);
      var fragType = req.param("fragType", null);
      var fragBegin = req.param("fragBegin", null);
      var fragEnd = req.param("fragEnd", null);

      var result = {};
      result.success = false;
      result.message = "";
      if(trackURI == null){
          result.message += "The track has not been specified. ";
      }else if(fragType == null){
          result.message += "The type of fragment has not been specified. ";
      }else if(!(fragType == "segment" || fragType == "point" )){
          result.message += "A fragment can only be a segment or a flag. ";
      }else if(fragBegin == null){
          result.message += "The beginning time has not been specified. ";
      }else if(fragType == "segment" && fragEnd == null){
          result.message += "A segment needs an ending time. ";
      }else {
          if(fragType == "point")
              fragEnd = fragBegin;
          if(result.message == "")
          {
              ////////////////////////////////////////////////////////////////
              //  Don't know if it is needed but we have the id of the tag  //
              //   We can create the fragment, we have all the needed data   //
              ////////////////////////////////////////////////////////////////
              result.success = true;
              result.data = {
                "trackURI" : trackURI, 
                "tag" : { "uri" : tagURI.concat("1"), "name" : tagName, "nature" : tagNature },
                "fragment" : {"type" : fragType, "begin" : fragBegin, "end" : fragEnd}
              };
          }
          else{
              result.data = {};
          }
      }
      res.json(result);

    })

    router.route('/createTrack/')
      .get(function(req,res){
        var mediaURI = req.param("mediaURI", null);
        var trackName = req.param("trackName", null);

        var result = {};
        result.msg = "";
        result.data = {};
        result.success = false;
        if(mediaURI == null || trackName == null || mediaURI.length == 0 || trackName.length ==0){
            result.msg += "All the informations have not been completed \n";
        }else{
            //REQUETE VERS LE SERVEUR <3 <3 <3
            //ON RECOIT LE RESULTAT QUI CONTIENT L'URI et le resultat
            //considerons que ça marche
            if(true){
                result.success = true;
                result.data.uri = "URI URI quand tu me tiens";
                result.data.track = trackName;
            }else{
                result.msg("An error occured in the request \n");
            }
        }
      
        res.json(result);

    })
    
// allow us to use this routing configuration in other files as 'router'
module.exports = router;
