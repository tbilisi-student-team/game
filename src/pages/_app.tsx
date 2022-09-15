import type { AppProps } from 'next/app'

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { fetchCurrentUserData, reduxStore } from '@/reduxStore/index';
import { ErrorBoundary } from '@/components/index';
import { startServiceWorker } from '@/utils/index';
import { AppContextProvider } from '@/appContext/index';
import { Layout } from '@/components/Layout';

import '../styles/index.css';

reduxStore.dispatch(fetchCurrentUserData());

function App({ Component, pageProps }: AppProps) {

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
