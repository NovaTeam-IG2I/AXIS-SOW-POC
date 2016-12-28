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
    data.informations = {};
    data.duree = 171;
    data.tags = {};
        data.tags["0"] = {};
            data.tags["0"].name = "Président";
            data.tags["0"].id = "1010";
            data.tags["0"].structure = {};
                data.tags["0"].structure["0"] = {"track" : "Image", "type" : "fragment", "begin" : 7.2, "end" : 18 };
                data.tags["0"].structure["1"] = {"track" : "Audio", "type" : "fragment", "begin" : 10.5, "end" : 18 };
                data.tags["0"].structure["2"] = {"track" : "Audio", "type" : "fragment", "begin" : 23.5, "end" : 34 };
                data.tags["0"].structure["3"] = {"track" : "Audio", "type" : "fragment", "begin" : 41.5, "end" : 50 };
                data.tags["0"].structure["4"] = {"track" : "Audio", "type" : "fragment", "begin" : 59, "end" : 70};
                data.tags["0"].structure["5"] = {"track" : "Image", "type" : "fragment", "begin" : 25, "end" : 27 };
                data.tags["0"].structure["6"] = {"track" : "Image", "type" : "fragment", "begin" : 32, "end" : 34 };
                data.tags["0"].structure["7"] = {"track" : "Image", "type" : "flag", "begin" : 47, "end" : 50.5 };
                data.tags["0"].structure["8"] = {"track" : "Image", "type" : "fragment", "begin" : 59, "end" : 60.6 };
                data.tags["0"].structure["9"] = {"track" : "Image", "type" : "fragment", "begin" : 79, "end" : 81 };
                data.tags["0"].structure["10"] = {"track" : "Image", "type" : "fragment", "begin" : 156, "end" : 165 };
                data.tags["0"].structure["11"] = {"track" : "Audio", "type" : "fragment", "begin" : 154, "end" : 164};
        data.tags["1"] = {};
            data.tags["1"].name = "Directeur général";
            data.tags["1"].id = "1011";
            data.tags["1"].structure = {};
                data.tags["1"].structure["0"] = {"track" : "Image", "type" : "fragment", "begin" : 84, "end" : 97 };
                data.tags["1"].structure["1"] = {"track" : "Audio", "type" : "flag", "begin" : 117, "end" : 133 };
                data.tags["1"].structure["2"] = {"track" : "Image", "type" : "fragment", "begin" : 15, "end" : 40 };
    res.json(data);
              
              
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

      var productionData = new Object();
      productionData.title = "Titanic";
      productionData.theme1 = "Drama";
      productionData.theme2 = "Love";
      productionData.theme3 = "Disaster";
      productionData.release = 1997;
      productionData.duration = 194;
      productionData.country = "USA";
      productionData.author = "James Cameron";
      productionData.director = "James Cameron";
      productionData.society = "20th Century Fox";
      res.json(productionData);

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

      var technicalData = new Object();
      technicalData.fileName = "Selma.mp4"
      technicalData.date = 2014;
      technicalData.fileSize = "700mo";
      technicalData.hyperLink = "httpï¿¼/www.imdb.com/title/tt1020072/";
      technicalData.rights = "Warner Bros";
      technicalData.duration = "128";
      technicalData.importationDate = "2016-12-22";
      res.json(technicalData);

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
