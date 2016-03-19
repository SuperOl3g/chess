import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'Backbone';



import {Piece, helpers} from './piece';



let Rook = Piece.extend({
  initialize: function () {
    this.attributes.type = "rook";
  },

  getVariants: function () {
    let variants = [];

    for (let i = this.attributes.x + 1; i <= 7; i++) {
      let newX = i,
          newY = this.attributes.y;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    }

    for (let i = this.attributes.x - 1; i >= 0; i--) {
      let newX = i,
          newY = this.attributes.y;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    }

    for (let i = this.attributes.y + 1; i <= 7; i++) {
      let newX = this.attributes.x,
          newY = i;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    }

    for (let i = this.attributes.y - 1; i >= 0; i--) {
      let newX = this.attributes.x ,
          newY = i;
      if ( helpers.addTargetPos(newX, newY,this.attributes.enemyCollection.models, variants) || !helpers.addValidPos(newX, newY, this, variants) )
        break;
    }

    return variants;
  }
});

export default Rook;
