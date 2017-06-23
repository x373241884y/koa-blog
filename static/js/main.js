NProgress.inc();
$(window).load(function () {
	NProgress.done();
	$("#target-editor-with-custom-language").markdown({language:'fr'})
	$("pre").addClass("prettyprint linenums");//如果其他地方也要用到pre，我们可以再加一个父标签的选择器来区分
	prettyPrint();//代替body上的onload事件加载该方法
//		$(document).snowfall({image: "/images/flake.png", maxSize: 15});
});

jQuery(document.body).jstars({
	image_path: '/images', // folder with magic image
	style: 'rand',       // optional, color, default: white
	frequency: 3         // optional, from 1 to 19
});

(function () { //injectGoogleAnalytics
	(function (i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
		a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

	ga('create', 'UA-96574719-1', 'auto');
	ga('send', 'pageview');
})();