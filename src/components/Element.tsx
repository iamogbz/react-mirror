import * as React from "react";

import { useRefs } from "../hooks/useRef";
import { syncScroll } from "../utils/dom";

export type ElementProps<T extends string> =
  T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : JSX.IntrinsicElements[keyof JSX.IntrinsicElements];

export type DOMElement<T extends string> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : never;

type DOMElementProps<T extends string> = {
  tagName: T;
  domRef?: React.Ref<DOMElement<T>>;
  scroll?: { x: number; y: number };
} & ElementProps<T>;

export function Element<T extends string>({
  children,
  domRef,
  tagName,
  scroll: { x: scrollLeft, y: scrollTop } = { x: 0, y: 0 },
  ...props
}: DOMElementProps<T>) {
  const [ref, setRef] = useRefs(domRef);

  React.useEffect(
    () => syncScroll({ scrollTop, scrollLeft }, ref),
    [ref, scrollLeft, scrollTop],
  );

  // For attributes that are not always updated when the prop is removed
  React.useEffect(
    /** Manually reset missing values */ () => {
      const valueResetMap = { value: "" };
      Object.entries(valueResetMap).forEach(([name, resetValue]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (ref) (ref as any)[name] = (props as any)[name] ?? resetValue;
      });
    },
    [ref, props],
  );

  return React.createElement(
    tagName.toLowerCase(),
    { ...props, ref: setRef },
    ...(Array.isArray(children) ? children : [children]),
  );
}
