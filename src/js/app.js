import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'backbone';

window.$ = $;
window.Backbone = Backbone;

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
};

import LoginView    from './views/p-login';
import MainMenuView from './views/p-mainMenu';
import GameUIView   from './views/p-gameUI';

let App = {
  setMainRegion: function(newView) {
    if (this.mainRegion)
      this.mainRegion.close();
    this.mainRegion = newView;
    $('#main-content').html( newView.render().$el);
  }
};

let loginView = new LoginView();
App.setMainRegion(loginView);
loginView.on('login', createMainMenu);

function createMainMenu() {
  let mainMenuView = new MainMenuView();
  App.setMainRegion(mainMenuView);
  mainMenuView.on('joined-to-game', (params) => {
    let inGameView = new GameUIView(params)
    App.setMainRegion(inGameView);
    inGameView.on('close', createMainMenu );
  });
}


// запрещаем дефолтное перетаскивание картинок (мешает нашему дрег'н'дропу)
$(document).on('mousedown', 'img', (e) => e.preventDefault() );
