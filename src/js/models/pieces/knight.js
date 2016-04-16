import _        from 'underscore';


import {Piece, helpers} from './piece';


let Knight = Piece.extend({
  initialize: function () {
    this.attributes.type = "knight";
  },

  getVariants: function () {
    let variants = [],

        differences = [
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
      let newX = this.attributes.x + delta.x,
          newY = this.attributes.y + delta.y;
      if ( !helpers.addTargetPos(newX, newY, this.attributes.enemyCollection, variants) )
        helpers.addValidPos(newX, newY, this, variants);
    });

    return variants;
  }
});

export default Knight;
