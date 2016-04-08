import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';

import RoomsListView   from './roomsList';
import SearchModalView from './p-mainMenu__modal';

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
        this.trigger('joined-to-game');
      });
  },

  onFindGameBtnClick: function () {
    let searchModal = new SearchModalView();
    this.$el.find('.main-menu__modal').append(searchModal.render().el);

    this.listenTo(searchModal, 'game_found', (response) => {
      console.info(response);
      this.trigger('joined-to-game', response.color);
    });
  }

});

export default MainMenuView;
