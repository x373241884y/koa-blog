// MariaDB [myblog]> desc wp_options;
// +--------------+---------------------+------+-----+---------+----------------+
// | Field        | Type                | Null | Key | Default | Extra          |
// +--------------+---------------------+------+-----+---------+----------------+
// | option_id    | bigint(20) unsigned | NO   | PRI | NULL    | auto_increment |
// | option_name  | varchar(191)        | NO   | UNI |         |                |
// | option_value | longtext            | NO   |     | NULL    |                |
// | autoload     | varchar(20)         | NO   |     | yes     |                |
// +--------------+---------------------+------+-----+---------+---------------

function Option(option) {
	this.option_name = option.option_name;
	this.option_value = option.option_value;
	this.autoload = option.autoload||"yes";
}
module.exports = Option;