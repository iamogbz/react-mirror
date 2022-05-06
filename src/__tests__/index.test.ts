describe("Entry", () => {
    it("exports expected modules", async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        expect(require("../")).toMatchInlineSnapshot(`
            Object {
              "Frame": [Function],
              "Mirror": [Function],
              "Reflection": [Function],
              "Style": [Function],
              "useMirror": [Function],
            }
        `);
    });
});
