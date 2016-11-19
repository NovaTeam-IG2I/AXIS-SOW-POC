//
// API routing code file
//

var express = require('express');
var router = express.Router();

//  Some implementation....

router.route('/media')
  .post(function(req,res){

      //TODO create an importation method to add a media to the database
      res.send({message:"TODO import a media in the database"});
  })
  .delete(function(req,res){

      //TODO create an suppression method to delete a media from the database
      res.send({message:"TODO delete a media from the database"});
  })
  .get(function(req,res){

      //TODO create an get method to read all the media of the database
      res.send({message:"TODO get all the media of the database"});
  })

// allow us to use this routing configuration in other files as 'router'
module.exports = router;
