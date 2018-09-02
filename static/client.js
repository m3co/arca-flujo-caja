'use strict';
((io) => {
  var client = io();
  var ProjectId = location.search.match(/\d+$/);
  client.on('connect', () => {
    console.log('connection');

    client.emit('data', {
      query: 'select',
      module: 'Projects'
    });

    if (ProjectId) {
      client.emit('data', {
        query: 'select',
        module: 'viewAAUCosts1MonthFlow',
        project: ProjectId
      });
    }

  });

  client.on('response', (data) => {
    var query = data.query;
    if (query == 'select' && data.module == 'viewAAUCosts1MonthFlow') {
      qtakeoffcostsflow.doselect(data.row);
    } else if (query == 'select' && data.module == 'Projects') {
      window.projects.doselect(data.row);
    } else {
      console.log('not processed', data);
    }
  });
  window.client = client;
})(io);
