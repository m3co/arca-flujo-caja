'use strict';
((io) => {
  var client = io();
  client.on('connect', () => {
    console.log('connection');

    client.emit('data', {
      query: 'select',
      module: 'viewQtakeoffCosts1MonthFlow'
    });

  });

  client.on('response', (data) => {
    var query = data.query;
    console.log('not processed', data);
  });
  window.client = client;
})(io);
