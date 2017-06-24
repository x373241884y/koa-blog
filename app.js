const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const morgan = require('koa-morgan');
const bodyparser = require('koa-bodyparser')();
const session = require('koa-session');

let logger = app.logger = require('./server').logger;

// middlewares
app.use(bodyparser);
app.use(json());
app.use(morgan('dev', {stream: logger.stream}));
app.use(require('koa-static')(__dirname + '/static'));

app.use(views(__dirname + '/server/views', {
	extension: 'ejs'
}));

let config = require('config-lite');
app.keys = [config.session.secret];
app.use(session({
	key: config.session.name,
	httpOnly: config.session.cookie.httpOnly,
	secure: config.session.cookie.secure,
	maxAge: config.session.cookie.maxAge,
}, app));

require('./server')(app);

module.exports = app;
