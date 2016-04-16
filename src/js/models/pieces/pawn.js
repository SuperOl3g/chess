import _        from 'underscore';

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

  canBeMovedTo: function(pos) {
    let deltaY = this.attributes.color == 'white' ? 1 : -1;

    // дополнительная обработка варианта с взятием на проходе
    if ([1,-1].some( (deltaX) => this.attributes.x + deltaX == pos.x && this.attributes.y + deltaY == pos.y ))
      return this.constructor.__super__.canBeMovedTo.call(this, pos, {x: pos.x, y: pos.y - deltaY});

    return this.constructor.__super__.canBeMovedTo.call(this, pos);
  },

  getVariants: function () {
    let variants = [],
        deltaY = this.attributes.color == 'white' ? 1 : -1;

    helpers.addTargetPos(this.attributes.x - 1, this.attributes.y + deltaY, this.attributes.enemyCollection, variants);
    helpers.addTargetPos(this.attributes.x + 1, this.attributes.y + deltaY, this.attributes.enemyCollection, variants);

    // взятие на проходе
    [-1,1].forEach( (deltaX) => {
      let targetX = this.attributes.x + deltaX,
          targetY = this.attributes.y;

      let target = this.attributes.enemyCollection.getPieceAt(targetX, targetY);

      if (helpers.isValidCoords(targetX, targetY) && target && target.attributes.type == 'pawn'
        && target.previous('onStartPos') && this.attributes.enemyCollection.lastMovedPiece == target) {
        variants.push({
          x: targetX,
          y: targetY + deltaY,
          type: 'target'
        });
      }
    });

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
