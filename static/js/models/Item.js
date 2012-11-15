// Item.js
// Representation of an item in the inventory

var firebird = firebird || {};

firebird.Item = Backbone.Model.extend({

  defaults: {
    name: "",
    description: "",
    category: 0,
    price: 0,
    salePrice: 0,
    quantity: 1
  }

});
