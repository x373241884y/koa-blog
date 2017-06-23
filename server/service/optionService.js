"use strict";
var optionDao = require("../dao").OptionDao;
var Promise = require('bluebird');
var cache = {autoloadOptions: {}};
module.exports = {
	createOption: function (option) {
		cache.autoloadOptions.dirty = true;
		return optionDao.create(option);
	},
	removeOption: function (optionID) {
		cache.autoloadOptions.dirty = true;
		return optionDao.remove({option_id:optionID});
	},
	//更新信息
	updateOption: function (option) {
		cache.autoloadOptions.dirty = true;
		return optionDao.update(option);
	},
	updateMulOption: function (options) {
		cache.autoloadOptions.dirty = true;
		return optionDao.updateMulOption(options);
	},
	//获取Option列表
	getOptionPage: function (offset, limit) {
		return new Promise(function (resolve, reject) {
			offset = offset || 0;
			limit = limit || 10;
			optionDao.getOptionPage(offset, limit).then(function (pageModel) {
				resolve(pageModel);
			}, function (error) {
				reject(error);
			});
		});
	},
	getOptions: function () {
		return optionDao.findAll();
	},
	//自动载入信息
	autoloadOption: function () {
		return new Promise(function (resolve, reject) {
			if(!cache.autoloadOptions){
				return resolve(cache.autoloadOptions.data);
			}
			optionDao.autoload().then(function (options) {
				var optionObj=	cache.autoloadOptions.data = {};
				options.forEach(function (temp) {
					optionObj[temp.option_name] = temp.option_value;
				});
				cache.autoloadOptions.dirty = false;
				resolve(optionObj);
			}).caught(function (err) {
				reject(err);
			});
		});
	}
};