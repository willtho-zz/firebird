function StoreViewModel() {
	var self = this;

	// store data
	self.cart = ko.observableArray([]);
	self.categories = ko.observableArray([]);

	// ui state
	self.category = ko.observable("");
	self.search = ko.observable("");
	self.screen = ko.observable("");

	// navigation behaviors
	self.goToAllCategories = function() {
		location.hash = "";
	}
	self.goToCart = function() {
		location.hash = "cart";
	}
	self.goToCategory = function(category) {
		location.hash = "category/" + category;
	}

	// search behaviors
	self.startSearch = function(text) {
		self.goToCategory(self.category());
		self.search(text);
	}
	self.clearSearch = function() {
		self.search("");
	}

	// test data
	self.cart(["item", "item", "item"]);
	self.categories(["Books", "Card Magic", "Coin Magic", "Juggling", "Rope Magic"]);
	self.removeItem = function() {
		self.cart.pop();
	}
	self.addItem = function() {
		self.cart.push("item");
	}

	// url hash routing
	Sammy(function() {
		this.get("#cart", function() {
			self.category("");
			self.screen("cart.html");
		});
		this.get("#category/:category", function() {
			self.category(this.params.category);
			self.screen("inventory.html");
		});
		this.get("", function() {
			self.category("");
			self.screen("inventory.html");
		});
		this.put("", function() { return false; });
	}).run();
}

StoreViewModel.formatItemCount = function(items) {
	switch (items) {
		case 0:  return "empty";
		case 1:  return "1 item";
		default: return items + " items";
	}
};
