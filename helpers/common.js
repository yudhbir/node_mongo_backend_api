var send_response=function(code,response,result_info){
	if (code && code!=undefined) {
		var data = {success: true,result: ""};
		switch (code) {
			case 400: 
				data.success=false;
				data.result=result_info;
				response.status(code).json(data);
			break;
			case 200:
				data.result=result_info;
				response.status(code).json(data);
			break;
			case 500:
				data.success=false;
				data.result=result_info;
				response.status(code).json(data);
			break;
			default:
			data.success=false;
			data.result=result_info;
			response.send(data);
			break;
		}
	}
}

module.exports=send_response;