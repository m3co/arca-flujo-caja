import React from 'react';
import { State } from 'arca-redux';
import { getDateList } from '../../../utils';
import {
  getPointOnTimeline, parseToDotsFormat,
} from '../../../utils/text';
import { CELL_WIDTH } from '../../../utils/constant';
import './Row.less';

interface RowProps {
  rowInfo: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'],
  timeLine: Array<Date>,
}

const Row: React.FunctionComponent<RowProps> = ({
  rowInfo, timeLine,
}) => (
  <div className='cash-flow-row'>
    <div
      className='cash-flow-row__task-timeline'
      style={{
        width: (CELL_WIDTH * timeLine.length),
      }}
    >
      <div className='cash-flow-row__task-duration-wrap'>
        {
            rowInfo.map((rowElem, index) => {
              const durationTask = getDateList(new Date(rowElem.Start), new Date(rowElem.End));

              const startOnTimeLine = getPointOnTimeline(timeLine, new Date(rowElem.Start));

              return (
                <div
                  key={String(index)}
                  role='presentation'
                  style={{
                    width: (CELL_WIDTH * durationTask.length) - 1,
                    marginLeft: CELL_WIDTH * startOnTimeLine,
                  }}
                  className='cash-flow-row__task-duration'
                >
                  { parseToDotsFormat(String(rowElem.Cost)) }
                </div>
              );
            })
          }
      </div>
    </div>
  </div>
);

export default Row;
