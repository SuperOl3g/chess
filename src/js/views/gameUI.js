import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'Backbone';

import * as Pieces            from "./../models/pieces/pieces";
import PieceCollection        from './../collections/pieceCollection';
import LoggerView             from './logger';
import PieceView              from './piece';
import PawnPromotionModalView from './pawnPromotionModal';

let GameUIView = Backbone.View.extend({

  className: 'deck',
  template: _.template($('#deck-template').html()),

  render: function() {
    this.$el.html( this.template() );
    this.subViews.forEach( (childView) => {
      this.$el.find('.deck__pieces').append(childView.render().el);
    });
    return this;
  },

  initialize: function () {
    let myPieceCollection    = new PieceCollection(),
        enemyPieceCollection = new PieceCollection(),
        Logger               = new LoggerView(myPieceCollection, enemyPieceCollection);

    $("body").append(Logger.render().el);

    this.subViews = [];

    myPieceCollection   .on('add', (piece) => this.subViews.push(new PieceView({model: piece})) );
    enemyPieceCollection.on('add', (piece) => this.subViews.push(new PieceView({model: piece})) );
    myPieceCollection   .on('pawnOnLastRank', (pawn) => $("body").append(new PawnPromotionModalView({model: pawn}).render().el) );
    enemyPieceCollection.on('pawnOnLastRank', (pawn) => $("body").append(new PawnPromotionModalView({model: pawn}).render().el) );

    myPieceCollection.push([
      new Pieces.Pawn   ({x:0, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Pawn   ({x:1, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Pawn   ({x:2, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Pawn   ({x:3, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Pawn   ({x:4, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Pawn   ({x:5, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Pawn   ({x:6, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Pawn   ({x:7, y:1, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Rook   ({x:0, y:0, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Rook   ({x:7, y:0, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Knight ({x:1, y:0, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Knight ({x:6, y:0, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Bishop ({x:2, y:0, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Bishop ({x:5, y:0, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.Queen  ({x:4, y:0, color:'white', enemyCollection: enemyPieceCollection}),
      new Pieces.King   ({x:3, y:0, color:'white', enemyCollection: enemyPieceCollection}),
    ]);


    enemyPieceCollection.push([
      new Pieces.Pawn   ({x:0, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Pawn   ({x:1, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Pawn   ({x:2, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Pawn   ({x:3, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Pawn   ({x:4, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Pawn   ({x:5, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Pawn   ({x:6, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Pawn   ({x:7, y:6, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Rook   ({x:0, y:7, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Rook   ({x:7, y:7, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Knight ({x:1, y:7, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Knight ({x:6, y:7, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Bishop ({x:2, y:7, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Bishop ({x:5, y:7, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.Queen  ({x:4, y:7, color:'black', enemyCollection: myPieceCollection}),
      new Pieces.King   ({x:3, y:7, color:'black', enemyCollection: myPieceCollection}),
    ]);

    let turnTypes = ['move', 'promotion', 'castling'];
    turnTypes.forEach( (turnType) => {
       socket.on(`player_${turnType}`, (response) => console.info(`${response.playerColor} has made ${turnType}!!!`) );
    });
  }
});

export default GameUIView;
