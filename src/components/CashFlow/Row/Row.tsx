import React from 'react';
import { State } from 'arca-redux';
import { getDateList } from '../../../utils';
import {
  getPointOnTimeline,
} from '../../../utils/text';
import './Row.less';
import { CELL_WIDTH } from '../../../utils/constant';

interface RowProps {
  rowInfo: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'][0],
  timeLine: Array<Date>,
}

const Row: React.FunctionComponent<RowProps> = ({
  rowInfo, timeLine,
}) => {
  const durationTask = getDateList(new Date(rowInfo.Start), new Date(rowInfo.End));

  const startOnTimeLine = getPointOnTimeline(timeLine, new Date(rowInfo.Start));

  return (
    <div className='cash-flow-row'>
      <div
        className='cash-flow-row__task-timeline'
        style={{
          width: (CELL_WIDTH * timeLine.length),
        }}
      >
        <div className='cash-flow-row__task-duration-wrap'>
          <div
            role='presentation'
            style={{
              width: (CELL_WIDTH * durationTask.length) - 1,
              marginLeft: CELL_WIDTH * startOnTimeLine,
            }}
            className='cash-flow-row__task-duration'
          >
            { rowInfo.Cost }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Row;
