var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var locationschema=new Schema({
	country:{type:String,required:true},
	street_address:{type:String,required:true},
	city:{type:String,required:true},
	state:{type:String,required:true},
	zip:{type:String,required:true},	
	lat:{type:String},
	long:{type:String},
	full_address:{type:String},	
	status: {type: Number, enum: [1, 0],default: 1}	
},{timestamps:true});
var Locations=mongoose.model('Locations',locationschema);

module.exports=Locations;