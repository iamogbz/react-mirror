import * as React from "react";
import * as ReactDOM from "react-dom";
import { randomString } from "../utils";
import { useDimensions } from "../hooks/useDimensions";
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
    const { id, real } = React.useMemo(
        () => ({
            /** Unique identifier of this mirror */
            id: randomString(7),
            /** Actual DOM node of react element being reflected */
            // eslint-disable-next-line react/no-find-dom-node
            real: ReactDOM.findDOMNode(reflect) ?? undefined,
        }),
        [reflect],
    );

    const { height, width } = useDimensions(real);
    const frameProps = { className, height, id, width };
    return (
        <Frame {...frameProps}>
            <Reflection real={real} style={{ pointerEvents: "none" }} />
        </Frame>
    );
}
