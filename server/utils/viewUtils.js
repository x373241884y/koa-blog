var marked = require("marked");

marked.Renderer.prototype.heading = function(text, level, raw) {
	return '<h'
		+ level
		+ ' id="'
		+ this.options.headerPrefix
		+ slugify(raw, '-')
		+ '">'
		+ text
		+ '</h'
		+ level
		+ '>\n';
};
var toc = require('marked-toc');

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false
});
function formatDate(date, style) { //date format util
	if(typeof date.getFullYear!=="function"){
		date = new Date(date);
	}
	var y = date.getFullYear();
	var M = "0" + (date.getMonth() + 1);
	M = M.substring(M.length - 2);
	var d = "0" + date.getDate();
	d = d.substring(d.length - 2);
	var h = "0" + date.getHours();
	h = h.substring(h.length - 2);
	var m = "0" + date.getMinutes();
	m = m.substring(m.length - 2);
	var s = "0" + date.getSeconds();
	s = s.substring(s.length - 2);
	return style.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('HH', h).replace('mm', m).replace('ss', s);
}

function cutMaxTitle(str, length) {
	if (typeof str == "string") {
		if (str.length > length) {
			return str.substr(0, length) + "...";
		} else {
			return str;
		}
	} else {
		return str;
	}
}

function postSnippet(str) {
	return cutMaxTitle(str, 200);
}

exports.dateFormat = formatDate;

exports.cutMaxTitle = cutMaxTitle;
exports.postSnippet = postSnippet;
function slugify(text) {
	return text.replace(/[\s\t\r\n]+/g, '_');
}

exports.marked = function (mdStr) {
	var tocHtml = toc(mdStr);
	tocHtml = tocHtml.replace(/^\s+/, '');
	mdStr = mdStr.replace(/\[TOC\]/, tocHtml+'\n');
	return marked(mdStr);
};