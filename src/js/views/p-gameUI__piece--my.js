import $        from 'jquery';
import _        from 'underscore';

import PieceView from './p-gameUI__piece';

const TILE_SIZE = 40,
      FPS = 60;

let MyPieceView = PieceView.extend({
  className: () => 'piece piece--my',

  events: {
    'mousedown': 'onMouseDown'
  },

  onMouseDown: function (e) {
    // если не наш ход, фигуру двигать нельзя
    if (!this.model.collection.turnFlag)
      return;

    let $deck = $('.deck'),
        deckHeight = $deck.height(),
        startCoords = this.$el.css(["left", "bottom"]),
        shiftX = e.pageX - parseInt(startCoords.left, 10),
        shiftY = deckHeight - e.pageY - parseInt(startCoords.bottom, 10);

    let $indicators = this.model.getNonBlockedVariants().map( (pos) => {
      return $(document.createElement("div"))
        .addClass(`tileIndicator tileIndicator--${pos.type}`)
        .css({
          left:   `${pos.x * TILE_SIZE}px`,
          bottom: `${pos.y * TILE_SIZE}px`
        });
    });

    $deck.append($indicators);

    document.onmousemove = (e) => {
      this.$el.css({
        left: e.pageX - shiftX,
        bottom: deckHeight - e.pageY - shiftY
      });
    };

    document.onmouseup = (e) => {
      document.onmousemove = null;
      document.onmouseup = null;

      $indicators.forEach( ($indicator) => $indicator.remove() );

      // определяем координаты поля на странице
      let deckOffset = $deck.offset();
      deckOffset.top  += parseInt($deck.css('borderWidth'), 10);
      deckOffset.left += parseInt($deck.css('borderWidth'), 10);

      // определяем над какой клеткой мы сейчас находимся
      let newX = Math.floor( (e.pageX - deckOffset.left) / TILE_SIZE),
        newY = Math.floor( (deckHeight - e.pageY + deckOffset.top) / TILE_SIZE);


      if( this.model.moveTo(newX, newY) ) {
        this.model.collection.turnFlag = false;
      } else {
        // если позиция невалидна, возвращаем в исходное положение
        this.$el.css({
          left: startCoords.left,
          bottom: startCoords.bottom
        });
      }
    }
  }
});

export default MyPieceView;
