import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Store } from 'redux';
import { getSpecificSource, State } from 'arca-redux-v4';
import { socket } from './redux/store';
import CashFlow from './components/CashFlow/CashFlow';
import Loader from './components/Loader/Loader';
import StartPage from './components/StartPage/StartPage';

const App: React.FunctionComponent = () => {
  const projects: State['Source']['Projects'] = useSelector((state: Store) => getSpecificSource(state, 'Projects'));
  const cashFlowRows = useSelector((state: Store) => getSpecificSource(state, 'Tasks-Month-CashFlow-AAU'));

  const [curProject, setCurProject] = useState(0);

  useEffect(() => {
    socket.select('Projects');
  }, []);

  useEffect(() => {
    if (curProject > 0) {
      socket.select('Tasks-Month-CashFlow-AAU', { Project: curProject });
    }
  }, [curProject]);

  const setCurrentProject = (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => {
    setCurProject(Number(event.target.value));
  };

  const projectOptions = projects.map(project => ({
    value: project.ID,
    name: project.Name,
  }));

  if (projects.length) {
    if (cashFlowRows.length && curProject) {
      return (
        <CashFlow
          cashFlowRows={cashFlowRows}
          currentProject={curProject}
          setCurrentProject={setCurrentProject}
          projectOptions={projectOptions}
        />
      );
    }

    return (
      <StartPage
        currentProject={curProject}
        setCurrentProject={setCurrentProject}
        projectOptions={projectOptions}
      />
    );
  }

  return <Loader />;
};

export default App;
