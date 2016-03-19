import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'Backbone';


const TILE_SIZE = 40,
      FPS = 60;

let PieceView = Backbone.View.extend({
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
    let self = this,
        $deck = $('.deck'),
        deckHeight = $deck.height(),
        startCoords = self.$el.css(["left", "bottom"]),
        shiftX = e.pageX - parseInt(startCoords.left, 10),
        shiftY = deckHeight - e.pageY - parseInt(startCoords.bottom, 10);

    let $indicators = this.model.getNonBlockedVariants().map( (pos) => {
      let indicator = document.createElement("div");
      $(indicator)
        .addClass(`tileIndicator--${pos.type}`)
        .css({
          left:   `${pos.x * TILE_SIZE}px`,
          bottom: `${pos.y * TILE_SIZE}px`
        });
      return $(indicator);
    });

    $deck.append($indicators);

    document.onmousemove = _.throttle( (e) => {
        self.$el.css({
          left: e.pageX - shiftX,
          bottom: deckHeight - e.pageY - shiftY,
        });

        document.onmouseup = (e) => {
          document.onmousemove = null;

          $indicators.forEach( ($indicator) => {
            $indicator.remove();
          });

          // определяем координаты поля на странице
          let deckOffset = $deck.offset();
          deckOffset.top  += parseInt($deck.css('borderWidth'), 10);
          deckOffset.left += parseInt($deck.css('borderWidth'), 10);

          // определяем над какой клеткой мы сейчас находимся
          let newX = Math.floor( (e.pageX - deckOffset.left) / TILE_SIZE),
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
    let model = this.model.attributes;
    this.$el.html(this.template({
      type: model.type,
      color: model.color
    }));
    this.$el.css({
      bottom: `${model.y * TILE_SIZE}px`,
      left:   `${model.x * TILE_SIZE}px`,
    });
    return this;
  }
});

export default PieceView;
