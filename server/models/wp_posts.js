//MySQL [wp_blog]> describe wp_posts;
//+-----------------------+---------------------+------+-----+---------------------+----------------+
//| Field                 | Type                | Null | Key | Default             | Extra          |
//+-----------------------+---------------------+------+-----+---------------------+----------------+
//| ID                    | bigint(20) unsigned | NO   | PRI | NULL                | auto_increment |
//| post_author           | bigint(20) unsigned | NO   | MUL | 0                   |                |
//| post_date             | datetime            | NO   |     | 0000-00-00 00:00:00 |                |
//| post_date_gmt         | datetime            | NO   |     | 0000-00-00 00:00:00 |                |
//| post_content          | longtext            | NO   |     | NULL                |                |
//| post_title            | text                | NO   |     | NULL                |                |
//| post_excerpt          | text                | NO   |     | NULL                |                |
//| post_status           | varchar(20)         | NO   |     | publish             |                |
//| comment_status        | varchar(20)         | NO   |     | open                |                |
//| ping_status           | varchar(20)         | NO   |     | open                |                |
//| post_password         | varchar(20)         | NO   |     |                     |                |
//| post_name             | varchar(200)        | NO   | MUL |                     |                |
//| to_ping               | text                | NO   |     | NULL                |                |
//| pinged                | text                | NO   |     | NULL                |                |
//| post_modified         | datetime            | NO   |     | 0000-00-00 00:00:00 |                |
//| post_modified_gmt     | datetime            | NO   |     | 0000-00-00 00:00:00 |                |
//| post_content_filtered | longtext            | NO   |     | NULL                |                |
//| post_parent           | bigint(20) unsigned | NO   | MUL | 0                   |                |
//| guid                  | varchar(255)        | NO   |     |                     |                |
//| menu_order            | int(11)             | NO   |     | 0                   |                |
//| post_type             | varchar(20)         | NO   | MUL | post                |                |
//| post_mime_type        | varchar(100)        | NO   |     |                     |                |
//| comment_count         | bigint(20)          | NO   |     | 0                   |                |
function Post(post) {
	//this.ID = post.ID; //auto_increment
	this.post_author = post.post_author;
	this.post_date = post.post_date;
	this.post_date_gmt = post.post_date_gmt;
	this.post_content = post.post_content;
	this.post_title = post.post_title;
	this.post_excerpt = post.post_excerpt || "NULL";
	this.post_status = post.post_status || "publish";
	this.comment_status = post.comment_status || "open";
	this.ping_status = post.ping_status || "open";
	this.post_password = post.post_password || "";
	this.post_name = post.post_name || "";
	this.to_ping = post.to_ping || "NULL";
	this.pinged = post.pinged || "NULL";
	this.post_modified = post.post_modified;
	this.post_modified_gmt = post.post_modified_gmt;
	this.post_content_filtered = post.post_content_filtered || "NULL";
	this.post_parent = post.post_parent || 0;
	this.guid = post.guid || "";
	this.menu_order = post.menu_order || 0;
	this.post_type = post.post_type || "post";
	this.post_mime_type = post.post_mime_type || "";
	this.comment_count = post.comment_count || 0;
}
module.exports = Post;