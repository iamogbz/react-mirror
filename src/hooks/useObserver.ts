import * as React from "react";

import { useEventHandlers } from "./useEventHandlers";

export interface UseObserverProps<
  T extends typeof MutationObserver | typeof ResizeObserver,
> {
  initOptions?: Parameters<InstanceType<T>["observe"]>[1];
  target?: Parameters<InstanceType<T>["observe"]>[0];
  ObserverClass: T;
  /**
   * Also listen for other changes that are not observable.
   *
   * NOTE: Events will trigger `onUpdate` with no parameters unlike the mutation/resize triggered with records and reference to observer.
   */
  onEvents?: Set<keyof GlobalEventHandlersEventMap>;
  onUpdate: ConstructorParameters<T>[0];
}

export function useObserver<
  T extends typeof MutationObserver | typeof ResizeObserver,
>({ initOptions, ObserverClass, onEvents, ...props }: UseObserverProps<T>) {
  const target = props.target as Node & Element;
  const onUpdate = props.onUpdate as EventListener &
    MutationCallback &
    ResizeObserverCallback;

  const observer = React.useMemo(() => {
    return new ObserverClass(onUpdate);
  }, [ObserverClass, onUpdate]);

  React.useEffect(
    function observeRealElement() {
      if (!target || !observer) return;
      observer.observe(target, initOptions);

      return function destroy() {
        observer.disconnect();
      };
    },
    [initOptions, observer, onUpdate, target],
  );

  const handlers = React.useMemo(() => {
    return Array.from(onEvents ?? []).map(
      (eventType) => [eventType, onUpdate] as const,
    );
  }, [onEvents, onUpdate]);

  useEventHandlers(target, handlers);
}
