var sendResponse = require('../helpers/common');
var nodemailer = require('nodemailer');
var forgot_mail={
	forgot_link:function(req,token, user,done){
		var smtpTransport = nodemailer.createTransport({
	        host: "smtp.mailtrap.io",
	    	port: 2525,
	        auth: {
	          user: 'd9e9d8c64c6348',
	          pass: '58ae697a576eb9'
	        }
	     });
		var link='http://' + req.headers.host + '/reset/' + token;
		var mailOptions = {
			to: user.email,
			from: 'yudhbir.s@iapptechnologies.com',
			subject: 'Node.js Password Reset',
			html: '<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>' +
          	'<p>Please click on the following link, or paste this into your browser to complete the process:<br><a href="'+link+'">'+link+'</a></p>' +
          	'<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>'
      };
		smtpTransport.verify(function(error, success) {
		  if (error) {
		    console.log(error);
		  } else {
		    console.log("Server is ready to take our messages");
		  }
		});
		smtpTransport.sendMail(mailOptions, function(err) {			
			if(err){
		        done(err,null)		        
		    }else{
				done(null,user);
			}
		});
	},
	confirmation_link:function(req, user, done){
		var smtpTransport = nodemailer.createTransport({
	        host: "smtp.mailtrap.io",
	    	port: 2525,
	        auth: {
	          user: 'd9e9d8c64c6348',
	          pass: '58ae697a576eb9'
	        }
	     });
		var mailOptions = {
	        to: user.email,
	        from: 'passwordreset@demo.com',
	        subject: 'Your password has been changed',
	        html: 'Hello,<br>' +
	          '<p>This is a confirmation that the password for your account ' + user.email + ' has just been changed.</p>'
	    };
	    smtpTransport.sendMail(mailOptions, function(err) {
	        if(err){
		        done(err,null)		        
		    }else{
				done(null,user);
			}
	    });
	}
}

module.exports=forgot_mail;