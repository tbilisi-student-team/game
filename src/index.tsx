import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';
import { ErrorBoundary } from './components';
import { App } from './pages';
import { AppContextProvider } from './AppContext';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppContextProvider>
          <App/>
        </AppContextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>, document.getElementById('root'));
