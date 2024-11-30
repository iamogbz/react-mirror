describe("Entry", () => {
  it("exports expected modules", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    expect(require("../")).toMatchInlineSnapshot(`
      {
        "Frame": [Function],
        "FrameStyles": [Function],
        "Mirror": [Function],
        "Reflection": [Function],
        "Window": [Function],
        "useDimensions": [Function],
        "useMirror": [Function],
        "useRefs": [Function],
      }
    `);
  });
});
