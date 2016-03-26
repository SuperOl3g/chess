import _        from 'underscore';
import Backbone from 'Backbone';


import {Piece, helpers} from './piece';


let Pawn = Piece.extend({
  initialize: function () {
    this.attributes.type = "pawn";
    this.listenTo(this, 'move', this.onPawnMove);
  },

  onPawnMove: function () {
    let lastRank = this.attributes.color == 'white' ? 7 : 0;
    if (this.attributes.y == lastRank) {
      this.trigger('pawnOnLastRank', this);
    }
  },

  getVariants: function () {
    let variants = [],
        deltaY = this.attributes.color == 'white' ? 1 : -1;

    //TODO: взятие на проходе
    helpers.addTargetPos(this.attributes.x - 1, this.attributes.y + deltaY, this.attributes.enemyCollection, variants);
    helpers.addTargetPos(this.attributes.x + 1, this.attributes.y + deltaY, this.attributes.enemyCollection, variants);

    let newX = this.attributes.x,
        newY = this.attributes.y + deltaY;
    if ( !this.attributes.enemyCollection.getPieceAt(newX, newY) )
      helpers.addValidPos(newX, newY, this, variants);

    // ход на 2 клетки со стартовой позиции
    if (this.attributes.onStartPos) {
      let newX = this.attributes.x,
          newY = this.attributes.y + 2 * deltaY;
      if ( !this.attributes.enemyCollection.getPieceAt(newX, newY) )
        helpers.addValidPos(newX, newY, this, variants);
    }

    return variants;
  }
});

export default Pawn;
