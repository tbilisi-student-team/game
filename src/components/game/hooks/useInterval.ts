import { useEffect, useRef } from 'react';

export default function useInterval(callback: VoidFunction, delay: number) {
  const savedCallback = useRef<VoidFunction>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [ callback ]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [ delay ]);
}
