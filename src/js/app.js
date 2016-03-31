import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';
import io         from 'socket.io-client';

window.$ = $;
window.Backbone = Backbone;


window.io = io;

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}


import LoginView    from './views/p-login';
import MainMenuView from './views/p-mainMenu';
import GameUIView   from './views/p-gameUI';

let App = {};
// let App = new Marionette.Application();
// App.addRegions({
//   mainRegion: "#main-content"
// });
// App.start();
// App.mainRegion.show(new LoginView());

export default App;

//
// $("body").append(new LoginView().render().el);
// $("body").append(new RoomsListView().render().el);
// $("body").append(new GameUIView().render().el);
