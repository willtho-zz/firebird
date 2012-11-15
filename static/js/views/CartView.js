// CartView.js
// Subview that displays the contents of the shopping cart in the content area

var firebird = firebird || {};

firebird.CartView = Backbone.View.extend({

  tagName: "div",

  render: function() {
    this.$el.html("<h2 class='title'>Shopping Cart</h2>");
    return this.$el;
  }

});
