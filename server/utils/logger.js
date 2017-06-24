var config = require('config-lite');

var winston = require('winston');
var dateUtils = require('./dateutils');

var logger = new (winston.Logger)({
	level: config.loggerLevel,
	transports: [
		new (winston.transports.Console)({
			colorize: 'all',
			timestamp: function () {
				return dateUtils.format(new Date(), '[yyyy-MM-dd HH:mm:ss]');
			}
		})
	]
});
logger.stream = {
	write: function(message, encoding){
		logger.info(message.slice(0, -1));
	}
};

module.exports = logger;