// CartItem.js
// Client-side representation of an item in the cart

var firebird = firebird || {};

firebird.CartItem = Backbone.Model.extend({

  defaults: {
    itemID: 0,
    count: 1
  }

});
