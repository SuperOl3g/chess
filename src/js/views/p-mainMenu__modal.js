import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';

let timerID;

let SearchModal = Backbone.View.extend({

    className: 'main-menu__modal',
    template: _.template($('#main-menu__modal-template').html()),

    events: {
      'click .main-menu__modal-cancel-btn': 'onCancelBtnClick'
    },

    onCancelBtnClick: function () {
      socket.emit('game_stopFinding');
      this.close();
    },

    onClose: function () {
      clearInterval(timerID);
    },

    initialize: function () {
      socket.emit('game_find');
      socket.on('game_found', (response) => {
        this.trigger('game_found', response);
        this.close();
      });
    },

    render: function() {
      this.$el.html( this.template() );
      let time = new Date(0);

      timerID = setInterval( () => {
        let min = time.getMinutes(),
            sec = time.getSeconds();

        time.setSeconds(++sec);

        this.$el.find('.main-menu__modal-time').html(`${min<10?'0':''}${min}:${sec<10?'0':''}${sec}`);
      }, 1000);

      return this;
    },
});

export default SearchModal;
