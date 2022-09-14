import React from 'react';

import { State } from './types';

export function useWindowVisualViewportSize(defaultState: State) {
  const [size, setSize] = React.useState<State>(defaultState);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const resize = () => {
      if (window && window.visualViewport) {
        const {
          width,
          height,
        } = window.visualViewport;

        setSize({
          width,
          height,
        });
      }
    }

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        resize();
      }, 200);
    };

    if (window) {
      window.addEventListener('resize', handleResize);
    }

    resize();

    return () => {
      if (window) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return size;
}
