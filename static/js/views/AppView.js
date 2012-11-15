// AppView.js
// Top-level view responsible for navigation and setting up child views

var firebird = firebird || {};

firebird.AppView = Backbone.View.extend({

  initialize: function() {
    var self = this;

    // cache HTML elements
    self.$cartItemCount = self.$("#cartItemCount");
    self.$categoryList = self.$("#categoryList");
    self.$contentDiv = self.$("#contentDiv");

    // create the child views
    self.views = {};
    self.views.cart = new firebird.CartView();
    self.views.inventory = new firebird.InventoryView();

    // update the category list when the categories change
    firebird.categories.on("all", function() {
      // handler for category link
      function navigateCategory(e) {
        // navigate to the correct category
        var id = $(this).data("category-id");
        firebird.router.navigate("shop/" + id + "/p1", { trigger: true });

        e.preventDefault();
      }

      // add the "All Items" link and set up the click handler
      self.$categoryList.html("<a href='' class='dark'>All Items</a><br><br>");
      self.$categoryList.children("a").data("category-id", 0).click(navigateCategory);

      // add a link for each category
      firebird.categories.each(function(category) {
        var $a = $("<a href='' class='dark'>" + category.get("name") + "</a>");
        $a.data("category-id", category.get("id"));
        $a.click(navigateCategory);

        self.$categoryList.append($a).append("<br>");
      });
    });

    // set up the "View Cart" link handler
    self.$("#viewCartLink").click(function(e) {
      firebird.router.navigate("cart", { trigger: true });
      e.preventDefault();
    });

    // update the link when the cart changes
    firebird.cart.on("all", function() {
      self.$cartItemCount.html(firebird.cart.getFormattedCount());
    });
    firebird.cart.trigger("change");
  },

  // navigation actions
  navigateCart: function() {
    var self = this;

    self.category = -1;
    self.search = "";

    // update the UI
    self.$categoryList.children("a").removeClass("bold");
    self.$contentDiv.html(self.views.cart.render());
  },

  navigateInventory: function(category, page, query) {
    var self = this;

    self.category = category;
    self.query = query;

    // update the UI
    self.$categoryList.children("a").removeClass("bold").each(function() {
      var $this = $(this), id = $this.data("category-id");

      if (id == category)
        $this.addClass("bold");
    });

    self.views.inventory.setCategory(category).setPage(page).setQuery(query);
    self.$contentDiv.html(self.views.inventory.render());
  }

});
