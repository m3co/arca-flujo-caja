import React, { useCallback, useState, useEffect } from 'react';
import { State } from 'arca-redux-v4';
import first from 'lodash/first';
import last from 'lodash/last';
import {
  sortByEnd, sortByStart, getDateList,
} from '../../utils';
import Header from './Header/Header';
import LeftBar from './LeftBar/LeftBar';
import Row from './Row/Row';
import Footer from './Footer/Footer';
import TopBar from '../TopBar/TopBar';
import './Cashflow.less';

type styles = {
  ['margin-left']?: string,
  ['margin-top']?: string,
};

interface CashFlowProps {
  cashFlowRows: State['Source']['Tasks-Month-CashFlow-AAU'],
  currentProject: number,
  setCurrentProject: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  projectOptions: Array<{ name: number | string; value: number }>,
}

const CashFlow: React.FunctionComponent<CashFlowProps> = ({
  cashFlowRows, currentProject, setCurrentProject, projectOptions,
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

  const rowsToListsOfRows = useCallback(() => {
    const result: Array<State['Source']['Tasks-Month-CashFlow-AAU']> = [];

    const rowsMappedByKey = cashFlowRows.reduce((map, row) => {
      if (map.has(row.Key)) {
        map.set(row.Key, [...map.get(row.Key), row]);
      } else {
        map.set(row.Key, [row]);
      }

      return map;
    }, new Map());

    rowsMappedByKey.forEach(rows => result.push(rows));

    return result;
  }, [cashFlowRows]);

  const [listsRows, setListsRows] = useState(rowsToListsOfRows());

  useEffect(() => {
    setListsRows(rowsToListsOfRows());
  }, [rowsToListsOfRows]);

  const onScroll = (event: React.UIEvent<HTMLElement>) => {
    const left = event.currentTarget.scrollLeft;
    const top = event.currentTarget.scrollTop;

    const innerChilds = event.currentTarget.children as HTMLCollection;

    const topPanel = innerChilds[1].children[1] as HTMLElement;
    const topPanelStyles = topPanel.style as styles;

    const leftBar = innerChilds[2].children[0] as HTMLElement;
    const leftBarStyles = leftBar.style as styles;

    const footer = innerChilds[innerChilds.length - 1].children[1] as HTMLElement;
    const footerStyles = footer.style as styles;

    topPanelStyles['margin-left'] = `${-left + 451}px`;
    leftBarStyles['margin-top'] = `${-top + 122}px`;
    footerStyles['margin-left'] = `${-left + 451}px`;
  };

  return (
    <div className='cash-flow__outer'>
      <div
        onScroll={onScroll}
        className='cash-flow__inner'
      >
        <TopBar
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          projectOptions={projectOptions}
        />
        <Header
          timeLine={timeLine}
        />
        <LeftBar cashFlowRows={listsRows} />
        {
          listsRows.map((row, index) => (
            <Row
              rowInfo={row}
              timeLine={timeLine}
              key={row[0].Key + String(index)}
            />
          ))
        }
        <Footer cashFlowRows={listsRows} timeLine={timeLine} />
      </div>
    </div>
  );
};

export default CashFlow;
