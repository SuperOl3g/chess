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

import template from './../../templates/deck.ejs';


let subViews = [];

let GameUIView = Backbone.View.extend({

  className: 'deck',
  template: _.template(template),

  events: {
    'click .deck__close-btn' : 'onCloseBtnClick'
  },

  onCloseBtnClick: function () {
    socket.emit('room_leave');
    this.trigger('close');
  },

  render: function() {
    this.$el.prepend( this.template() );
    return this;
  },

  initialize: function (myColor) {
    let sides = {};

    sides['white'] = new PieceCollection();
    sides['black'] = new PieceCollection();

    this.$el.append( new LoggerView(sides['white'], sides['black']).render().el );

    Object.keys(sides).forEach( (color) => {
      if (color == myColor)
        sides[color].on('add', (piece) => this.$el.append( new MyPieceView({model: piece}).render().el));
      else
        sides[color].on('add', (piece) => this.$el.append( new PieceView({model: piece}).render().el ));
    });

    sides['white'].push([
      // new Pieces.Pawn   ({x:0, y:1, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Pawn   ({x:1, y:1, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Pawn   ({x:2, y:1, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Pawn   ({x:3, y:1, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Pawn   ({x:4, y:1, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Pawn   ({x:5, y:1, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Pawn   ({x:6, y:1, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Pawn   ({x:7, y:1, color:'white', enemyCollection: sides['black']}),
      new Pieces.Rook   ({x:0, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Rook   ({x:6, y:0, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Knight ({x:1, y:0, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Knight ({x:6, y:0, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Bishop ({x:2, y:0, color:'white', enemyCollection: sides['black']}),
      // new Pieces.Bishop ({x:5, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.Queen  ({x:3, y:0, color:'white', enemyCollection: sides['black']}),
      new Pieces.King   ({x:4, y:0, color:'white', enemyCollection: sides['black']}),
    ]);

    sides['black'].push([
      // new Pieces.Pawn   ({x:0, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Pawn   ({x:1, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Pawn   ({x:2, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Pawn   ({x:3, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Pawn   ({x:4, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Pawn   ({x:5, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Pawn   ({x:6, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Pawn   ({x:7, y:6, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Rook   ({x:0, y:7, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Rook   ({x:7, y:7, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Knight ({x:1, y:7, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Knight ({x:6, y:7, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Bishop ({x:2, y:7, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Bishop ({x:5, y:7, color:'black', enemyCollection: sides['white']}),
      // new Pieces.Queen  ({x:3, y:7, color:'black', enemyCollection: sides['white']}),
      new Pieces.King   ({x:7, y:7, color:'black', enemyCollection: sides['white']}),
    ]);



    if (myColor) {
      sides[myColor].turnFlag = myColor == 'white';

      sides[myColor].on('pawnOnLastRank', (pawn) => {
        this.$el.append( new PawnPromotionModalView({model: pawn}).render().el );
      });

      sides[myColor].on('promotion', (pawn, newPiece) => {
        socket.emit('turn_promotion', {
          from: {
            x: pawn.previous('x'),
            y: pawn.previous('y'),
          },
          to: {
            x: pawn.attributes.x,
            y: pawn.attributes.y
          },
          newPiece: newPiece.attributes.type
        });
      });

      sides[myColor].on('move', (piece) => {

        if (piece.attributes.type == 'pawn') {
          let lastRank = piece.attributes.color == 'white' ? 7 : 0;

          if (piece.attributes.y == lastRank) {
            return;
          }
        }

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


      let rooks = sides[myColor].models.filter((piece) => piece.attributes.type == 'rook');

      rooks.forEach( (rook) => {
        rook.on('castling', (rook) => {
          socket.emit('turn_castling', {
            from: {
              x: rook.previous('x'),
              y: rook.previous('y'),
            }
          });
        });
      });

      sides[myColor].on('mate', (piece) => socket.emit('turn_mate') );
      sides[myColor].on('draw', (piece) => socket.emit('turn_draw') );
    }




    // обработка входящий событий

    socket.on('player_move', (response) => {
      let movingPiece = sides[response.playerColor].getPieceAt(response.from.x, response.from.y);

      movingPiece.moveTo(response.to.x, response.to.y);

      if (myColor)
        sides[myColor].turnFlag = true;
    });

    socket.on('player_castling', (response) => {
      let kingNewX = response.from.x == 0 ? 2 : 6;
      let king = sides[response.playerColor].models.find( (piece) => piece.attributes.type == 'king');

      king.moveTo(kingNewX, king.attributes.y);

      if (myColor)
        sides[myColor].turnFlag = true;
    });

    socket.on('player_promotion', (response) => {
      let pawn = sides[response.playerColor].getPieceAt(response.from.x, response.from.y);

      pawn.moveTo(response.to.x, response.to.y);
      sides[response.playerColor].pawnPromotion(pawn, response.newPiece);

      if (myColor)
        sides[myColor].turnFlag = true;
    });


    socket.on('player_mate', () => {
      socket.emit('turnValidation_mate');
    });

    socket.on('player_draw', () => {
      socket.emit('turnValidation_draw');
    });

    socket.on('game_end', (response) => {
      let gameEndView = new GameEndModalView({model: response});

      this.$el.append( gameEndView.render().el );
      gameEndView.on('close', () => this.trigger('close') );
    });

  }
});

export default GameUIView;
