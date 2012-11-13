var firebird = firebird || {};

firebird.Cart = Backbone.Collection.extend({

	model: firebird.CartItem,

	// return the count formatted for use in the "View Cart" link
	getFormattedCount: function() {
		switch (this.length) {
		case 0:
			return "empty";
		case 1:
			return "1 item";
		default:
			return this.length + " items";
		}
	}

});
