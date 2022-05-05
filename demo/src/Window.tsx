import * as React from "react";
import * as ReactDOM from "react-dom";

export function Window({
    onClose,
    children,
}: {
    onClose: () => void;
    children: React.ReactNode;
}): JSX.Element {
    const portalWindow = React.useMemo(() => {
        const _window = window.open(
            "",
            "React Mirror Portal Test",
            "width=400,height=400",
        );
        _window?.addEventListener("beforeunload", onClose);
        return _window;
    }, [onClose]);
    const portal = React.useMemo(() => {
        if (!portalWindow?.document?.body) return;
        return ReactDOM.createPortal(children, portalWindow.document.body);
    }, [children, portalWindow]);
    return <>{portal}</>;
}
