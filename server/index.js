var db = require('./utils/db');

let fs = require("fs");
let path = require("path");
const router = require('koa-router')();

let settings = {
	controllerPath: path.resolve(__dirname, 'controllers'),
	templateOptions: {
		marked: function () {
			console.log('marked...');
		},
		utils: require('./utils/viewUtils'),
		doSEO: require('./utils/seoUtils')
	}
};

module.exports = async function (app) {
	try {
		await db.bootstrap();
		extendContext(app);
		configFilter(app);
		loadRoute(app);
	} catch (err) {
		console.log(err);
	}
};

function extendContext(app) {
	app.use(async(ctx, next) => {
		const start = new Date();
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

function configFilter(app) {
	app.use(require('./filters/permission')()); //permission
}

function loadRoute(app) {
	let ctrls_path = settings.controllerPath, ctrl_path, controller;
	let files = fs.readdirSync(ctrls_path);
	for (let i = 0; i < files.length; i++) {
		ctrl_path = path.join(ctrls_path, files[i]);
		controller = require(ctrl_path);
		for (let key in controller) {
			if (key == "doGet" || key == 'doPost') { //注册多个get,多个post
				let routes = controller[key]();
				Object.keys(routes).forEach(function (temp) {
					configProxy(temp, routes[temp], key == "doGet" ? 'get' : 'post');
				});
			} else {
				let small_router = controller[key](),url;
				if (typeof small_router == "function") {
					configProxy("/" + key, small_router,'get');
				} else {
					url = small_router.url || key;
					if (typeof url == "string" && url.substr(0, 1) !== "/") {
						url = "/" + url;
					}
					configProxy(url, small_router.controller, small_router.method||'get');
				}
			}
		}
	}
	app.use(router.routes());

	function configProxy(url, ctrl, method) {
		router[method](url, ctrl);
		console.log('config---->url:' + url + ' with method:' + method);
	}
}