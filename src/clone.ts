import { compare } from "specificity";

function randomString(length: number): string {
    let str = "";
    while (str.length < length) {
        str += Math.random()
            .toString(36)
            .substr(2, length - str.length);
    }
    return str;
}

export function copyStyles(
    sourceElt: HTMLElement,
    targetElt: HTMLElement,
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
                .map(s => s.trim())) {
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
    targetElt.className = `${singleClassName}_${randomString(7)}`;
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

function toSpinalCase(camelCase: string): string {
    return camelCase.replace(/([A-Z])/g, "-$1").toLocaleLowerCase();
}

function cloneNodeWithStyles(node: Node, xStyles: React.CSSProperties): Node {
    const clone = node.cloneNode(false);
    // check that node is html element before cloning styles
    const cloneElt = clone as HTMLElement;
    const nodeElt = node as HTMLElement;
    if (nodeElt.style && cloneElt.style) {
        copyStyles(nodeElt, cloneElt);
        for (const [prop, value] of Object.entries(xStyles)) {
            cloneElt.style.setProperty(toSpinalCase(prop), value);
        }
    }
    return clone;
}

export function deepCloneWithStyles(
    node: Node,
    xStyles: React.CSSProperties,
): Node {
    const clone = cloneNodeWithStyles(node, xStyles);
    for (const child of node.childNodes) {
        clone.appendChild(deepCloneWithStyles(child, xStyles));
    }
    return clone;
}
