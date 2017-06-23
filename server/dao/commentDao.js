"use strict";
var Comment = require('../models').Comment;
var sqlhelp = require('../utils/sqlHelper');
var pagehelp = require('./pageSqlHelper');
module.exports = {
	create:function(obj){
		return new Promise(function (resolve, reject) {
			sqlhelp.withTransaction(function (connection) {
				var comment = new Comment(obj);
				return connection.queryAsync("insert into wp_comments set ?", comment).then(function (okPacket) {
					return connection.queryAsync("update wp_posts set comment_count = comment_count + 1 where ID=?", comment.comment_post_ID);
				});
			}).then(function (result) {
				resolve(result);
			}).caught(function (err) {
				reject(err);
			});
		});
	},
	remove:function(comment){
		return new Promise(function (resolve, reject) {
			sqlhelp.withTransaction(function (connection) {
				return connection.queryAsync("delete  from wp_comments where comment_ID=?", comment.comment_ID).then(function (okPacket) {
					return connection.queryAsync("update wp_posts set comment_count = comment_count - 1 where ID=? and comment_count>0", comment.comment_post_ID);
				});
			}).then(function (result) {
				resolve(result);
			}).caught(function (err) {
				reject(err);
			});
		});
	},
	getById:function(id){
		var sql = 'select * from wp_comments where comment_ID=?';
		return sqlhelp.queryOne(sql, [id]);
	},
	getPageModel:function(offset,limit){
		var sql = "select * from wp_comments";
		return pagehelp.getPageModel(offset, limit, sql);
	},
	findAllByPostId:function(postId){
		var sql = "select * from wp_comments where comment_post_ID=?";
		sql = sqlhelp.format(sql, [postId]);
		return sqlhelp.query(sql);
	}
};