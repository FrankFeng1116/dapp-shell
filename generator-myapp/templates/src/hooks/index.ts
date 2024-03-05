import { DependencyList, useCallback, useRef } from "react";

export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
  deps: DependencyList,
  delay = 500,
) {
  const lock = useRef<number>();
  return useCallback((...args: any[]) => {
    if (!callback) return;
    const now = Date.now();
    if (lock.current && lock.current + delay > now) return;
    lock.current = now;
    return callback(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useCurrentNetworkInfo(){
  return {
    apiUrl: 'https://aa-portkey.portkey.finance',
    networkType: 'MAINNET',
  }
}
// https://aa-portkey.portkey.finance