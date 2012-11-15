// CategoryList.js
// Collection containing all of the shop's categories

var firebird = firebird || {};

firebird.CategoryList = Backbone.Collection.extend({

  model: firebird.Category,
  url: "/api/categories"

});
