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
