"use strict";
var transaction = require('../dao').transaction;
var commentDao = require("../dao").CommentDao;
var Promise = require('bluebird');
module.exports = {
	addComment:function(comment){
		return new Promise(function (resolve, reject) {
			if(!comment.comment_author||!comment.comment_author_email||!comment.comment_content){
				reject({
					errorMessage: "缺少评论必须的字段！"
				});
			}
			if(!comment.comment_author_url){
				comment.comment_author_url = "http://youke.com";
			}
			commentDao.create(comment).then(function (result) {
				resolve(result);
			}).then(function (err) {
				reject(err);
			});
		});

	},
	removeComment:function(commentId){
		return commentDao.getById(commentId).then(function (comment) {
			return commentDao.remove(comment);
		});
	},
	findById:function(id){
		return commentDao.getById(id);
	},
	getPageModel:function(offset,limit){
		return commentDao.getPageModel(offset, limit);
	},
	findAllByPostId:function(postId){
		return commentDao.findAllByPostId(postId);
	}
};