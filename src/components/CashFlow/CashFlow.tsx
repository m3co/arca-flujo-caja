import React from 'react';
import { State, ARCASocket } from 'arca-redux';
import './Cashflow.less';

interface CashFlowProps {
  socket: ARCASocket,
  cashFlowRows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'],
  cashFlowInfo: State['Source']['Tasks-Month-CashFlow-AAU']['Info'],
}

const CashFlow: React.FunctionComponent<CashFlowProps> = ({
  cashFlowInfo, cashFlowRows,
}) => {
  console.log(cashFlowInfo, cashFlowRows, ARCASocket);
  return (
    <h1>Cash Flow</h1>
  );
};

export default CashFlow;
