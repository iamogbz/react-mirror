import * as React from "react";
import { getAllStyleRules } from "../utils/dom";
import { useObserver } from "../hooks/useObserver";
import { IFrame, IFrameProps } from "./IFrame";
import { Style } from "./Styles";

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
    const [rules, setRules] = React.useState(getAllStyleRules);

    const onUpdate = React.useCallback(
        function updateRules() {
            const newRules = getAllStyleRules();
            if (JSON.stringify(rules) === JSON.stringify(newRules)) return;
            setRules(newRules);
        },
        [rules],
    );

    useObserver({
        ObserverClass: MutationObserver,
        onUpdate,
        initOptions: {
            attributeFilter: ["class"],
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
        },
        target: window.document,
    });

    return <Style rules={rules} />;
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
