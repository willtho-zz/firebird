var firebird = firebird || {};

firebird.Cart = Backbone.Collection.extend({

	model: firebird.CartItem,

	// return the count formatted for use in the "View Cart" link
	getFormattedCount: function() {
		var count = this.length;

		if (count == 0)
			return "empty";
		else if (count == 1)
			return "1 item";
		else
			return count + " items";
	}

});
