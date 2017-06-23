
var userDao = require('../userDao');
function testCreate() {
	var user1 = {
		user_login: "zhangsan",
		user_pass: "zhangsan123",
		display_name: "zhangsands",
		user_nicename: "zhangsanun",
		user_email: "zhangsanemail",
		user_url: "zhangsan.url",
		user_registered: new Date(),
		user_activation_key: "1231313"
	};
	userDao.create(user1).then(function(result) {
	},function(error){
		console.log(error);
	});
}

function testRemove(){
	userDao.remove({
		ID:1
	}).then(function(result){

	},function(error){
		console.log(error);
	})
}
//Executing (default): SELECT count(`Post`.`ID`) AS `count` FROM `posts` AS `Post` LEFT OUTER JOIN `users` AS `user` ON `Post`.`user_id` = `user`.`ID` LEFT OUTER JOIN (`term_relationship` AS `termTaxonomys.TermRelationShip` INNER JOIN `term_taxonomy` AS `termTaxonomys` ON `termTaxonomys`.`id` = `termTaxonomys.TermRelationShip`.`term_id`) ON `Post`.`ID` = `termTaxonomys.TermRelationShip`.`object_id` WHERE `Post`.`post_type` = 'post';
//Executing (default): SELECT count(`Post`.`ID`) AS `count` FROM `posts` AS `Post` LEFT OUTER JOIN `users` AS `user` ON `Post`.`user_id` = `user`.`ID` LEFT OUTER JOIN (`term_relationship` AS `termTaxonomys.TermRelationShip` INNER JOIN `term_taxonomy` AS `termTaxonomys` ON `termTaxonomys`.`id` = `termTaxonomys.TermRelationShip`.`term_id`) ON `Post`.`ID` = `termTaxonomys.TermRelationShip`.`object_id` WHERE `Post`.`post_type` = 'page';
//Executing (default): SELECT count(`Post`.`ID`) AS `count` FROM `posts` AS `Post` LEFT OUTER JOIN `users` AS `user` ON `Post`.`user_id` = `user`.`ID` LEFT OUTER JOIN (`term_relationship` AS `termTaxonomys.TermRelationShip` INNER JOIN `term_taxonomy` AS `termTaxonomys` ON `termTaxonomys`.`id` = `termTaxonomys.TermRelationShip`.`term_id`) ON `Post`.`ID` = `termTaxonomys.TermRelationShip`.`object_id` WHERE `Post`.`post_type` = 'page';
//Executing (default): SELECT `Post`.*, `user`.`ID` AS `user.ID`, `user`.`user_login` AS `user.user_login`, `user`.`user_pass` AS `user.user_pass`, `user`.`display_name` AS `user.display_name`, `user`.`user_nicename` AS `user.user_nicename`, `user`.`user_email` AS `user.user_email`, `user`.`user_url` AS `user.user_url`, `user`.`user_registered` AS `user.user_registered`, `user`.`user_activation_key` AS `user.user_activation_key`, `user`.`user_level` AS `user.user_level`, `user`.`user_status` AS `user.user_status`, `termTaxonomys`.`id` AS `termTaxonomys.id`, `termTaxonomys`.`term_id` AS `termTaxonomys.term_id`, `termTaxonomys`.`taxonomy` AS `termTaxonomys.taxonomy`, `termTaxonomys`.`description` AS `termTaxonomys.description`, `termTaxonomys`.`parent` AS `termTaxonomys.parent`, `termTaxonomys`.`count` AS `termTaxonomys.count`, `termTaxonomys.TermRelationShip`.`object_id` AS `termTaxonomys.TermRelationShip.object_id`, `termTaxonomys.TermRelationShip`.`term_id` AS `termTaxonomys.TermRelationShip.term_id`, `termTaxonomys.TermRelationShip`.`term_order` AS `termTaxonomys.TermRelationShip.term_order` FROM (SELECT `Post`.`ID`, `Post`.`post_author`, `Post`.`post_date`, `Post`.`post_date_gmt`, `Post`.`post_content`, `Post`.`post_title`, `Post`.`post_status`, `Post`.`comment_status`, `Post`.`post_name`, `Post`.`post_type`, `Post`.`user_id`, `Post`.`comment_count` FROM `posts` AS `Post` WHERE `Post`.`post_type` = 'post' ORDER BY post_date DESC LIMIT 0, 5) AS `Post` LEFT OUTER JOIN `users` AS `user` ON `Post`.`user_id` = `user`.`ID` LEFT OUTER JOIN (`term_relationship` AS `termTaxonomys.TermRelationShip` INNER JOIN `term_taxonomy` AS `termTaxonomys` ON `termTaxonomys`.`id` = `termTaxonomys.TermRelationShip`.`term_id`) ON `Post`.`ID` = `termTaxonomys.TermRelationShip`.`object_id` ORDER BY post_date DESC;
//Executing (default): SELECT `Post`.*, `user`.`ID` AS `user.ID`, `user`.`user_login` AS `user.user_login`, `user`.`user_pass` AS `user.user_pass`, `user`.`display_name` AS `user.display_name`, `user`.`user_nicename` AS `user.user_nicename`, `user`.`user_email` AS `user.user_email`, `user`.`user_url` AS `user.user_url`, `user`.`user_registered` AS `user.user_registered`, `user`.`user_activation_key` AS `user.user_activation_key`, `user`.`user_level` AS `user.user_level`, `user`.`user_status` AS `user.user_status`, `termTaxonomys`.`id` AS `termTaxonomys.id`, `termTaxonomys`.`term_id` AS `termTaxonomys.term_id`, `termTaxonomys`.`taxonomy` AS `termTaxonomys.taxonomy`, `termTaxonomys`.`description` AS `termTaxonomys.description`, `termTaxonomys`.`parent` AS `termTaxonomys.parent`, `termTaxonomys`.`count` AS `termTaxonomys.count`, `termTaxonomys.TermRelationShip`.`object_id` AS `termTaxonomys.TermRelationShip.object_id`, `termTaxonomys.TermRelationShip`.`term_id` AS `termTaxonomys.TermRelationShip.term_id`, `termTaxonomys.TermRelationShip`.`term_order` AS `termTaxonomys.TermRelationShip.term_order` FROM (SELECT `Post`.`ID`, `Post`.`post_author`, `Post`.`post_date`, `Post`.`post_date_gmt`, `Post`.`post_content`, `Post`.`post_title`, `Post`.`post_status`, `Post`.`comment_status`, `Post`.`post_name`, `Post`.`post_type`, `Post`.`user_id`, `Post`.`comment_count` FROM `posts` AS `Post` WHERE `Post`.`post_type` = 'page' ORDER BY post_date DESC LIMIT 6) AS `Post` LEFT OUTER JOIN `users` AS `user` ON `Post`.`user_id` = `user`.`ID` LEFT OUTER JOIN (`term_relationship` AS `termTaxonomys.TermRelationShip` INNER JOIN `term_taxonomy` AS `termTaxonomys` ON `termTaxonomys`.`id` = `termTaxonomys.TermRelationShip`.`term_id`) ON `Post`.`ID` = `termTaxonomys.TermRelationShip`.`object_id` ORDER BY post_date DESC;
//Executing (default): SELECT `Post`.*, `user`.`ID` AS `user.ID`, `user`.`user_login` AS `user.user_login`, `user`.`user_pass` AS `user.user_pass`, `user`.`display_name` AS `user.display_name`, `user`.`user_nicename` AS `user.user_nicename`, `user`.`user_email` AS `user.user_email`, `user`.`user_url` AS `user.user_url`, `user`.`user_registered` AS `user.user_registered`, `user`.`user_activation_key` AS `user.user_activation_key`, `user`.`user_level` AS `user.user_level`, `user`.`user_status` AS `user.user_status`, `termTaxonomys`.`id` AS `termTaxonomys.id`, `termTaxonomys`.`term_id` AS `termTaxonomys.term_id`, `termTaxonomys`.`taxonomy` AS `termTaxonomys.taxonomy`, `termTaxonomys`.`description` AS `termTaxonomys.description`, `termTaxonomys`.`parent` AS `termTaxonomys.parent`, `termTaxonomys`.`count` AS `termTaxonomys.count`, `termTaxonomys.TermRelationShip`.`object_id` AS `termTaxonomys.TermRelationShip.object_id`, `termTaxonomys.TermRelationShip`.`term_id` AS `termTaxonomys.TermRelationShip.term_id`, `termTaxonomys.TermRelationShip`.`term_order` AS `termTaxonomys.TermRelationShip.term_order` FROM (SELECT `Post`.`ID`, `Post`.`post_author`, `Post`.`post_date`, `Post`.`post_date_gmt`, `Post`.`post_content`, `Post`.`post_title`, `Post`.`post_status`, `Post`.`comment_status`, `Post`.`post_name`, `Post`.`post_type`, `Post`.`user_id`, `Post`.`comment_count` FROM `posts` AS `Post` WHERE `Post`.`post_type` = 'page' ORDER BY post_date DESC LIMIT 6) AS `Post` LEFT OUTER JOIN `users` AS `user` ON `Post`.`user_id` = `user`.`ID` LEFT OUTER JOIN (`term_relationship` AS `termTaxonomys.TermRelationShip` INNER JOIN `term_taxonomy` AS `termTaxonomys` ON `termTaxonomys`.`id` = `termTaxonomys.TermRelationShip`.`term_id`) ON `Post`.`ID` = `termTaxonomys.TermRelationShip`.`object_id` ORDER BY post_date DESC;

function testUpdate() {
	var user1 = {
		ID:2,
		user_login: "lisifdsf",
		user_pass: "zhangsan123",
		display_name: "zhangsands",
		user_nicename: "zhangsanun",
		user_email: "zhangsanemail",
		user_url: "zhangsan.url",
		user_registered: new Date(),
		user_activation_key: "000"
	};
	userDao.update(user1);
}

function testFindAll() {
	userDao.findAll().then(function (list) {
		console.log(list);
	});
}

function testGetById() {
	userDao.getById(2).then(function (user) {
		console.log(user);
	});
}

require('../../utils/db').bootstrap().then(function () {
	testFindAll();
});