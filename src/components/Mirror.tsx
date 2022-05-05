import * as React from "react";
import * as ReactDOM from "react-dom";
import { getBounds, isElement } from "../utils/dom";
import { randomString } from "../utils";
import { useObserver } from "../hooks/useObserver";
import { Frame, FrameProps } from "./Frame";
import { Reflection } from "./Reflection";

export interface MirrorProps extends Pick<FrameProps, "className"> {
    /** Reference to target instance to reflect */
    reflect?: React.ReactInstance;
}

/**
 * Create reflection wrapped in frame element
 */
export function Mirror({ className, reflect }: MirrorProps) {
    const { real, instanceId } = React.useMemo(
        () => ({
            /** Unique identifier of this mirror */
            instanceId: randomString(7),
            /** Actual DOM node of react element being reflected */
            // eslint-disable-next-line react/no-find-dom-node
            real: ReactDOM.findDOMNode(reflect) ?? undefined,
        }),
        [reflect],
    );
    const dimens = useDimensions(real);
    return (
        <Frame
            className={className}
            height={dimens.height}
            id={instanceId}
            width={dimens.width}
        >
            <Reflection real={real} style={{ pointerEvents: "none" }} />
        </Frame>
    );
}

function useDimensions(node?: Node) {
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
