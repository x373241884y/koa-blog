"use strict";
var Term = require('../models').Term;
var sqlhelp = require('../utils/sqlHelper');
var termsqls = require('./SQLTemplate').termSql;
var pagehelp = require('./pageSqlHelper');
var Promise = require('bluebird');
var logger = require('../utils/logger');
module.exports = {
	create: function (term, options) {
		var sql = "insert into wp_terms set ?";
		return sqlhelp.query(sql, term);
	},
	create2: function (term) {
		var conn;
		return new Promise(function (resolve, reject) {
			function reject2(err, connection) {
				return connection.rollback(function () {
					logger.info('rollback.........');
					reject(err);
					connection && connection.release();
				});
			}
			sqlhelp.getConnection(function (err, connection) {
				conn = connection;
				if (err) {
					return reject2(err, conn);
				}
				connection.beginTransaction(function (err) {
					if (err) {
						return reject2(err, conn);
					}
					var term2 = new Term(term);
					connection.query("insert into wp_terms set ?", term2, function (err, okPacket) {
						if (err) {
							return reject2(err, conn);
						}
						var taxonomy = term.termTaxonomy;
						taxonomy.term_id = okPacket.insertId;
						connection.query("insert into wp_term_taxonomy set ?", taxonomy, function (err, okPacket) {
							if (err) {
								reject(err, conn);
							} else {
								connection.commit(function (err) {
									if (err) {
										reject2(err, conn);
									} else {
										resolve(okPacket);
									}
								});

							}
						});
					});
				});
			});
		});

	},
	remove: function (term) {
		var sql = "delete  from wp_terms where term_id=?";
		return sqlhelp.query(sql, term.term_id);
	},
	update: function (term) {
		var conn;
		return new Promise(function (resolve, reject) {
			function reject2(err, connection) {
				return connection.rollback(function () {
					logger.info('rollback.........');
					reject(err);
					connection && connection.release();
				});
			}
			sqlhelp.getConnection(function (err, connection) {
				conn = connection;
				if (err) {
					return reject2(err, conn);
				}
				connection.beginTransaction(function (err) {
					if (err) {
						return reject2(err, conn);
					}
					var term2 = new Term(term);
					connection.query("update wp_terms set name = ?, slug = ? where term_id=?",[term2.name,term2.slug,term.term_id], function (err, okPacket) {
						if (err) {
							return reject2(err, conn);
						}
						var taxonomy = term.termTaxonomy;
						connection.query("update wp_term_taxonomy set description = ? where term_id=?", [taxonomy.description,taxonomy.term_id], function (err, okPacket) {
							if (err) {
								reject(err, conn);
							} else {
								connection.commit(function (err) {
									if (err) {
										reject2(err, conn);
									} else {
										resolve(okPacket);
									}
								});

							}
						});
					});
				});
			});
		});
	},
	getById: function (term_id) {
		var sql = 'select * from wp_terms where term_id=' + sqlhelp.escape(term_id);
		return sqlhelp.queryOne(sql);
	},
	findBySlug:function(slug){
		var sql = 'select * from wp_terms where slug=' + sqlhelp.escape(slug);
		return sqlhelp.queryOne(sql);
	},
	findAllCategory: function () {
		return sqlhelp.query(termsqls.getAllCategory);
	},
	findAllTag: function () {
		return sqlhelp.query(termsqls.getAllTags);
	},
	getCategoryPage: function (offset, limit) {
		return pagehelp.getPageModel(offset, limit, termsqls.getCategoryPage);
	},
	getTagPage: function (offset, limit) {
		return pagehelp.getPageModel(offset, limit, termsqls.getTagPage);
	},
	QryPostByCategory:function(offset,limit,slug){
		return pagehelp.getPageModel(offset, limit, termsqls.QryPostByCategory,[slug]);
	},
	QryPostByTag:function(offset,limit,slug){
		return pagehelp.getPageModel(offset, limit, termsqls.QryPostByTag,[slug]);
	}
};