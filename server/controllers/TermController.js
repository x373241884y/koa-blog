var termService = require('../service').TermService;
//分类管理
exports.doPost = function () {
	return {
		"/admin/addCategory.do": async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var name = req_pargs.name;
			var slug = req_pargs.slug;
			var parent = req_pargs.parent;
			var description = req_pargs.description;
			var newTerm = {
				name: name,
				slug: slug,
				parent: parent,
				description: description
			};
			try {
				await termService.addCategory(newTerm);
				ctx.body = {
					success: "ok",
					user: user
				};
			} catch (err) {
				await ctx.errorProxy(err);
			}

		},
		"/admin/addTag.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var name = req_pargs.name;
			var slug = req_pargs.slug;
			var description = req_pargs.description;
			var newTerm = {
				name: name,
				slug: slug,
				description: description
			};
			try {
				await termService.addTag(newTerm);
				ctx.body = {
					success: "ok",
					user: user
				};
			} catch (err) {
				await ctx.errorProxy(err);
			}
		},
		"/admin/deleteCategory.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var term_id = req_pargs.term_id;
			try {
				await termService.removeTerm(term_id);
				ctx.body = {
					success: "ok",
					user: user
				};
			} catch (err) {
				await ctx.errorProxy(err);
			}
		},
		"/admin/deleteTag.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var term_id = req_pargs.term_id;
			try {
				await termService.removeTerm(term_id);
				ctx.body = {
					success: "ok",
					user: user
				};
			} catch (err) {
				await ctx.errorProxy(err);
			}
		},
		"/admin/updateCategory.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var term_id = req_pargs.term_id;
			var name = req_pargs.name;
			var slug = req_pargs.slug;
			var parent = req_pargs.parent;
			var description = req_pargs.description;
			try {
				await termService.updateCategory({
					term_id: term_id,
					name: name,
					slug: slug,
					parent: parent,
					description: description
				});
				ctx.body = {
					success: "ok",
					user: user
				};
			} catch (err) {
				await ctx.errorProxy(err);
			}
		},
		"/admin/updateTag.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var term_id = req_pargs.term_id;
			var name = req_pargs.name;
			var slug = req_pargs.slug;
			var description = req_pargs.description;

			try{
				await termService.updateTag({
					term_id: term_id,
					name: name,
					slug: slug,
					description: description
				});
				ctx.body = {
					success: "ok",
					user: user
				};
			}catch (err){
				await ctx.errorProxy(err);
			}
		},
		"/admin/termTagList.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;

			try{
				let pageModel = await termService.getTagPage(offset, limit);
				ctx.body = pageModel;
			}catch (err){
				await ctx.errorProxy(err);
			}
		},
		"/admin/getCategoryList.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;

			try{
				let pageModel = await termService.getCategoryPage(offset, limit);
				ctx.body = pageModel;
			}catch (err){
				await ctx.errorProxy(err);
			}
		},
		"/admin/getTagList.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;

			try{
				let pageModel = await termService.getTagPage(offset, limit);
				ctx.body = pageModel;
			}catch (err){
				await ctx.errorProxy(err);
			}
		},
		"/admin/getAllCategory.do":async function (ctx, next) {
			try{
				let allTag = await termService.getAllCategory();
				ctx.body = allTag;
			}catch (err){
				await ctx.errorProxy(err);
			}
		},
		"/admin/getAllTag.do":async function (ctx, next) {
			try{
				let allTag = await termService.getAllTags();
				ctx.body = allTag;
			}catch (err){
				await ctx.errorProxy(err);
			}
		}
	};
};