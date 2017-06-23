var optionsService = require('../service').OptionService;
/**
 * user setting...
 * @returns {Function}
 */
//ajax接口
exports.doPost = function () {
	return {
		"/admin/addOption.do":async function (ctx, next) {
			var req_pargs = ctx.request.body;
			var option_name = req_pargs.option_name;
			var option_value = req_pargs.option_value;

			try {
				await optionsService.createOption({
					option_name: option_name,
					option_value: option_value
				});
				ctx.body = {success: "ok"};
			}catch (err){
				ctx.errorProxy(err);
			}
		},
		"/admin/deleteOption.do":async function (ctx, next) {
			var req_pargs = req.body;
			var option_id = req_pargs.option_id;

			try {
				await optionsService.removeOption(option_id);
				ctx.body = {success: "ok"};
			}catch (err){
				ctx.errorProxy(err);
			}
		},
		"/admin/optionList.do":async function (ctx, next) {
			var req_pargs = req.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;

			try {
				let pageModel=await optionsService.getOptionPage(offset,limit);
				ctx.body = pageModel;
			}catch (err){
				ctx.errorProxy(err);
			}
		},
		"/admin/updateOption.do":async function (ctx, next) {
			var req_pargs = req.body;
			var option_id = req_pargs.option_id;
			var option_name = req_pargs.option_name;
			var option_value = req_pargs.option_value;

			try {
				let pageModel=await optionsService.updateOption({
					option_id:option_id,
					option_name:option_name,
					option_value:option_value
				});
				ctx.body = pageModel;
			}catch (err){
				ctx.errorProxy(err);
			}
		}
	};
};