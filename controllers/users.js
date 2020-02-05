var user_model = require('../models/user_model');
var business_model = require('../models/business_model');
var location_model = require('../models/location_model');
var sendResponse = require('../helpers/common');
var forgotMail = require('../helpers/forgot_mail');

var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var asyncd = require('async');

const secret=process.env.Token_Secret;

var User={
	signup:function(req,res){
		var user = new user_model({
			  email: req.body.email,
			  password:req.body.password,			  	   
		});
		user.save(function(err,user){
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
					return sendResponse(200,res,user);
				}
			}catch(error) {
				return sendResponse(400,res,{'message':error.message});		  
			}
		});
	},
	login:async function(req,res){
		var userInfo=await user_model.findOne({'email':'yudhbir@yopmail.com'}).exec();
		try {
				if(userInfo){
					var is_matched=user_model.comparePassword('1111111',userInfo.password);
					if(is_matched){
						var userinfo = userInfo.toObject();						
						let token = jwt.sign({auth_id: userinfo._id},secret,{expiresIn:'24h'});						
						userinfo.token=token;						
						return sendResponse(200,res,userinfo);
					}else{
						return sendResponse(400,res,{'message':'User is not a authorize user'});
					}
				}else{
					return sendResponse(400,res,{'message':'User is not exist'});
				}
		}catch(error) {
			return sendResponse(400,res,{'message':error.message});		  
		}
	},
	forgot_password:function(req,res,next){
		asyncd.waterfall([
		    function(done) {
		      crypto.randomBytes(20, function(err, buf) {
		        var token = buf.toString('hex');
		        done(err, token);
		      });
		    },
		    function(token, done) {
		      user_model.findOne({ email: req.body.email }, function(err, user) {
		        if (!user) {
		          return sendResponse(400,res,{'message':'No account with that email address exists.'});
		        }else{
			        user.resetPasswordToken = token;
			        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
			        user.save(function(err) {
			          done(err, token, user);
			        });
			    }
		      });
		    },
		    function(token, user, done) {
		    	try {		    		
		    		 return  forgotMail.forgot_link(req,token, user,done);				    
				}catch(error) {
					return sendResponse(400,res,{'message':error.message});		  
				}
		    }
		  ], function(err,result) {
		    if (err) {
		    	return sendResponse(400,res,{'message':err});	
		    }else{
			    return sendResponse(200,res,result);
			}
		});
	},
	reset_password:function(req,res,next){
		asyncd.waterfall([
		    function(done) {
		      user_model.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		        if (!user) {
		          	 return sendResponse(400,res,{'message':'Password reset token is invalid or has expired.'});	
		        }
		        user.password = req.body.password;
		        user.resetPasswordToken = undefined;
		        user.resetPasswordExpires = undefined;

		        user.save(function(err) {
		          done(err, user);
		        });
		      });
		    },
		    function(user, done) {
		    	try {		    		
		    		 return  forgotMail.confirmation_link(req,user,done);				    
				}catch(error) {
					return sendResponse(400,res,{'message':error.message});		  
				}
		    }
		  ], function(err,result) {
		    if (err) {
		    	return sendResponse(400,res,{'message':err});	
		    }else{
			    return sendResponse(200,res,result);
			}
		});
	},
	add_business:async function(req,res){		
		// return sendResponse(400,res,{'message':'working fine with tokenization :: '+req.decoded.email});
		var location_id="";	
		
		if(req.body.location){			
			location_id= await User.add_location(req,res);			
		}
		let verification_code=Math.floor(100 + Math.random() * 900);	
		var B_user = new business_model({
			  name: req.body.name,
			  category:req.body.category,			  	   
			  location:req.body.location,			  	   
			  location_id:location_id,
			  user_id:req.auth.auth_id,			  	   
			  phone_no:req.body.phone_no,			  	   
			  verification_code:verification_code,	  	   
		});
		await B_user.save(function(err,user){
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
					return sendResponse(200,res,user);
				}
			}catch(error) {
				return sendResponse(400,res,{'message':error.message});		  
			}
		});
	},
	add_location:async function(req,res){
		try {
		var location = new location_model({
			  country: req.body.country,
			  street_address:req.body.street_address,			  	   
			  city:req.body.city,			  	   
			  state:req.body.state,			  	   
			  zip:req.body.zip,
			  lat: req.body.lat,
			  long:req.body.long,			  	   
			  full_address:req.body.full_address
		});
		var location_info= await location.save();
			if(location_info._id){
				return location_info._id;
			}			
		}catch(error) {			
			if(error.message && error._message && error.message!=undefined){
				var res_err = error.message.replace(error._message+':', "");
				res_err 	= res_err.split(',');						
				return sendResponse(400,res,{'message':res_err});
			}else{
				return sendResponse(400,res,{'message':error.message});
			}			
		}
		// return location_data._id;
	},
	verify_phone:async function(req,res){
		var businessInfo=await business_model.findOne({'user_id':req.auth.auth_id}).exec();
		try {
				if(businessInfo){
					var is_matched=(req.body.code==businessInfo.verification_code)?true:false;
					if(is_matched){
						var userInfo= await user_model.findByIdAndUpdate(req.auth.auth_id,{'status':1},{new:true}).exec();
						return sendResponse(200,res,userInfo);
					}else{
						return sendResponse(400,res,{'message':'Please check your verification code'});
					}
				}else{
					return sendResponse(400,res,{'message':'User is not exist'});
				}
		}catch(error) {
			return sendResponse(400,res,{'message':error.message});		  
		}
	},
	search_business:function(req,res){
		let search_text = req.query.query;
		business_model.find({'name' : { '$regex' : search_text, '$options' : 'i' }},{'_id':1,'name':1},function(err,results){
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
					return sendResponse(200,res,results);
				}
			}catch(error) {
				return sendResponse(400,res,{'message':error.message});		  
			}		
		});
	},
	business_info:function(req,res){
		let business_id = req.params.id;
		business_model.findById({_id:business_id},function(err,results){
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
					return sendResponse(200,res,results);
				}
			}catch(error) {
				return sendResponse(400,res,{'message':error.message});		  
			}		
		});
	}	
}

module.exports=User;
