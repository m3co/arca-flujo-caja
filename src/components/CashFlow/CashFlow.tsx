import React, { useCallback, useState, useEffect } from 'react';
import { State, ARCASocket } from 'arca-redux';
import first from 'lodash/first';
import last from 'lodash/last';
import {
  sortByEnd, sortByStart, getDateList,
} from '../../utils';
import './Cashflow.less';
import Header from './Header/Header';
import LeftBar from './LeftBar/LeftBar';
import Row from './Row/Row';

interface CashFlowProps {
  socket: ARCASocket,
  cashFlowRows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'],
  cashFlowInfo: State['Source']['Tasks-Month-CashFlow-AAU']['Info'],
}

const CashFlow: React.FunctionComponent<CashFlowProps> = ({
  cashFlowInfo, cashFlowRows, socket,
}) => {
  const calcTimeLine = useCallback(() => {
    const sortedDataByEnd = sortByEnd([...cashFlowRows]);
    const sortedDataByStart = sortByStart([...cashFlowRows]);

    const startDate = new Date(first(sortedDataByStart).Start);
    const endDate = new Date(last(sortedDataByEnd).End);

    return getDateList(startDate, endDate);
  }, [cashFlowRows]);

  const [timeLine, setTimeLine] = useState(calcTimeLine());

  useEffect(() => {
    setTimeLine(calcTimeLine());
  }, [calcTimeLine]);

  return (
    <div className='cash-flow__outer'>
      <div
        className='cash-flow__inner'
      >
        <Header timeLine={timeLine} />
        <LeftBar cashFlowRows={cashFlowRows} />
        {
          cashFlowRows.map((row, index) => (
            <Row
              rowInfo={row}
              timeLine={timeLine}
              key={row.Key + String(index)}
            />
          ))
        }
      </div>
    </div>
  );
};

export default CashFlow;
