import * as React from "react";
import { spinalToCamelCase } from "../utils";
import { useObserver } from "../hooks/useObserver";
import { useRerender } from "../hooks/useRerender";
import { Element } from "./Element";

/**
 * User action events to track and update style
 * https://developer.mozilla.org/en-US/docs/Web/Events#event_listing
 */
const TRACK_EVENTS = [
    "click",
    "input",
    "keypress",
    "keydown",
    "keyup",
    "mousemove",
    "mousedown",
    "mouseup",
] as const;
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
    const { rerender: onUpdate } = useRerender();
    // Observe changes on real element
    const observer = useObserver({ onUpdate });
    React.useEffect(
        function observeRealElement() {
            if (!real || !observer) return;
            observer.observe(real, OBSERVER_INIT);
            // also listen for other changes that are not observable
            TRACK_EVENTS.forEach((event) => {
                real.addEventListener(event, onUpdate, false);
            });
            // disconnect and remove event listeners on unmount
            return function destroy() {
                observer.disconnect();
                TRACK_EVENTS.forEach((event) => {
                    real.removeEventListener(event, onUpdate, false);
                });
            };
        },
        [real, observer, onUpdate],
    );

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

function getChildren(element?: Element | Text) {
    const children: (Element | Text)[] = [];
    if (isElement(element)) {
        element.childNodes.forEach((childNode) => {
            if (isElement(childNode) || isText(childNode)) {
                children.push(childNode);
            }
        });
    }
    return children;
}

function getAttributes(element?: Element | Text) {
    const attributes: Record<string, string> = {};
    if (isElement(element)) {
        Array.from(element.attributes).forEach((attr) => {
            attributes[attr.name] = attr.value;
        });
    }
    attributes.value = getValue(element);
    return attributes;
}

function getValue(node?: Node) {
    return (node as HTMLInputElement)?.value;
}

function isElement(node?: Node): node is Element {
    return node ? !isText(node) : false;
}

function isText(node?: Node): node is Text {
    return node?.nodeType === Node.TEXT_NODE;
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
