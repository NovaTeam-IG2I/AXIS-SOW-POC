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
      //console.log('Request URL:', req.file);
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
      technicalData.camera = "Zenmuse";
      technicalData.width = "1920";
      technicalData.height = "1080";
      technicalData.lens = "X5R";
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

// allow us to use this routing configuration in other files as 'router'
module.exports = router;
