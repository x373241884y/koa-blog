"use strict";
var TermTaxonomy = require("../models").TermTaxonomy;
var pageHelper = require('../utils/pageHelper');
module.exports = {
	create:function(taxonomy,options){
		var sql = "insert into wp_term_taxonomy set ?";
		return sqlhelp.query(sql, termTaxonomy);
	},
	remove:function(taxonomy){
		var sql = "delete  from wp_term_taxonomy where term_id=?";
		return sqlhelp.query(sql,taxonomy.term_id);
	},
	updateCategory:function(taxonomy){
		var sql = "update wp_term_taxonomy set description = ?, parent = ? where term_id=?";
		return sqlhelp.query(sql, [taxonomy.description,taxonomy.parent,taxonomy.term_id]);
	},
	updateTag:function(taxonomy){
		var sql = "update wp_term_taxonomy set description = ? where term_id=?";
		return sqlhelp.query(sql, [taxonomy.description,taxonomy.term_id]);
	},
	getById:function(id){
		var sql = 'select * from wp_term_taxonomy where term_taxonomy_id=' + sqlhelp.escape(id);
		return sqlhelp.queryOne(sql);
	},
	findAll:function(){
		var sql = "select * from wp_term_taxonomy";
		return sqlhelp.query(sql);
	}
};