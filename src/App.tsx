import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import CashFlow from './components/CashFlow/CashFlow';
import Loader from './components/Loader/Loader';

interface AppProps {
  socket: ARCASocket,
}

interface AppState {
  cashFlowRows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'],
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      cashFlowRows: [],
    };

    props.socket.store.subscribe((): void => {
      const state: State = props.socket.store.getState();
      this.setState({
        cashFlowRows: state.Source['Tasks-Month-CashFlow-AAU'].Rows,
      });
    });

    props.socket.Select('Tasks-Month-CashFlow-AAU');
    props.socket.GetInfo('Tasks-Month-CashFlow-AAU');
    props.socket.Subscribe('Tasks-Month-CashFlow-AAU');
  }

  render() {
    const { cashFlowRows } = this.state;
    return (
      cashFlowRows.length
        ? <CashFlow cashFlowRows={cashFlowRows} />
        : <Loader />
    );
  }
}

export default App;
