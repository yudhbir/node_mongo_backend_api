var users = require('../controllers/users');
var verifyToken = require('../middleware/auth');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req,res){
	res.send("Every thing is working fine");
});
router.post('/signup', users.signup);
router.get('/login',users.login);
router.post('/forgot',users.forgot_password);
router.post('/reset/:token',users.reset_password);
router.post('/business/add',verifyToken,users.add_business);
router.post('/phone/verify',verifyToken,users.verify_phone);
router.get('/business/search',users.search_business);
router.get('/business/information/:id',users.business_info);
// router.get('/login', verifyToken,users.login);

module.exports = router;
