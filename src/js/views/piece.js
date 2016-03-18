var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

const TILE_SIZE = 40,
      FPS = 60;

var PieceView = Backbone.View.extend({
  className: 'piece',
  template: _.template($('#pieceTemplate').html()),

  events: {
    'mousedown': 'onMouseDown'
  },

  initialize: function() {
    this.listenTo(this.model, 'move',  this.render);
    this.listenTo(this.model, 'taked promotion', this.remove);
  },

  onMouseDown: function (e) {
    var self = this,
        $deck = $('.deck'),
        deckHeight =$deck.height(),
        startCoords = self.$el.css(["left", "bottom"]),
        shiftX = e.pageX - parseInt(startCoords.left, 10),
        shiftY = deckHeight - e.pageY - parseInt(startCoords.bottom, 10);

    var $indicators = this.model.getNonBlockedVariants().map( (pos) => {
      var indicator = document.createElement("div");
      $(indicator)
        .addClass(`tileIndicator--${pos.type}`)
        .css({
          left: `${pos.x * TILE_SIZE}px`,
          bottom: `${pos.y * TILE_SIZE}px`
        });
      return $(indicator);
    });

    $deck.append($indicators);

    document.onmousemove = _.throttle(function(e) {
        self.$el.css({
          left: e.pageX - shiftX,
          bottom: deckHeight - e.pageY - shiftY,
        });

        document.onmouseup = function (e) {
          document.onmousemove = null;

          $indicators.forEach( ($indicator) => {
            $indicator.remove();
          });

          // определяем координаты поля на странице
          var deckOffset = $deck.offset();
          deckOffset.top += parseInt($deck.css('borderWidth'), 10);
          deckOffset.left += parseInt($deck.css('borderWidth'), 10);

          // определяем над какой клеткой мы сейчас находимся
          var newX = Math.floor( (e.pageX - deckOffset.left) / TILE_SIZE),
              newY = Math.floor( (deckHeight - e.pageY + deckOffset.top) / TILE_SIZE);


          if( !self.model.moveTo(newX, newY) ) {
            // если позиция невалидна, возвращаем в исходное положение
            self.$el.css({
              left: startCoords.left,
              bottom: startCoords.bottom
            });
          };
        }
      }, 1000 / FPS)
  },

  render: function() {
    var model = this.model.attributes;
    this.$el.html(this.template({name: `${model.type}-${model.color}`}));
    this.$el.css({
      bottom: `${model.y * TILE_SIZE}px`,
      left: `${model.x * TILE_SIZE}px`,
    });
    return this;
  }
});

module.exports = PieceView;
