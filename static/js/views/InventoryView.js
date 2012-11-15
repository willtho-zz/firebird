// InventoryView.js
// Subview that displays the inventory in the content area

var firebird = firebird || {};

firebird.InventoryView = Backbone.View.extend({

  tagName: "div",

  render: function() {
    var category = this.category ? firebird.categories.get(this.category).get("name") : "All Items";
    this.$el.html("<h2 class='title'>" + category + "</h2>");
    return this.$el;
  },

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
