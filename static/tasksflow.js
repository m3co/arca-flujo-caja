'use strict';
(() => {
var APUIdSymbol = Symbol();
var columns = ['id', 'parent', 'description', 'unit', 'total'];
var levels = ['brown', 'red', 'blue', 'green'];
var date = (d) => {
  return d instanceof Date ? d.toISOString().split('T')[0] : null;
};
var period = (row) => `${date(row.start)} ${date(row.end)}`;
function QtakeoffCostsFlow() {
  var tasks = [];
  var periods = [];
  window.tasks = tasks;

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
    tr.style('background-color', (d, i) => {
        return i % 2 ? 'white' : '#f0f0f0';
      });

    tr.enter().append('tr')
      .style('background-color', (d, i) => {
        return i % 2 ? 'white' : '#f0f0f0';
      });

    var trs = tr.selectAll('td.fixed-column')
      .data(d => columns.map(key => ({
        key: key,
        value: d[key],
        row: d
      })))
      .text(d => {
        if (d.key === 'total') {
          return `$${Number(Object.keys(d.row.periods).reduce((acc, key, i, arr) => {
            acc += d.row.periods[key].cost;
            return acc;
          }, 0).toFixed(0)).toLocaleString()}`;
        }
        return d.value;
      })
      .style('color', d => {
        var level = levels[d.row.id.split('.').length - 1];
        return d.row.expand ? (level ? level : 'black') : 'black';
      });

    trs.enter()
      .append('td')
        .attr('class', 'fixed-column')
        .text(d => d.value)
        .style('color', d => {
          var level = levels[d.row.id.split('.').length - 1];
          return d.row.expand ? (level ? level : 'black') : 'black';
        });

    var trs = tr.selectAll('td.flow-column')
      .data(d => periods.map(key => ({
          cost: d.periods[key] ? Number(d.periods[key].cost).toFixed(0) : null,
          row: d
        })))
      .text(d => d.cost ? `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}` : '')
      .style('color', d => {
        var level = levels[d.row.id.split('.').length - 1];
        return d.row.expand ? (level ? level : 'black') : 'black';
      });

    trs.enter()
      .append('td')
        .attr('class', 'flow-column')
        .text(d => d.cost ? `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}` : '')
        .style('color', d => {
          var level = levels[d.row.id.split('.').length - 1];
          return d.row.expand ? (level ? level : 'black') : 'black';
        });
  }
  this.doselect = doselect;
}


window.qtakeoffcostsflow = new QtakeoffCostsFlow();
})();
