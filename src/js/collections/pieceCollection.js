var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

//var Pieces = require('/models/pieces');

var PieceCollection = Backbone.Collection.extend({
  //model: Pieces.Piece
});

module.exports = PieceCollection;
