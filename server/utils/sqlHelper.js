var mysql = require('mysql');
var Promise = require('bluebird');
exports.query = function () {
	console.info("sql query " + arguments[0]);
	var params = Array.prototype.slice.call(arguments, 0);

	return new Promise(function (resolve, reject) {
		params.push(function (err) {
			var args = Array.prototype.slice.call(arguments, 1);
			if (err) {
				console.log(err.stack);
				reject(err);
			}
			resolve.apply(this, args);
		});
		process.dbpool.query.apply(process.dbpool, params);
	});
};
exports.queryOne = function () {
	console.info("sqlOne query " + arguments[0]);
	var params = Array.prototype.slice.call(arguments, 0);

	return new Promise(function (resolve, reject) {
		params.push(function (err, result) {
			var uniqueResult;
			if (err) {
				console.log(err.stack);
				reject(err);
			}
			if (result && result.length > 0) {
				uniqueResult = result[0];
			}
			resolve.apply(this, [uniqueResult]);
		});
		process.dbpool.query.apply(process.dbpool, params);
	});
};
exports.getConnection = function () {
	return process.dbpool.getConnection.apply(process.dbpool, arguments);
};
function getSqlConnection() {
	return process.dbpool.getConnectionAsync().disposer(function (connection) {
		process.dbpool.releaseConnection(connection);
	});
}
exports.getSqlConnection = getSqlConnection;

exports.withTransaction = function (fn) {
	console.log('withTransaction--------start.........');
	return Promise.using(getSqlConnection(), function (connection) {
		return connection.beginTransactionAsync().then(function () {
			return Promise
				.try(fn, connection)
				.then(function (res) {
					console.log('withTransaction--------end.........');
					return connection.commitAsync().thenReturn(res)
				}, function (err) {
					console.log('withTransaction--------rollback.........');
					return connection.rollbackAsync()
						.catch(function (e) {/* maybe add the rollback error to err */
						})
						.thenThrow(err);
				});
		});
	});
};
exports.escape = mysql.escape;
exports.escapeId = mysql.escapeId;
exports.format = mysql.format;
