"use strict";
var Option = require('../models').Option;
var sqlhelp = require("../utils/sqlHelper");
var pagehelp = require("./pageSqlHelper");
module.exports = {
	create: function (obj) {
		var option = new Option(obj);
		var sql = "insert into wp_options set ?";
		return sqlhelp.query(sql, option);
	},
	remove: function (option) {
		var sql = "delete  from wp_options where option_id=?";
		return sqlhelp.query(sql, [option.option_id]);
	},
	update: function (option) {
		var sql = "update wp_options set option_name=? ,option_value=? where option_id=?";
		return sqlhelp.query(sql, [option.option_name,option.option_value,option.option_id]);
	},
	updateMulOption: function (options) {
		var sql = "update wp_options set option_name=? ,option_value=? where option_id=?";

		return Promise(function (resolve, reject) {
			sqlhelp.withTransaction(function (connection) {
				var promises = [];
				options.forEach(function (temp) {
					promises.push(function () {
						return connection.queryAsync(sql, [temp.option_value, temp.option_name,temp.option_id]);
					});
				});
				return Promise.all(promises);
			}).then(function (result) {
				resolve(result)
			}).caught(function (err) {
				reject(err);
			});
		});
	},
	getById: function (id) {
		var sql = 'select * from wp_options where option_id=?';
		return sqlhelp.queryOne(sql, [id]);
	},
	getOptionPage: function (offset,limit) {
		var sql = "select * from wp_options";
		return pagehelp.getPageModel(offset, limit, sql);
	},
	findAll: function () {
		var sql = "select * from wp_options";
		return sqlhelp.query(sql);
	},
	autoload:function(){
		return sqlhelp.query('select * from wp_options where autoload=\'yes\'');
	}
};