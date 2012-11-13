var firebird = firebird || {};

firebird.AppView = Backbone.View.extend({

	el: $("#app"),

	initialize: function() {
		var self = this;

		// cache HTML elements
		self.$cartItemCount = self.$("#cartItemCount");
		self.$categoryList = self.$("#categoryList");
		self.$contentDiv = self.$("#contentDiv");
		self.$searchText = self.$("#searchText");

		// cache templates
		self.categoryListTemplate =
			_.template($("#categoryListTemplate").html());

		// initialize content views
		self.views = {};
		self.views.cart = new firebird.CartView();
		self.views.item = new firebird.ItemView();
		self.views.shop = new firebird.InventoryView();

		// update cart item count
		firebird.cart.on("all", function() {
			self.$cartItemCount.html(firebird.cart.getFormattedCount());
		});
		firebird.cart.trigger("change");

		// update category list
		firebird.categories.on("add remove reset", function() {
			self.$categoryList.html(self.categoryListTemplate({
				categories: firebird.categories.models
			}));

			// if the inventory is open, highlight the right link
			var category = self.views.shop.category;

			if (location.hash.substring(0, 5) == "#shop")
				self.setCategory(category ? "shop-" + category : "shop");
		});

		// set up the search event handler
		self.$("#searchForm").submit(function(e) {
			e.preventDefault();

			// make sure the input isn't empty
			if (!self.$searchText.val())
				return;

			// if the cart is open, navigate to inventory view
			if (location.hash.substring(0, 5) != "#shop")
				firebird.router.navigate("shop", { trigger: true });

			self.views.shop.setSearch(self.$searchText.val());
			self.views.shop.render();
			self.$searchText.val("");
		});
	},

	// navigation actions
	navigateAllCategories: function() {
		this.setCategory("shop");
		this.views.shop.setCategory("all");
		this.$contentDiv.html(this.views.shop.render().el);
		document.title = "James' Magic Shop";
	},

	navigateCart: function() {
		this.setCategory();
		this.$contentDiv.html(this.views.cart.render().el);
		document.title = "James' Magic Shop - Shopping Cart";
	},

	navigateCategory: function(id) {
		this.setCategory("shop-" + id);
		this.views.shop.setCategory(id);
		this.$contentDiv.html(this.views.shop.render().el);
		document.title = "James' Magic Shop - " +
		                 firebird.categories.get(id).get("name");
	},

	navigateItem: function(id) {
		this.setCategory();
		this.views.item.setItem(firebird.inventory.get(id));
		this.$contentDiv.html(this.views.item.render().el);
		document.title = "James' Magic Shop - " +
		                 firebird.inventory.get(id).get("name");
	},

	// change the link for the given category to bold
	setCategory: function(id) {
		this.$categoryList.find("a").removeClass("bold").filter("#" + id)
		    .addClass("bold");
	}

});
