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

    self.$el.html(self.inventoryViewTemplate({ category: category, query: self.query }));

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
