'use strict';
(() => {
var APUIdSymbol = Symbol();
var columns = ['APUId', 'constrain'];
var date = (d) => d.toISOString().split('T')[0];
var period = (row) => `${date(row.start)} ${date(row.end)}`;
function QtakeoffCostsFlow() {
  var tasks = [];

  function doselect(row) {
    var found = tasks.find(d => d.id == row.id);
    if (found) {
      row.start = row.start ? new Date(row.start) : null;
      row.end = row.end ? new Date(row.end) : null;
      if (found.periods[period(row)]) {
        return;
      }
      found.periods[period(row)] = Object.keys(row)
      .filter(d => d.indexOf('cost') > -1)
      .reduce((acc, d) => {
        acc[d] = row[d];
        return acc;
      }, {});
    } else {
      insertTask(row);
    }
    renderRows();
  }

  function insertTask(row) {
    row.start = row.start ? new Date(row.start) : null;
    row.end = row.end ? new Date(row.end) : null;
    row[APUIdSymbol] = row.APUId.split('.')
      .reduce((acc, d, i, array) => {
        acc.push(`${'0'.repeat(5 - d.length)}${d}`);
        if (i + 1 == array.length) {
          acc.push(...(new Array(8 - array.length)).fill('00000'));
        }
        return acc;
      }, []).join('');
    row.periods = {};
    row.periods[period(row)] = Object.keys(row)
      .filter(d => d.indexOf('cost') > -1)
      .reduce((acc, d) => {
        acc[d] = row[d];
        return acc;
      }, {});
    delete row.start;
    delete row.end;
    Object.keys(row).filter(d => d.indexOf('cost') > -1).forEach(d => {
      delete row[d];
    });
    tasks.push(row);
    tasks.sort((a, b) => {
      if (a[APUIdSymbol] > b[APUIdSymbol]) return 1;
      if (a[APUIdSymbol] < b[APUIdSymbol]) return -1;
      return 0;
    });
  }

  var tbody = d3.select('tbody');
  function renderRows() {
    var trs = tbody.selectAll('tr.row').data(tasks);
    var tr = trs.enter().append('tr')
      .attr('class', 'row');

    tr.selectAll('td.fixed-column')
      .data(d => columns.map(c => d[c])).enter()
      .append('td')
        .attr('class', 'fixed-column')
        .text(d => d);

    tr.selectAll('td.flow-column')
      .data(d => d.periods).enter()
      .append('td')
        .attr('class', 'flow-column')
        .text(d => d.start);
  }
  this.doselect = doselect;
}


window.qtakeoffcostsflow = new QtakeoffCostsFlow();
})();
