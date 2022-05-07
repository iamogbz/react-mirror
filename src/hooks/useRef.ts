import * as React from "react";

export function useCallbackRef<T>() {
  const [current, setRef] = React.useState<T | null>(null);
  return [current ?? undefined, setRef] as const;
}
