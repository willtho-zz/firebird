var firebird = firebird || {};

firebird.ItemView = Backbone.View.extend({

	tagName: "div",

	render: function() {
		this.$el.html("<h2 class='title'>" + this.item.get("name") + "</h2>");
		return this;
	},

	setItem: function(item) {
		this.item = item;
	}

});
