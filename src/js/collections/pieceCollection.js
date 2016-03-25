import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'Backbone';

import * as Pieces from "./../models/pieces/pieces";

let PieceCollection = Backbone.Collection.extend({
  model: Pieces.Piece,

  pawnPromotion: function(pawn, type) {
    let Type = type[0].toUpperCase() + type.slice(1);
    this.push(new Pieces[Type]({
      x: pawn.attributes.x,
      y: pawn.attributes.y,
      color: pawn.attributes.color,
      enemyCollection: pawn.attributes.enemyCollection
    }));
    pawn.trigger('promotion', this);
    pawn.destroy();
  },

  getPieceAt: function (x, y) {
    return this.models.find( (piece) => x == piece.attributes.x && y == piece.attributes.y);
  }


});

export default PieceCollection;
