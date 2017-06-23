/**
 * Created by toor on 17-2-16.
 */
var userSql = {};
var postSql = {
	//添加文章/页面
	save: "insert into wp_posts set ?",
	//删除文章或页面
	delete: "delete  from wp_posts where ID=?",
	//更新文章/页面
	update: "update wp_posts set post_title = ?, post_content = ?,post_status = ?,post_modified=?,post_modified_gmt=? where ID=?",
	//update category
	updateCategory: "update wp_term_relationships set term_taxonomy_id=? where object_id=?",
	//获取文章
	getById: "select * from wp_posts where ID=? and post_type='post'",
	//get tags and category
	getPostTerms: "select * from wp_term_relationships as T1 " +
	"inner join wp_term_taxonomy as T2 on T1.term_taxonomy_id=T2.term_taxonomy_id " +
	"inner join wp_terms as T3 on T2.term_id=T3.term_id " +
	"where T1.object_id=?",
	//获取页面
	getPageById: "select * from wp_posts where ID=? and post_type='page'",
	//获取前一篇文章
	getPrev: "select * from wp_posts where ID<? and post_type=\'post\' and post_status=\'publish\' order by ID desc limit 1",
	//下一篇文章
	getNext: "select * from wp_posts where ID>? and post_type=\'post\' and post_status=\'publish\' order by ID  limit 1",
	//通过分类查找文章带分页
	findByCategoryPageModel: "select * " +
	"from wp_terms as T1,wp_term_taxonomy as T2,wp_term_relationships as T3,wp_posts as T4 " +
	"where T1.slug=? and T1.term_id=T2.term_id and T2.term_taxonomy_id=T3.term_taxonomy_id and T3.object_id=T4.ID and T4.post_status=\'publish\' " +
	"order by post_date desc",
	//首页列表
	getPostListA: "select T1.ID,post_title,user_login,post_type,menu_order,comment_count,post_date,post_status " +
	"from wp_posts as T1 " +
	"left join wp_users as T2 on T1.post_author=T2.ID " +
	"where post_type='post' and post_status=\'publish\' order by T1.post_date desc",
	//获取所有文章，用于后台管理
	getPostPageModel: "select T1.ID,post_title,user_login,post_type,menu_order,comment_count,post_date,post_status " +
	"from wp_posts as T1 " +
	"left join wp_users as T2 on T1.post_author=T2.ID " +
	"where post_type='post' order by T1.post_date desc",
	//获取所有页面，用于后台管理
	getPagePageModel: "select T1.ID,post_title,user_login,post_type,menu_order,comment_count,post_date,post_status " +
	"from wp_posts as T1 " +
	"left join wp_users as T2 on T1.post_author=T2.ID " +
	"where post_type='page' order by T1.post_date desc",
	//获取最新的文章，带分页,降序，状态为已经发布
	findNewestListPageModel: 'select ID,comment_count, post_title,post_content,post_status,post_date ' +
	'from wp_posts  ' +
	'where post_type=\'post\'and  post_status=\'publish\' ' +
	'order by post_date desc',

	findPostByWordPageModel: 'select ID,comment_count, post_title,post_content,post_status,post_date ' +
	'from wp_posts  ' +
	'where post_type=\'post\'and  post_status=\'publish\' and post_title like ? ' +
	'order by post_date desc',
	//获取所有文章的归档，即年月集合
	findArticleArchive: 'select year(post_date) as year,month(post_date) as month,count(ID) as archive_count ' +
	'from wp_posts ' +
	'where post_type=\'post\' and post_status=\'publish\' ' +
	'group by year(post_date),month(post_date) ' +
	'order by year(post_date) desc,month(post_date)desc',
	//获取所有文章的归档，即年月集合
	findByYearMonthPageModel: 'select *  from wp_posts ' +
	'where year(post_date)=? and month(post_date)=? and post_type=\'post\' and post_status=\'publish\' ' +
	'order by post_date desc',
	//获取最新的6则文章(左侧最新文章显示)
	findNewestList: "select ID,comment_count, post_title,post_status,post_date " +
	"from wp_posts  " +
	"where post_type=\'post\' and post_status=\'publish\' " +
	"order by post_date desc limit 6",
	//获取最新的6则页面(左侧关于...)
	findNewestPage: "select ID, post_title,post_status,post_date from wp_posts  where post_type=\'page\' and post_status=\'publish\' order by post_date desc limit 6"
};
var termSql = {
	//通过分类查找文章带分页
	QryPostByCategory: "select * " +
	"from wp_terms as T1,wp_term_taxonomy as T2,wp_term_relationships as T3,wp_posts as T4 " +
	"where T1.slug=? and T1.term_id=T2.term_id  and T2.term_taxonomy_id=T3.term_taxonomy_id and T3.object_id=T4.ID and T4.post_status=\'publish\' and T2.taxonomy=\'category\'" +
	"order by post_date desc",
	//通过标签查找文章带分页
	QryPostByTag: "select * " +
	"from wp_terms as T1,wp_term_taxonomy as T2,wp_term_relationships as T3,wp_posts as T4 " +
	"where T1.slug=? and T1.term_id=T2.term_id  and T2.term_taxonomy_id=T3.term_taxonomy_id and T3.object_id=T4.ID and T4.post_status=\'publish\' and T2.taxonomy=\'post_tag\'" +
	"order by post_date desc",
	getAllCategory: "select * from wp_terms as T1,wp_term_taxonomy as T2 " +
	"where T1.term_id=T2.term_id and T2.taxonomy=\'category\'" +
	"order by T1.term_id",
	getAllTags: "select * from wp_terms as T1,wp_term_taxonomy as T2 " +
	"where T1.term_id=T2.term_id and T2.taxonomy='post_tag'" +
	"order by T1.name",
	getCategoryPage: "select * from wp_terms as T1,wp_term_taxonomy as T2 where T1.term_id=T2.term_id and T2.taxonomy='category' order by T1.term_id desc",
	getTagPage: "select * from wp_terms as T1,wp_term_taxonomy as T2 where T1.term_id=T2.term_id and T2.taxonomy=\'post_tag\' order by T1.term_id desc"
};
var termRelationshipSql = {
	saveMulti: "insert into wp_term_relationships(object_id,term_taxonomy_id,term_order) VALUES ?",
	//delete multiple
	deleteMuti: "delete  from wp_term_relationships where term_taxonomy_id IN(?)",
	//delete One
	deleteRelations:"delete from wp_term_relationships where object_id = ?"
};
module.exports = {
	userSql: userSql,
	postSql: postSql,
	termSql: termSql,
	termRelationshipSql: termRelationshipSql
};