import * as React from "react";
import { getBounds, isElement } from "../utils/dom";
import { useObserver } from "./useObserver";

export function useDimensions(target?: Node) {
  // get the dimensions of the current target
  const getDimensions = React.useCallback(() => {
    return getBounds(target);
  }, [target]);
  // track dimensions and trigger rerender on set
  const [dimensions, setDimensions] = React.useState(getDimensions);
  // update dimensions when triggered
  const onUpdate = React.useCallback(() => {
    setDimensions(getDimensions());
  }, [getDimensions]);
  // track resizes and trigger update
  useObserver({
    ObserverClass: isElement(target) ? ResizeObserver : MutationObserver,
    onUpdate,
    target,
    initOptions: {
      characterData: true,
    },
  });

  return dimensions;
}
