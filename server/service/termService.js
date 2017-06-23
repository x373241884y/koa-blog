"use strict";
var termDao = require('../dao').TermDao;
var taxonomyDao = require('../dao').TaxonomyDao;
var Promise = require('bluebird');
var cache = {
	getAllCategory: {},
	getAllTags: {}
};
module.exports = {
	//添加分类
	addCategory: function (term) {
		return new Promise(function (resolve, reject) {
			if (term.name && term.slug) {
				term.termTaxonomy = {
					taxonomy: "category",
					parent: term.parent || 0,
					description: term.description
				};
				return termDao.create2(term).then(
					function (result) {
						cache.getAllCategory.dirty = true;
						return resolve(result);
					},
					function (error) {
						return 	reject(error);
					});
			} else {
				reject({
					errorMessage: "分类名和别名不能为空!"
				});
			}
		});
	},
	//添加标签
	addTag: function (term) {
		return new Promise(function (resolve, reject) {
			if (term.name && term.slug) {
				term.termTaxonomy = {
					taxonomy: "post_tag",
					description: term.description
				};
				return termDao.create2(term).then(
					function (result) {
						cache.getAllTags.dirty = true;
						return resolve(result);
					},
					function (error) {
						return reject(error);
					});
			} else {
				reject({
					errorMessage: "标签名和别名不能为空!"
				});
			}
		});
	},
	//删除分类标签
	removeTerm: function (termId) {
		return new Promise(function (resolve, reject) {
			if (!termId) {
				return reject({
					errorMessage: "termId不能为空!"
				});
			}
			termDao.getById(termId).then(function (term) {
				if (term) {
					return termDao.remove(term).then(function (result) {
							cache.getAllCategory.dirty = true;
							cache.getAllTags.dirty = true;
							resolve(result);
						},
						function (error) {
							reject(error);
						});
				} else {
					reject({
						errorMessage: "term未找到!"
					});
				}
			}).caught(function (error) {
				reject(error);
			});
		});
	},
	//更新分类
	updateCategory: function (term) {
		return new Promise(function (resolve, reject) {
			if (term.term_id && term.name && term.slug) {
				termDao.getById(term.term_id).then(function (term2) {
					if(term2){
						term.termTaxonomy = {
							term_id: term.term_id,
							description: term.description
						};
						termDao.update(term).then(function (result) {
							cache.getAllCategory.dirty == true;
							resolve(result);
						}).caught(function (error) {
							reject(error);
						});
					}else{
						reject({
							errorMessage: "该分类不存在!"
						});
					}
				});
			} else {
				reject({
					errorMessage: "分类ID,分类名和别名不能为空!"
				});
			}
		});
	},
	//更新标签
	updateTag: function (term) {
		return new Promise(function (resolve, reject) {
			if (term.term_id && term.name && term.slug) {
				termDao.getById(term.term_id).then(function (term2) {
					if(term2){
						termDao.update(term).then(function (result) {
							cache.getAllTags.dirty = true;
							resolve(result);
						}).caught(function (error) {
							reject(error);
						});
					}else{
						reject({
							errorMessage: "该标签不存在!"
						});
					}
				});
			} else {
				reject({
					errorMessage: "标签ID,标签名和别名不能为空!"
				});
			}
		});
	},
	//通过别名获取分类
	getBySlug: function (slug) {
		return new Promise(function (resolve, reject) {
			termDao.findBySlug(slug).then(function (term) {
				resolve(term);
			}, function (error) {
				reject(error);
			});
		});
	},
	//获取分类列表
	getCategoryPage: function (offset, limit) {
		return new Promise(function (resolve, reject) {
			offset = offset || 0;
			limit = limit || 10;
			termDao.getCategoryPage(offset, limit).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	//获取标签列表
	getTagPage: function (offset, limit) {
		return new Promise(function (resolve, reject) {
			offset = offset || 0;
			limit = limit || 10;
			termDao.getTagPage(offset, limit).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	//获取所有分类
	getAllCategory: function () {
		return new Promise(function (resolve, reject) {
			if (cache.getAllCategory.dirty == false) {
				return resolve(cache.getAllCategory.pageModel);
			}
			termDao.findAllCategory().then(function (pageModel) {
				cache.getAllCategory.pageModel = pageModel;
				cache.getAllCategory.dirty = false;
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	//获取所有标签
	getAllTags: function () {
		return new Promise(function (resolve, reject) {
			if (cache.getAllTags.dirty == false) {
				return resolve(cache.getAllTags.pageModel);
			}
			termDao.findAllTag().then(function (pageModel) {
				cache.getAllTags.pageModel = pageModel;
				cache.getAllTags.dirty = false;
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	}
};