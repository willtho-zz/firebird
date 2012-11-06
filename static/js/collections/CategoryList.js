var firebird = firebird || {};

firebird.CategoryList = Backbone.Collection.extend({

	model: firebird.Category,

	url: "/api/categories"

});
