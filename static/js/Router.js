var firebird = firebird || {};

firebird.Router = Backbone.Router.extend({

	routes: {
		"cart": "navigateCart",
		"shop": "navigateAllCategories",
		"shop/:id": "navigateCategory"
	},

	initialize: function() {
		// start routing requests
		Backbone.history.start();
	},

	// for each route, call the corresponding function in the AppView
	navigateAllCategories: function() {
		firebird.app.navigateAllCategories();
	},

	navigateCart: function() {
		firebird.app.navigateCart();
	},

	navigateCategory: function(id) {
		firebird.app.navigateCategory(id);
	}

});
