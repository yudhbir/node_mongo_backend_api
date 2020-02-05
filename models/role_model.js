var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var roleschema=new Schema({
	name:{type:String,require:true}

}{timestamps:true});
var Roles=mongoose.model('Roles',roleschema);

module.exports=Roles;