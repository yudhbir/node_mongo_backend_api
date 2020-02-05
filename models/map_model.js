var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var mapschema=new Schema({
	lat:{type:String},
	long:{type:String},
	full_address:{type:String},	
}{timestamps:true});
var Maps=mongoose.model('Maps',mapschema);

module.exports=Maps;