var userService = require('../service').UserService;

//ajax接口
exports.doPost = function () {
	return {
		"/user/login.do": async function (ctx, next) {
			try {
				var req_pargs = ctx.request.body;
				var user_login = req_pargs.user_login;
				var user_pass = req_pargs.user_pass;
				let user = await userService.userLogin(user_login, user_pass);
				ctx.session.user = user;
				ctx.body = {
					success: "ok",
					user: user
				};
			} catch (error) {
				ctx.errorProxy(error);
			}
		},
		"/user/logout.do": async function (ctx, next) {
			var user = ctx.session.user;
			if (user) {
				ctx.session.user = undefined;
			}
			ctx.body = {
				success: "ok",
				loginStatus: "0"
			};
		},
		"/user/resetpwd.do": async function (ctx, next) {
			try{
				var req_pargs = ctx.request.body;
				var reset_key = req_pargs.reset_key;
				let user=await userService.userResetPwd({
					user_login: req_pargs.user_login,
					user_pass: req_pargs.user_pass
				}, reset_key);
				ctx.body={
					success: "ok",
					user: user
				}
			}catch (err){
				ctx.errorProxy(err);
			}
		},
		"/admin/getLoginInfo.do": async function (ctx, next) {
			var user = ctx.session.user;
			ctx.body = {
				user_login: user.user_login,
				display_name: user.display_name,
				user_nicename: user.user_nicename,
				user_email: user.user_email,
				user_url: user.user_url,
				user_status: user.user_status
			};
		},
		"/admin/userList.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;
			try {
				let pageModel = await userService.getUserPage(offset, limit);
				ctx.body = pageModel;
			} catch (err) {
				ctx.errorProxy(err);
			}
		},
		"/admin/getUser.do": async function (ctx, next) {
			var UserId = ctx.request.body.UserId;

			try {
				let user = await userService.getUserInfo(UserId);
				ctx.body = user;
			} catch (err) {
				ctx.errorProxy(err);
			}

		},
		"/admin/addUser.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var newUser = {
				user_login: req_pargs.user_login,
				user_pass: req_pargs.user_pass,
				user_email: req_pargs.user_email,
				user_url: req_pargs.user_url,
				display_name: req_pargs.display_name,
				user_nicename: req_pargs.user_nicename
			};

			try {
				let user = await userService.addUser(newUser);
				ctx.body = {
					"success": "ok",
					user: user
				};
			} catch (error) {
				ctx.errorProxy(error);
			}
		},
		"/admin/deleteUser.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var user_id = req_pargs.user_id;
			try {
				await userService.removeUser(user_id);
				ctx.body = {
					"success": "ok"
				}
			} catch (err) {
				ctx.errorProxy(err);
			}
		},
		"/admin/updateUser.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var newUser = {
				ID: req_pargs.user_id,
				user_login: req_pargs.user_login,
				oldpassword: req_pargs.oldpassword,
				newpassword: req_pargs.newpassword,
				user_email: req_pargs.user_email,
				user_url: req_pargs.user_url,
				display_name: req_pargs.display_name,
				user_nicename: req_pargs.user_nicename
			};

			try {
				let user = await userService.updateUser(newUser);
				ctx.body = {
					"success": "ok",
					user: user
				};
			} catch (err) {
				ctx.errorProxy(err);
			}
		}
	};
};