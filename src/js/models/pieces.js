var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

var Piece = Backbone.Model.extend({
  defaults: {
    x: null,
    y: null,
    onStartPos: true
  },

  sync: function () {
    return;
  },

  moveTo: function (newX, newY) {
    var enemyPiece;                                                                 // TODO: добавить возрващение срубленных фигур после проверки верности хода
    // проверяем являются ли новые координаты валидными
    var pos = this.getVariants().find( (pos) => (pos.x==newX && pos.y == newY) );
    if (!pos) return false;

    if (pos.type == 'target') {
      // если ставим в клетку с чужой фигурой, ее надо удалить
      enemyPiece = this.attributes.enemyCollection.models.find( (enemyPiece) => {
        return enemyPiece.attributes.x == newX && enemyPiece.attributes.y == newY
      });
      if (enemyPiece) {
        enemyPiece.destroy();
        enemyPiece.trigger('taked', enemyPiece, this);
        this.trigger('taking', this, enemyPiece);
      }
      else {
        console.error('Фигура врага не найдена');
      }
    }
    var prevX = this.attributes.x,
        prevY = this.attributes.y,
        prewOnStartPos = this.attributes.onStartPos;
    // если позиция валидна, переставляем фигуру
    this.save({
      x: newX,
      y: newY,
      onStartPos: false
    });

    // но если мы поставили своего короля под удар, возвращаемся обратно
    var king = this.collection.models.find( (piece) => piece.attributes.type == 'king');
    if ( isUnderCheck(king) ) {
      this.save({
        x: prevX,
        y: prevY,
        onStartPos: prewOnStartPos
      });
      return false;
    }

    this.trigger('move', this);
    return true;

  }
});

var Pawn = Piece.extend({
  initialize: function () {
    this.attributes.type = "pawn";
    this.listenTo(this, 'move', this.onPawnMove);
  },

  onPawnMove: function () {
    var lastRank = this.attributes.color == 'white' ? 7 : 0;
    if (this.attributes.y == lastRank) {
      this.trigger('pawnOnLastRank', this);
    }
  },

  getVariants: function () {
    var variants = [],
        deltaY= this.attributes.color == 'white'? 1 : -1;

    //TODO: взятие на проходе
    addTargetPos(this.attributes.x - 1, this.attributes.y + deltaY, this.attributes.enemyCollection.models, variants);
    addTargetPos(this.attributes.x + 1, this.attributes.y + deltaY, this.attributes.enemyCollection.models, variants);

    var newX = this.attributes.x,
        newY = this.attributes.y + deltaY;
    if ( !isOccupied(newX, newY, this.attributes.enemyCollection.models) )
      addValidPos(newX, newY, this, variants);

    // ход на 2 клетки со стартовой позиции
    if (this.attributes.onStartPos) {
      var newX = this.attributes.x,
          newY = this.attributes.y + 2 * deltaY;
      if ( !isOccupied(newX, newY, this.attributes.enemyCollection.models) )
        addValidPos(newX, newY, this, variants);
    }

    return variants;
  }
});

var Knight = Piece.extend({
  initialize: function () {
    this.attributes.type = "knight";
  },

  getVariants: function () {
    var variants = [];

    var differences = [
      {x:-2, y: 1},
      {x:-1, y: 2},
      {x: 1, y: 2},
      {x: 2, y: 1},
      {x: 2, y:-1},
      {x: 1, y:-2},
      {x:-1, y:-2},
      {x:-2, y:-1}
    ];

    differences.forEach( (delta) => {
      var newX = this.attributes.x + delta.x,
          newY = this.attributes.y + delta.y;
      if ( !addTargetPos(newX, newY, this.attributes.enemyCollection.models, variants) )
        addValidPos(newX, newY, this, variants);
    });

    return variants;
  }
});

var Bishop = Piece.extend({
  initialize: function () {
    this.attributes.type = "bishop";
  },

  getVariants: function () {
    var variants = [];

    for (var i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x + i,
          newY = this.attributes.y + i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    for (var i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x + i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y + i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    return variants;
  }
});

var Rook = Piece.extend({
  initialize: function () {
    this.attributes.type = "rook";
  },

  getVariants: function () {
    var variants = [];

    for (var i = this.attributes.x + 1; i <= 7; i++) {
      var newX = i,
          newY = this.attributes.y;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    for (var i = this.attributes.x - 1; i >= 0; i--) {
      var newX = i,
          newY = this.attributes.y;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    for (var i = this.attributes.y + 1; i <= 7; i++) {
      var newX = this.attributes.x,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    for (var i = this.attributes.y - 1; i >= 0; i--) {
      var newX = this.attributes.x ,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    return variants;
  }
});

var Queen = Piece.extend({
  initialize: function () {
    this.attributes.type = "queen"
  },

  getVariants: function () {
    var variants = [];

    // диагонали
    for (var i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x + i,
          newY = this.attributes.y + i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    for (var i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x + i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y + i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    };

    // прямые
    for (var i = this.attributes.x + 1; i <= 7; i++) {
      var newX = i,
          newY = this.attributes.y;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    for (var i = this.attributes.x - 1; i >= 0; i--) {
      var newX = i,
          newY = this.attributes.y;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    for (var i = this.attributes.y + 1; i <= 7; i++) {
      var newX = this.attributes.x,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    for (var i = this.attributes.y - 1; i >= 0; i--) {
      var newX = this.attributes.x ,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this, variants) )
        break;
    }

    return variants;
  }
});

var King = Piece.extend({
  initialize: function () {
    this.attributes.type = "king";
    this.listenTo(this.attributes.enemyCollection, 'move', this.onEnemyMove);
    this.listenTo(this.attributes.enemyCollection, 'promotion', this.onEnemyMove);
  },

  onEnemyMove: function () {
    if ( isUnderCheck(this) )
      this.trigger('check', this.attributes.color);
  },

  getVariants: function () {
    var variants = [],
        enemyVariants = [];

    var differences = [
      {x:-1, y:-1},
      {x:-1, y: 0},
      {x:-1, y: 1},
      {x: 0, y:-1},
      {x: 0, y: 1},
      {x: 1, y:-1},
      {x: 1, y: 0},
      {x: 1, y: 1}
    ];

    this.attributes.enemyCollection.forEach( (enemyPiece) => {
      // отдельно обрабатываем позиции короля, чтобы не уйти в рекурсию
      if (enemyPiece.attributes.type == 'king') {
        differences.forEach( (delta) => {
          var newX = enemyPiece.attributes.x + delta.x,
              newY = enemyPiece.attributes.y + delta.y;

          if ( isValidCoords(newX, newY) )
            enemyVariants.push({x: newX, y: newY});
        });
        return;
      }

      // отдельно обрабатываем позиции под ударом пешек
      if (enemyPiece.attributes.type == 'pawn' ) {
        var deltaY= enemyPiece.attributes.color == 'white'? 1 : -1;

        var newX = enemyPiece.attributes.x + 1,
            newY = enemyPiece.attributes.y + deltaY;
        if (isValidCoords(newX, newY)) {
          enemyVariants.push({x: newX, y: newY});
        }

        var newX = enemyPiece.attributes.x - 1,
            newY = enemyPiece.attributes.y + deltaY;
        if (isValidCoords(newX, newY)) {
          enemyVariants.push({x: newX, y: newY});
        }
        return;
      }

      enemyVariants.push(...enemyPiece.getVariants());
    });

    differences.forEach( (delta) => {
      var newX = this.attributes.x + delta.x,
          newY = this.attributes.y + delta.y;

      if ( !isValidCoords(newX, newY) )
        return;

      if ( enemyVariants.some( (pos) => pos.x == newX && pos.y ==newY ) )
        return;

      if ( !addTargetPos(newX, newY, this.attributes.enemyCollection.models, variants) )
        addValidPos(newX, newY, this, variants);
    });

    return variants;
  }
});


/*==============================
  Вспомогательные функции
===============================*/

function isValidCoords(x, y) {
  return (x >= 0 && x<= 7 && y >= 0 && y <= 7)
};

function isOccupied(x, y, checkCollection) {
  return checkCollection.some( (piece) => piece.attributes.x == x && piece.attributes.y == y );
};

function isUnderCheck(King) {
  return King.attributes.enemyCollection.models.some( (enemy) => {
    return enemy.getVariants().some( (pos) => {
      return pos.x == King.attributes.x && pos.y == King.attributes.y;
    });
  })
}



function addTargetPos(x, y, enemyPieces, variants) {
  if ( !isValidCoords(x, y) )
    return false;

  if ( isOccupied(x, y, enemyPieces) ) {
    variants.push({x: x, y: y, type: 'target'});
    return true;
  }
  return false;
}

function addValidPos(x, y, yourPiece, variants) {
  if ( !isValidCoords(x, y) )
    return false;

  if ( isOccupied(x, y, yourPiece.collection.models) )
    return false;

  variants.push({x: x, y: y, type: 'validPos'});
  return true;
};


exports.Piece = Piece;
exports.Pawn = Pawn;
exports.Knight = Knight;
exports.Bishop = Bishop;
exports.Rook = Rook;
exports.Queen = Queen;
exports.King = King;
