import _        from 'underscore';
import Backbone from 'Backbone';

let RoomsList = Backbone.Collection.extend({
  initialize: function () {
    socket.emit('roomsList_subscribe');
    socket.on('roomsList', (response) => {
      this.reset(response);
    });
  }
});

export default RoomsList
