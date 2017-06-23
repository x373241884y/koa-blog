var PageService = require('../service').PageService;
//管理接口
exports.doPost = function () {
	return {
		"/admin/addPage.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_title = req_pargs.post_title;
			var post_content = req_pargs.post_content;
			var post_status = req_pargs.post_status;

			try {
				await PageService.addPage({
					post_author: ctx.req.session.user.ID,
					post_title: post_title,
					post_content: post_content,
					post_status: post_status,
					post_date: new Date(),
					post_date_gmt: new Date()
				});
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			} catch (err) {
				ctx.errorProxy(err);
			}
		},
		"/admin/deletePage.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_id = req_pargs.post_id;
			try {
				await PageService.removePage(post_id);
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			} catch (err) {
				ctx.errorProxy(err);
			}
		},
		"/admin/getPage.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_id = req_pargs.post_id;

			try {
				let page = await PageService.getPage(post_id);
				ctx.body = page;
			} catch (err) {
				ctx.errorProxy(err);
			}
		},
		"/admin/updatePage.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var post_id = req_pargs.post_id;
			var post_title = req_pargs.post_title;
			var post_content = req_pargs.post_content;
			var post_status = req_pargs.post_status;

			try {
				await PageService.updatePage({
					ID: post_id,
					post_title: post_title,
					post_status: post_status,
					post_content: post_content
				});
				ctx.body = {
					success: "ok",
					loginStatus: "1"
				};
			} catch (err) {
				ctx.errorProxy(err);
			}
		},
		"/admin/pageList.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;

			try {
				let pageModel = await PageService.pageModelOfPage(offset, limit);
				ctx.body = pageModel;
			} catch (err) {
				ctx.errorProxy(err);
			}
		}
	};
};