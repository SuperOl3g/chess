import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'backbone';

import * as Pieces            from "./../models/pieces/pieces";
import PieceCollection        from './../collections/pieceCollection';
import LoggerView             from './p-gameUI__logger';
import PieceView              from './p-gameUI__piece';
import MyPieceView            from './p-gameUI__piece--my';
import PawnPromotionModalView from './p-gameUI__promotion-modal';
import GameEndModalView       from './p-gameUI__game-end-modal';

let subViews = [];

let GameUIView = Backbone.View.extend({

  className: 'deck',
  template: _.template($('#deck-template').html()),

  events: {
    'click .deck__close-btn' : 'onCloseBtnClick'
  },

  onCloseBtnClick: function () {
    socket.emit('room_leave');
    this.trigger('close');
  },

  render: function() {
    this.$el.html( this.template() );
    let subViewsElems = subViews.map( (childView) => childView.render().el );
    this.$el.append(subViewsElems);
    return this;
  },

  initialize: function (myColor) {
    let sides = {};

    sides['white'] = new PieceCollection();
    sides['black'] = new PieceCollection();

    subViews.push( new LoggerView(sides['white'], sides['black']) );

    Object.keys(sides).forEach( (color) => {
      if (color == myColor)
        sides[color].on('add', (piece) => subViews.push(new MyPieceView({model: piece})));
      else
        sides[color].on('add', (piece) => subViews.push(new PieceView({model: piece})) );

      sides[color].on('pawnOnLastRank', (pawn) => {
        this.$el.append( new PawnPromotionModalView({model: pawn}).render().el );
      });
    });

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

    if (myColor) {
      sides[myColor].turnFlag = myColor == 'white';

      sides[myColor].on('move', (piece) => {
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
    };

    socket.on('player_move', (response) => {
      let movingPiece = sides[response.playerColor].getPieceAt(response.from.x, response.from.y);
      movingPiece.moveTo(response.to.x, response.to.y);
      if (myColor)
        sides[myColor].turnFlag = true;
    });

    socket.on('game_end', (response) => {
      let gameEndView = new GameEndModalView({model: response});
      this.$el.append( gameEndView.render().el );
      gameEndView.on('close', () => this.trigger('close') );

    });
  }
});

export default GameUIView;
