describe("Entry", () => {
    it("exports expected modules", async () => {
        expect(await import("../")).toMatchInlineSnapshot(`
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
