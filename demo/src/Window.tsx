import * as React from "react";
import * as ReactDOM from "react-dom";

export function Window({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element | null {
    const portalWindow = React.useMemo(
        () =>
            window.open("", "React Mirror Portal Test", "width=400,height=400"),
        [],
    );
    const portal = React.useMemo(() => {
        if (!portalWindow?.document?.body) return null;
        return ReactDOM.createPortal(children, portalWindow.document.body);
    }, [children, portalWindow]);
    return portal;
}
