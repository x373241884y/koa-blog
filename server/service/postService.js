"use strict";
var postDao = require("../dao").PostDao;
var termDao = require("../dao").TermDao;
var Promise = require('bluebird');
var filterTerm = require('../utils/filters');
var cache = {findArticleArchive: {}};
module.exports = {
	addPost: function (post) {
		return new Promise(function (resolve, reject) {
			post.post_type = 'post';
			post.post_status =post.post_status|| 'publish';

			var termIdArray = post.termRelations;
			if(termIdArray&&termIdArray.length){
				post.termRelations = termIdArray;
			}else{
				post.termRelations = [];
			}

			return postDao.createPost(post).then(function (result) {
				cache.findArticleArchive.dirty = true;
				return resolve(result);
			}, function (error) {
				return reject(error);
			});
		});
	},
	removePost: function (postID) {
		return new Promise(function (resolve, reject) {
			postDao.getById(postID).then(function (post) {
				if (post === null) {
					reject({
						errorMessage: "post不存在！"
					});
				} else {
					resolve(postDao.removePost(post));
				}
			});
			postDao.removePost({ID: postID}).then(function (result) {
				cache.findArticleArchive.dirty = true;
				resolve(result);
			}, function (error) {
				reject(error);
			});
		});
	},
	updatePost: function (post2) {
		return new Promise(function (resolve, reject) {
			postDao.getById(post2.ID).then(function (post) {
				if (post === null) {
					reject({
						errorMessage: "post不存在！"
					});
				} else {
					if(post2.post_status){
						post.post_status = post2.post_status;
					}
					post.post_title = post2.post_title;
					post.post_content = post2.post_content;
					post.post_modified = post2.post_modified;
					post.post_modified_gmt = post2.post_modified_gmt;
					post.termRelations=post2.termRelations||[];
					postDao.getPostTerms(post2.ID).then(function (terms) {
						if(terms&&terms.length>0){
							post.oldTermRelations=terms.map(function (temp) {
								return temp.term_taxonomy_id;
							});
						}else{
							post.oldTermRelations=[];
						}
						resolve(postDao.updatePost(post));
					}).caught(function (err) {
						reject(err);
					});
				}
			});

		});
	},
	getPost: function (postId) {
		return new Promise(function (resolve, reject) {
			Promise.all([postDao.getById(postId), postDao.getPostTerms(postId)])
				.spread(function (post, terms) {
					post.categoryList = filterTerm.filterCategory(terms);
					post.tagList = filterTerm.filterTags(terms);
					resolve(post);
				})
				.caught(function (error) {
					reject(error);
				});
		});
	},
	findPrev: function (postId) {
		return new Promise(function (resolve, reject) {
			return postDao.getPrev(postId).then(function (post) {
				resolve(post);
			}, function (error) {
				reject(error);
			});
		});
	},
	findNext: function (postId) {
		return new Promise(function (resolve, reject) {
			return postDao.getNext(postId).then(function (post) {
				resolve(post);
			}, function (error) {
				reject(error);
			});
		});
	},
	pageModelOfPost: function (offset, limit) {
		return new Promise(function (resolve, reject) {
			return postDao.getPageModel1(offset, limit).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	/**前台服务**/
	findPostPageModel: function (offset, limit) {
		return new Promise(function (resolve, reject) {
			return postDao.getPostListA(offset, limit).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	findArticleArchive: function () {
		return new Promise(function (resolve, reject) {
			if (cache.findArticleArchive.dirty == false) {
				return resolve(cache.findArticleArchive.result);
			}
			return postDao.getArchive().then(function (result) {
				var list = JSON.parse(JSON.stringify(result));
				cache.findArticleArchive.result = list;
				cache.findArticleArchive.dirty = false;
				resolve(list);
			}, function (error) {
				reject(error);
			});
		});
	},
	findLastestPost: function () {
		return new Promise(function (resolve, reject) {
			return postDao.getLastestPost(6).then(function (result) {
				resolve(result);
			}, function (error) {
				reject(error);
			});
		});
	},
	findPostByWordPageModel: function (offset, limit, word) {
		return new Promise(function (resolve, reject) {
			return postDao.findByWord(offset, limit, word).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	findByArchivePageModel: function (offset, limit, archive) {
		return new Promise(function (resolve, reject) {
			return postDao.findByArchive(offset, limit, archive).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	findByCategoryPageModel: function (offset, limit, category) {
		return new Promise(function (resolve, reject) {
			return termDao.QryPostByCategory(offset, limit, category).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	findByTagPageModel: function (offset, limit, category) {
		return new Promise(function (resolve, reject) {
			return termDao.QryPostByTag(offset, limit, category).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	}

};