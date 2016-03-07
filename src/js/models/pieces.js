var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

var Piece = Backbone.Model.extend({
  defaults: {
    x: null,
    y: null,
    onStartPos: true
  },

  moveTo: function (newX, newY) {
    // проверяем являются ли новые координаты валидными
    return this.getVariants().some( (pos) => {
      if (pos.x==newX && pos.y == newY) {
        if (pos.type == 'target') {
          // если ставим в клетку с чужой фигурой, ее надо удалить
          this.attributes.enemyCollection.models.some( (enemyPiece) => {
            if (enemyPiece.attributes.x == newX && enemyPiece.attributes.y == newY) {
              enemyPiece.destroy();
              this.trigger('taking', this, enemyPiece);
              return true;
            }
            return false;
          });
        } else {
          this.trigger('move', this, {x: newX, y: newY});
        }
        // если позиция валидна, обновляем координаты модели
        this.save({
          x: newX,
          y: newY,
          onStartPos: false
        });
        return true;
      }
      return false;
    })
  }
});

var Pawn = Piece.extend({
  initialize: function () {
    this.attributes.type = "pawn";
  },

  getVariants: function () {
    var variants = [],
        deltaY= this.attributes.color == 'white'? 1 : -1;


    //TODO: взятие на проходе
    //TODO: превращение пешки
    addTargetPos(this.attributes.x - 1, this.attributes.y + deltaY, this.attributes.enemyCollection.models, variants);
    addTargetPos(this.attributes.x + 1, this.attributes.y + deltaY, this.attributes.enemyCollection.models, variants);

    addValidPos(this.attributes.x, this.attributes.y + deltaY, this.collection.models, variants, this.attributes.enemyCollection.models);

    // ход на 2 клетки со стартовой позиции
    if (this.attributes.onStartPos)
      addValidPos(this.attributes.x, this.attributes.y + 2 * deltaY, this.collection.models, variants, this.attributes.enemyCollection.models);

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

    differences.forEach( (variant) => {
      var newX = this.attributes.x + variant.x,
          newY = this.attributes.y + variant.y;
      if ( !addTargetPos(newX, newY, this.attributes.enemyCollection.models, variants) )
        addValidPos(newX, newY, this.collection.models, variants);
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
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    };

    for (var i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x + i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y + i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
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
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    }

    for (var i = this.attributes.x - 1; i >= 0; i--) {
      var newX = i,
          newY = this.attributes.y;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    }

    for (var i = this.attributes.y + 1; i <= 7; i++) {
      var newX = this.attributes.x,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    }

    for (var i = this.attributes.y - 1; i >= 0; i--) {
      var newX = this.attributes.x ,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
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
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    };

    for (var i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x + i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y + i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    };

    for (var i = 1, len = this.attributes.x ; i <= len; i++) {
      var newX = this.attributes.x - i,
          newY = this.attributes.y - i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    };

    // прямые
    for (var i = this.attributes.x + 1; i <= 7; i++) {
      var newX = i,
          newY = this.attributes.y;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    }

    for (var i = this.attributes.x - 1; i >= 0; i--) {
      var newX = i,
          newY = this.attributes.y;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    }

    for (var i = this.attributes.y + 1; i <= 7; i++) {
      var newX = this.attributes.x,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    }

    for (var i = this.attributes.y - 1; i >= 0; i--) {
      var newX = this.attributes.x ,
          newY = i;
      if ( addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !addValidPos(newX, newY, this.collection.models, variants) )
        break;
    }

    return variants;
  }
});

var King = Piece.extend({
  initialize: function () {
    this.attributes.type = "king"
  },

  getVariants: function () {
    var variants = [];

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

    differences.forEach( (variant) => {
      var newX = this.attributes.x + variant.x,
          newY = this.attributes.y + variant.y;
      if ( !addTargetPos(newX, newY, this.attributes.enemyCollection.models, variants) )
        addValidPos(newX, newY, this.collection.models, variants);
    });

    return variants;
  }
});


/*==============================
  вспомогательные функции
===============================*/

function isValidCoords(x, y) {
  return (x >= 0 && x<= 7 && y >= 0 && y <= 7)
};

function isOccupied(x, y, checkCollection) {
  return checkCollection.some( (model) => {
    return model.attributes.x == x && model.attributes.y == y;
  });
};

function addTargetPos(x, y, enemyPieces, variants) {
  if ( !isValidCoords(x, y) )
    return false;

  if ( isOccupied(x, y, enemyPieces) ) {
    variants.push({x: x, y: y, type: 'target'});
    return true;
  }
  return false;
}

function addValidPos(x, y, yourPieces, variants , enemyPieces) {
  if ( !isValidCoords(x, y) )
    return false;

  if ( isOccupied(x, y, yourPieces) )
    return false;

  if ( enemyPieces && isOccupied(x,y, enemyPieces) )
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
