import * as React from "react";

export type EventHandlerTarget = Pick<
  GlobalEventHandlers,
  "addEventListener" | "removeEventListener"
>;

export function useEventHandlers(
  target?: EventHandlerTarget,
  onEvents?: (readonly [
    keyof GlobalEventHandlersEventMap,
    Parameters<GlobalEventHandlers["addEventListener"]>[1],
  ])[],
) {
  React.useEffect(
    function onEventHandlers() {
      if (!target || !onEvents) return;
      onEvents.forEach(([eventType, listener]) => {
        target.addEventListener(eventType, listener, false);
      });

      return function destroy() {
        onEvents.forEach(([eventType, listener]) => {
          target.removeEventListener(eventType, listener, false);
        });
      };
    },
    [onEvents, target],
  );
}
