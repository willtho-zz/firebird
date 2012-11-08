var firebird = firebird || {};

firebird.AppView = Backbone.View.extend({

	el: $("#app"),

	initialize: function() {
		var self = this;

		// cache HTML elements
		self.$cartItemCount = self.$("#cartItemCount");
		self.$categoryList = self.$("#categoryList");
		self.$contentDiv = self.$("#contentDiv");

		// initialize content views
		this.views = {};
		this.views.cart = new firebird.CartView();
		this.views.shop = new firebird.InventoryView();

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
		this.$contentDiv.html(this.views.shop.setCategory("all").render().el);
		document.title = "James' Magic Shop";
	},

	navigateCart: function() {
		this.setCategory();
		this.$contentDiv.html(this.views.cart.render().el);
		document.title = "James' Magic Shop - Shopping Cart";
	},

	navigateCategory: function(id) {
		this.setCategory("shop-" + id);
		this.$contentDiv.html(this.views.shop.setCategory(id).render().el);
		document.title = "James' Magic Shop - " + firebird.categories.get(id).get("name");
	},

	// change the link for the given category to bold
	setCategory: function(id) {
		this.$categoryList.find("a").removeClass("bold").filter("#" + id).addClass("bold");
	}

});
