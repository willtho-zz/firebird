// CartView.js
// Subview that displays the contents of the shopping cart in the content area

var firebird = firebird || {};

firebird.CartView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.cartViewTemplate = _.template($("#cartViewTemplate").html());
  },

  render: function() {
    this.$el.html(this.cartViewTemplate({
      inventory: firebird.inventory,
      items: firebird.cart
    }));
    return this.$el;
  }

});
