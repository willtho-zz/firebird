// CartView.js
// Subview that displays the contents of the shopping cart in the content area

var firebird = firebird || {};

firebird.CartView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.cartViewTemplate = _.template($("#cartViewTemplate").html());
  },

  render: function() {
    var self = this;

    self.$el.html(self.cartViewTemplate({
      inventory: firebird.inventory,
      items: firebird.cart
    }));

    setTimeout(function() {
      // add the remove button event handler
      self.$(".removeButton").click(function(e) {
        firebird.cart.remove(firebird.cart.where({ itemID: $(this).data("item-id") }));
        firebird.app.navigateCart();
      });
    }, 350);

    return self.$el;
  }

});
