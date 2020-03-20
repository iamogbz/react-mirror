import * as React from "react";
import * as ReactDOM from "react-dom";

export function Mirror({
    reflect,
}: {
    reflect: React.ReactInstance | null;
}): JSX.Element {
    // ref to element in which reflection will be framed
    const [frame, ref] = React.useState<HTMLDivElement | null>(null);
    // real dom node of react element being reflected
    // eslint-disable-next-line react/no-find-dom-node
    const real = React.useMemo(() => ReactDOM.findDOMNode(reflect), [reflect]);
    // update the reflection to match the real node
    const update = React.useCallback(() => {
        if (!frame || !real) return;
        frame.innerHTML = "";
        frame.appendChild(real.cloneNode(true));
    }, [frame, real]);
    // start of the reflection
    React.useEffect(update, [update]);
    // mutation observer single instance
    const observer = React.useMemo(() => new MutationObserver(update), [
        update,
    ]);
    // observe or disconnect when real node is set or unmounted
    React.useEffect(() => {
        if (!real || !observer) return undefined;
        observer.observe(real, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,
        });
        return (): void => observer.disconnect();
    }, [real, observer]);
    // return frame element
    return <div ref={ref} style={{ pointerEvents: "none" }} />;
}

export function useMirror(): [
    React.Dispatch<unknown>,
    JSX.Element | undefined,
] {
    const [node, ref] = React.useState(null);
    return [ref, <Mirror key="mirror" reflect={node} />];
}
