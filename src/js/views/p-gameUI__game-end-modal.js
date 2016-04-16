import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'backbone';


let GameEndModal = Backbone.View.extend({

    className: 'game-end-modal',
    template: _.template($('#game-end-modal-template').html()),

    render: function() {
        this.$el.html( this.template({response: this.model}));
        return this;
    },

    events: {
        'click .game-end-modal__close-btn': 'onCloseBtnClick'
    },

    onCloseBtnClick: function() {
        this.trigger('close');
        this.remove();
    }
});

export default GameEndModal;
