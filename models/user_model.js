var bcrypt = require('bcryptjs');
// var salt=process.env.APP_SALT;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email:  {
		type:String,
		required: [true, 'Please Enter your email'],
		match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
		validate: {
	      validator: function() {
	        return new Promise((res, rej) =>{
	          Users.findOne({email: this.email, _id: {$ne: this._id}})
	              .then(data => {
	                  if(data) {
	                      res(false)
	                  } else {
	                      res(true)
	                  }
	              })
	              .catch(err => {
	                  res(false)
	              })
	        })
	      }, message: 'Email Already Taken'
	    }		
	},
	password: {type:String,required: [true, 'Please Enter your password']},
	avatar:   {type: String,default: ''},
	/*role_type: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],*/
	status: {type: Number, enum: [1, 0],default: 0},
	resetPasswordToken: String,
  	resetPasswordExpires: Date
	},
	{
		timestamps: true
	}
);
userSchema.pre('save', function (next) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(this.password, salt);
	this.password = hash;
	return next();	  
});

var Users = mongoose.model('Users', userSchema);
Users.comparePassword = function(passw,hash_password) {
	// console.log(passw);
	return bcrypt.compareSync(passw, hash_password);  
}; 
module.exports=Users;