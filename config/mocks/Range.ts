Range.prototype.getBoundingClientRect = () => new DOMRect();
/*
Range.prototype.getClientRects = function () {
    const clientRects = [this.getBoundingClientRect()];
    return {
        item: (i: number) => clientRects[i] ?? null,
        length: 1,
        [Symbol.iterator]: () => clientRects.values(),
    };
};
*/
