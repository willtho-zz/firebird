var firebird = firebird || {};

firebird.Item = Backbone.Model.extend({

	defaults: {
		name: "",
		desc: "",
		category: "",
		price: 0,
		salePrice: 0,
		quantity: 1
	}

});
