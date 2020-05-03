import { compare } from "specificity";
import { camelToSpinalCase } from "./utils";

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
    const pseudoRegex = /:(:?)[a-z-]+/g;
    for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i] as CSSStyleSheet;
        const rules = styleSheet.rules || styleSheet.cssRules;
        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;
            // test each selector in a group separately
            // accounts for bug with specificity library where
            // `.classA, .classB` fails when compared with `.classB`
            // https://github.com/keeganstreet/specificity/issues/4
            for (const selectorText of rule.selectorText
                .split(",")
                .map((s: string) => s.trim())) {
                // also match pseudo selectors
                const selector = selectorText?.replace(pseudoRegex, "");
                if (sourceElt?.matches(selector)) {
                    styleDecls[selectorText] = rule.style;
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
        const pseudos = selector.match(pseudoRegex);
        // store pseudo styles in style element
        if (pseudos?.length) {
            for (const p of new Set(pseudos)) {
                styleElt.innerHTML += `.${targetElt.className}${p} { ${styleDecl.cssText} }\n`;
            }
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
