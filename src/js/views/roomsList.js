import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';

import RoomsList from './../collections/roomsList';

let RoomsListView = Backbone.View.extend({

  className: 'rooms-list',
  template: _.template($('#rooms-list-template').html()),

  events: {
    'click .rooms-list__join-btn': 'onJoinBtnClick'
  },

  initialize: function () {
    this.model = new RoomsList();
    this.listenTo(this.model, 'all',  this.render);
  },

  onJoinBtnClick: function (e) {
    socket.emit('room_enter', $(e.target).data('game-id'));
    this.trigger('joined-to-game');
  },

  render: function() {
    this.$el.html( this.template({rooms: this.model.models}) );
    return this;
  }
});

export default RoomsListView;
