import * as React from "react";

export interface UseObserverProps<
  T extends typeof MutationObserver | typeof ResizeObserver,
> {
  initOptions?: Parameters<InstanceType<T>["observe"]>[1];
  target?: Parameters<InstanceType<T>["observe"]>[0];
  ObserverClass: T;
  /** Also listen for other changes that are not observable */
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

  React.useEffect(
    function onEventHandlers() {
      if (!target || !onEvents) return;
      onEvents.forEach((event) => {
        target.addEventListener(event, onUpdate, false);
      });

      return function destroy() {
        onEvents.forEach((event) => {
          target.removeEventListener(event, onUpdate, false);
        });
      };
    },
    [onEvents, onUpdate, target],
  );
}
