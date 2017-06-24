var db = require('./utils/db');

let fs = require("fs");
let path = require("path");
const router = require('koa-router')();
let logger = require('./utils/logger');
let settings = {
	controllerPath: path.resolve(__dirname, 'controllers'),
	templateOptions: {
		marked: function () {
			logger.info('marked...');
		},
		utils: require('./utils/viewUtils'),
		doSEO: require('./utils/seoUtils')
	}
};

module.exports = async function (app) {
	try {
		await db.bootstrap();
		extendContext(app);
		errorHandler(app);
		configFilter(app);
		loadRoute(app);
	} catch (err) {
		logger.error(err);
	}
};
module.exports.logger = logger;

function extendContext(app) {
	logger.info('config extendContext');
	app.use(async(ctx, next) => {
		let session = ctx.session;
		let request = ctx.request;
		let response = ctx.response;
		ctx.errorProxy = require('./utils/errorProxy');
		ctx.state = Object.assign({ //extend template context
			session: session,
			request: request,
			response: response
		}, settings.templateOptions || {});
		await next();
	});
}
function errorHandler(app) {
	logger.info('config errorHandler');
	app.use(async(ctx, next) => {
		try {
			await next();
			if (ctx.status === 404) {
				ctx.throw(404);
			}
		} catch (err) {
			ctx.status = err.status || 500;
			ctx.body = err.message;
			await ctx.errorProxy(err, ctx.status);
		}
	});
}
function configFilter(app) {
	logger.info('config configFilter');
	app.use(require('./filters/permission')()); //permission
}

function loadRoute(app) {
	logger.info('config loadRoute');
	let ctrls_path = settings.controllerPath, ctrl_path, controller;
	let files = fs.readdirSync(ctrls_path);
	files.forEach(function (file) {
		ctrl_path = path.join(ctrls_path, file);
		controller = require(ctrl_path);
		Object.keys(controller).forEach(function (key) {
			if (key == "doGet" || key == 'doPost') { //注册多个get,多个post
				let routes = controller[key]();
				Object.keys(routes).forEach(function (temp) {
					configProxy(temp, routes[temp], key == "doGet" ? 'get' : 'post');
				});
			} else {
				let small_router = controller[key](), url;
				if (typeof small_router == "function") {
					configProxy("/" + key, small_router, 'get');
				} else {
					url = small_router.url || key;
					if (typeof url == "string" && url.substr(0, 1) !== "/") {
						url = "/" + url;
					}
					configProxy(url, small_router.controller, small_router.method || 'get');
				}
			}
		});
	});
	app.use(router.routes());

	function configProxy(url, ctrl, method) {
		router[method](url, ctrl);
		logger.info('config---->url:' + url + ' with method:' + method);
	}
}