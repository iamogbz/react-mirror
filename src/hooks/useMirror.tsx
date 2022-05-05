import * as React from "react";
import { Mirror, MirrorProps } from "../components/Mirror";
import { useCallbackRef } from "./useRef";

export function useMirror<T extends React.ReactInstance>(props?: MirrorProps) {
    const [node, ref] = useCallbackRef<T>();
    return [ref, <Mirror key="mirror" {...props} reflect={node} />] as const;
}
