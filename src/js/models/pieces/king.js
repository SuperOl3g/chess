import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'Backbone';


import {Piece, helpers} from './piece';

let King = Piece.extend({
  initialize: function () {
    this.attributes.type = "king";
    this.listenTo(this.attributes.enemyCollection, 'move', this.onEnemyMove);
    this.listenTo(this.attributes.enemyCollection, 'promotion', this.onEnemyMove);
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

      if ( !helpers.addTargetPos(newX, newY, this.attributes.enemyCollection.models, variants) )
        helpers.addValidPos(newX, newY, this, variants);
    });

    return variants;
  }
});

export default King;
