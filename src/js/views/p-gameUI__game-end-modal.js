import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'backbone';

import template from './../../templates/p-gameUI__game-end-modal.ejs';

let GameEndModal = Backbone.View.extend({

  className: 'game-end-modal',
  template: _.template(template),

  render: function () {
    this.$el.html(this.template({response: this.model}));
    return this;
  },

  events: {
    'click .game-end-modal__close-btn': 'onCloseBtnClick'
  },

  onCloseBtnClick: function () {
    this.trigger('close');
    this.remove();
  }
});

export default GameEndModal;
