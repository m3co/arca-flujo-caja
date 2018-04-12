'use strict';
(() => {
document.querySelector('select').addEventListener('change', e => {
  document.querySelector('table').setAttribute('show', e.target.value);
});
var APUIdSymbol = Symbol();
var columns = ['id', 'description', 'unit', 'total'];
var levels = ['brown', 'red', 'blue', 'green'];
var date = (d) => {
  return d instanceof Date ? d.toISOString().split('T')[0] : null;
};
var period = (row) => `${date(row.start)} ${date(row.end)}`;
function QtakeoffCostsFlow() {
  var tasks = [];
  var periods = [];
  var lastSTO = null;
  window.tasks = tasks;
  window.periods = periods;

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
      .filter(d => d == 'qop' || d.indexOf('cost') > -1)
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
    if (lastSTO) {
      clearTimeout(lastSTO);
    }
    lastSTO = setTimeout(() => {
      if (lastSTO < 100) return;
      renderRows();
    }, 200);
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
  function renderRows() {
    var ths = d3.select('thead tr.periods').selectAll('th.flow-header')
      .data(periods).text(d => d.split(' ')[1].slice(0, 7));

    ths.enter().append('th')
      .attr('class', 'flow-header')
      .text(d => d.split(' ')[1].slice(0, 7));

    d3.select('thead tr').selectAll('th.flow-header')
      .data(periods).enter().append('th')
        .attr('class', 'flow-header')
        .text((d, i) => i + 1);

    var tr = tbody.selectAll('tr').data(tasks);
    tr.style('background-color', (d, i) => {
        return i % 2 ? 'white' : '#f0f0f0';
      });

    var w = tr.enter().append('tr')
      .style('background-color', (d, i) => {
        return i % 2 ? 'white' : '#f0f0f0';
      });

    var trs = w.selectAll('td.fixed-column')
      .data(d => columns.map(key => ({
          key: key,
          value: d[key],
          row: d
        })));

    trs.enter()
      .append('td')
        .attr('class', 'fixed-column')
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

    var trs = w.selectAll('td.flow-column')
      .data(d => periods.map(key => ({
          cost: d.periods[key] ? Number(d.periods[key].cost).toFixed(0) : null,
          qop: d.periods[key] ? Number(d.periods[key].qop) : null,
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
        .each(function(d, i, m) {
          d3.select(this).append('span')
            .classed('cost', true)
            .text(d => d.cost
              ? `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}`
              : '');
          d3.select(this).append('span')
            .classed('qop', true)
            .text(d => d.qop
              ? `${Number(Number(d.qop).toFixed(2)).toLocaleString()}`
              : '');
        })
        .style('color', d => {
          var level = levels[d.row.id.split('.').length - 1];
          return d.row.expand ? (level ? level : 'black') : 'black';
        });
  }
  this.doselect = doselect;
}


window.qtakeoffcostsflow = new QtakeoffCostsFlow();
})();
