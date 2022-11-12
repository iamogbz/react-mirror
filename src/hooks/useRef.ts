import * as React from "react";

export function useCallbackRef<T>() {
  const [current, setRef] = React.useState<T | null>(null);
  return [current ?? undefined, setRef] as const;
}

type UseRefsResult<T> = [T | null, (v: T) => void];

export function useRefs<T>(ref: React.Ref<T> | undefined): UseRefsResult<T>;
export function useRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): UseRefsResult<T>;
export function useRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): UseRefsResult<T> {
  const [ref, setRef] = React.useState<T | null>(null);

  const setRefs = React.useCallback(
    function setRefs(current: T) {
      setRef((previous) => {
        if (previous !== current) {
          refs.forEach((ref) => {
            if (!ref) return;
            else if (ref instanceof Function) {
              ref(current);
            } else if (ref.current !== current) {
              Object.assign(ref, { current });
            }
          });
        }
        return current;
      });
    },
    [refs],
  );

  return [ref, setRefs];
}
