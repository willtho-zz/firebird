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

    self.$el.html(self.itemViewTemplate({
      item: firebird.inventory.get(self.id).attributes,
      admin: firebird.app.loggedIn
    }));

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

      // edit button
      self.$("#editLink").click(function(e) {
        e.preventDefault();

        var dialog = firebird.modalDialog2("Edit Item",
          "<table><tr><td>Name:</td><td><input id='itemName'></td></tr>" +
          "<tr><td>Description:</td><td><input id='itemDescription'></td></tr>" +
          "<tr><td>Category:</td><td><select id='itemCategory'></select></td></tr>" +
          "<tr><td>Price:</td><td><input id='itemPrice'></td></tr>" +
          "<tr><td>Sale Price:</td><td><input id='itemSalePrice'></td></tr>" +
          "<tr><td>Quantity:</td><td><input id='itemQuantity'></td></tr></table>",
          {
            Edit: function() {
              firebird.inventory.get(self.id).save({
                name: dialog.find("#itemName").val(),
                description: dialog.find("#itemDescription").val(),
                category: dialog.find("#itemCategory").val(),
                price: parseFloat(dialog.find("#itemPrice").val()),
                salePrice: parseFloat(dialog.find("#itemSalePrice").val()),
                quantity: parseInt(dialog.find("#itemQuantity").val())
              }, {
                success: function() {
                  Notifier.success("Item edit.");
                  firebird.inventory.fetch();
                  dialog.dialog("close");
                },
                error: function() {
                  Notifier.error("Could not edit item.");
                  dialog.dialog("close");
                }
              });
            },
            Cancel: function() {
              dialog.dialog("close");
            }
          });

        firebird.categories.each(function(category) {
          dialog.find("#itemCategory").append("<option value='" + category.get("id") +
                                              "'>" + category.get("name") + "</option>");

        var item = firebird.inventory.get(self.id);

        dialog.find("#itemName").val(item.get("name"));
        dialog.find("#itemDescription").val(item.get("description"));
        dialog.find("#itemCategory").val(item.get("category"));
        dialog.find("#itemPrice").val(item.get("price"));
        dialog.find("#itemSalePrice").val(item.get("salePrice"));
        dialog.find("#itemQuantity").val(item.get("quantity"));
        });
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
