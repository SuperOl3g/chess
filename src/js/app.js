import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';
import Marionette from 'backbone.marionette';
import io         from 'socket.io-client';

window.$ = $;
window.Backbone = Backbone;

window.io = io;

import LoginView from './views/p-login';

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
