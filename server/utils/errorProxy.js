var exceptMap = {
	DefaultExcept: "123456",
	SqlException: "591000",
	ExistException:"592000",
	NotFoundException: "404000",
	SystemException: "5150000",
	SessionTimeoutException: "999999"
};

function Proxy(errorObj) { //foreground 前台标志
	console.log('\x1b[31m%s\x1b[47m' ,'[errorProxy]:'+ errorObj.stack);
	var ctx = this;
	if(errorObj=="sqlInject"){
		return ctx.render("404");
	}
	var req = ctx.req;
	if(req.xhr){
		errorObj = errorObj || {};
		if(errorObj.code==="ER_DUP_ENTRY"){
			errorObj.errorCode = exceptMap["SqlException"];
			errorObj.errorMessage = "已存在该条记录！";
		}else{
			errorObj.errorCode = exceptMap["DefaultExcept"];
			errorObj.errorMessage = "系统异常";
		}
		ctx.body = errorObj;
	}else{
		ctx.render("500");
	}

}
module.exports = Proxy;
