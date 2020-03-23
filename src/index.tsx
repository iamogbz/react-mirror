import * as React from "react";
import * as ReactDOM from "react-dom";

import { deepCloneWithStyles } from "./clone";

type MirrorPropsType = {
    className?: string;
    reflect?: React.ReactInstance | null;
};

export function Mirror({ className, reflect }: MirrorPropsType): JSX.Element {
    // ref to element in which reflection will be framed
    const [frame, ref] = React.useState<HTMLDivElement | null>(null);
    // real dom node of react element being reflected
    // eslint-disable-next-line react/no-find-dom-node
    const real = React.useMemo(() => ReactDOM.findDOMNode(reflect), [reflect]);
    // update the reflection to match the real node
    const update = React.useCallback(() => {
        if (!frame || !real) return;
        const reflection = deepCloneWithStyles(real as Element, {
            pointerEvents: "none",
        });
        if (frame.firstChild) {
            frame.replaceChild(reflection, frame.firstChild);
        } else {
            frame.appendChild(reflection);
        }
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
        // also listen for input changes since those are not observable
        real.addEventListener("input", update);
        return (): void => observer.disconnect();
    }, [real, observer]);
    // return frame element
    return <div className={className} ref={ref} />;
}

export function useMirror(
    props: MirrorPropsType,
): [React.Dispatch<unknown>, JSX.Element | undefined] {
    const [node, ref] = React.useState(null);
    return [ref, <Mirror {...props} key="mirror" reflect={node} />];
}
