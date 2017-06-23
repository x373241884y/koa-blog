var transaction = require('../index').transaction;
var postDao = require('../postDao');
function testManyCreate() {
	var post;
	var count = 0;
	for(var i=0;i<55;i++){
		transaction().then(function (trans) {
			count++;
			post = {
				post_author: 1,
				post_title: "title_" + count,
				post_content: "post_content....." + count,
				post_date: new Date(),
				post_date_gmt: new Date(),
				post_status: "publish",
				post_type: "post",
				termRelations: [{
					term_taxonomy_id: 20,
					term_order: 0
				}]
			};
			postDao.create2(post, trans).then(function (result) {
				trans.commit().then(function () {
					console.log('okok....');
				});
			}, function (error) {
				console.log(error);
				trans.rollback(function () {
					console.log(error);
				});
			});
		});

	}
}

function testGetById() {
	postDao.getById(5).then(function (post) {
		console.log(post.toJSON());
	}, function (error) {
		console.log(error);
	});
}

function updatePost() {
	var post = {
		ID: 5,
		post_title: "xxxx5"
	};
	postDao.update(post).then(function (post) {
	}, function (error) {
		console.log(error);
	});
}

function getPostPage() {

	postDao.getPageModel1(5,5).then(function (pageModel) {
		console.log(JSON.stringify(pageModel,null,4));
	}, function (error) {
		console.log(error);
	});
}

function testArchive() {
	postDao.getArchive().then(function (result) {
		console.log(JSON.stringify(result,null,4));
	},function(error){
		console.log(error);
	});
}
function testFindByCategory() {
	postDao.findByCategory(0, 10);
}
//testManyCreate();
//testGetById();
//updatePost();
//testArchive();
//testCreate();
//testArchive();

testManyCreate();