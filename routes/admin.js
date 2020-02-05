var admin = require('../controllers/admin');
var verifyToken = require('../middleware/auth');
var express = require('express');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req,res){
	res.send("Every thing is working fine");
});
router.get('/users',admin.user_listing);
router.post('/users/profile/upload',admin.upload_avatar);

// router.post('/phone/verify',verifyToken,users.verify_phone);

module.exports = router;