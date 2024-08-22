import { useEffect, useState } from 'react';

export function useAsyncInitialize(func, deps = []) {
  const [state, setState] = useState();

  useEffect(() => {
    (async () => {
      const result = await func();
      setState(result);
    })();
  }, deps);

  return state;
}
