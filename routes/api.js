//
// API routing code file : link between website and webservice
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

      // Create a ReadStream with the webservice to upload our new media
      var form = new FormData();
      form.append('title',req.body.title);
      form.append('file', fs.createReadStream('./uploads/'+ req.body.file));
      form.submit('http://localhost:8080/AXIS-SOW-POC-backend/import', function(err, res) {
        res.resume();
      });

      res.send("End of transaction");
    })

router.route('/productionsheet/:uri')
    .get(function(req,res){

      //TODO create a get method to get all production metadata of a media
      console.log("TODO get all the production metadata of a media : " + req.params.uri);

      // GET request to the webservice to get the production data about the media currently watched
      http.get('http://localhost:8080/AXIS-SOW-POC-backend/production?uri=' + encodeURIComponent(req.params.uri), (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        // Error handlers
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

        // Response treatment
        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            res.json(parsedData);
          } catch (e) {
            console.log(e.message);
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    })

router.route('/technicalsheet/:uri')
    .get(function(req,res){

      //TODO create a get method to get all technical metadata of a media
      console.log("TODO get all the technical metadata of a media.");

      // GET request to the webservice to get the technical data about the media currently watched
      http.get('http://localhost:8080/AXIS-SOW-POC-backend/technical?uri=' + encodeURIComponent(req.params.uri), (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        // Error handlers
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

        // Response treatment
        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            res.json(parsedData);
          } catch (e) {
            console.log(e.message);
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    })

router.route('/clipsheet/:uri')
  .get(function(req,res){

      //TODO create a get method to get all the metadata of a tag
      console.log("TODO get all the metadata of a tag.");

      // GET request to the webservice to get the clip data about the tag selected
      http.get('http://localhost:8080/AXIS-SOW-POC-backend/clip?uri=' + encodeURIComponent(req.params.uri), (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        // Error handlers
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

        // Response treatment
        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            res.json(parsedData);
          } catch (e) {
            console.log(e.message);
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
  })

router.route('/cliplist')
    .get(function(req,res){

      //TODO create a get method to get all the URI of all the clips
      console.log("TODO get all the URI of all the clips");

      // GET request to the webservice to get the list of all the available media
      http.get('http://localhost:8080/AXIS-SOW-POC-backend/list', (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        // Error handlers
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

        // Response treatment
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

      http.get('http://localhost:8080/AXIS-SOW-POC-backend/structure?uri=' + encodeURIComponent(req.params.uri) , (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        // Error handlers
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

        // Response treatment
        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            parsedData.duree = 171;
            res.json(parsedData);
          } catch (e) {
            console.log(e.message);
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    })

router.route('/createFragment')
    .post(function(req,res){

      //TODO create a post method to add a fragment in the database

      var trackURI = req.body.trackURI;
      var tagURI = req.body.tagURI;
      var tagName = req.body.tagName;
      var tagNature = req.body.tagNature;
      var fragType = req.body.fragType;
      var fragBegin = req.body.fragBegin;
      var fragEnd = req.body.fragEnd;

      var resultTrack = {};
      resultTrack.success = false;
      resultTrack.message = "";
      if(trackURI == null){
          resultTrack.message += "The track has not been specified. ";
      } else if(fragType == null){
          resultTrack.message += "The type of fragment has not been specified. ";
      } else if(!(fragType == "segment" || fragType == "point" )){
          resultTrack.message += "A fragment can only be a segment or a flag. ";
      } else if(fragBegin == null){
          resultTrack.message += "The beginning time has not been specified. ";
      } else if (fragType == "segment" && fragEnd == null){
          resultTrack.message += "A segment needs an ending time. ";
      } else {
          if(fragType == "point") fragEnd = fragBegin;
          if(resultTrack.message == ""){
              resultTrack.success = true;
              // TODO HTTP POST REQUEST

              var postData = querystring.stringify({
                "track" : trackURI,
                "register" : tagURI,
                "type" : fragType,
                "start" : fragBegin,
                "end" : fragEnd
              });
              var options = {
                hostname: 'localhost',
                port: 8080,
                path: '/AXIS-SOW-POC-backend/fragment',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': Buffer.byteLength(postData)
                }
              };
              var RegisterURI;
              var request = http.request(options, (result) => {
                console.log(`STATUS: ${result.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
                result.setEncoding('utf8');
                // Response treatment
                let rawData = '';
                result.on('data', (chunk) => rawData += chunk);
                result.on('end', () => {
                  try {
                    let parsedData = JSON.parse(rawData);
                    RegisterURI = parsedData.uri;
                    console.log(parsedData);
                    console.log(RegisterURI);
                  } catch (e) {
                    console.log(e.message);
                  }
                });
              });

              request.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
              });

              // write data to request body
              request.write(postData);
              request.end();

              resultTrack.data = {
                "trackURI" : trackURI,
                "tag" : { "uri" : tagURI, "name" : tagName, "nature" : tagNature },
                "fragment" : {"type" : fragType, "begin" : fragBegin, "end" : fragEnd}
              };
          }
          else {
              resultTrack.data = {};
          }
      }

      res.json(resultTrack);
    })

router.route('/createTrack')
    .post(function(req,res){

      //TODO create a post method to add a track in the database

      var resultTrack = {};
      resultTrack.msg = "";
      resultTrack.data = {};
      resultTrack.success = false;
      if(req.body.uri == null || req.body.name == null || req.body.uri.length == 0 || req.body.name.length ==0){
          resultTrack.msg += "All the informations have not been completed \n";
      } else {
          var postData = querystring.stringify({
            "name" : req.body.name, "uri" : req.body.uri
          });

          var options = {
            hostname: 'localhost',
            port: 8080,
            path: '/AXIS-SOW-POC-backend/track',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData)
            }
          };

          var request = http.request(options, (result) => {
            console.log(`STATUS: ${result.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
            result.setEncoding('utf8');
            // Response treatment
            let rawData = '';
            result.on('data', (chunk) => rawData += chunk);
            result.on('end', () => {
              try {
                let parsedData = JSON.parse(rawData);
                resultTrack.success = true;
                resultTrack.data.uri = parsedData.uri;
                resultTrack.data.track = req.body.name;
                res.json(resultTrack);
              } catch (e) {
                console.log(e.message);
              }
            });
          });

          request.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
          });

          // write data to request body
          request.write(postData);
          request.end();
      }
    })

router.route('/exportation')
    .get(function(req,res){

      //TODO create an deplacement method to deplace a clip to a particular place

      http.get('http://localhost:8080/AXIS-SOW-POC-backend/export', (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        // Error handlers
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

        // Response treatment
        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
          try {
            res.send(rawData);
          } catch (e) {
            console.log(e.message);
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    })

router.route('/createRegister')
    .post(function(req,res){
      //TODO create a method to add a register to the database
      var postData = querystring.stringify({
        "name" : req.body.name, "class" : req.body.class
      });

      var options = {
        hostname: 'localhost',
        port: 8080,
        path: '/AXIS-SOW-POC-backend/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      var request = http.request(options, (result) => {
        console.log(`STATUS: ${result.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
          let parsedData = JSON.parse(chunk);
          console.log(`BODY: ${chunk}`);
          res.json(parsedData);
        });
        result.on('end', () => {
          console.log('No more data in response.');
        });
      });

      request.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
      });

      // write data to request body
      request.write(postData);
      request.end();
      //res.send("End of transaction");
    })

router.route('/listRegister')
    .get(function(req,res){

      //TODO create an deplacement method to deplace a clip to a particular place

      http.get('http://localhost:8080/AXIS-SOW-POC-backend/categories', (result) => {
        const statusCode = result.statusCode;
        const contentType = result.headers['content-type'];

        // Error handlers
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

        // Response treatment
        result.setEncoding('utf8');
        let rawData = '';
        result.on('data', (chunk) => rawData += chunk);
        result.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            res.send(parsedData);
          } catch (e) {
            console.log(e.message);
          }
        });
      }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
      });
    })

// allow us to use this routing configuration in other files as 'router'
module.exports = router;
