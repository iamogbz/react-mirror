import * as React from "react";

export function useRenderTrigger() {
    const [count, setCount] = React.useState(1);
    const rerender = React.useCallback(
        () => setCount((count) => count + 1),
        [setCount],
    );

    return {
        count,
        rerender,
    };
}
