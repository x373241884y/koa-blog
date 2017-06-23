function forTitle(locals) {
	if (locals.title) {
		return locals.title + '-x373241884y的小居';
	} else {
		return 'x373241884y的小居-记录一个小码农成长之路的个人网站';
	}
}

function forKeywords(locals) {
	if (locals.type) {
		return locals.type + ',x373241884y的小居,x373241884y的空间';
	} else if (locals.keywords) {
		return locals.keywords;
	} else {
		return 'x373241884y的小居,x373241884y的个人空间,x373241884y的个人网站';
	}
}

function forDesc(locals) {
	var str = 'x373241884y的小居,是x373241884y的个人空间,生活笔录,经验总结!记录一个小码农成长之路的个人网站!';
	if (locals.type) {
		return locals.type + '-' + str;
	} else if (locals.description) {
		return locals.description + '-' + str;
	} else {
		return str;
	}
}

module.exports = function (request) {
	var home = request.home, type = home.type, post,locals;
	if (type === 'article') {
		post = request.previewPost;
		locals = {
			title: post.post_title,
			keywords: post.tagList.map(function (temp) {
				return temp.name;
			}).join(','),
			description: post.post_title
		};
	} else if (type === 'page') {
		post = request.previewPost;
		locals = {
			title: post.post_title,
			type: post.post_title,
			description: post.post_title
		};
	} else if (type === 'list') {
		var listType = home.listType,title,type;
		locals = {};
		if(listType==='index'){
			//...
		}else if(listType==='search'){
			locals.title = home.word+'-关键字搜索';
			locals.type = '关键字搜索';
		}else if(listType==='archive'){
			locals.title = home.year+home.month+'-文章归档';
			locals.type = '文章归档';
		}else if(listType==='category'){
			locals.title = home.category+'-文章分类';
			locals.type = '文章分类';
		}else if(listType==='tag'){
			locals.title = home.category+'-标签分类';
			locals.type = '标签分类';
		}
	}
	return {
		title: forTitle(locals),
		keywords: forKeywords(locals),
		description: forDesc(locals)
	};
};