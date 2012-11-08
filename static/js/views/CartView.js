var firebird = firebird || {};

firebird.CartView = Backbone.View.extend({

	tagName: "div",

	render: function() {
		this.$el.html("<h2 class='title'>Shopping Cart</h2>");
		return this;
	}

});
