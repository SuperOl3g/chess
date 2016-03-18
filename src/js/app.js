var $        = require('jquery'),
    _        = require('underscore'),
    Backbone = require('Backbone'),
    io       = require('socket.io-client')('http://localhost:3056');

window.$=$;
window.Backbone = Backbone;

var Pieces = require('./models/pieces'),
    PieceCollection = require('./collections/pieceCollection'),
    PieceView = require('./views/piece'),
    LoggerView = require('./views/logger'),
    PawnPromotionModalView = require('./views/pawnPromotionModal');

( () => {
  var myPieceCollection    = new PieceCollection(),
      enemyPieceCollection = new PieceCollection(),
      Logger               = new LoggerView(myPieceCollection, enemyPieceCollection);

  $("body").append(Logger.render().el);

  myPieceCollection.on('add', (piece) => {
    $(".deck").append(new PieceView({model: piece}).render().el);
  });
  enemyPieceCollection.on('add', (piece) => {
    $(".deck").append(new PieceView({model: piece}).render().el);
  });
  myPieceCollection.on('pawnOnLastRank', (pawn) => new PawnPromotionModalView({model: pawn}));
  enemyPieceCollection.on('pawnOnLastRank', (pawn) => new PawnPromotionModalView({model: pawn}));

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

  io.on('connect', () => console.log(`I'm connected as ${io.id}`) );

})();
