'use strict';
(() => {
var APUIdSymbol = Symbol();
var columns = ['id', 'parent', 'description', 'unit'];
var date = (d) => d.toISOString().split('T')[0];
var period = (row) => `${date(row.start)} ${date(row.end)}`;
function QtakeoffCostsFlow() {
  var tasks = [];
  var periods = [];

  function doselect(row) {
    var found = tasks.find(d => d.id == row.id);
    if (found) {
      row.start = row.start ? new Date(row.start) : null;
      row.end = row.end ? new Date(row.end) : null;
      var p = period(row);
      if (found.periods[p]) {
        return;
      }
      found.periods[p] = Object.keys(row)
      .filter(d => d.indexOf('cost') > -1)
      .reduce((acc, d) => {
        acc[d] = row[d];
        return acc;
      }, {});
      if (periods.indexOf(p) == -1) {
        periods.push(p);
        periods.sort();
      }
    } else {
      insertTask(row);
    }
    renderRows();
  }

  function insertTask(row) {
    row.start = row.start ? new Date(row.start) : null;
    row.end = row.end ? new Date(row.end) : null;
    var p = period(row);
    row[APUIdSymbol] = row.id.split('.')
      .reduce((acc, d, i, array) => {
        acc.push(`${'0'.repeat(5 - d.length)}${d}`);
        if (i + 1 == array.length) {
          acc.push(...(new Array(8 - array.length)).fill('00000'));
        }
        return acc;
      }, []).join('');
    row.periods = {};
    if (periods.indexOf(p) == -1) {
      periods.push(p);
      periods.sort();
    }
    row.periods[p] = Object.keys(row)
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
  var thead = d3.select('thead tr');
  function renderRows() {
    var ths = thead.selectAll('th.flow-header')
      .data(periods);
    ths.text(d => d.split(' ')[1].slice(0, 7));

    ths.enter().append('th')
      .attr('class', 'flow-header')
      .text(d => d.split(' ')[1].slice(0, 7));

    var tr = tbody.selectAll('tr').data(tasks);
    tr.selectAll('td.fixed-column')
      .data(d => columns.map(key => d[key]))
      .text(d => d);

    tr.enter().append('tr');

    var trs = tr.selectAll('td.fixed-column')
      .data(d => columns.map(key => d[key]))
      .text(d => d);

    trs.enter()
      .append('td')
        .attr('class', 'fixed-column')
        .text(d => d);

    var trs = tr.selectAll('td.flow-column')
      .data(d => periods.map(key => ({
          cost: d.periods[key] ? Number(d.periods[key].cost).toFixed(0) : null
        })))
      .text(d => `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}`);

    trs.enter()
      .append('td')
        .attr('class', 'flow-column')
        .text(d => `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}`);
  }
  this.doselect = doselect;
}


window.qtakeoffcostsflow = new QtakeoffCostsFlow();
})();
