var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

var Pieces = require('./../models/pieces');

var PieceCollection = Backbone.Collection.extend({
  model: Pieces.Piece,

  pawnPromotion: function (pawn, type) {
    var Type = type[0].toUpperCase() + type.slice(1);
    this.push(new Pieces[Type]({
      x: pawn.attributes.x,
      y: pawn.attributes.y,
      color: pawn.attributes.color,
      enemyCollection: pawn.attributes.enemyCollection
    }));
    pawn.trigger('promotion', this);
    pawn.destroy();
  }
});

module.exports = PieceCollection;
