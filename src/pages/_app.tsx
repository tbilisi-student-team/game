import type { AppProps } from 'next/app'

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { fetchCurrentUserData, fetchAllLeadersData, reduxStore } from '@/reduxStore/index';
import { ErrorBoundary } from '@/components/index';
import { startServiceWorker } from '@/utils/index';
import { AppContextProvider } from '@/appContext/index';

import '../styles/index.css';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    reduxStore.dispatch(fetchCurrentUserData());
    reduxStore.dispatch(fetchAllLeadersData())
  }, [])

  useEffect(() => {
    startServiceWorker();
  }, [])

  return (
    <ErrorBoundary>
      <AppContextProvider>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </AppContextProvider>
    </ErrorBoundary>
  )
}

export default App
