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

  initialize: function (myColor) {
    let myPieceCollection    = new PieceCollection(),
        enemyPieceCollection = new PieceCollection(),
        sides = [];

    sides[myColor] = myPieceCollection;
    sides[myColor == 'white' ? 'black' : 'white'] = enemyPieceCollection;

    let Logger = new LoggerView(sides['white'], sides['black']);
    $("body").append(Logger.render().el);

    this.subViews = [];

    myPieceCollection   .on('add', (piece) => this.subViews.push(new PieceView({model: piece})) );
    enemyPieceCollection.on('add', (piece) => this.subViews.push(new PieceView({model: piece})) );
    myPieceCollection   .on('pawnOnLastRank', (pawn) => $("body").append(new PawnPromotionModalView({model: pawn}).render().el) );
    enemyPieceCollection.on('pawnOnLastRank', (pawn) => $("body").append(new PawnPromotionModalView({model: pawn}).render().el) );

    sides['white'].push([
      new Pieces.Pawn   ({x:0, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Pawn   ({x:1, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Pawn   ({x:2, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Pawn   ({x:3, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Pawn   ({x:4, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Pawn   ({x:5, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Pawn   ({x:6, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Pawn   ({x:7, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Rook   ({x:0, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Rook   ({x:7, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Knight ({x:1, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Knight ({x:6, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Bishop ({x:2, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Bishop ({x:5, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Queen  ({x:4, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.King   ({x:3, y:0, color:'white', enemyCollection: sides['black']}),
    ]);


  sides['black'].push([
      new Pieces.Pawn   ({x:0, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Pawn   ({x:1, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Pawn   ({x:2, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Pawn   ({x:3, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Pawn   ({x:4, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Pawn   ({x:5, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Pawn   ({x:6, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Pawn   ({x:7, y:6, color:'black', enemyCollection: sides['white']}),
      new Pieces.Rook   ({x:0, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.Rook   ({x:7, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.Knight ({x:1, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.Knight ({x:6, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.Bishop ({x:2, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.Bishop ({x:5, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.Queen  ({x:4, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.King   ({x:3, y:7, color:'black', enemyCollection: sides['white']}),
    ]);

    myPieceCollection.on('move', (piece) => {
        socket.emit('turn_move', {
          from: {
            x: piece.previous('x'),
            y: piece.previous('y'),
          },
          to: {
            x: piece.attributes.x,
            y: piece.attributes.y
          }
        });
    });

    socket.on('player_move', (response) => {
      console.info(response.from);
      var movingPiece = sides[response.playerColor].getPieceAt(response.from.x, response.from.y);
      movingPiece.moveTo(response.to.x, response.to.y);
    });

    socket.on('game_end', (response) => console.info(`Игра окончена: ${response}`) );
  }
});

export default GameUIView;
