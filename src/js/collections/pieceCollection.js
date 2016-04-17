import _        from 'underscore';
import Backbone from 'backbone';

import * as Pieces from "./../models/pieces/pieces";

let PieceCollection = Backbone.Collection.extend({
  model: Pieces.Piece,

  pawnPromotion: function(pawn, type) {
    let Type = type[0].toUpperCase() + type.slice(1);
    let newPiece = new Pieces[Type]({
      x: pawn.attributes.x,
      y: pawn.attributes.y,
      color: pawn.attributes.color,
      enemyCollection: pawn.attributes.enemyCollection,
      onStartPos: false
    });
    this.push(newPiece);
    this.trigger('piece_add', newPiece);
    pawn.trigger('promotion', pawn, newPiece);
    pawn.destroy();
    return newPiece;
  },

  addPiece: function(piece) {
    this.push(piece);
    this.trigger('piece_add', piece);
  },

  getPieceAt: function (x, y) {
    return this.models.find( (piece) => x == piece.attributes.x && y == piece.attributes.y);
  },

  initialize: function () {
    this.listenTo(this, 'move', (piece) => {
      this.lastMovedPiece = piece;
    });
  }
});

export default PieceCollection;
