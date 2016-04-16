import _        from 'underscore';

import {Piece, helpers} from './piece';


let Bishop = Piece.extend({
  initialize: function () {
    this.attributes.type = "bishop";
  },

  getVariants: function () {
    let variants = [];

    for (let i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      let newX = this.attributes.x + i,
          newY = this.attributes.y + i;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    };

    for (let i = 1, len = 7 - this.attributes.x ; i <= len; i++) {
      let newX = this.attributes.x + i,
          newY = this.attributes.y - i;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    };

    for (let i = 1, len = this.attributes.x ; i <= len; i++) {
      let newX = this.attributes.x - i,
          newY = this.attributes.y + i;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    };

    for (let i = 1, len = this.attributes.x ; i <= len; i++) {
      let newX = this.attributes.x - i,
          newY = this.attributes.y - i;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    };

    return variants;
  }
});

export default Bishop;
