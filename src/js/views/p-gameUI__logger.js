import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'backbone';

import msgTemplate from './../../templates/log-msg.ejs';

let Logger = Backbone.View.extend({

  className: 'log',

  initialize: function (col1, col2) {
    [col1, col2].forEach( (collection) => {
      this.listenTo(collection, 'taking',    this.onTaking);
      this.listenTo(collection, 'check',     this.onCheckOrMate.bind(this, 'check'));
      this.listenTo(collection, 'mate',      this.onCheckOrMate.bind(this, 'mate'));
      this.listenTo(collection, 'draw',      this.onDraw);
      this.listenTo(collection, 'move',      this.onMove);
      this.listenTo(collection, 'castling',  this.onCastling);
      this.listenTo(collection, 'promotion', this.onPromotion);
    });
  },

  render: function() {
    this.$el.html('<h2>Log</h2><div class="log__content"></div>');
    return this;
  },

  onMove: function (piece) {
    let $logContent = this.$el.find(".log__content");
    $logContent.append(
      _.template(msgTemplate)({
        type: 'move',
        piece: piece.attributes,
        oldCoords: piece.previousAttributes(),
        NtoS: NtoS
      })
    );
    $logContent.stop().animate({scrollTop: $logContent.prop('scrollHeight')});
  },

  onCastling: function(piece) {
    if (piece.attributes.type != 'rook')
      return;

    let $logContent = this.$el.find(".log__content");
    $logContent.append(
      _.template(msgTemplate)({
        type: 'castling', 
        color: piece.attributes.color,
        castlingType: piece.previous('x') == 0 ? 'long' : 'short'
      })
    );
    $logContent.stop().animate({scrollTop: $logContent.prop('scrollHeight')});
  },

  onPromotion: function(pawn, newPiece) {
    let $logContent = this.$el.find(".log__content");
    $logContent.append(
      _.template(msgTemplate)({
        type: 'promotion',
        pawn: pawn.attributes,
        newPieceType: newPiece.attributes.type,
        NtoS: NtoS
      })
    );
    $logContent.stop().animate({scrollTop: $logContent.prop('scrollHeight')});
  },

  onCheckOrMate: function (endType, color) {
    let $logContent = this.$el.find(".log__content");
    $logContent.append(
      _.template(msgTemplate)({
        type:  'checkOrMate',
        endType,
        color
      })
    );
    $logContent.stop().animate({scrollTop: $logContent.prop('scrollHeight')});
  },

  onDraw: function () {
    let $logContent = this.$el.find(".log__content");
    $logContent.append(
      _.template(msgTemplate)({
        type: 'draw'
      })
    );
    $logContent.stop().animate({scrollTop: $logContent.prop('scrollHeight')});
  },

  onTaking: function (attacker, target) {
    let $logContent = this.$el.find(".log__content");
    $logContent.append(
      _.template(msgTemplate)({
        type: 'taking',
        attacker: attacker.attributes,
        target: target.attributes,
        NtoS: NtoS
      })
    );
    $logContent.stop().animate({scrollTop: $logContent.prop('scrollHeight')});
  }
});

function NtoS(number) {
  let symbols = ['A','B','C','D','E','F','G','H'];
  return symbols[number];
}

export default Logger;
