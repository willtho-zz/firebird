// InventoryView.js
// Subview that displays the inventory in the content area

var firebird = firebird || {};

firebird.InventoryView = Backbone.View.extend({

  tagName: "div",

  initialize: function() {
    this.inventoryViewTemplate = _.template($("#inventoryViewTemplate").html());
  },

  render: function() {
    var self = this;

    // get the values needed by the template
    var category = self.category ? firebird.categories.get(self.category).get("name") : "All Items";

    // create the item list
    var items = firebird.inventory.filter({ category: self.category, query: self.query }), rows = [], pages = [];

    // split the item array into groups of four
    while (items.length) {
      rows = rows.concat([_(items).first(4)]);
      items = _(items).rest(4);
    }

    // split the rows into pages (groups of three)
    while (rows.length) {
      pages = pages.concat([_(rows).first(3)]);
      rows = _(rows).rest(3);
    }

    self.$el.html(self.inventoryViewTemplate({
      category: category,
      query: self.query,
      currentPage: self.page,
      pages: Math.max(pages.length, 1),
      items: pages[self.page - 1] || [],
      admin: firebird.app.loggedIn
    }));

    // set up event handlers
    setTimeout(function() {
      // "remove" link
      self.$("#removeSearch").click(function(e) {
        firebird.router.navigate("shop/" + self.category + "/p1", { trigger: true });
        e.preventDefault();
      });

      // page links
      self.$(".navPage").click(function(e) {
        // construct the url based on whether a search is active and the link's page
        var url = self.query ? "search/" + self.query : "shop";
        url += "/" + self.category + "/p" + $(this).data("page");

        firebird.router.navigate(url, { trigger: true });
        e.preventDefault();
      });

      // item links
      self.$(".itemLink").click(function(e) {
        firebird.router.navigate("item/" + $(this).data("item-id"), { trigger: true });
        e.preventDefault();
      });

      // "delete item" links
      self.$(".deleteItemLink").click(function(e) {
        e.preventDefault();

        $.ajax("/api/inventory/" + $(this).data("item-id"), {
          type: "DELETE",
          success: function() {
            Notifier.success("Item deleted.");
            firebird.inventory.fetch();
          }
        }).error(function() {
          Notifier.error("Could not delete item.");
        });
      });

      // "move item" links
      self.$(".moveItemLink").click(function(e) {
        e.preventDefault();

        var div = $("<div class='popupMenu'></div>"), itemID = $(this).data("item-id");

        firebird.categories.each(function(category) {
          var categoryID = category.get("id");
          div.append("<a href='' class='dark'>" + category.get("name") + "</a><br>")
             .find("a").last().click(function(e) {
               e.preventDefault();

               var item = _.clone(firebird.inventory.get(itemID));
               item.category = categoryID;

               firebird.inventory.get(itemID).save({ category: categoryID }, {
                 success: function() {
                   Notifier.success("Item moved.");
                   div.hide().detach();
                 },
                 error: function() {
                   Notifier.error("Could not move item.");
                   firebird.inventory.trigger("reset");
                   div.hide().detach();
                 }
               });
             });
        });

        div.find("br").last().remove();

        div.mouseleave(function() {
          div.hide().detach();
        });

        $("body").append(div);
        div.width(80).position({ my: "left top", at: "left top", of: this });
      });

      // "add item" link
      self.$("#addItemLink").click(function(e) {
        e.preventDefault();

        var dialog = firebird.modalDialog2("Add Item",
          "Name: <input id='itemName'><br>" +
          "Description: <input id='itemDescription'><br>" +
          "Category: <select id='itemCategory'></select><br>" +
          "Price: <input id='itemPrice'><br>" +
          "Sale Price: <input id='itemSalePrice'><br>" +
          "Quantity: <input id='itemQuantity'>",
          {
            Add: function() {
              firebird.inventory.create({
                name: dialog.find("#itemName").val(),
                description: dialog.find("#itemDescription").val(),
                price: parseFloat(dialog.find("#itemPrice").val()),
                salePrice: parseFloat(dialog.find("#itemSalePrice").val()),
                quantity: parseInt(dialog.find("#itemQuantity").val())
              }, {
                success: function() {
                  Notifier.success("Item added.");
                  firebird.inventory.fetch();
                },
                error: function() {
                  Notifier.error("Could not add item.");
                }
              });
            },
            Cancel: function() {
              dialog.dialog("close");
            }
          });
      });
    }, 10);

    return self.$el;
  },

  // mutator methods - return "this" to enable method chaining
  setCategory: function(category) {
    this.category = category;
    return this;
  },

  setPage: function(page) {
    this.page = page;
    return this;
  },

  setQuery: function(query) {
    this.query = query;
    return this;
  }

});
