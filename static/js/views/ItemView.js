// ItemView.js
// Subview that displays an item's details in the content area

var firebird = firebird || {};

firebird.ItemView = Backbone.View.extend({

  tagName: "div",

  render: function() {
    this.$el.html("<h2 class='title'>Item</h2>");
    return this.$el;
  },

  // mutator methods - return "this" to enable method chaining
  setID: function(id) {
    this.id = id;
    return this;
  }

});
