var services = require('../service');
var postService = services.PostService;
var termService = services.TermService;
var pageService = services.PageService;
var commentService = services.CommentService;
var optionService = services.OptionService;
var Promise = require('bluebird');
/**
 * 首页
 * @returns {Function}
 */
exports.index = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: "/",
		controller: async function (ctx, next) {
			try {
				var offset = Number(ctx.query.start) || 0;
				var limit = Number(ctx.query.limit) || 5;
				var req = ctx.request;
				let [postPageModel, categoryList, articleArchList, postNewestList, pageNewestList, option]=await Promise.all(
					[postService.findPostPageModel(offset, limit),
						termService.getAllCategory(),
						postService.findArticleArchive(),
						postService.findLastestPost(),
						pageService.findLastestPage(),
						optionService.autoloadOption()]);
				req.postNewestList = postNewestList;
				req.articleArchList = articleArchList;
				req.categoryList = categoryList;
				req.pageNewestList = pageNewestList;
				req.home = {
					type: "list",
					listType: "index",
					pageModel: postPageModel
				};
				req.autoloadOption = option;
				await ctx.render("index");
			} catch (err) {
				await ctx.errorProxy(err);
			}
		}
	}
};
/**
 * 关键字搜索
 * @returns {{url: string, controller: controller}}
 */
exports.search = function () {
	return {
		url: "/search",
		controller: async function (ctx, next) {
			try {
				var word = ctx.query.word;
				var req = ctx.request;
				var offset = Number(ctx.query.start) || 0;
				var limit = Number(ctx.query.limit) || 5;
				if (!word) {
					return ctx.req.redirect("/");
				}
				let [pageModel, categoryList, articleArchList, postNewestList, pageNewestList, option]= await Promise.all([
					postService.findPostByWordPageModel(offset, limit, word),
					termService.getAllCategory(),
					postService.findArticleArchive(),
					postService.findLastestPost(),
					pageService.findLastestPage(),
					optionService.autoloadOption()]);
				req.categoryList = categoryList;
				req.articleArchList = articleArchList;
				req.postNewestList = postNewestList;
				req.pageNewestList = pageNewestList;
				req.home = {
					type: "list",
					listType: "search",
					word: word,
					pageModel: pageModel
				};
				req.autoloadOption = option;
				await ctx.render("index");
			} catch (err) {
				await ctx.errorProxy(err);
			}
		}
	}
};
/**
 * 阅读文章
 * @returns {{url: RegExp, controller: controller}}
 */
exports.indexPost = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: /\d{4}\/\d{1,2}\/\d{1,2}\/post(\d+)\/?$/,
		controller: async function (ctx, next) {
			try {
				var postID = ctx.params[0];
				var req = ctx.request;
				let [post, prevPost, nextPost, commentList, categoryList, articleArchList, postNewestList, pageNewestList, option]=await Promise.all([
					postService.getPost(postID),
					postService.findPrev(postID),
					postService.findNext(postID),
					commentService.findAllByPostId(postID),
					termService.getAllCategory(),
					postService.findArticleArchive(),
					postService.findLastestPost(),
					pageService.findLastestPage(),
					optionService.autoloadOption()]);
				req.previewPost = post;
				req.prevPost = prevPost;
				req.nextPost = nextPost;
				req.commentList = commentList;
				req.categoryList = categoryList;
				req.articleArchList = articleArchList;
				req.postNewestList = postNewestList;
				req.pageNewestList = pageNewestList;
				req.home = {
					type: "article"
				};
				req.autoloadOption = option;
				await ctx.render("index");
			} catch (err) {
				await ctx.errorProxy(err);
			}
		}
	}
};
/**
 * 展示关于等页面
 * @returns {{url: RegExp, controller: controller}}
 */
exports.indexPage = function () {
	return {
		url: /\d{4}\/\d{1,2}\/\d{1,2}\/page(\d+)\/?$/,
		controller: async function (ctx, next) {
			try {
				var id = ctx.params[0];
				var req = ctx.request;
				let [post, categoryList, articleArchList, postNewestList, pageNewestList, option]=    await Promise.all([
					pageService.getPage(id),
					termService.getAllCategory(),
					postService.findArticleArchive(),
					postService.findLastestPost(),
					pageService.findLastestPage(),
					optionService.autoloadOption()]);
				req.previewPost = post;
				req.categoryList = categoryList;
				req.articleArchList = articleArchList;
				req.postNewestList = postNewestList;
				req.pageNewestList = pageNewestList;
				req.home = {
					type: "page"
				};
				req.autoloadOption = option;
				await ctx.render("index");
			} catch (err) {
				await ctx.errorProxy(error);
			}
		}
	}
};
/**
 * 文章归档
 * @returns {{url: RegExp, controller: controller}}
 */
exports.indexArchive = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: /(\d{4})\/(\d{1,2})\/?$/,
		controller: async function (ctx, next) {
			try {
				var offset = Number(ctx.query.start) || 0;
				var limit = Number(ctx.query.limit) || 5;
				var year = ctx.params[0];
				var month = ctx.params[1];
				var req = ctx.request;
				let [pageModel, categoryList, articleArchList, postNewestList, pageNewestList, option]= await Promise.all([
					postService.findByArchivePageModel(offset, limit, {year: year, month: month}),
					termService.getAllCategory(),
					postService.findArticleArchive(),
					postService.findLastestPost(),
					pageService.findLastestPage(),
					optionService.autoloadOption()]);
				req.home = {
					type: "list",
					listType: "archive",
					year: year,
					month: month,
					pageModel: pageModel
				};
				req.categoryList = categoryList;
				req.articleArchList = articleArchList;
				req.postNewestList = postNewestList;
				req.pageNewestList = pageNewestList;
				req.autoloadOption = option;
				await ctx.render("index");
			} catch (err) {
				await ctx.errorProxy(err);
			}
		}
	}
};
/**
 * 分类归档
 * @returns {{url: RegExp, controller: controller}}
 */
exports.indexCategory = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: /\/category\/([^\s\/]+)\/?$/,
		controller: async function (ctx, next) {
			try {
				var pargs1 = ctx.params[0];
				var offset = Number(ctx.query.start) || 0;
				var limit = Number(ctx.query.limit) || 5;
				var req = ctx.request;
				let [pageModel, categoryList, articleArchList, postNewestList, pageNewestList, option]=  await Promise.all([
					postService.findByCategoryPageModel(offset, limit, pargs1),
					termService.getAllCategory(),
					postService.findArticleArchive(),
					postService.findLastestPost(),
					pageService.findLastestPage(),
					optionService.autoloadOption()]);
				req.home = {
					type: "list",
					listType: "category",
					category: pargs1,
					pageModel: pageModel
				};
				req.categoryList = categoryList;
				req.articleArchList = articleArchList;
				req.postNewestList = postNewestList;
				req.pageNewestList = pageNewestList;
				req.autoloadOption = option;
				await ctx.render("index");
			} catch (err) {
				await ctx.errorProxy(err);
			}
		}
	}
};
/**
 * 标签分类
 * @returns {{url: RegExp, controller: controller}}
 */
exports.indexTag = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: /\/tag\/([^\s\/]+)\/?$/,
		controller: async function (ctx, next) {
			try {
				var pargs1 = ctx.params[0];
				var offset = Number(ctx.query.start) || 0;
				var limit = Number(ctx.query.limit) || 5;
				var req = ctx.request;
				let [pageModel, categoryList, articleArchList, postNewestList, pageNewestList, option]=await Promise.all([
					postService.findByTagPageModel(offset, limit, pargs1),
					termService.getAllCategory(),
					postService.findArticleArchive(),
					postService.findLastestPost(),
					pageService.findLastestPage(),
					optionService.autoloadOption()]);
				req.home = {
					type: "list",
					listType: "tag",
					category: pargs1,
					pageModel: pageModel
				};
				req.categoryList = categoryList;
				req.articleArchList = articleArchList;
				req.postNewestList = postNewestList;
				req.pageNewestList = pageNewestList;
				req.autoloadOption = option;
				await ctx.render("index");
			} catch (err) {
				await ctx.errorProxy(err);
			}
		}
	}
};
