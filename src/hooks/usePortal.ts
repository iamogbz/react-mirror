import * as React from "react";
import * as ReactDOM from "react-dom";

interface UsePortalProps {
    key?: string;
    source: React.ReactNode;
    target?: Element;
}

export function usePortal({ key, source, target }: UsePortalProps) {
    return React.useMemo(
        function createPortal() {
            if (!target) return null;
            return ReactDOM.createPortal(source, target, key);
        },
        [key, source, target],
    );
}
