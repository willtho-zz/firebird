var firebird = firebird || {};

firebird.InventoryView = Backbone.View.extend({

	tagName: "div",

	events: {
		"click #removeSearch": "removeSearch"
	},

	initialize: function() {
		this.inventoryTemplate = _.template($("#inventoryTemplate").html());
	},

	render: function() {
		this.$el.html(this.inventoryTemplate({
			category: this.category,
			search: this.search,
			categories: firebird.categories
		}));
		this.delegateEvents();
		return this;
	},

	removeSearch: function() {
		this.setSearch("");
	},

	setCategory: function(id) {
		this.category = id == "all" ? 0 : id;
		return this;
	},

	setSearch: function(search) {
		this.search = search;
		this.render();
	}

});
