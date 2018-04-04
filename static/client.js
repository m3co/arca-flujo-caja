'use strict';
((io) => {
  var client = io();
  client.on('connect', () => {
    console.log('connection');

    client.emit('data', {
      query: 'select',
      module: 'viewAPUCosts1MonthFlow',
      project: '2'
    });

  });

  client.on('response', (data) => {
    var query = data.query;
    qtakeoffcostsflow.doselect(data.row);
  });
  window.client = client;
})(io);
