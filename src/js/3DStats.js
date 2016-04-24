import Stats      from 'stats-js';

function initStats() {
  let stats = new Stats();
  stats.setMode(0);

  $(stats.domElement).css({
    position: 'absolute',
    left:     '0px',
    top:      '0px'
  });

  return stats;
}

module.exports = {
  init: initStats
};