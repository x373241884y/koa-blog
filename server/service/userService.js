"use strict";
var userDao = require("../dao").UserDao;
var pageHelper = require('../utils/pageHelper');
var Promise = require('bluebird');
var crypto = require('crypto');
var dateutils = require('../utils/dateutils');
module.exports = {
	//用户登录
	userLogin: function (username, password) {
		return new Promise(function (resolve, reject) {
			var md5 = crypto.createHash('md5');
			password = md5.update(password).digest('hex');
			userDao.findByName(username).then(function (user) {
				if (user) {
					if (user.user_pass !== password) {
						reject({
							errorMessage: "密码错误！"
						});
					} else {
						delete user.user_pass;
						resolve(user);
					}
				} else {
					reject({
						errorCode: "600404",
						errorMessage: "用户不存在！"
					});
				}
			});
		});
	},
	//用户注册
	userRegister: function (user) {
		return new Promise(function (resolve, reject) {
			userDao.findByName(user.user_login).then(function (result) {
				if (result) {
					reject({
						errorCode:"600404",
						errorMessage: "用户已存在！"
					});
				} else {
					userDao.create(user).then(function (result) {
						resolve(result);
					}, function (error) {
						reject(error);
					});
				}
			});
		});
	},
	//重置密码
	userResetPwd: function (user, key) {
		return new Promise(function (resolve, reject) {
			if (key&&key==='227754') {
				userDao.findByName(user.user_login).then(function (result) {
					if (!result) {
						reject({
							errorMessage: "用户不已存在！"
						});
					} else {
						user.ID = result.ID;
						var md5 = crypto.createHash('md5');
						user.user_pass = md5.update(user.user_pass).digest('hex');
						userDao.update(user).then(function(result){
							resolve(result);
						},function(error){
							reject(error);
						});
					}
				});
			} else {
				reject({
					errorCode: "123192",
					errorMessage: "key...is need！"
				});
			}

		});
	},
	//管理员添加用户
	addUser: function (user) {
		var md5 = crypto.createHash('md5');
		user.user_pass = md5.update(user.user_pass).digest('hex');
		user.user_status = "0";
		user.user_activation_key = dateutils.randomStr(16);
		user.user_registered = dateutils.format(new Date(), "yyyy-MM-dd HH:mm:ss");
		return new Promise(function(resolve,reject){
			userDao.findByName(user.user_login).then(function (result) {
				if (result) {
					reject({
						errorMessage: "用户已存在！"
					});
				} else {
					userDao.create(user).then(function(result){
						resolve(result);
					},function(error){
						reject(error);
					});
				}
			});
		})
	},
	//系统初始化
	setupManager: function (user) {
		user.user_level = 9;
		return this.addUser(user);
	},
	//删除用户
	removeUser: function (user_id) {
		return new Promise(function (resolve, reject) {
			if(!user_id){
				reject({
					errorMessage: "user_id is need"
				});
			}
			userDao.remove(user_id).then(function (result) {
				resolve(result);
			}, function (error) {
				reject(error);
			});
		});
	},
	//更新用户信息
	updateUser: function (user) {
		return new Promise(function(resolve,reject){
			if(!user.ID){
				reject({
					errorCode: "600404",
					errorMessage: "ID必须！"
				});
			}else if(!user.oldpassword){
				reject({
					errorCode: "600404",
					errorMessage: "password必须！"
				});
			}else{
				userDao.getById(user.ID).then(function(selectUser){
					if(!selectUser){
						reject({
							errorCode: "600404",
							errorMessage: "用户不存在！"
						});
					}else{
						var md5 = crypto.createHash('md5');
						user.user_pass = md5.update(user.oldpassword).digest('hex');

						if(user.user_pass===selectUser.user_pass){
							var newUser = {
								user_login: user.user_login,
								user_email: user.user_email,
								user_nicename: user.user_nicename,
								display_name: user.display_name,
								user_url: user.user_url
							};
							newUser.ID = selectUser.ID;
							var md52 = crypto.createHash('md5');
							newUser.user_pass = md52.update(user.newpassword).digest('hex');
							userDao.update(newUser).then(function(result){
								resolve(result);
							},function(error){
								reject(error);
							});
						}else{
							reject({
								errorCode: "600404",
								errorMessage: "密码错误！"
							});
						}
					}
				},function(error){
					reject(error);
				});
			}
		});
	},
	//获取用户信息
	getUserInfo: function (UserId) {
		return new Promise(function (resolve, reject) {
			userDao.getById(UserId).then(function (user) {
				if (user) {
					delete user.user_pass;
					resolve(user);
				} else {
					reject({
						errorCode: "600404",
						errorMessage: "用户不存在！"
					});
				}
			}, function (error) {
				reject(error);
			});
		});
	},
	//获取用户列表
	getUserPage: function (offset, limit) {
		return new Promise(function (resolve, reject) {
			userDao.getPageModel(offset, limit).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	}
};