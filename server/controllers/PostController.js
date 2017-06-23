var postService = require('../service').PostService;
/**
 * add user
 * @returns {Function}
 */
//管理接口
exports.doPost = function () {
	return {
		"/admin/addPost.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_title = req_pargs.post_title;
			var post_content = req_pargs.post_content;
			var post_status = req_pargs.post_status;
			var dt = new Date();
			var gmt = new Date(dt.setMinutes(dt.getMinutes() + 480));
			var user = ctx.session.user;
			try {
				await  postService.addPost({
					post_author: user.ID,
					post_title: post_title,
					post_content: post_content,
					post_status: post_status,
					post_date: gmt, //本地时间为dt+8*60
					post_date_gmt: dt, //假设系统时间以GMT时间为准
					post_modified: gmt, //本地时间为dt+8*60
					post_modified_gmt: dt, //假设系统时间以GMT时间为准
					termRelations: req_pargs.termRelations
				});
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			} catch (err) {
				await    ctx.errorProxy(error);
			}
		},
		"/admin/deletePost.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_id = req_pargs.post_id;

			try {
				await  postService.removePost(post_id);
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			} catch (err) {
				await ctx.errorProxy(err);
			}
		},
		"/admin/updatePost.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_id = req_pargs.post_id;
			var post_title = req_pargs.post_title;
			var post_content = req_pargs.post_content;
			var post_status = req_pargs.post_status;
			var dt = new Date();
			var gmt = new Date(dt.setMinutes(dt.getMinutes() + 480));
			try {
				await  postService.updatePost({
					ID: post_id,
					post_title: post_title,
					post_content: post_content,
					post_status: post_status,
					post_modified: gmt, //本地时间为dt+8*60
					post_modified_gmt: dt, //假设系统时间以GMT时间为准
					termRelations: req_pargs.termRelations
				});
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			} catch (err) {
				await ctx.errorProxy(err);
			}
		},
		"/admin/getPost.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_id = req_pargs.post_id;
			try {
				let post = await postService.getPost(post_id);
				ctx.body = post;
			} catch (err) {
				await ctx.errorProxy(err);
			}
		},
		"/admin/postList.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;
			try {
				let pageModel = await postService.pageModelOfPost(offset, limit);
				ctx.body = pageModel;
			} catch (err) {
				ctx.errorProxy(err);
			}
		}
	};
};
