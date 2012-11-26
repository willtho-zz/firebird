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
      total: firebird.app.total
    }));

    setTimeout(function() {
      // "billing info same as shipping" checkbox
      self.$("#same").click(function() {
        // show or hide the billing info table
        self.$("#billingTable")[$(this).attr("checked") ? "hide" : "show"]("slow");
      });
    }, 350);

    return self.$el;
  }

});
