// Router.js
// Backbone router that updates the main view when the URL changes

var firebird = firebird || {};

firebird.Router = Backbone.Router.extend({

  routes: {
    "":                               "navigateHome",
    "cart":                           "navigateCart",
    "shop/:category/p:page":          "navigateInventory",
    "search/:query/:category/p:page": "navigateInventorySearch"
  },

  initialize: function() {
    // start routing urls
    Backbone.history.start({ pushState: true });
  },

  // for each route, call the corresponding function in the AppView
  navigateCart: function() {
    firebird.app.navigateCart();
  },

  navigateHome: function() {
    firebird.app.navigateInventory(0, 1, null);
  },

  navigateInventory: function(category, page) {
    firebird.app.navigateInventory(parseInt(category), parseInt(page), null);
  },

  navigateInventorySearch: function(query, category, page) {
    firebird.app.navigateInventory(parseInt(category), parseInt(page), query);
  }

});
