// ItemView.js
// Subview that displays an item's details in the content area

var firebird = firebird || {};

firebird.ItemView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.itemViewTemplate = _.template($("#itemViewTemplate").html());
  },

  render: function() {
    var self = this;

    self.$el.html(self.itemViewTemplate({ item: firebird.inventory.get(self.id).attributes }));

    // set up event handlers
    setTimeout(function() {
      // "add to cart" form
      self.$("#addToCartForm").submit(function(e) {
        var item = firebird.cart.where({ itemID: self.id })[0];

        if (item) {
          item.incrementCount(parseInt(self.$("#addQuantity").val()));
        }
        else {
          firebird.cart.add(new firebird.CartItem({
            itemID: self.id,
            count: parseInt(self.$("#addQuantity").val())
          }));
        }

        e.preventDefault();
      });
    }, 10);

    return self.$el;
  },

  // mutator methods - return "this" to enable method chaining
  setID: function(id) {
    this.id = id;
    return this;
  }

});
