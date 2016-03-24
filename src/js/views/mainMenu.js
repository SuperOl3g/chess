import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';

import App             from './../app';
import RoomsListView   from './roomsList';
import SearchModalView from './mainMenu__modal';
import GameUIView      from './gameUI'

let MainMenuView = Backbone.View.extend({

  className: 'main-menu',
  template:  _.template($('#main-menu-template').html()),

  events: {
    'click .main-menu__find-game-btn': 'onFindGameBtnClick'
  },

  render: function() {
    this.$el.html( this.template() );
    this.$el.find('.main-menu__rooms').append(this.subView.render().el);
    return this;
  },

  initialize: function () {
      let roomsList = new RoomsListView();
      this.subView = roomsList;
      this.listenTo(roomsList, 'joined-to-game', () => {
        App.mainRegion.show(new GameUIView());
      });
  },

  onFindGameBtnClick: function () {
    let searchModal = new SearchModalView();
    this.$el.find('.main-menu__modal').append(searchModal.render().el);
    this.listenTo(searchModal, 'game_found', () => {
      App.mainRegion.show(new GameUIView());
    });
  }

});

export default MainMenuView;
