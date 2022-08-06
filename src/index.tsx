import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';
import { App } from './pages';
import { AppContextProvider } from './AppContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App/>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>, document.getElementById('root'));
