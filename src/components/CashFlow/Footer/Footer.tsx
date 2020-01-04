import React from 'react';
import { State } from 'arca-redux';
import FooterRow from './FooterRow';
import {
  parseToDotsFormat,
} from '../../../utils/text';
import './Footer.less';

interface FooterProps {
  cashFlowRows: Array<State['Source']['Tasks-Month-CashFlow-AAU']['Rows']>,
  timeLine: Array<Date>,
}

const Footer: React.FunctionComponent<FooterProps> = ({
  cashFlowRows, timeLine,
}) => (
  <div className='cash-flow-footer'>
    <div className='cash-flow-footer__title'>
      Total
      <div className='cash-flow-footer__total'>
        {
          parseToDotsFormat(String(cashFlowRows.reduce((sum, row) => sum + row[0].TotalCost, 0)))
        }
      </div>
    </div>
    <FooterRow cashFlowRows={cashFlowRows} timeLine={timeLine} />
  </div>
);

export default Footer;
