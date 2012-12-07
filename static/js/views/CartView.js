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
      items: firebird.cart,
      app: firebird.app
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

          // find the item in the cart and get the new count
          var item = firebird.cart.where({ itemID: id })[0],
              invItem = firebird.inventory.get(item.get("itemID")),
              count = parseInt($(this).val());

          // make sure there are enough items in the inventory
          if (count > invItem.get("quantity")) {
            Notifier.error("Not enough of item \"" + invItem.get("name") + "\" in stock.");
            $(this).val(item.get("count"));
          }
          else if (count > 0)
            item.set("count", count);
          else
            // if count <= 0, remove the item
            firebird.cart.remove(item);
        });

        firebird.app.navigateCart();
      });

      // checkout button
      self.$("#checkoutButton").click(function() {
        firebird.router.navigate("checkout", { trigger: true });
      });
    }, 350);

    return self.$el;
  }

});
