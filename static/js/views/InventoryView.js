// InventoryView.js
// Subview that displays the inventory in the content area

var firebird = firebird || {};

firebird.InventoryView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.inventoryViewTemplate = _.template($("#inventoryViewTemplate").html());
  },

  render: function() {
    var self = this;

    // get the values needed by the template
    var category = self.category ? firebird.categories.get(self.category).get("name") : "All Items";

    // create the item list
    var items = firebird.inventory.filter({ category: self.category, query: self.query }), rows = [];

    // split the item array into groups of four
    while (items.length) {
      rows = rows.concat([_(items).first(4)]);
      items = _(items).rest(4);
    }

    self.$el.html(self.inventoryViewTemplate({ category: category, query: self.query, items: rows }));

    // set up event handlers
    setTimeout(function() {
      // "remove" link
      self.$el.find("#removeSearch").click(function(e) {
        firebird.router.navigate("shop/" + self.category + "/p1", { trigger: true });
        e.preventDefault();
      });
    }, 10);

    return self.$el;
  },

  // mutator methods - return "this" to enable method chaining
  setCategory: function(category) {
    this.category = category;
    return this;
  },

  setPage: function(page) {
    this.page = page;
    return this;
  },

  setQuery: function(query) {
    this.query = query;
    return this;
  }

});
