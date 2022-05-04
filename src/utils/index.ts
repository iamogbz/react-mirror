export function randomString(length: number) {
    let str = "";
    while (str.length < length) {
        str += Math.random()
            .toString(36)
            .substr(2, length - str.length);
    }
    return str;
}

export function spinalToCamelCase(spinalCase: string): string {
    return spinalCase.replace(/-[a-z]/g, (m) => m.substring(1).toUpperCase());
}
