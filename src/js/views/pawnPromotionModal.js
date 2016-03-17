var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

var PawnPromotionModal = Backbone.View.extend({

  className: 'pawnPromotionModal',
  template: _.template($('#pawnPromotionModalTemplate').html()),

  initialize: function () {
    $("body").append(this.render().el);
  },

  render: function() {
    this.$el.html( this.template({
      pieces: ['knight', 'rook', 'bishop', 'queen'],
      color: this.model.attributes.color
    }));
    return this;
  },

  events: {
    'click .pawnPromotionModal__piece': 'onPieceClick'
  },

  onPieceClick: function (e) {
    var type = $(e.target).closest('.pawnPromotionModal__piece').data('type');
    this.model.collection.pawnPromotion(this.model, type);
    this.remove();
  }
});

module.exports = PawnPromotionModal;
