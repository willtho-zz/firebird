// ItemView.js
// Subview that displays an item's details in the content area

var firebird = firebird || {};

firebird.ItemView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.itemViewTemplate = _.template($("#itemViewTemplate").html());
  },

  render: function() {
    this.$el.html(this.itemViewTemplate({ item: firebird.inventory.get(this.id).attributes }));
    return this.$el;
  },

  // mutator methods - return "this" to enable method chaining
  setID: function(id) {
    this.id = id;
    return this;
  }

});
