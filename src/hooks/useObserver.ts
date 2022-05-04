import * as React from "react";

interface UseObserverProps {
    onUpdate: MutationCallback;
}

export function useObserver({ onUpdate }: UseObserverProps) {
    return React.useMemo(() => {
        return new MutationObserver(onUpdate);
    }, [onUpdate]);
}
