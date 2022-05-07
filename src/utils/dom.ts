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
                return rule.cssText;
            });
        }),
    ).sort();
}
