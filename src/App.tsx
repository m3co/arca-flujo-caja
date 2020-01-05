import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import CashFlow from './components/CashFlow/CashFlow';
import Loader from './components/Loader/Loader';

interface AppProps {
  socket: ARCASocket,
}

interface AppState {
  projects: State['Source']['Projects']['Rows'],
  cashFlowRows: State['Source']['Tasks-Month-CashFlow-AAU']['Rows'],
  currentProject: number,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      projects: [],
      cashFlowRows: [],
      currentProject: 1,
    };

    props.socket.store.subscribe((): void => {
      const state: State = props.socket.store.getState();

      this.setState({
        cashFlowRows: state.Source['Tasks-Month-CashFlow-AAU'].Rows,
        projects: state.Source.Projects.Rows,
      });
    });

    props.socket.Select('Projects');
    props.socket.Subscribe('Projects');
  }

  componentDidMount() {
    const { socket } = this.props;
    const { currentProject } = this.state;

    socket.Select('Tasks-Month-CashFlow-AAU', { Project: currentProject });
    socket.GetInfo('Tasks-Month-CashFlow-AAU');
    socket.Subscribe('Tasks-Month-CashFlow-AAU');
  }

  setCurrentProject = (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => {
    this.setState({ currentProject: Number(event.target.value) }, () => {
      const { socket } = this.props;
      const { currentProject } = this.state;

      socket.Select('Tasks-Month-CashFlow-AAU', { Project: currentProject });
      socket.GetInfo('Tasks-Month-CashFlow-AAU');
      socket.Subscribe('Tasks-Month-CashFlow-AAU');
    });
  };

  render() {
    const { cashFlowRows, currentProject, projects } = this.state;

    const projectOptions = projects.map(project => ({
      value: project.ID,
      name: project.Name,
    }));

    return (
      cashFlowRows.length
        ? (
          <CashFlow
            cashFlowRows={cashFlowRows}
            currentProject={currentProject}
            setCurrentProject={this.setCurrentProject}
            projectOptions={projectOptions}
          />
        )
        : <Loader />
    );
  }
}

export default App;
