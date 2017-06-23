(function (window, angular, undefined) {
	'use strict';

	var services = {};
	services.$cookieService = [function () {
		return {
			addCookice: function (name, value, expireHours) {
				// TODO 添加函数过程
				var cookieStr = name + "=" + escape(value);
				//是否设置过期时间
				if (expireHours > 0) {
					var date = new Date();
					date.setTime(date.getTime + expireHours * 3600 * 1000);
					cookieStr = cookieStr + ";expires=" + date.toGMTString();
				}
				document.cookie = cookieStr;
			},
			getCookie: function (name) {

				var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
				if (arr != null)
					return unescape(arr[2]);
				return null;

			},
			deleteCookie: function (name) {
				var exp = new Date();
				exp.setTime(exp.getTime() - 10000);
				var cval = this.getCookie(name);
				if (cval != null) {
					document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
				}
			}
		};
	}];

	angular.module('app').factory(services);

})(window, window.angular);