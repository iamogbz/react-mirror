import { compare } from "specificity";
import {
    camelToSpinalCase,
    getPseudoElementSelector,
    splitSelectors,
} from "./utils";

export type CloneOptions = {
    styles?: React.CSSProperties;
    class?: string;
};

export function copyStyles(
    sourceElt: HTMLElement,
    targetElt: HTMLElement,
    options?: CloneOptions,
): void {
    const styleDecls: { [key: string]: CSSStyleDeclaration } = {};
    for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i] as CSSStyleSheet;
        const rules = styleSheet.rules || styleSheet.cssRules;
        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;
            // test each selector in a group separately
            // accounts for bug with specificity library where
            // `.classA, .classB` fails when compared with `.classB`
            // https://github.com/keeganstreet/specificity/issues/4
            for (const selectorText of splitSelectors(rule.selectorText)) {
                // also match pseudo selectors
                const selector = selectorText.replace(
                    getPseudoElementSelector(selectorText),
                    "",
                );
                try {
                    if (sourceElt?.matches(selector || "*")) {
                        styleDecls[selectorText] = rule.style;
                    }
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e.message, { selectorText });
                }
            }
        }
    }
    // ensures only the cloned styles are applied to element
    const singleClassName = targetElt.className.replace(" ", "-");
    targetElt.className = `${singleClassName}${options?.class || ""}`;
    // style element used for transfering pseudo styles
    const styleElt = document.createElement("style");
    styleElt.type = "text/css";
    for (const selector of Object.keys(styleDecls).sort(compare)) {
        const styleDecl = styleDecls[selector];
        // store pseudo element styles in style element
        const pseudoElementSelector = getPseudoElementSelector(selector);
        if (pseudoElementSelector) {
            styleElt.innerHTML += `.${targetElt.className}${pseudoElementSelector} { ${styleDecl.cssText} }\n`;
        } else {
            for (let i = 0; i < styleDecl.length; i++) {
                const propName = styleDecl[i];
                const propValue = styleDecl.getPropertyValue(propName);
                targetElt.style.setProperty(propName, propValue);
            }
        }
    }
    // append style element used for transfering pseudo styles
    styleElt.innerHTML && targetElt.appendChild(styleElt);
}

export function cloneNodeWithStyles(node: Node, options: CloneOptions): Node {
    const clone = node.cloneNode(false);
    // check that node is html element before cloning styles
    const cloneElt = clone as HTMLElement;
    const nodeElt = node as HTMLElement;
    if (nodeElt.style && cloneElt.style) {
        copyStyles(nodeElt, cloneElt, options);
        for (const [prop, value] of Object.entries(options.styles || {})) {
            cloneElt.style.setProperty(camelToSpinalCase(prop), value);
        }
    }
    return clone;
}

export function deepCloneWithStyles(node: Node, options: CloneOptions): Node {
    const clone = cloneNodeWithStyles(node, options);
    for (const child of node.childNodes) {
        clone.appendChild(deepCloneWithStyles(child, options));
    }
    return clone;
}
