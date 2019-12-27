import React from 'react';
import { State } from 'arca-redux';
import './LeftBar.less';

interface LeftBarProps {
  cashFlowRows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'],
}

const LeftBar: React.FunctionComponent<LeftBarProps> = ({
  cashFlowRows,
}) => (
  <div className='gantt-leftbar-wrap'>
    <div className='gantt-leftbar'>
      {
        cashFlowRows.map((row, index) => (
          <div className='gantt-leftbar__task-name' key={row.Key + String(index)}>
            { row.Key }
          </div>
        ))
      }
    </div>
  </div>
);

export default LeftBar;
