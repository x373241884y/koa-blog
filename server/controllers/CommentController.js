var util = require("../utils/dateutils");
var commentService = require('../service').CommentService;
var Promise = require('bluebird');

exports.doPost = function () {
	return {
		"/comment/postComment.do":async function (ctx, next) {
			var req=ctx.req;
			var req_pargs = req.body;
			//客户端获取数据
			var comment_post_ID = req_pargs.post_id;
			var comment_author = req_pargs.author;
			var comment_author_email = req_pargs.email;
			var comment_author_url = req_pargs.url;
			var comment_content = req_pargs.content;
			var comment_parent = req_pargs.comment_parent;
			//计算或出来
			var comment_author_IP = req.headers.host.replace(/\:\d+/, "");
			var dt = new Date;
			var gmt = new Date(dt.setMinutes(dt.getMinutes() + 480));
			var comment_agent = req.headers["user-agent"];
			var user_id = req.session.user && req.session.user.user_login;
			try{
				await    commentService.addComment({
					comment_post_ID: comment_post_ID,
					comment_author: comment_author,
					comment_author_email: comment_author_email,
					comment_author_url: comment_author_url,
					comment_content: comment_content,
					comment_parent: comment_parent,
					comment_author_IP: comment_author_IP,
					comment_agent: comment_agent,
					comment_date: dt,
					comment_date_gmt: gmt,
					user_id: user_id
				});
				ctx.render("result/success", {"title": "Express", "prevUrl": "/"});
			}catch (err){
				ctx.render("result/error", {"title": "Express", error: err, "prevUrl": "/"});
			}
		}
	}
};

//管理接口
exports.doPost = function () {
	return {
		"/admin/commentlist.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var offset = Number(req_pargs.offset) || 0;
			var limit = Number(req_pargs.limit) || 10;

			try{
				let pageModel =await commentService.getPageModel(offset, limit);
				ctx.body=pageModel;
			}catch (err){
				ctx.errorProxy(err);
			}
		},
		"/admin/getComment.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var comment_ID = req_pargs.comment_ID;
			try{
				let commentList=await commentService.findById(comment_ID);
				if (commentList.length > 0) {
					ctx.body = commentList[0];
				} else {
					ctx.errorProxy("NotFoundException", {
						errorMessage: "没有找到该条评论"
					});
				}
			}catch (err){
				ctx.errorProxy(err);
			}
		},
		"/admin/commentApprove.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var comment_ID = req_pargs.comment_ID;
			var comment_approved = req_pargs.comment_approved;

			try{
				await commentService.updateByApprove({
					comment_ID: comment_ID,
					comment_approved: comment_approved
				});
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			}catch (err){
				ctx.errorProxy(err);
			}
		},
		"/admin/deleteComment.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var comment_ID = req_pargs.comment_ID;
			try{
				await commentService.removeComment(comment_ID);
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			}catch (err){
				ctx.errorProxy(err);
			}
		}
	}
};