import * as React from "react";
import * as ReactDOM from "react-dom";
import { randomString } from "../utils";
import { useDimensions } from "../hooks/useDimensions";
import { Frame, FrameProps } from "./Frame";
import { Reflection } from "./Reflection";

export interface MirrorProps extends Pick<FrameProps, "className"> {
    frameProps?: FrameProps;
    /** Reference to target instance to reflect */
    reflect?: React.ReactInstance;
}

/**
 * Create reflection wrapped in frame element
 */
export function Mirror({ className, frameProps, reflect }: MirrorProps) {
    const { instanceId, real } = React.useMemo(
        () => ({
            /** Unique identifier of this mirror */
            instanceId: randomString(7),
            /** Actual DOM node of react element being reflected */
            // eslint-disable-next-line react/no-find-dom-node
            real: ReactDOM.findDOMNode(reflect) ?? undefined,
        }),
        [reflect],
    );

    const { top, bottom, left, right } = useDimensions(real);
    return (
        <Frame
            className={className}
            height={bottom - top}
            id={instanceId}
            width={right - left}
            {...frameProps}
        >
            <Reflection real={real} style={{ pointerEvents: "none" }} />
        </Frame>
    );
}
