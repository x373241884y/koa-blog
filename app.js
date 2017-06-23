const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const session = require('koa-session');

// error handler
onerror(app);

// middlewares
app.use(bodyparser);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/static'));

app.use(views(__dirname + '/server/views', {
  extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

let config = require('config-lite');
app.keys = [config.session.secret];
app.use(session({
	key: config.session.name,
	httpOnly:config.session.cookie.httpOnly,
	secure:config.session.cookie.secure,
	maxAge:config.session.cookie.maxAge,
}, app));

require('./server')(app);

module.exports = app;
