import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';

let SearchModal = Backbone.View.extend({

    className: 'main-menu__modal',
    template: _.template($('#main-menu__modal-template').html()),

    events: {
      'click .main-menu__modal-cancel-btn': 'onCancelBtnClick'
    },

    onCancelBtnClick: function () {
      socket.emit('game_stopFinding');
      this.remove();
    },

    initialize: function () {
      socket.emit('game_find');
      socket.on('game_found', (response) => {
        this.trigger('game_found', response);
        this.remove();
      });
    },

    render: function() {
      this.$el.html( this.template() );
      return this;
    },
});

export default SearchModal;
