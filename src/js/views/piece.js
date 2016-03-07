var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('Backbone');

var helpers = require('../helpers');

const TILE_SIZE = 40,
      FPS = 60;

var PieceView = Backbone.View.extend({
  className: 'piece',
  template: _.template($('#pieceTemplate').html()),

  events: {
    'mousedown': 'onMouseDown'
  },

  initialize: function() {
    this.listenTo(this.model, 'change',  this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  onMouseDown: function (e) {
    var self = this,
        $deck = $('.deck'),
        deckHeight =$deck.height(),
        variants = this.model.getVariants(),
        startCoords = self.$el.css(["left", "bottom"]),
        shiftX = e.pageX - parseInt(startCoords.left, 10),
        shiftY = deckHeight - e.pageY - parseInt(startCoords.bottom, 10);

    var $indicators = variants.map( (pos) => {
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

    document.onmousemove = helpers.throttle(function(e) {
        self.$el.css({
          left: e.pageX - shiftX,
          bottom: deckHeight - e.pageY - shiftY,
        });

        document.onmouseup = function (e) {
          document.onmousemove = null;

          $indicators.forEach( ($indicator) => {
            $indicator.remove();
          });

          var deckOffset = $deck.offset();
          deckOffset.top += parseInt($deck.css('borderWidth'), 10);
          deckOffset.left += parseInt($deck.css('borderWidth'), 10);

          var newX = Math.floor( (e.pageX - deckOffset.left) / TILE_SIZE),
              newY = Math.floor( (deckHeight - e.pageY + deckOffset.top) / TILE_SIZE);


          if (!isOnValidPos()) {
            self.$el.css({
              left: startCoords.left,
              bottom: startCoords.bottom
            });
          }
          else {
            self.model.save({
              x: newX,
              y: newY,
              onStartPos: false
            });
          };

          function isOnValidPos() {
            return variants.some( (pos) => {
              if (pos.x==newX && pos.y == newY) {
                if (pos.type == 'target')
                  self.model.attributes.enemyCollection.models.some( (enemyPiece) => {
                    if (enemyPiece.attributes.x == newX && enemyPiece.attributes.y == newY)
                      enemyPiece.destroy();
                  });
                return true;
              }
              return false;
              ;
            } )
          }
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
