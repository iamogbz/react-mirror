import * as React from "react";

export type ElementProps<T extends string> =
    T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : JSX.IntrinsicElements[keyof JSX.IntrinsicElements];

type DOMElement<T extends string> = T extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[T]
    : never;

type DOMElementProps<T extends string> = {
    tagName: T;
    domRef?: React.Ref<DOMElement<T>>;
} & ElementProps<T>;

export function Element<T extends string>({
    children,
    domRef,
    tagName,
    ...props
}: DOMElementProps<T>) {
    return React.createElement(
        tagName.toLowerCase(),
        { ...props, ref: domRef },
        ...(Array.isArray(children) ? children : [children]),
    );
}
