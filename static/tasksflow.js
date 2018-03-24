'use strict';
(() => {
var APUIdSymbol = Symbol();
function QtakeoffCostsFlow() {
  var tasks = [];

  function doselect(row) {
    var found = tasks.find(d => d.id == row.id);
    if (found) {
      row.start = row.start ? new Date(row.start) : null;
      row.end = row.end ? new Date(row.end) : null;
      if (found.periods.find(d => d.start.valueOf() == row.start.valueOf() &&
        d.end.valueOf() == row.end.valueOf())) {
        return;
      }
      found.periods.push({
        start: row.start,
        end: row.end
      });
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

    row.periods = [{
      start: row.start,
      end: row.end
    }];
    delete row.start;
    delete row.end;
    tasks.push(row);
    tasks.sort((a, b) => {
      if (a[APUIdSymbol] > b[APUIdSymbol]) return 1;
      if (a[APUIdSymbol] < b[APUIdSymbol]) return -1;
      return 0;
    });
  }

  function renderRows() {
    console.log(tasks);
  }
  this.doselect = doselect;
}


window.qtakeoffcostsflow = new QtakeoffCostsFlow();
})();
