import React from 'react';
import { State } from 'arca-redux-v4';
import FooterRow from './FooterRow';
import {
  parseToDotsFormat,
} from '../../../utils/text';
import './Footer.less';

interface FooterProps {
  cashFlowRows: Array<State['Source']['Tasks-Month-CashFlow-AAU']>,
  timeLine: Array<Date>,
}

const Footer: React.FunctionComponent<FooterProps> = ({
  cashFlowRows, timeLine,
}) => (
  <div className='cash-flow-footer'>
    <div className='cash-flow-footer__title'>
      <div className='cash-flow-footer__total-title'>
        Total
      </div>
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
