'use strict';

module.exports = {
	port: 3000,
	// type:'mongodbb',
	// url: 'mongodb://localhost:27017/blogxu',
	type:'mysql',
	url: 'mysql://xxhblog:xxhblog@127.0.0.1/myblog?e&charset=utf8',
	loggerLevel: 'info',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		}
	}
};