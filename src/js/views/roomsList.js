import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'backbone';

import RoomsList from './../collections/roomsList';

import template from './../../templates/rooms-list.ejs';

let RoomsListView = Backbone.View.extend({

  className: 'rooms-list',
  template: _.template(template),

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
