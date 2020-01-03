import React from 'react';
import { State } from 'arca-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { getDateList } from '../../../utils';
import {
  getPointOnTimeline,
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
                <Tooltip
                  key={String(index)}
                  title={(
                    <div className='cash-flow-row__description'>
                      <p>{`Project: ${rowElem.Project}`}</p>
                      <p>{`Key: ${rowElem.Key}`}</p>
                      <p>{`Description: ${rowElem.Description}`}</p>
                      <p>{`Unit: ${rowElem.Unit}`}</p>
                      <p>{`TaskStart: ${rowElem.TaskStart}`}</p>
                      <p>{`Start: ${rowElem.Start}`}</p>
                      <p>{`End: ${rowElem.End}`}</p>
                      <p>{`TaskEnd: ${rowElem.TaskEnd}`}</p>
                      <p>{`Days: ${rowElem.Days}`}</p>
                      <p>{`TotalDays: ${rowElem.TotalDays}`}</p>
                      <p>{`Cost: ${rowElem.Cost}`}</p>
                      <p>{`TotalCost: ${rowElem.TotalCost}`}</p>
                    </div>
                  )}
                >
                  <div
                    role='presentation'
                    style={{
                      width: (CELL_WIDTH * durationTask.length) - 1,
                      marginLeft: CELL_WIDTH * startOnTimeLine,
                    }}
                    className='cash-flow-row__task-duration'
                  >
                    { rowElem.Cost }
                  </div>
                </Tooltip>
              );
            })
          }
      </div>
    </div>
  </div>
);

export default Row;
