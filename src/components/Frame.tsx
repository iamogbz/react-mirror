import * as React from "react";
import { usePortal } from "../hooks/usePortal";
import { useCallbackRef } from "../hooks/useRef";
import { ElementProps } from "./Element";
import { Styles } from "./Styles";

export interface FrameProps {
    /** Enables class styling of class iframe element */
    className?: string;
    /** ID of iframe element */
    id?: string;
}

/**
 * Used to wrap and isolate reflection from rest of document
 */
export function Frame({
    children,
    className,
    id,
}: React.PropsWithChildren<FrameProps>) {
    return (
        <IFrame id={id} className={className}>
            <ResetStyle />
            <Styles sheetList={document.styleSheets} />
            {children}
        </IFrame>
    );
}

type IFrameProps = ElementProps<"iframe"> & {
    /** Get the iframe content node the react children will be rendered into */
    getMountNode?: (_?: Window) => Element | undefined;
};

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

/**
 * https://www.webfx.com/blog/web-design/should-you-reset-your-css
 */
function ResetStyle() {
    return (
        <link
            rel="stylesheet"
            href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
        />
    );
}
