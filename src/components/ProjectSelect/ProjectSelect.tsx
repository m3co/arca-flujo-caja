import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import './ProjectSelect.less';

interface ProjectSelectProps {
  currentProject: number,
  onChange: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  options: Array<{ name?: number | string; value: number }>,
}

const ProjectSelect: React.FunctionComponent<ProjectSelectProps> = ({
  currentProject, onChange, options,
}) => {
  const currentOption = options.find(option => option.value === currentProject);

  return (
    <div className='cash-flow-project-select'>
      <InputLabel htmlFor='project'>Project</InputLabel>
      <Select
        value={currentOption.value}
        onChange={onChange}
        inputProps={{
          name: 'project',
          id: 'project',
        }}
      >
        {
          options.map(project => (
            <MenuItem key={String(project.value)} value={project.value}>{ project.name || project.value }</MenuItem>
          ))
        }
      </Select>
    </div>
  );
};

export default ProjectSelect;
