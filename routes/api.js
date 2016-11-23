//
// API routing code file
//

var express = require('express');
var router = express.Router();

//  Some implementation....

router.route('/import')
  .post(function(req,res){

      //TODO create an deplacement method to deplace a clip to a particular place
      req.header("Content-Type", "multipart/form-data");
      res.send({message:"TODO deplace a clip to a location"});
  })
router.route('/list')
  .post(function(req,res){

      //TODO create an importation method to add a clip to the database
      res.send({message:"TODO import a clip in the database"});
  })
  .delete(function(req,res){

      //TODO create a suppression method to delete a clip from the database
      res.send({message:"TODO delete a clip from the database"});
  })
  .get(function(req,res){

      //TODO create a get method to read all the clip of the database
      res.send({message:"TODO get all the clip of the database"});
  })

router.route('/clip/:id')
  .get(function(req,res){

      //TODO create a loading method to get all the tags of the clip tracks
      res.send({message:"TODO get all the tags of a clip : " + req.params.id})
  })

router.route('/xmp/:id')
  .get(function(req,res){

      //TODO create a request methode to get the xmp part corresponding to a tag
      res.send({message:"TODO get the xmp part corresponding to the tag : " + req.params.id})
  })
router.route('/media/:id')
  .get(function(req,res){

      //TODO create a request methode to get the metadata and the xmp file of a clip
      res.send({message:"TODO get the metadata and the xmp file of the clip : " + req.params.id})
  })

// allow us to use this routing configuration in other files as 'router'
module.exports = router;
