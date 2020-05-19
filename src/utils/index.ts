import { State } from 'arca-redux';

export const sortByStart = (rows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows']) => rows
  .sort((a, b) => Date.parse(String(a.Start)) - Date.parse(String(b.Start)));

export const sortByEnd = (rows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows']) => rows
  .sort((a, b) => Date.parse(String(a.End)) - Date.parse(String(b.End)));

export const getDateList = (start: Date, end: Date) => {
  const list = [];
  const date = new Date(start);

  while (date <= end) {
    list.push(new Date(date));
    date.setMonth(date.getMonth() + 1);
  }

  return list;
};

export const getMappedDates = (list: Array<Date>) => {
  const mappedDates = new Map();

  const yearsMap = list.reduce((years, date) => {
    const year = date.getFullYear();

    if (years.has(year)) {
      years.set(year, [...years.get(year), date]);
    } else {
      years.set(year, [date]);
    }

    return years;
  }, new Map());

  yearsMap.forEach((month: Array<Date>, year) => {
    interface Imonth<T> {
      [key: number]: Array<Date>,
    }

    const months = month.reduce((year: Imonth<[]>, date: Date) => {
      const month: keyof Imonth<number> = date.getMonth();

      if (year[month]) {
        year[month].push(date);
      } else {
        Object.defineProperty(year, month, {
          configurable: true,
          enumerable: true,
          value: [date],
        });
      }

      return year;
    }, {});

    mappedDates.set(year, months);
  });

  return mappedDates;
};
