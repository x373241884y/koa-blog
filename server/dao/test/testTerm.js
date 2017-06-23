var termDao = require('../termDao');
var models = require('../../models');
var taxonomyDao = require('../taxonomyDao');
function createManyTerm() {
	for (var i = 1; i < 33; i++) {
		var index = i;
		var term = {
			name: "category_" + index,
			slug: "category_" + index,
			taxonomy: "category",
			description: "category_desc"
		};
		termDao.create(term).then(function (term2) {
			return taxonomyDao.create({
				term_id: term2.term_id,
				taxonomy: term.taxonomy,
				description: term.description
			}).then(function (result) {
				console.log('okok----');
			});
		});
	}

}

function testGetById() {
	termDao.getById(1).then(function (term) {
		console.log(term.toJSON());
	});

}

function updateTerm() {
	termDao.getById(5).then(function (term) {
		var term2 = {
			term_id: term.term_id,
			name: "xiaozi1"
		};
		return termDao.update(term2);
	}).then(function (result) {
		console.log('ooko');
	}).caught(function (error) {
		console.log(error);
	})
}

function testGetAllCategory() {
	termDao.findAllCategory().then(function (result) {
		console.log(JSON.stringify(result, null, 4));
	});
}

function testGetAllTag() {
	termDao.findAllTag().then(function (result) {
		console.log(JSON.stringify(result, null, 4));
	});
}

function testFindAllPM1() {
	termDao.getCategoryPage(5, 10).then(function (result) {
		console.log(JSON.stringify(result, null, 4));
	});
}
function testFindAllPM2() {
	termDao.getTagPage(5, 10).then(function (result) {
		console.log(JSON.stringify(result, null, 4));
	});
}


function testTransition() {
	models.sequelize.transaction().then(
		function (t) {
			var term = {
				name: "123fsf",
				slug: "123dsf",
				parent: 0,
				description: "123fsf"
			};
			termDao.create(term, {transaction: t}).then(function (term) {
					var termTaxonomy = {
						term_id: term.term_id,
						parent: term.parent || 0,
						taxonomy: "category",
						description: "xxx"
					};
					return taxonomyDao.create(termTaxonomy, {transaction: t});
				})
				.then(function (result) {
					t.commit().then(function () {
						console.log(result);
					})
				}, function (error) {
					console.log(error);
					console.log('-----------');
					t.rollback().then(function () {
						console.log(error.message);
					});
				})

		},
		function (error) {

		});
}


function testCreateTag() {
	models.sequelize.transaction().then(
		function (t) {
			var term = {
				name: "123",
				slug: "123",
				parent: 0,
				description: "123"
			};
			termDao.create(term, {transaction: t}).then(function (term) {
				var termTaxonomy = {
					term_id: term.term_id,
					taxonomy: "post_tag",
					description: description
				};
				return taxonomyDao.create(termTaxonomy, {transaction: t});
			}).then(function (result) {
				t.commit().then(function () {
					console.log(12313);
				});
			}, function (error) {
				t.rollback(function () {
					console.log(123);
				});
			});

		},
		function (error) {

		});
}
function testCreate() {
	termDao.create({
		name: "test11",
		slug: "test11",
		termTaxonomy: {
			//taxonomy: "ibmsfsf",
			description: "test11",
			parent: 0
		}
	}, {
		include: [
			{
				model: models.TermTaxonomy,
				as: "termTaxonomy"
			}
		]
	}).then(function (result) {
		console.log(result);
		//console.log(result);
	}, function (error) {
		console.log(error);
	});

}

function testCreate2() {
	models.sequelize.transaction().then(function (t) {
		termDao.create2({
			name: "test22",
			slug: "test22",
			termTaxonomy: {
				//taxonomy: "ibmsfsf",
				description: "test22",
				parent: 0
			}
		}, t).then(function (result) {
			t.commit().then(function () {
				console.log(result);
			});
			//console.log(result);
		}, function (error) {
			t.rollback().then(function() {
				console.log(error);
			})
		});
	});
}

function testUpdate() {
	models.sequelize.transaction().then(function (t) {
		termDao.update2({
			term_id:113,
			name: "testjiangsan2",
			slug: "testjiangsan2",
			termTaxonomy: {
				//taxonomy: "ibmsfsf",
				description: "testjiangsan",
				parent: 0
			}
		}, t).then(function (result) {
			t.commit().then(function () {
				console.log(result);
			});
			//console.log(result);
		}, function (error) {
			t.rollback().then(function() {
				console.log(error);
			})
		});
	});
}
//testGetAllTag();
//testGetAllCategory();

//testGetById();
//testFindAllPM2();

createManyTerm();
//testUpdate();