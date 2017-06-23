(function () {
	var cssFiles = [
		"css/admin.css",
		"css/admin-menu.css",
		"css/editormd.min.css",
		"css/editormd.preview.min.css",
		"css/extra.css"
	];
	var jsFiles = [
		"lib/min/vx2-route.min.js",
		"lib/min/oclazyload.js",
		"lib/min/vx2-sanitize.min.js",//净化html 运用在v-bind-html
		"lib/plugins/ui-bootstrap-0.13.0.js",//插件引用
		"lib/plugins/swiper-3.4.0.jquery.min.js",//插件引用
		"lib/plugins/jquery.extend.js",
		"lib/plugins/pinyin.js",
		"lib/plugins/crypto-js.js",
		"lib/plugins/jquery-ui.js",
		"lib/vx2-config.js",
		"lib/vx2-locale_zh_cn.js",//国际化及翻译
		"lib/app.js",//路由及rootscope
		/*vx2模块*/
		"lib/directives.js",
		"lib/filters.js",
		"lib/services.js",
		"lib/resource.js",
		"lib/modules/services/cookieService.js",
		"lib/modules/directives/ui-pager.js",
	];

	if (typeof (exports) != "undefined") {
		exports.jsFiles = jsFiles;
		exports.cssFiles = cssFiles;
	} else {
		var i;
		for (i = 0; i < vx2_files.length; i++) {
			addTag('script', {
				"type": "text/javascript",
				"src": vx2_files[i]
			});
		}
		window.addTag = addTag;
	}

	function addTag(name, attributes) {
		var el = document.createElement(name), attrName;

		for (attrName in attributes) {
			el.setAttribute(attrName, attributes[attrName]);
		}
		document.write(outerHTML(el));
		document.close();
	}

	function outerHTML(node) {
		// if IE, Chrome take the internal method otherwise build one
		return node.outerHTML || (function (n) {
				var div = document.createElement('div'), h;
				div.appendChild(n);
				h = div.innerHTML;
				div = null;
				return h;
			})(node);
	}

})();

