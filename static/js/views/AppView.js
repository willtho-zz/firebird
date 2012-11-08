var firebird = firebird || {};

firebird.AppView = Backbone.View.extend({

	el: $("#app"),

	initialize: function() {
		var self = this;

		// cache HTML elements
		self.$cartItemCount = self.$("#cartItemCount");
		self.$categoryList = self.$("#categoryList");

		// update cart item count
		firebird.cart.on("all", function() {
			self.$cartItemCount.html(firebird.cart.getFormattedCount());
		});
		firebird.cart.trigger("change");

		// update category list
		firebird.categories.on("add remove reset", function() {
			self.$categoryList.html("<a id='shop' href='#shop' class='dark'>All Items</a><br>");
			_.each(firebird.categories.models, function(category) {
				var id = category.get("id");
				self.$categoryList.append("<br><a id='shop-" + id + "' href='#shop/" + id +
					"' class='dark'>" + category.get("name") + "</a>");
			});
		});
	},

	// navigation actions
	navigateAllCategories: function() {
		this.setCategory("shop");
	},

	navigateCart: function() {
		this.setCategory();
	},

	navigateCategory: function(id) {
		this.setCategory("shop-" + id);
	},

	// change the link for the given category to bold
	setCategory: function(id) {
		this.$categoryList.find("a").removeClass("bold").filter("#" + id).addClass("bold");
	}

});
