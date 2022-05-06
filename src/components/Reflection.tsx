import * as React from "react";
import { spinalToCamelCase } from "../utils";
import { getAttributes, getChildren, isText } from "../utils/dom";
import { useObserver } from "../hooks/useObserver";
import { useRenderTrigger } from "../hooks/useRenderTrigger";
import { Element } from "./Element";

/**
 * User action events to track and update style
 * https://developer.mozilla.org/en-US/docs/Web/Events#event_listing
 */
const TRACK_EVENTS = new Set([
    "click",
    "input",
    "keypress",
    "keydown",
    "keyup",
    "mousemove",
    "mousedown",
    "mouseup",
] as const);
const OBSERVER_INIT = {
    attributes: true,
    childList: true,
    subtree: false,
    characterData: true,
} as const;

type ReflectionProps = {
    className?: string;
    real?: Element | Text;
    style?: React.CSSProperties;
};

export function Reflection({ className, real, style }: ReflectionProps) {
    const {
        class: classList,
        style: styleList,
        ...attributes
    } = getAttributes(real);
    const children = getChildren(real).map((childNode, i) => {
        return <Reflection key={i} real={childNode} style={style} />;
    });

    // Trigger a rerender
    const { rerender: onUpdate } = useRenderTrigger();
    // Observe changes on real element
    useObserver({
        initOptions: OBSERVER_INIT,
        ObserverClass: MutationObserver,
        onEvents: TRACK_EVENTS,
        onUpdate,
        target: real,
    });

    if (!real) return null;
    if (isText(real)) return <>{real.textContent}</>;
    // TODO: copy over missing computed styles from real to reflection
    return (
        <Element
            className={mergeClassList(className, classList)}
            readOnly
            style={mergeStyleProps(style, styleList)}
            tagName={real.nodeName}
            {...attributes}
        >
            {children}
        </Element>
    );
}

function mergeClassList(className?: string, classList?: string) {
    return [className, classList].filter(Boolean).join(" ");
}

function mergeStyleProps(
    cssProps: React.CSSProperties = {},
    inlineCSS = "",
    styleDecl?: CSSStyleDeclaration,
) {
    return {
        ...(styleDecl &&
            asCSSProperties(
                Array.from(styleDecl),
                (prop) => prop,
                (prop) => styleDecl.getPropertyValue(prop),
            )),
        ...asCSSProperties(
            inlineCSS
                .split(";")
                .map((propValue) => propValue.trim().split(":")),
            ([prop]) => prop,
            ([, value]) => value,
        ),
        ...cssProps,
    };
}

function asCSSProperties<T>(
    items: T[],
    getProp: (_: T) => string,
    getValue: (_: T) => string,
) {
    return Object.fromEntries(
        items
            .map((item) => [spinalToCamelCase(getProp(item)), getValue(item)])
            .filter(([, value]) => Boolean(value)),
    ) as React.CSSProperties;
}
