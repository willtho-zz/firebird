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
      self.$el.find("#removeSearch").click(function(e) {
        firebird.router.navigate("shop/" + self.category + "/p1", { trigger: true });
        e.preventDefault();
      });

      // page links
      self.$el.find(".navPage").click(function(e) {
        // construct the url based on whether a search is active and the link's page
        var url = self.query ? "search/" + self.query : "shop";
        url += "/" + self.category + "/p" + $(this).data("page");

        firebird.router.navigate(url, { trigger: true });
        e.preventDefault();
      });

      // item links
      self.$el.find(".itemLink").click(function(e) {
        firebird.router.navigate("item/" + $(this).data("item-id"), { trigger: true });
        e.preventDefault();
      });

      // "delete item" links
      self.$el.find(".deleteItemLink").click(function(e) {
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
      self.$el.find(".moveItemLink").click(function(e) {
        e.preventDefault();

        var div = $("<span class='popupMenu'><ul></ul></span>"), itemID = $(this).data("item-id"),
            ul = div.find("ul");

        firebird.categories.each(function(category) {
          var categoryID = category.get("id");
          ul.append("<li><a href='' class='dark'>" + category.get("name") + "</a></li>")
            .find("a").last().click(function(e) {
              e.preventDefault();

              var item = _.clone(firebird.inventory.get(itemID));
              item.category = categoryID;

              firebird.inventory.get(itemID).save({ category: categoryID }, {
                success: function() { Notifier.success("Item moved."); },
                error: function() {
                  Notifier.error("Could not move item.");
                  firebird.inventory.trigger("reset");
                }
              });
            });
        });

        div.mouseleave(function() {
          div.hide().detach();
        });

        $("body").append(div);
        div.position({ my: "left top", at: "left top", of: this });
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
