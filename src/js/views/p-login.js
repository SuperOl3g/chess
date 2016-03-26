import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'Backbone';

import App           from './../app';
import MainMenuView from './p-mainMenu';

let LoginView = Backbone.View.extend({

  className: 'login',
  template: _.template($('#login-template').html()),

  events: {
    'click .login__action-btn': 'onActionBtnClick'
  },

  onActionBtnClick: function () {
    let server = this.$el.find('.login__server').val(),
        port = this.$el.find('.login__port').val(),
        $actionBtn = this.$el.find('.login__action-btn');

    $actionBtn.html('Подключение...')
    window.socket = io(`${server}:${port}`);
    console.log(window.socket);

    socket.on('connect', () => {
      console.info(`You've been connected as ${socket.id}.`);
      App.mainRegion.show(new MainMenuView());
      socket.removeAllListeners('connect');
    });
  },

  render: function() {
    this.$el.html( this.template({
      nickName: '',
      server: '127.0.0.1',
      port: 3056
    }));
    return this;
  }

});

export default LoginView;
