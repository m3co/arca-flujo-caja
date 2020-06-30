import React from 'react';
import get from 'lodash/get';
import { State } from 'arca-redux-v4';
import {
  parseToDotsFormat,
} from '../../../utils/text';

interface FooterRowProps {
  cashFlowRows: Array<State['Source']['Tasks-Month-CashFlow-AAU']>,
  timeLine: Array<Date>,
}

const FooterRow: React.FunctionComponent<FooterRowProps> = ({
  cashFlowRows, timeLine,
}) => (
  <React.Fragment>
    {
      timeLine.map(date => {
        const currentMonth = date.getMonth();

        const costsByCurrentMonth = cashFlowRows.map(row => {
          const rowItem = row.find(month => new Date(month.Start).getMonth() === currentMonth);

          return get(rowItem, 'Cost', 0);
        });

        return (
          <div className='cash-flow-footer-row__item' key={`month-total-${currentMonth}`}>
            <div className='cash-flow-footer-row__item-title'>
              { parseToDotsFormat(String(costsByCurrentMonth.reduce((sum, cost) => sum + cost, 0))) }
            </div>
          </div>
        );
      })
    }
  </React.Fragment>
);

export default FooterRow;
