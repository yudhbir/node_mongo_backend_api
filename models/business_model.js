var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var businesschema=new Schema({
	name:{type:String,required:true},
	category:{type:String},//{type:Schema.Types.ObjectId, ref: 'Categories' },
	location:{type:Boolean,default:0},
	location_id:{type:Schema.Types.ObjectId, ref: 'Locations' },
	user_id:{type:Schema.Types.ObjectId, ref: 'Users' },
	phone_no:{type:String},
	verification_code:{type:Number},
	avatar:   {type: String,default: ''},	
	status: {type: Number, enum: [1, 0],default: 0}	
},{timestamps:true});
var Business=mongoose.model('Business',businesschema);

module.exports=Business;