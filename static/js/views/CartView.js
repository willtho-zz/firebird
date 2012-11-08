var firebird = firebird || {};

firebird.CartView = Backbone.View.extend({

	tagName: "div",

	render: function() {
		this.$el.html("This is the shopping cart.");
		return this;
	}

});
