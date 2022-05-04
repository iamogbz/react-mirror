import * as React from "react";
import * as ReactDOM from "react-dom";
import { randomString } from "../utils";
import { Frame, FrameProps } from "./Frame";
import { Reflection } from "./Reflection";

export interface MirrorProps extends Pick<FrameProps, "className"> {
    /** Reference to target instance to reflect */
    reflect?: React.ReactInstance;
}

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
    // return reflection wrapped in frame element
    return (
        <Frame id={instanceId} className={className}>
            <Reflection real={real} style={{ pointerEvents: "none" }} />
        </Frame>
    );
}
