import * as React from "react";

export function useRerender() {
    const [count, setCount] = React.useState(0);
    const rerender = React.useCallback(
        () => setCount((count) => count + 1),
        [setCount],
    );

    return {
        count,
        rerender,
    };
}
