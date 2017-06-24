'use strict';

const mongoose = require('mongoose');
let config = require('config-lite');
let logger = require('./logger');
mongoose.connect(config.url, {server: {auto_reconnect: true}});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
	logger.info('连接数据成功')
});

db.on('error', function (error) {
	logger.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
});

db.on('close', function () {
	logger.info('数据库断开，重新连接数据库');
	mongoose.connect(config.url, {server: {auto_reconnect: true}});
});

module.exports = db;