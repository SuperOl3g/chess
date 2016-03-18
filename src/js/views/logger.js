var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

var Logger = Backbone.View.extend({

  className: 'log',

  initialize: function (collection1, collection2) {
    this.listenTo(collection1, 'taking', this.onTaking);
    this.listenTo(collection2, 'taking', this.onTaking);
    this.listenTo(collection1, 'check', this.onCheckOrMate.bind(this, 'check'));
    this.listenTo(collection2, 'check', this.onCheckOrMate.bind(this, 'check'));
    this.listenTo(collection1, 'mate', this.onCheckOrMate.bind(this, 'mate'));
    this.listenTo(collection2, 'mate', this.onCheckOrMate.bind(this, 'mate'));
    this.listenTo(collection1, 'move', this.onMove);
    this.listenTo(collection2, 'move', this.onMove);
  },

  render: function() {
    this.$el.html('<h2>Log</h2><div class="log__content"></div>');
    return this;
  },

  onMove: function (piece) {
    var logContent = this.$el.find(".log__content")
    logContent.append(
      _.template($('#logMsgTemplate--move').html())({
        piece: piece.attributes,
        oldCoords: piece.previousAttributes(),
        NtoS: NtoS
      })
    );
    logContent.animate({scrollTop: logContent.prop('scrollHeight')});
  },

  onCheckOrMate: function (type, color) {
    var logContent = this.$el.find(".log__content")
    logContent.append(
      _.template($('#logMsgTemplate--checkOrMate').html())({
        type: type,
        color: color
      })
    );
    logContent.animate({scrollTop: logContent.prop('scrollHeight')});
  },

  onTaking: function (attacker, target) {
    var logContent = this.$el.find(".log__content")
    logContent.append(
      _.template($('#logMsgTemplate--taking').html())({
        attacker: attacker.attributes,
        target: target.attributes,
        NtoS: NtoS
      })
    );
    logContent.animate({scrollTop: logContent.prop('scrollHeight')});
  }
});

function NtoS(number) {
  var symbols = ['A','B','C','D','E','F','G','H'];
  return symbols[number];
}

module.exports = Logger;
