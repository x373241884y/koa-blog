var sqlhelp = require("../utils/sqlHelper");
var Promise = require('bluebird');
var sqlfirewall=require("../utils/sqlFirewall");
var logger = require('../utils/logger');
function PageModel(offset, limit, list, count) {
	// 页面参数
	this.offset = offset;
	this.limit = this.pageSize = limit;
	// 数据库查询
	this.recordList = list;
	this.recordCount = count;

	// 计算其他的数据
	this.currentPage = parseInt(offset / limit) + 1;
	this.pageCount = parseInt((count - 1) / limit + 1);
	/**
	 * 总页数不多于10页， 则全部显示 总页数多于10页，则当显示附近10个页码 ×× 当前面页码不足4个，显示前10个页码 ××
	 * 当前面附近共10个页码，显示10个页码 ×× 当后面页码不足5个时，显示后10个页码
	 */
	if (this.pageCount <= limit) {
		this.beginPageIndex = 1;
		this.endPageIndex = this.pageCount;
	} else {
		this.beginPageIndex = this.currentPage - parseInt(limit / 2) - 1;
		this.endPageIndex = this.currentPage + parseInt(limit / 2);
		if (this.beginPageIndex < 1) {
			this.beginPageIndex = 1;
			this.endPageIndex = limit;
		}
		if (this.endPageIndex > this.pageCount) {
			this.endPageIndex = this.pageCount;
			this.beginPageIndex = this.pageCount - limit + 1;
		}
	}

}
function getPageBean(offset, limit, sql, parameters) {
	var defered = Promise.defer();
	if(sqlfirewall("number",[offset,limit])){
		logger.info("**********************分页查询开始************************");
		var pagemodel, queryCountSql, limitSql;
		limitSql = sql + " limit " + offset + "," + limit;
		queryCountSql = sql.toLowerCase().replace(/select.*from/, "select count(*) from");
		Promise.all([sqlhelp.query(queryCountSql, parameters), sqlhelp.query(limitSql, parameters)])
			.spread(function (countResult, list) {
				logger.info("**********************分页查询结束************************");
				pagemodel = new PageModel(offset, limit, list, countResult[0]["count(*)"]);
				defered.resolve(pagemodel);
			}, function (err) {
				defered.reject(err);
			});
	}else{
		logger.warn('sqlinject.....???????????');
		defered.reject("sqlInject");
	}
	return defered.promise;
}

exports.getPageModel = getPageBean;