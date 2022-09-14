import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { reduxStore } from 'reduxStore';

import './styles/index.css';
import { ErrorBoundary } from 'components';
import { App } from 'pages';
import { AppContextProvider } from 'AppContext';
import { fetchCurrentUserData } from 'pages/App/currentUserSlice';
import { startServiceWorker } from 'utils';

reduxStore.dispatch(fetchCurrentUserData());

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Provider store={reduxStore}>
          <AppContextProvider>
            <App/>
          </AppContextProvider>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>, document.getElementById('root'));

startServiceWorker();
