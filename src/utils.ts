export function randomString(length: number): string {
    let str = "";
    while (str.length < length) {
        str += Math.random()
            .toString(36)
            .substr(2, length - str.length);
    }
    return str;
}

export function camelToSpinalCase(camelCase: string): string {
    return camelCase.replace(/([A-Z])/g, "-$1").toLocaleLowerCase();
}

export function splitSelectors(selectors: string): string[] {
    if (!selectors) {
        return [];
    }
    if (isAtRule(selectors)) {
        return [selectors];
    }
    const splitted = [];
    let quotes = 0;
    let parens = 0;
    let angulars = 0;
    let soFar = "";
    for (let i = 0, len = selectors.length; i < len; i++) {
        const char = selectors[i];
        if (char === "(") {
            parens += 1;
        } else if (char === ")") {
            parens -= 1;
        } else if (char === "[") {
            angulars += 1;
        } else if (char === "]") {
            angulars -= 1;
        } else if (char === '"') {
            quotes += 1;
        } else if (char === ",") {
            if (!parens && !angulars && !(quotes % 2)) {
                splitted.push(soFar.trim());
                soFar = "";
                continue;
            }
        }
        soFar += char;
    }
    splitted.push(soFar.trim());
    return splitted.filter(Boolean);
}

function isAtRule(selector: string): boolean {
    return selector.indexOf("@") === 0;
}

export function getPseudoElementSelector(selector: string): string {
    const pseudoElementSelector = /::\w+(\(\w+\))?/g;
    return selector.match(pseudoElementSelector)?.[0] ?? "";
}
