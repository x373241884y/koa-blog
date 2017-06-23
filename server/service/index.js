'use strict';
/**
 * 业务层
 * @type {*|exports|module.exports}
 */
var UserService = require('./userService');
var PostService = require('./postService');
var PageService = require('./pageService');
var TermService = require('./termService');
var CommentService = require('./commentService');
var OptionService = require('./optionService');

module.exports = {
	UserService:UserService,
	PostService:PostService,
	PageService:PageService,
	TermService:TermService,
	CommentService:CommentService,
	OptionService:OptionService
};
