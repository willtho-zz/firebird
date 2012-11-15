// Inventory.js
// Collection containing all items in the shop's inventory

var firebird = firebird || {};

firebird.Inventory = Backbone.Collection.extend({

  model: firebird.Item,
  url: "/api/inventory",

  // return an array of items that fit the search criteria
  // "options" is an object with the following optional fields:
  //   * category - category ID
  //   * maxPrice - upper limit on sale price
  //   * minPrice - lower limit on sale price
  //   * onSale   - whether the item is on sale (boolean)
  //   * query    - text to search for in names and descriptions
  filter: function(options) {
    var items = _(this.models).pluck("attributes");
    options = options || {};

    if (options.category)
      items = _(items).where({ category: options.category });

    if (options.query) {
      var query = options.query.toLowerCase().split(" ");

      items = _(items).filter(function(item) {
        // return items where all search terms were found
        return _(query).all(function(term) {
          return item.name.search(term) >= 0 ||
                 item.description.search(term) >= 0;
        });
      });
    }

    if ("minPrice" in options)
      items = _(items).filter(function(item) { return item.salePrice >= options.minPrice; });

    if ("maxPrice" in options)
      items = _(items).filter(function(item) { return item.salePrice <= options.maxPrice; });

    if ("onSale" in options)
      items = _(items).filter(function(item) { return (item.price != item.salePrice) == options.onSale; });

    return items;
  }

});
