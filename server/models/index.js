'use strict';
var User = require('./wp_users');
var Term = require('./wp_terms');
var TermTaxonomy = require('./wp_term_taxonomy');
var Post = require('./wp_posts');
var Comment = require('./wp_comments');
var Option = require('./wp_options');
var TermRelationship = require('./wp_term_relationships');

module.exports = {
	User: User,
	Term: Term,
	TermTaxonomy: TermTaxonomy,
	Post: Post,
	TermRelationship: TermRelationship,
	Comment: Comment,
	Option: Option
};
