import $        from 'jquery';
import _        from 'underscore';
import Backbone from 'Backbone';


const TILE_SIZE = 40;

let PieceView = Backbone.View.extend({
  className: 'piece',
  template: _.template($('#piece-template').html()),

  initialize: function() {
    this.listenTo(this.model, 'move',  this.render);
    this.listenTo(this.model, 'taked promotion', this.remove);
  },

  render: function() {
    let model = this.model.attributes;
    this.$el.html(this.template({
      type: model.type,
      color: model.color
    }));
    this.$el.css({
      bottom: `${model.y * TILE_SIZE}px`,
      left:   `${model.x * TILE_SIZE}px`,
    });
    return this;
  }
});

export default PieceView;
