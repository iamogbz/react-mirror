describe("Entry", () => {
  it("exports expected modules", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    expect(require("../")).toMatchInlineSnapshot(`
      {
        "Frame": [Function],
        "FrameStyles": [Function],
        "Mirror": [Function],
        "Reflection": [Function],
        "Window": [Function],
        "useMirror": [Function],
        "useRefs": [Function],
      }
    `);
  });
});
