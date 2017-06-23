'use strict';

let config = require('config-lite'),db;
if(config.type==='mysql') {
	db = require('./mysqlHelper');
}else if(config.type==='mongodb'){
	db = require('./mongodbHelper');
}else{
	throw Error('not recognise database type');
}
module.exports = db;