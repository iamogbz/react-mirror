import * as React from "react";
import * as ReactDOM from "react-dom";

import { randomString } from "./utils";
import { CloneOptions, deepCloneWithStyles, copyStyles } from "./clone";

type MirrorPropsType = {
    className?: string;
    reflect?: React.ReactInstance | null;
};

export function Mirror({ className, reflect }: MirrorPropsType): JSX.Element {
    // unique identifier of this mirror
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const instanceId = React.useMemo(() => randomString(7), [reflect]);
    // ref to element in which reflection will be framed
    const [frame, ref] = React.useState<HTMLDivElement | null>(null);
    // real dom node of react element being reflected
    // eslint-disable-next-line react/no-find-dom-node
    const real = React.useMemo(() => ReactDOM.findDOMNode(reflect), [reflect]);
    // update the reflection to match the real node
    const update = React.useCallback(() => {
        if (!frame || !real) return;
        const cloneOptions: CloneOptions = {
            class: `_${instanceId}`,
            styles: { pointerEvents: "none" },
        };
        const reflection = deepCloneWithStyles(real as Element, cloneOptions);
        if (frame.firstChild) {
            frame.replaceChild(reflection, frame.firstChild);
        } else {
            frame.appendChild(reflection);
        }
        while (frame.firstChild !== frame.lastChild && frame.lastChild) {
            frame.removeChild(frame.lastChild);
        }
        if (className) {
            frame.className = className;
        }
        copyStyles(frame, frame, cloneOptions);
    }, [frame, real, instanceId, className]);
    // start of the reflection
    React.useEffect(update, [update]);
    // mutation observer single instance
    const observer = React.useMemo(() => {
        return new MutationObserver(update);
    }, [update]);
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
    }, [real, observer, update]);
    // return frame element
    return <div className={className} ref={ref} />;
}

export function useMirror<T extends React.ReactInstance>(
    props?: MirrorPropsType,
) {
    const [node, ref] = React.useState<T | null>(null);
    return [ref, <Mirror key="mirror" {...props} reflect={node} />] as const;
}
