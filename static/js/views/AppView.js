// AppView.js
// Top-level view responsible for navigation and setting up child views

var firebird = firebird || {};

firebird.modalDialog = function(title, contents, buttons) {
  return $("<div title=\"" + title + "\">" + contents + "</div>").dialog({
    buttons: buttons,
    draggable: false,
    modal: true,
    resizable: false
  });
}

firebird.AppView = Backbone.View.extend({

  initialize: function() {
    var self = this;

    self.categoryListTemplate = _.template($("#categoryListTemplate").html());

    // cache HTML elements
    self.$cartItemCount = self.$("#cartItemCount");
    self.$categoryList = self.$("#categoryList");
    self.$contentDiv = self.$("#contentDiv");
    self.$loginLink = self.$("#loginLink");
    self.$searchText = self.$("#searchText");

    // create the child views
    self.views = {};
    self.views.cart = new firebird.CartView();
    self.views.checkout = new firebird.CheckoutView();
    self.views.inventory = new firebird.InventoryView();
    self.views.item = new firebird.ItemView();

    self.$("#homeLink").click(function(e) {
      firebird.router.navigate("/", { trigger: true });
      e.preventDefault();
    });

    // update the inventory view when the inventory changes
    firebird.inventory.on("all", function() {
      self.views.inventory.render();
    });

    // update the category list when the categories change
    firebird.categories.on("all", function() {
      // handler for category link
      function navigateCategory(e) {
        // navigate to the correct category
        var id = $(this).data("category-id");

        // navigate to either /search or /shop, depending on whether the user has
        // entered a query
        var url = self.query ? "search/" + self.query + "/" : "shop/";
        url += id + "/p1";
        firebird.router.navigate(url, { trigger: true });

        e.preventDefault();
      }

      // fill in the category list and add handlers to the links
      self.$categoryList.html(self.categoryListTemplate({
        categories: firebird.categories,
        admin: firebird.app.loggedIn
      })).find("a").each(function() {
        var $this = $(this);
        $this.html($this.html().trim());
      });
      setTimeout(function() {
        self.$categoryList.find("a.categoryLink").click(navigateCategory);
        self.$categoryList.find("a.editLink").click(function(e) {
          e.preventDefault();
        });
        self.$categoryList.find("a.removeLink").click(function(e) {
          firebird.categories.get($(this).data("category-id")).destroy();
          e.preventDefault();
        });
        self.$categoryList.find("a.addLink").click(function(e) {
          e.preventDefault();
        });
      }, 50);
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

    // add the search event handler
    self.$("#searchForm").submit(function(e) {
      e.preventDefault();

      var query = self.$searchText.val();
      self.$searchText.val("");

      // don't allow an empty query
      if (!query)
        return;

      // if we're not in the inventory view, go to "All Items"
      var category = Math.max(self.category, 0),
          url = "search/" + query + "/" + category + "/p1";
      firebird.router.navigate(url, { trigger: true });
    });

    // login link handler
    self.$loginLink.html(self.$loginLink.html().trim());
    self.$loginLink.click(function(e) {
      e.preventDefault();

      if (firebird.app.loggedIn) {
        // log out
        $.post("/logout", function() {
          firebird.app.loggedIn = false;
          self.$loginLink.html("Log In");
          Notifier.success("Logged out.");
          firebird.categories.trigger("change");
        });
      }
      else {
        // log in
        function logIn() {
          $.post("/login", {
            username: dialog.find("#name").val(),
            password: dialog.find("#pass").val()
          }, function() {
            firebird.app.loggedIn = true;
            self.$loginLink.html("Log Out");
            dialog.dialog("close");
            firebird.categories.trigger("change");
            Notifier.success("Logged in.");
          }).error(function() {
            Notifier.error("Could not log in.");
          });
        }

        var dialog = firebird.modalDialog("Log In",
          "<form><input type='text' id='name'><input type='password' id='pass'></form>",
          {
            "Log In": logIn,
            "Cancel": function() {
              dialog.dialog("close");
            }
          });
        
        // submit form when "enter" is pressed
        dialog.find("#name").add(dialog.find("#pass")).keypress(function(e) {
          if (e.keyCode == 13)
            dialog.find("form").submit();
        });

        dialog.find("form").submit(function(e) {
          logIn();
          e.preventDefault();
        });
      }
    });
  },

  // navigation actions
  navigateCart: function() {
    var self = this;

    self.category = -1;
    self.query = "";

    // update the UI
    self.$categoryList.children("a").removeClass("bold");
    document.title = "James' Magic Shop - Shopping Cart";
    self.transition(self.views.cart);
  },

  navigateCheckout: function() {
    var self = this;

    self.category = -1;
    self.query = "";

    // update the UI
    self.$categoryList.children("a").removeClass("bold");
    document.title = "James' Magic Shop - Checkout";
    self.transition(self.views.checkout);
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
    var categoryTitle = category ? " - " + firebird.categories.get(category).get("name") : "";
    document.title = "James' Magic Shop" + categoryTitle;

    self.views.inventory.setCategory(category).setPage(page).setQuery(query);
    self.transition(self.views.inventory);
  },

  navigateItem: function(id) {
    var self = this;

    self.category = -1;
    self.query = "";

    // update the UI
    self.$categoryList.children("a").removeClass("bold");
    document.title = "James' Magic Shop - " + firebird.inventory.get(id).get("name");

    self.views.item.setID(id);
    self.transition(self.views.item);
  },

  // fade out the content area, replace the content and fade back in
  transition: function(view) {
    var self = this;

    self.$contentDiv.fadeOut(150, function() {
      self.$contentDiv.html(view.render());
      self.$contentDiv.fadeIn(150);
    });
  }

});
