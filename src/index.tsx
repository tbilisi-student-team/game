import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';
import { ErrorBoundary } from './components';
import { App } from './pages';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>, document.getElementById('root'));
