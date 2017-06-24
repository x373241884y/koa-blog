"use strict";
var Post = require('../models').Post;
var pagehelp = require('./pageSqlHelper');
var Promise = require('bluebird');
var sqlhelp = require('../utils/sqlHelper');
var postSqls = require("./SQLTemplate").postSql;
var termRelationshipSql = require("./SQLTemplate").termRelationshipSql;
module.exports = {
	createPost: function (obj) {
		return new Promise(function (resolve, reject) {
			sqlhelp.withTransaction(function (connection) {
				var post = new Post(obj);
				return connection.queryAsync(postSqls.save, post).then(function (okPacket) {
					var termRelations = obj.termRelations, values = [];
					if (termRelations.length > 0) {
						termRelations.forEach(function (temp) {
							values.push([okPacket.insertId, temp, 0]);
						});
					} else {
						values.push([okPacket.insertId, 1, 0]);
					}
					return connection.queryAsync(termRelationshipSql.saveMulti, [values]);
				});
			}).then(function (result) {
				resolve(result)
			}).caught(function (err) {
				reject(err);
			});
		});

	},
	createPage: function (obj) {
		var post = new Post(obj);
		return sqlhelp.query(postSqls.save, post);
	},
	removePost: function (post) {
		return new Promise(function (resolve, reject) {
			sqlhelp.withTransaction(function (connection) {
				return connection.queryAsync(postSqls.delete, post.ID).then(function (okPacket) {
					return connection.queryAsync(termRelationshipSql.deleteRelations, post.ID);
				});
			}).then(function (result) {
				resolve(result)
			}).caught(function (err) {
				reject(err);
			});
		});
	},
	removePage: function (post) {
		return sqlhelp.query(postSqls.delete, post.ID);
	},
	updatePost: function (obj) {
		return new Promise(function (resolve, reject) {

			sqlhelp.withTransaction(function (connection) {
				return connection.queryAsync(postSqls.update, [obj.post_title,
					obj.post_content,
					obj.post_status,
					obj.post_modified,
					obj.post_modified_gmt,
					obj.ID])
					.then(function (okPacket) {
						var termRelations = obj.termRelations, oldTermRelations = obj.oldTermRelations, values = [], deleteIndex = [];
						termRelations.forEach(function (temp) {
							if (oldTermRelations.indexOf(temp) < 0) {
								values.push([obj.ID, temp, 0]);
							}
						});
						oldTermRelations.forEach(function (temp) {
							if (termRelations.indexOf(temp) < 0) {
								deleteIndex.push(temp);
							}
						});
						console.log(deleteIndex.join(','));
						if (values.length > 0 && deleteIndex.length > 0) {
							return connection.queryAsync(termRelationshipSql.saveMulti, [values]).then(function (okPacket) {
								return connection.queryAsync(termRelationshipSql.deleteMuti, deleteIndex.join(','));
							});
						} else if (values.length > 0) {
							return connection.queryAsync(termRelationshipSql.saveMulti, [values]);
						} else if (deleteIndex.length > 0) {
							return connection.queryAsync(termRelationshipSql.deleteMuti, deleteIndex.join(','));
						} else {
							return Promise.resolve(okPacket);
						}
					});
			}).then(function (result) {
				resolve(result)
			}).caught(function (err) {
				reject(err);
			});
		});
	},
	updatePage: function (post) {
		return sqlhelp.query(postSqls.update, [post.post_title, post.post_content, post.post_status, post.ID]);
	},
	updateCategory: function (post) {
		return sqlhelp.query(postSqls.updateCategory, [post.term_taxonomy_id, post.ID]);
	},
	getById: function (id) {
		return sqlhelp.queryOne(postSqls.getById, [id]);
	},
	getPostTerms: function (id) {
		return sqlhelp.query(postSqls.getPostTerms, [id]);
	},
	getPageById: function (id) {
		return sqlhelp.queryOne(postSqls.getPageById, [id]);
	},
	getPrev: function (id) {
		return sqlhelp.queryOne(postSqls.getPrev, [id]);
	},
	getNext: function (id) {
		return sqlhelp.queryOne(postSqls.getNext, [id]);
	},
	getPostListA: function (offset, limit) {
		return pagehelp.getPageModel(offset, limit, postSqls.getPostListA);
	},
	getPageModel1: function (offset, limit) {
		return pagehelp.getPageModel(offset, limit, postSqls.getPostPageModel);
	},
	getPageModel2: function (offset, limit) {
		return pagehelp.getPageModel(offset, limit, postSqls.getPagePageModel);
	},
	getArchive: function (offset, limit) {
		return sqlhelp.query(postSqls.findArticleArchive);
	},
	getLastestPost: function (count) {
		return sqlhelp.query(postSqls.findNewestList);
	},
	getLastestPage: function (count) {
		return sqlhelp.query(postSqls.findNewestPage);
	},
	findByWord: function (offset, limit, word) {
		word = "%" + word + "%";
		var sql = postSqls.findPostByWordPageModel;
		sql = sqlhelp.format(sql, [word]);
		return pagehelp.getPageModel(offset, limit, sql);
	},
	findByArchive: function (offset, limit, archive) {
		var sql = sqlhelp.format(postSqls.findByYearMonthPageModel, [archive.year, archive.month]);
		return pagehelp.getPageModel(offset, limit, sql);
	},

	findByCategory: function (offset, limit, category) {
		var sql = sqlhelp.format(postSqls.findByCategoryPageModel, [category]);
		return pagehelp.getPageModel(offset, limit, sql);
	}

};