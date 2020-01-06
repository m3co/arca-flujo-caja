import React from 'react';
import { State } from 'arca-redux';
import {
  parseToDotsFormat,
} from '../../../utils/text';
import './LeftBar.less';

interface LeftBarProps {
  cashFlowRows: Array<State['Source']['Tasks-Month-CashFlow-AAU']['Rows']>,
}

const LeftBar: React.FunctionComponent<LeftBarProps> = ({
  cashFlowRows,
}) => (
  <div className='gantt-leftbar-wrap'>
    <div className='gantt-leftbar'>
      {
        cashFlowRows.map((row, index) => (
          <div className='gantt-leftbar__task-name' key={row[0].Key + String(index)}>
            <div className='gantt-leftbar__key'>
              { row[0].Key }
            </div>
            <div className='gantt-leftbar__unit'>
              { row[0].Unit }
            </div>
            <div className='gantt-leftbar__description'>
              { row[0].Description }
            </div>
            <div className='gantt-leftbar__total'>
              { parseToDotsFormat(String(row[0].TotalCost)) }
            </div>
          </div>
        ))
      }
    </div>
  </div>
);

export default LeftBar;
