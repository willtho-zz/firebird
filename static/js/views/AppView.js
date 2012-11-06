var firebird = firebird || {};

firebird.AppView = Backbone.View.extend({

	el: $("#app"),

	initialize: function() {
		var self = this;

		// cache HTML elements
		self.$cartItemCount = self.$("#cartItemCount");

		// update cart item count
		firebird.cart.on("all", function() {
			self.$cartItemCount.html(firebird.cart.getFormattedCount());
		});
		firebird.cart.trigger("change");
	},

	// navigation actions
	navigateAllCategories: function() {
		console.log("all categories");
	},

	navigateCart: function() {
		console.log("cart");
	},

	navigateCategory: function(id) {
		console.log("category " + id);
	}

});
