//
// Index routing code file : link between UX and front code
//

var express = require('express');
var router = express.Router();

//  Some implementation....

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: "AXIS-SOW-POC"});
});


module.exports = router;
