var mongoose = require('mongoose');
try {
  mongoose.connect('mongodb://localhost:27017/melini', { useNewUrlParser: true,useUnifiedTopology: true,autoIndex: false },function(){
  	console.log('database is connected');
  });
} catch (error) {
  handleError(error);
}