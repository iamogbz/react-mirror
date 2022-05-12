import { act, renderHook } from "@testing-library/react";
import { useMirror } from "../useMirror";

describe("useMirror", () => {
  it("renders mirror with props and target", async () => {
    const props = {
      frameProps: {},
      mirrorProp: "",
    };
    const { result } = renderHook(() => useMirror(props));
    expect(result.current[1]).toMatchInlineSnapshot(`
      <Mirror
        frameProps={{}}
        mirrorProp=""
      />
    `);

    const targetNode = document.createElement("div");
    await act(async () => result.current[0](targetNode));

    expect(result.current[1]).toMatchInlineSnapshot(`
      <Mirror
        frameProps={{}}
        mirrorProp=""
        reflect={<div />}
      />
    `);
  });
});
