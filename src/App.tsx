import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import CashFlow from './components/CashFlow/CashFlow';
import Loader from './components/Loader/Loader';
import StartPage from './components/StartPage/StartPage';

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
      currentProject: 0,
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

    if (currentProject > 0) {
      socket.Select('Tasks-Month-CashFlow-AAU', { Project: currentProject });
    } else {
      socket.Select('Tasks-Month-CashFlow-AAU');
    }

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

    if (projects.length) {
      if (cashFlowRows.length && currentProject) {
        return (
          <CashFlow
            cashFlowRows={cashFlowRows}
            currentProject={currentProject}
            setCurrentProject={this.setCurrentProject}
            projectOptions={projectOptions}
          />
        );
      }

      return (
        <StartPage
          currentProject={currentProject}
          setCurrentProject={this.setCurrentProject}
          projectOptions={projectOptions}
        />
      );
    }

    return <Loader />;
  }
}

export default App;
