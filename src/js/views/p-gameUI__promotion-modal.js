import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'backbone';

import template from './../../templates/p-gameUI__promotion-modal.ejs';

let PawnPromotionModal = Backbone.View.extend({

  className: 'pawn-promotion-modal',
  template: _.template(template),

  render: function() {
    this.$el.html( this.template({
      pieces: ['knight', 'rook', 'bishop', 'queen'],
      color: this.model.attributes.color
    }));
    return this;
  },

  events: {
    'click .pawn-promotion-modal__piece': 'onPieceClick'
  },

  onPieceClick: function (e) {
    let type = $(e.target).closest('.pawn-promotion-modal__piece').data('type');
    this.model.collection.pawnPromotion(this.model, type);
    this.remove();
  }
});

export default PawnPromotionModal;
