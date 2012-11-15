// Inventory.js
// Collection containing all items in the shop's inventory

var firebird = firebird || {};

firebird.Inventory = Backbone.Collection.extend({

  model: firebird.Item,
  url: "/api/inventory"

});
