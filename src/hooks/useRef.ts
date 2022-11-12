import * as React from "react";

export function useCallbackRef<T>() {
  const [current, setRef] = React.useState<T | null>(null);
  return [current ?? undefined, setRef] as const;
}

export type UseRefsResult<T> = readonly [T | undefined, (v: T | null) => void];

export function useRefs<T>(ref: React.Ref<T> | undefined): UseRefsResult<T>;
export function useRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): UseRefsResult<T>;
export function useRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): UseRefsResult<T> {
  const [ref, setRef] = useCallbackRef<T>();

  const setRefs = React.useCallback(
    function setRefs(current: T | null) {
      setRef((previous) => {
        if (previous !== current) {
          refs.forEach((ref) => {
            if (!ref) return;
            else if (typeof ref === "function") {
              ref(current);
            } else if (ref.current !== current) {
              Object.assign(ref, { current });
            }
          });
        }
        return current;
      });
    },
    [refs, setRef],
  );

  return [ref, setRefs] as const;
}
