import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';
import Marionette from 'backbone.marionette';
import io         from 'socket.io-client';

window.$ = $;
window.Backbone = Backbone;

window.io = io;

import LoginView     from './views/login';

let App = new Marionette.Application();
App.addRegions({
  mainRegion: "#main-content"
});
App.start();
App.mainRegion.show(new LoginView());

export default App;

//
// $("body").append(new LoginView().render().el);
// $("body").append(new RoomsListView().render().el);
// $("body").append(new GameUIView().render().el);

// socket.on('connect', () => console.info(`You've been connected as ${socket.id}.`) );
// socket.on('roomsList', function (roomsList) {console.info(roomsList)} );
// socket.on('game_found', (response) => console.info(`You enter to ${response.roomID}, your color is ${response.color}.`) );
//
// let turnTypes = ['move', 'promotion', 'castling'];
// turnTypes.forEach( (turnType) => {
//  socket.on(`player_${turnType}`, (response) => console.info(`${response.playerColor} has made ${turnType}!!!`) );
// });
// socket.on('game_end', (response) => console.info(response) );
