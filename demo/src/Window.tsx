import * as React from "react";
import * as ReactDOM from "react-dom";

export function Window({
    onClose,
    children,
}: {
    onClose: () => void;
    children: React.ReactNode;
}): JSX.Element | null {
    const portalWindow = React.useMemo(() => {
        const w = window.open(
            "",
            "React Mirror Portal Test",
            "width=400,height=400",
        );
        w.onbeforeunload = onClose;
        return w;
    }, [onClose]);
    const portal = React.useMemo(() => {
        if (!portalWindow?.document?.body) return null;
        return ReactDOM.createPortal(children, portalWindow.document.body);
    }, [children, portalWindow]);
    return portal;
}
