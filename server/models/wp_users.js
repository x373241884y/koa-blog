//MySQL [wp_blog]> describe wp_users;
//+---------------------+---------------------+------+-----+---------------------+----------------+
//| Field               | Type                | Null | Key | Default             | Extra          |
//+---------------------+---------------------+------+-----+---------------------+----------------+
//| ID                  | bigint(20) unsigned | NO   | PRI | NULL                | auto_increment |
//| user_login          | varchar(60)         | NO   | MUL |                     |                |
//| user_pass           | varchar(255)        | NO   |     |                     |                |
//| user_nicename       | varchar(50)         | NO   | MUL |                     |                |
//| user_email          | varchar(100)        | NO   | MUL |                     |                |
//| user_url            | varchar(100)        | NO   |     |                     |                |
//| user_registered     | datetime            | NO   |     | 0000-00-00 00:00:00 |                |
//| user_activation_key | varchar(255)        | NO   |     |                     |                |
//| user_status         | int(11)             | NO   |     | 0                   |                |
//| display_name        | varchar(250)        | NO   |     |                     |                |
function User(user) {
	this.user_login = user.user_login;
	this.display_name = user.display_name;
	this.user_pass = user.user_pass;
	this.user_nicename = user.user_nicename;
	this.user_email = user.user_email;
	this.user_url = user.user_url;
	this.user_registered = user.user_registered;
	this.user_activation_key = user.user_activation_key;
	this.user_status = user.user_status;
}
module.exports = User;