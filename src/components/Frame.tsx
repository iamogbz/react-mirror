import * as React from "react";
import { IFrame, IFrameProps } from "./IFrame";
import { Styles } from "./Styles";

export type FrameProps = Omit<IFrameProps, "getMountNode">;

/**
 * Used to wrap and isolate reflection from rest of document
 */
export function Frame({ children, ...frameProps }: FrameProps) {
    return (
        <IFrame {...frameProps}>
            <ResetStyle />
            <DocumentStyle />
            {children}
        </IFrame>
    );
}

/**
 * Copy of the current document style sheets to be used in framing
 */
function DocumentStyle() {
    return <Styles sheetList={document.styleSheets} />;
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
