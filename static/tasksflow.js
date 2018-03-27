'use strict';
(() => {
var APUIdSymbol = Symbol();
var columns = ['expand', 'id', 'parent', 'description', 'unit'];
var levels = ['brown', 'red', 'blue', 'green'];
var date = (d) => d.toISOString().split('T')[0];
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
    row.expand = '+';
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
    tr.selectAll('td.fixed-column')
      .data(d => columns.map(key => ({
        key: key,
        value: d[key],
        row: d
      })))
      .text(d => d.value);

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
      .each(function(d) {
        if (d.key == 'expand') {
          d3.select(this).on('click', null);
          d3.select(this).on('click', () => {
            client.emit('data',{
              query: 'select',
              module: 'viewCosts1MonthFlow',
              parent: d.row.id
            });
          });
        }
      })
      .text(d => d.value)
      .style('color', d => {
        var level = levels[d.row.id.split('.').length - 1];
        return level ? level : 'black';
      });

    trs.enter()
      .append('td')
        .attr('class', 'fixed-column')
        .each(function(d) {
          if (d.key == 'expand') {
            d3.select(this).on('click', null);
            d3.select(this).on('click', () => {
              client.emit('data',{
                query: 'select',
                module: 'viewCosts1MonthFlow',
                parent: d.row.id
              });
            });
          }
        })
        .text(d => d.value)
        .style('color', d => {
          var level = levels[d.row.id.split('.').length - 1];
          return level ? level : 'black';
        });

    var trs = tr.selectAll('td.flow-column')
      .data(d => periods.map(key => ({
          cost: d.periods[key] ? Number(d.periods[key].cost).toFixed(0) : null,
          row: d
        })))
      .text(d => d.cost ? `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}` : '')
      .style('color', d => {
        var level = levels[d.row.id.split('.').length - 1];
        return level ? level : 'black';
      });

    trs.enter()
      .append('td')
        .attr('class', 'flow-column')
        .text(d => d.cost ? `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}` : '')
        .style('color', d => {
          var level = levels[d.row.id.split('.').length - 1];
          return level ? level : 'black';
        });
  }
  this.doselect = doselect;
}


window.qtakeoffcostsflow = new QtakeoffCostsFlow();
})();
