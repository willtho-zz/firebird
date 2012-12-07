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
        e.preventDefault();

        var item = firebird.cart.where({ itemID: self.id })[0], inCart = item ? item.get("count") : 0,
            adding = parseInt(self.$("#addQuantity").val());

        if (inCart + adding > firebird.inventory.get(self.id).get("quantity")) {
          Notifier.error("Not enough items in stock.");
          return;
        }

        if (item) {
          item.incrementCount(adding);
        }
        else {
          firebird.cart.add(new firebird.CartItem({
            itemID: self.id,
            count: adding
          }));
        }

        Notifier.success("\"" + firebird.inventory.get(self.id).get("name") + "\" added to cart.");
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
