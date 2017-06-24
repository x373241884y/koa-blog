/**
 * @description 客户端接口,user for permission intercept
 * */

'use strict';

module.exports = intercept;

var logger = require('../utils/logger');
function intercept(path, options) {
	logger.info('use filter:permission');
	
	var opts = options || {};
	
	var REGEX_VIEW_ADMIN = /^\/admin\/\w.*$/;

	return async function intercept(ctx, next) {
		var url = ctx.url.replace(/\?.*/, "");
		if (REGEX_VIEW_ADMIN.test(url)) {
			var session = ctx.session, now = new Date();
			if (!session.user) { //user not login
				ctx.session.error = "请您先登录!";
				ctx.body = {
					errorMessage: "请您先登录",
					errorCode: "999999"
				}
			} else if (session.cookie && session.cookie.expires < now) { //session timeout
				ctx.session.user = undefined;
				ctx.body = {
					errorMessage: "回话超时,请重新登录!",
					errorCode: "999999"
				}
			}else{
				await next();
			}
		}else{
			await next();
		}
	};
}