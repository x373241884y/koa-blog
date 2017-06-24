var exceptMap = {
	DefaultExcept: "123456",
	SqlException: "591000",
	ExistException: "592000",
	NotFoundException: "404000",
	SystemException: "5150000",
	SessionTimeoutException: "999999"
};
var logger = require('./logger');

async function Proxy(errorObj, errorCode) { //foreground 前台标志
	var ctx = this;
	logger.error(`[errorProxy]: url(${ctx.url})=>${errorObj.stack}`);
	if (errorCode == 404 || errorCode == 500) {
		await ctx.render(errorCode + "");
	} else {
		if (errorObj == "sqlInject") {
			await ctx.render("404");
		}
		if (ctx.req.xhr) {
			errorObj = errorObj || {};
			if (errorObj.code === "ER_DUP_ENTRY") {
				errorObj.errorCode = exceptMap["SqlException"];
				errorObj.errorMessage = "已存在该条记录！";
			} else {
				errorObj.errorCode = exceptMap["DefaultExcept"];
				errorObj.errorMessage = "系统异常";
			}
			ctx.body = errorObj;
		} else {
			await ctx.render("500");
		}
	}

}
module.exports = Proxy;
