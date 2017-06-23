"use strict";
var sqlhelp = require("../utils/sqlHelper");
var pagehelp = require("./pageSqlHelper");
module.exports = {
	create: function (user) {
		var sql = "insert into wp_users set ?";
		return sqlhelp.query(sql, user);
	},
	remove: function (user) {
		var sql = "delete  from wp_users where ID=?";
		return sqlhelp.query(sql, [user.ID]);
	},
	update: function (user) {
		var sql = "update wp_users set user_pass=? where user_login=?";
		return sqlhelp.query(sql, [user.user_pass,user.user_login]);
	},
	getById: function (id) {
		var sql = 'select * from wp_users where ID=?';
		return sqlhelp.queryOne(sql, [id]);
	},
	findAll: function () {
		var sql = "select * from wp_users";
		return sqlhelp.query(sql);
	},
	findByName: function (username) {
		var sql = 'select * from wp_users where user_login=?';
		return sqlhelp.queryOne(sql, [username]);
	},
	getPageModel: function (offset, limit) {
		var sql = "select * from wp_users";
		return pagehelp.getPageModel(offset, limit, sql);
	}
};