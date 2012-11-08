var firebird = firebird || {};

firebird.InventoryView = Backbone.View.extend({

	tagName: "div",

	render: function() {
		this.$el.html(this.category ? "Viewing category " + this.category : "Viewing all items");
		return this;
	},

	setCategory: function(id) {
		this.category = id == "all" ? 0 : id;
		return this;
	}

});
