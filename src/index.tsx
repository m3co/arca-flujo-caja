import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store, socket } from './redux/store';
import './less/index.less';
import App from './App';

render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>,
  document.getElementById('root'),
);
