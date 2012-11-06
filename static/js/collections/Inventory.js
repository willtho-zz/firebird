var firebird = firebird || {};

firebird.Inventory = Backbone.Collection.extend({

	model: firebird.Item,

	url: "/api/inventory"

});
