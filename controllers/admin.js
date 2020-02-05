var user_model = require('../models/user_model');
var business_model = require('../models/business_model');
var sendResponse = require('../helpers/common');
var multer = require('multer');
var path = require('path')


var admin={



	user_listing: function(req,res){
		user_model.find({},function(err,user_info){
			try {
				if(err){
					if(err.message && err.message!=undefined){
						var res_err = err.message.replace(err._message+':', "");
						res_err 	= res_err.split(',');						
						return sendResponse(400,res,{'message':res_err});
					}else{
						return sendResponse(400,res,{'message':err});
					}
				}else{
					return sendResponse(200,res,user_info);
				}
			}catch(error) {
				return sendResponse(400,res,{'message':error.message});		  
			}
		});
	},
	upload_avatar:function(req,res){
		 try {
		 	var storage = multer.diskStorage({
			    destination: (req, file, cb) => {
			      cb(null, 'public/images/uploads');
			    },
			    filename: (req, file, cb) => {
			    	let ext = path.extname(file.originalname)
			      cb(null, file.fieldname + '-' + Date.now()+ext);
			    }
			});
			var upload = multer({storage: storage,
					fileFilter: function(req, file, callback) {						
						var ext = path.extname(file.originalname);
						if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {							
							return sendResponse(400,res,{'message':'Only images are allowed'});
							//callback(new Error('Only images are allowed'+file.originalname), null);
						}else{
							callback(null, true)
						}
						
					}

			}).any('file');		 	
	         upload(req, res, (err) => {
	            if (err) {
	                return sendResponse(400,res,{'message':err});
	            }else{	            	
		            let results = req.files.map((file) => {
		                return {
		                    mediaName: file.filename,
		                    origMediaName: file.originalname,
		                    mediaSource: 'http://' + req.headers.host + '/images/uploads/' + file.filename
		                }
		            });
		            // console.log(req.files); 
		            return sendResponse(200,res,results);
		        }
	        });
	    } catch (e) {
	        return sendResponse(400,res,{ message: e.toString() });
	    }
	}

























}
module.exports = admin;