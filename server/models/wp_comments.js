//MySQL [wp_blog2]> desc wp_comments;
//+----------------------+---------------------+------+-----+---------------------+----------------+
//| Field                | Type                | Null | Key | Default             | Extra          |
//+----------------------+---------------------+------+-----+---------------------+----------------+
//| comment_ID           | bigint(20) unsigned | NO   | PRI | NULL                | auto_increment |
//| comment_post_ID      | bigint(20) unsigned | NO   | MUL | 0                   |                |
//| comment_author       | tinytext            | NO   |     | NULL                |                |
//| comment_author_email | varchar(100)        | NO   | MUL |                     |                |
//| comment_author_url   | varchar(200)        | NO   |     |                     |                |
//| comment_author_IP    | varchar(100)        | NO   |     |                     |                |
//| comment_date         | datetime            | NO   |     | 0000-00-00 00:00:00 |                |
//| comment_date_gmt     | datetime            | NO   | MUL | 0000-00-00 00:00:00 |                |
//| comment_content      | text                | NO   |     | NULL                |                |
//| comment_karma        | int(11)             | NO   |     | 0                   |                |
//| comment_approved     | varchar(20)         | NO   | MUL | 1                   |                |
//| comment_agent        | varchar(255)        | NO   |     |                     |                |
//| comment_type         | varchar(20)         | NO   |     |                     |                |
//| comment_parent       | bigint(20) unsigned | NO   | MUL | 0                   |                |
//| user_id              | bigint(20) unsigned | NO   |     | 0                   |                |
//+----------------------+---------------------+------+-----+---------------------+----------------+

function Comment(comment) {
	this.comment_post_ID = comment.comment_post_ID || 0;
	this.comment_author = comment.comment_author;
	this.comment_author_email = comment.comment_author_email;
	this.comment_author_url = comment.comment_author_url;
	this.comment_author_IP = comment.comment_author_IP;
	this.comment_date = comment.comment_date;
	this.comment_date_gmt = comment.comment_date_gmt;
	this.comment_content = comment.comment_content;
	this.comment_karma = comment.comment_karma || 0;
	this.comment_approved = comment.comment_approved || 0;
	this.comment_agent = comment.comment_agent;
	this.comment_type = comment.comment_type || "";
	this.comment_parent = comment.comment_parent || 0;
	this.user_id = comment.user_id || 0;
}
module.exports = Comment;