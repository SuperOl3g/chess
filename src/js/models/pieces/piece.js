import _        from 'underscore';
import Backbone from 'backbone';


/*========================================================
    Вспомогательные функции
 =========================================================*/
let helpers = {
  isValidCoords: function(x, y) {
    return (x >= 0 && x <= 7 && y >= 0 && y <= 7)
  },

  isUnderCheck: function(King) {
    return King.attributes.enemyCollection.models.some( (enemy) => {
      return enemy.getVariants().some( (pos) => {
        return pos.x == King.attributes.x && pos.y == King.attributes.y;
      });
    })
  },

  addTargetPos: function(x, y, enemyCollection, variants) {
    if ( !this.isValidCoords(x, y) || !enemyCollection.getPieceAt(x, y) )
      return false;

    variants.push({x, y, type: 'target'});
    return true;
  },

  addValidPos: function(x, y, yourPiece, variants) {
    if ( !this.isValidCoords(x, y) || yourPiece.collection.getPieceAt(x, y) )
      return false;

    variants.push({x, y, type: 'validPos'});
    return true;
  }
}




let Piece = Backbone.Model.extend({
  defaults: {
    x: null,
    y: null,
    onStartPos: true
  },

  sync: function() {

  },

  getNonBlockedVariants: function() {
    return this.getVariants().filter( (variant) => this.canBeMovedTo(variant).isValid );
  },

  canBeMovedTo: function(pos, targetPos) {
    let enemyPiece = null;

    // проверяем являются ли новые координаты валидными
    pos = this.getVariants().find( (variant) => pos.x == variant.x && pos.y == variant.y );
    if (!pos) return {
      isValid: false,
      enemyPiece: enemyPiece
    };

    // если ставим в клетку с чужой фигурой, ее надо удалить
    if (pos.type == 'target') {
      if (targetPos)
        enemyPiece = this.attributes.enemyCollection.getPieceAt(targetPos.x, targetPos.y);
      if (!enemyPiece)
        enemyPiece = this.attributes.enemyCollection.getPieceAt(pos.x, pos.y);

      if (enemyPiece)
        enemyPiece.collection.remove(enemyPiece);
      else
        throw new Error('Фигура врага не найдена');
    }

    let prevX = this.attributes.x,
        prevY = this.attributes.y,
        prevOnStartPos = this.attributes.onStartPos;

    // если позиция валидна, переставляем фигуру
    this.save({
      x: pos.x,
      y: pos.y,
      onStartPos: false
    });

    let king = this.collection.models.find( (piece) => piece.attributes.type == 'king' );
    if (!king)
      throw new Error('Король не найден');
    let isValid = !helpers.isUnderCheck(king);

    this.save({
      x: prevX,
      y: prevY,
      onStartPos: prevOnStartPos
    });

    if (enemyPiece)
      this.attributes.enemyCollection.add(enemyPiece);

    return {
      isValid: isValid,
      enemyPiece: enemyPiece,
      isCastling: pos.type == 'castling'
    };
  },

  moveTo: function(newX, newY) {
    let posInfo = this.canBeMovedTo({x: newX, y: newY});
    if ( posInfo.isValid ) {
      this.save({
        x: newX,
        y: newY,
        onStartPos: false
      });

      if (posInfo.enemyPiece) {
        posInfo.enemyPiece.trigger('taked', posInfo.enemyPiece, this);
        this.trigger('taking', this, posInfo.enemyPiece);
        posInfo.enemyPiece.destroy();
      }

      this.trigger('move', this);
      return true;
    }
    return false;
  }
});

export {Piece, helpers};
