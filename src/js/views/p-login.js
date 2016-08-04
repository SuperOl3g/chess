import $          from 'jquery';
import _          from 'underscore';
import Backbone   from 'backbone';
import io         from 'socket.io-client';

import template from './../../templates/p-login.ejs';

let LoginView = Backbone.View.extend({

  className: 'login',
  template: _.template(template),

  events: {
    'click .login__action-btn': 'onActionBtnClick'
  },

  onActionBtnClick: function () {
    let server = this.$el.find('.login__server').val(),
        port = this.$el.find('.login__port').val(),
        $actionBtn = this.$el.find('.login__action-btn');

    $actionBtn.html('Подключение...')
    window.socket = io(`${server}:${port}`);

    socket.on('connect', () => {
      console.info(`You've been connected as ${socket.id}.`);
      this.trigger('login');
      socket.removeAllListeners('connect');
    });
  },

  render: function() {
    this.$el.html( this.template({
      nickName: '',
      server: '185.81.113.164',
      port: 3056
    }));
    return this;
  }

});

export default LoginView;
