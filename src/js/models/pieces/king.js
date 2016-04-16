import _        from 'underscore';


import {Piece, helpers} from './piece';

let King = Piece.extend({
  initialize: function () {
    this.attributes.type = "king";
    this.listenTo(this.attributes.enemyCollection, 'move', this.onEnemyMove);
    this.listenTo(this.attributes.enemyCollection, 'promotion', this.onEnemyMove);
    this.listenTo(this.attributes.enemyCollection, 'castling', this.onEnemyMove);
  },

  onEnemyMove: function () {
    let isCheck = helpers.isUnderCheck(this),
        isNoVariants = !this.collection.models.some( (piece) => piece.getNonBlockedVariants().length != 0 );

    if( isNoVariants && !isCheck)
      this.trigger('draw');

    if (isCheck) {
      this.trigger('check', this.attributes.color);

      if (isNoVariants)
        this.trigger('mate', this.attributes.color);
    }
  },

  getVariants: function () {
    let variants = [],
        enemyVariants = new Set(),

        differences = [
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
          let newX = enemyPiece.attributes.x + delta.x,
              newY = enemyPiece.attributes.y + delta.y;

          if ( helpers.isValidCoords(newX, newY) )
            enemyVariants.add({x: newX, y: newY});
        });
        return;
      }

      // отдельно обрабатываем позиции под ударом пешек
      if (enemyPiece.attributes.type == 'pawn' ) {
        let deltaY= enemyPiece.attributes.color == 'white' ? 1 : -1,
            newX = enemyPiece.attributes.x + 1,
            newY = enemyPiece.attributes.y + deltaY;

        if (helpers.isValidCoords(newX, newY)) {
          enemyVariants.add({x: newX, y: newY});
        }

        newX = enemyPiece.attributes.x - 1;
        newY = enemyPiece.attributes.y + deltaY;

        if (helpers.isValidCoords(newX, newY)) {
          enemyVariants.add({x: newX, y: newY});
        }
        return;
      }

      enemyVariants.add(...enemyPiece.getVariants());
    });

    differences.forEach( (delta) => {
      let newX = this.attributes.x + delta.x,
          newY = this.attributes.y + delta.y;

      if ( !helpers.isValidCoords(newX, newY) )
        return;

      if ( enemyVariants.has( {x: newX, y: newY }) )
        return;

      if ( !helpers.addTargetPos(newX, newY, this.attributes.enemyCollection, variants) )
        helpers.addValidPos(newX, newY, this, variants);
    });


    // рокировка
    let isUnderCheck = enemyVariants.has( {x: this.attributes.x, y: this.attributes.y});

    if (this.attributes.onStartPos && !isUnderCheck) {
      let rooks = this.collection.filter((piece) => piece.attributes.type == 'rook' && piece.attributes.onStartPos);

      rooks.forEach( (rook) => {
        let from = Math.min(this.attributes.x, rook.attributes.x);
        let to   = Math.max(this.attributes.x, rook.attributes.x);

        // проверяем чтобы, клетки между королем и ладьей не были заняты другими фигурами
        for (let i = from + 1; i < to; i++) {
          if ( this.collection.getPieceAt(i, this.attributes.y)
            || this.attributes.enemyCollection.getPieceAt(i, this.attributes.y) )
            return;
        }

        let kingNewX = this.attributes.x + (this.attributes.x > rook.attributes.x ?  -2 : 2);
        from = Math.min(this.attributes.x, kingNewX);
        to   = Math.max(this.attributes.x, kingNewX);

        // проверяем чтобы, клетки, через которые пройдет король, не были под боем
        for (let i = from + 1; i < to; i++) {
          if (enemyVariants.has( {x: i, y: this.attributes.y}))
            return;
        }
        
        variants.push({
          x: kingNewX,
          y: this.attributes.y,
          type: 'castling'
        });
      });
    }

    return variants;
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

      if (posInfo.isCastling) {
        let rookX = newX == 2 ? 0 : 7;
        let rookNewX = newX == 2 ? 3 : 5;

        let rook = this.collection.getPieceAt(rookX, this.attributes.y);
        rook.save({
          x: rookNewX,
          y: this.attributes.y
        });

        this.trigger('castling', this);
        rook.trigger('castling', rook);
        return true;
      }

      this.trigger('move', this);
      return true;
    }
    return false;
  }
});

export default King;
