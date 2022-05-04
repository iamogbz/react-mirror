import * as React from "react";
import { Mirror, MirrorProps } from "../components/Mirror";
import { useRef } from "./useRef";

export function useMirror<T extends React.ReactInstance>(props?: MirrorProps) {
    const [node, ref] = useRef<T>();
    return [ref, <Mirror key="mirror" {...props} reflect={node} />] as const;
}
