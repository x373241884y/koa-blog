//MySQL [wp_blog2]> desc wp_term_relationships;
//+------------------+---------------------+------+-----+---------+-------+
//| Field            | Type                | Null | Key | Default | Extra |
//+------------------+---------------------+------+-----+---------+-------+
//| object_id        | bigint(20) unsigned | NO   | PRI | 0       |       |
//| term_taxonomy_id | bigint(20) unsigned | NO   | PRI | 0       |       |
//| term_order       | int(11)             | NO   |     | 0       |       |
//+------------------+---------------------+------+-----+---------+-------+
//	3 rows in set (0.00 sec)

function TermRelationship(relationship) {
	this.object_id = relationship.object_id || 0;
	this.term_taxonomy_id = relationship.term_taxonomy_id || 0;
	this.term_order = relationship.term_order || 0;

};
module.exports = TermRelationship;

var sqlhelp = require("../utils/sqlHelper");
/**
 * @return promise
 * @param relationship
 * @param callback
 */
TermRelationship.save = function save(relationship, callback) {
	var sql = "insert into wp_term_relationships set ?";
	return sqlhelp.query(sql, relationship);
};
/**
 * @return promise
 * @param relationships
 * @param callback
 */
TermRelationship.saveMulti = function save(relationships, callback) {
	var sql = "insert into wp_term_relationships(object_id,term_taxonomy_id,term_order) VALUES ?";
	return sqlhelp.query(sql, [relationships]);
};
/**
 * @return promise
 * @param callback
 */
TermRelationship.getAll = function get(callback) {
	var sql = "select * from wp_term_relationships";
	return sqlhelp.query(sql);
};
/**
 * @return promise
 * @param relationship
 * @param callback
 */
TermRelationship.delete = function (relationship, callback) {
	var sql = "delete * from wp_term_relationships where object_id=? and term_taxonomy_id=?";
	return sqlhelp.query(sql, relationship);
};