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
      self.$(".removeButton").click(function() {
        firebird.cart.remove(firebird.cart.where({ itemID: $(this).data("item-id") }));
        firebird.app.navigateCart();
      });

      // update button
      self.$("#updateButton").click(function() {
        self.$(".quantityInput").each(function() {
          var id = $(this).data("item-id");

          firebird.cart.where({ itemID: id })[0].set("count", parseInt($(this).val()));
        });

        firebird.app.navigateCart();
      });
    }, 350);

    return self.$el;
  }

});
