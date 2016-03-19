import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'Backbone';


/*==============================
  Вспомогательные функции
===============================*/
let helpers = {
  isValidCoords: function(x, y) {
    return (x >= 0 && x<= 7 && y >= 0 && y <= 7)
  },

  isOccupied: function(x, y, checkCollection) {
    return checkCollection.some( (piece) => piece.attributes.x == x && piece.attributes.y == y );
  },

  isUnderCheck: function(King) {
    return King.attributes.enemyCollection.models.some( (enemy) => {
      return enemy.getVariants().some( (pos) => {
        return pos.x == King.attributes.x && pos.y == King.attributes.y;
      });
    })
  },


  addTargetPos: function(x, y, enemyPieces, variants) {
    if ( !this.isValidCoords(x, y) )
      return false;

    if ( this.isOccupied(x, y, enemyPieces) ) {
      variants.push({x: x, y: y, type: 'target'});
      return true;
    }
    return false;
  },

  addValidPos: function(x, y, yourPiece, variants) {
    if ( !this.isValidCoords(x, y) )
      return false;

    if ( this.isOccupied(x, y, yourPiece.collection.models) )
      return false;

    variants.push({x: x, y: y, type: 'validPos'});
    return true;
  }
}




let Piece = Backbone.Model.extend({
  defaults: {
    x: null,
    y: null,
    onStartPos: true
  },

  sync: function () {
    return;
  },

  getNonBlockedVariants: function () {
    let variants = this.getVariants();
    return variants.filter( (variant) => this.canBeMovedTo(variant).isValid );
  },

  canBeMovedTo: function (pos) {
    let enemyPiece = null;

    if (pos.type == 'target') {
      // если ставим в клетку с чужой фигурой, ее надо удалить
      enemyPiece = this.attributes.enemyCollection.models.find( (enemyPiece) => {
        return enemyPiece.attributes.x == pos.x && enemyPiece.attributes.y == pos.y
      });
      if (enemyPiece)
        enemyPiece.collection.remove(enemyPiece);
      else
        console.error('Фигура врага не найдена');
    }

    let prevX = this.attributes.x,
        prevY = this.attributes.y,
        prewOnStartPos = this.attributes.onStartPos;

    // если позиция валидна, переставляем фигуру
    this.save({
      x: pos.x,
      y: pos.y,
      onStartPos: false
    });

    // но если мы поставили своего короля под удар, возвращаемся обратно
    let king = this.collection.models.find( (piece) => piece.attributes.type == 'king' ),
        checkFlag = helpers.isUnderCheck(king);

    this.save({
      x: prevX,
      y: prevY,
      onStartPos: prewOnStartPos
    });

    if (enemyPiece)
      this.attributes.enemyCollection.add(enemyPiece);

    return {
      isValid: !checkFlag,
      enemyPiece: enemyPiece
    };
  },

  moveTo: function (newX, newY) {
    let enemyPiece;
    // проверяем являются ли новые координаты валидными
    let pos = this.getVariants().find( (pos) => (pos.x==newX && pos.y == newY) );
    if (!pos) return false;

    let posInfo = this.canBeMovedTo(pos);
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
