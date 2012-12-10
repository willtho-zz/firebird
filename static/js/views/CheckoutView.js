// CheckoutView.js
// Subview that lets the user check out their items

var firebird = firebird || {};

firebird.CheckoutView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.checkoutViewTemplate = _.template($("#checkoutViewTemplate").html());
  },

  render: function() {
    var self = this;

    self.$el.html(self.checkoutViewTemplate({
      total: firebird.app.total || 0
    }));

    setTimeout(function() {
      // "billing info same as shipping" checkbox
      self.$("#same").click(function() {
        // show or hide the billing info table
        self.$("#billingTable")[$(this).attr("checked") ? "hide" : "show"]("slow");
      });

      self.$("#completeOrder").click(function() {
        $.ajax("/checkout", {
          contentType: "application/json",
          data: JSON.stringify({
            email: self.$("#email").val(),
            items: firebird.cart.map(function(item) {
              return { id: item.get("itemID"), quantity: item.get("count") };
            })
          }),
          type: "POST",
          success: function() {
            firebird.inventory.fetch();
            Notifier.success("Order completed");
            firebird.router.navigate("", { trigger: true });
          }
        });
      });
    }, 350);

    return self.$el;
  }

});
