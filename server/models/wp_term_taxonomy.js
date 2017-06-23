//+------------------+---------------------+------+-----+---------+----------------+
//| Field            | Type                | Null | Key | Default | Extra          |
//+------------------+---------------------+------+-----+---------+----------------+
//| term_taxonomy_id | bigint(20) unsigned | NO   | PRI | NULL    | auto_increment |
//| term_id          | bigint(20) unsigned | NO   | MUL | 0       |                |
//| taxonomy         | varchar(32)         | NO   | MUL |         |                |
//| description      | longtext            | NO   |     | NULL    |                |
//| parent           | bigint(20) unsigned | NO   |     | 0       |                |
//| count            | bigint(20)          | NO   |     | 0       |                |
//+------------------+---------------------+------+-----+---------+----------------+
function TermTaxonomy(termTaxonomy) {
	//this.term_taxonomy_id = termTaxonomy.term_taxonomy_id; //auto_increment
	this.term_id = termTaxonomy.term_id;
	this.taxonomy = termTaxonomy.taxonomy;
	this.description = termTaxonomy.description;
	this.parent = termTaxonomy.parent || 0;
	this.count = termTaxonomy.count || 0;
}
module.exports = TermTaxonomy;