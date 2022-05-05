import * as React from "react";
import { isElement, getBounds } from "../utils/dom";
import { useObserver } from "./useObserver";

export function useDimensions(node?: Node) {
    const [dimensions, setDimensions] = React.useState(new DOMRect());
    const target = React.useMemo(() => {
        return isElement(node) ? node : undefined;
    }, [node]);
    const onUpdate = React.useCallback(() => {
        setDimensions(getBounds(target));
    }, [target]);
    useObserver({ ObserverClass: ResizeObserver, onUpdate, target });
    return dimensions;
}
