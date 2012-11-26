// CheckoutView.js
// Subview that lets the user check out their items

var firebird = firebird || {};

firebird.CheckoutView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.checkoutViewTemplate = _.template($("#checkoutViewTemplate").html());
  },

  render: function() {
    this.$el.html(this.checkoutViewTemplate());
    return this.$el;
  }

});
