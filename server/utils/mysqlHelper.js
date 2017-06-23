'use strict';
var mysql = require('mysql');
var Promise = require('bluebird');
// so we require and promisifyAll them manually
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var config = require('config-lite');

var pool = mysql.createPool(config.url);

module.exports = {
	bootstrap: function () {
		var self = this;
		return new Promise(function (resolve, reject) {
			pool.queryAsync('SELECT 1 + 1 AS solution').then(function (results) {
				console.log('The solution is: ', results[0].solution);
				process.dbpool = pool;
				resolve(results[0].solution);
			}).caught(function (err) {
				reject(err);
			});
		});
	}
};
