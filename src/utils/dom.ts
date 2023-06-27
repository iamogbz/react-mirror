import { flatten } from ".";

export function getChildren(element?: Element | Text) {
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

export function getAttributes(element?: Element | Text) {
  const attributes: Record<string, string> = {};
  if (isElement(element)) {
    Array.from(element.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });
  }
  const fieldValue = getValue(element);
  if (fieldValue) attributes.value = fieldValue;
  return attributes;
}

function getValue(node?: Node) {
  return (node as HTMLInputElement)?.value;
}

export function getBounds(node?: Node) {
  if (isElement(node)) {
    return node.getBoundingClientRect();
  }
  if (isText(node)) {
    const range = document.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
  }
  return new DOMRect();
}

export function isElement(node?: Node): node is Element {
  return node ? !isText(node) : false;
}

export function isText(node?: Node): node is Text {
  return node?.nodeType === Node.TEXT_NODE;
}

/**
 * Get all style rules from window document sorted by selector text
 */
export function getAllStyleRules() {
  return flatten(
    ...Array.from(document.styleSheets).map((sheet) => {
      return Array.from(sheet.cssRules).map((rule) => {
        return withCustomerUserActionPseudoClassSelector(rule.cssText);
      });
    }),
  ).sort();
}

const USER_ACTION_PSEUDO_CLASS_LIST = [
  "active",
  "hover",
  "focus",
  // FIX: https://github.com/jsdom/jsdom/issues/3426
  // "focus-visible",
  // FIX: https://github.com/jsdom/jsdom/issues/3055
  // "focus-within",
] as const;
type UserActionPseudoClass = (typeof USER_ACTION_PSEUDO_CLASS_LIST)[number];

function withCustomerUserActionPseudoClassSelector(cssSelector: string) {
  const userActionPseudoClassesRegex = new RegExp(
    USER_ACTION_PSEUDO_CLASS_LIST.map(userActionAsPseudoClassSelector).join(
      "|",
    ),
  );

  return cssSelector.replace(
    userActionPseudoClassesRegex,
    (cls) => `.${asCustomPseudoClass(cls.substring(1))}`,
  );
}

function userActionAsPseudoClassSelector(cls: UserActionPseudoClass) {
  return `:${cls}`;
}

const CUSTOM_CLASS_PREFIX = "_refl_" as const;
function asCustomPseudoClass(cls: unknown) {
  return `${CUSTOM_CLASS_PREFIX}${cls}`;
}

export function getUserActionCustomPseudoClassList(el?: Element | Text) {
  return getUserActionPseudoClassList(el).map(asCustomPseudoClass);
}

function getUserActionPseudoClassList(el?: Element | Text) {
  if (!isElement(el)) return [];
  return USER_ACTION_PSEUDO_CLASS_LIST.filter((cls) =>
    el.matches(`*${userActionAsPseudoClassSelector(cls)}`),
  );
}

type ScrollableElement = Pick<HTMLElement, "scrollTop" | "scrollLeft">;

export function syncScroll(
  source?: ScrollableElement,
  target?: ScrollableElement,
) {
  if (!source || !target) return;
  target.scrollTop = source.scrollTop;
  target.scrollLeft = source.scrollLeft;
}
