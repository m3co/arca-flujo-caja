import React from 'react';
import { TMonthsNumber, IDatesByMonthsInYear } from '../../../types/date';
import { getMappedDates } from '../../../utils';
import { MONTHS } from '../../../utils/constant';
import './Header.less';

interface HeaderProps {
  timeLine: Array<Date>,
}

const Header: React.FunctionComponent<HeaderProps> = ({
  timeLine,
}) => {
  const renderMonth = (year: IDatesByMonthsInYear<{}>) => Object.keys(year).map(month => {
    const numberMonth: keyof IDatesByMonthsInYear<number> = Number(month);

    return (
      <div className='cash-flow-header__month' key={month}>
        <div className='cash-flow-header__month-title'>{MONTHS[numberMonth]}</div>
      </div>
    );
  });

  const renderHead = (mappedDates: Map<TMonthsNumber, IDatesByMonthsInYear<{}>>) => {
    const items: Array<JSX.Element> = [];

    mappedDates.forEach((months, year) => {
      items.push(
        <div className='cash-flow-header__year' key={String(year)}>
          <div className='cash-flow-header__year-title'>{year}</div>
          <div className='cash-flow-header__year-content'>
            {
              renderMonth(months)
            }
          </div>
        </div>,
      );
    });

    return items;
  };

  return (
    <div className='cash-flow-header'>
      <div className='cash-flow-header__title'>
        <div className='cash-flow-header__key'>
          Key
        </div>
        <div className='cash-flow-header__unit'>
          Unit
        </div>
        <div className='cash-flow-header__description'>
          Description
        </div>
        <div className='cash-flow-header__total'>
          Total
        </div>
      </div>
      {
        renderHead(getMappedDates(timeLine))
      }
    </div>
  );
};

export default Header;
