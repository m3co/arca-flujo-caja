import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import Loader from './components/Loader/Loader';

interface AppProps {
  socket: ARCASocket,
}

class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);

    props.socket.store.subscribe((): void => {
      const state: State = props.socket.store.getState();
      this.setState(state.Source['Tasks-Month-CashFlow-AAU']);
    });

    props.socket.Select('Tasks-Month-CashFlow-AAU');
    props.socket.GetInfo('Tasks-Month-CashFlow-AAU');
    props.socket.Subscribe('Tasks-Month-CashFlow-AAU');
  }

  render() {
    return (
      <Loader />
    );
  }
}

export default App;
