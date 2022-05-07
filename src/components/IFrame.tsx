import * as React from "react";
import { usePortal } from "../hooks/usePortal";
import { useCallbackRef } from "../hooks/useRef";
import { ElementProps } from "./Element";

export interface IFrameProps extends ElementProps<"iframe"> {
    /** Get the iframe content node the react children will be rendered into */
    getMountNode?: (_?: Window) => Element | undefined;
}

export function IFrame({
    children,
    getMountNode = (window) => window?.document?.body,
    ...props
}: IFrameProps) {
    const [iframe, ref] = useCallbackRef<HTMLIFrameElement>();
    const mountNode = getMountNode(iframe?.contentWindow ?? undefined);
    const portal = usePortal({ source: children, target: mountNode });

    return (
        <iframe {...props} ref={ref}>
            {portal}
        </iframe>
    );
}
