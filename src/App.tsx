import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import CashFlow from './components/CashFlow/CashFlow';
import Loader from './components/Loader/Loader';

interface AppProps {
  socket: ARCASocket,
}

interface AppState {
  cashFlowRows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'],
  cashFlowInfo: State['Source']['Tasks-Month-CashFlow-AAU']['Info'],
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      cashFlowRows: [],
      cashFlowInfo: null,
    };

    props.socket.store.subscribe((): void => {
      const state: State = props.socket.store.getState();
      this.setState({
        cashFlowRows: state.Source['Tasks-Month-CashFlow-AAU'].Rows,
        cashFlowInfo: state.Source['Tasks-Month-CashFlow-AAU'].Info,
      });
    });

    props.socket.Select('Tasks-Month-CashFlow-AAU');
    props.socket.GetInfo('Tasks-Month-CashFlow-AAU');
    props.socket.Subscribe('Tasks-Month-CashFlow-AAU');
  }

  render() {
    const { socket } = this.props;
    const { cashFlowInfo, cashFlowRows } = this.state;
    return (
      cashFlowRows.length && cashFlowInfo
        ? <CashFlow socket={socket} cashFlowInfo={cashFlowInfo} cashFlowRows={cashFlowRows} />
        : <Loader />
    );
  }
}

export default App;
